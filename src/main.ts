import * as THREE from "three";
import "./styles.css";
import { meals, type Meal } from "./meals";

const STORAGE_KEY = "flashmeals.saved.v1";
const THEME_KEY = "flashmeals.theme.v1";
const INSTALL_DISMISSED_KEY = "flashmeals.install.dismissed.v1";
const DONATION_URL = "https://ko-fi.com/";

type MealCategory = "all" | "breakfast" | "lunch" | "dinner";
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function mustQuery<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`FlashMeals could not find ${selector}.`);
  }
  return element;
}

const canvas = mustQuery<HTMLCanvasElement>("#cardCanvas");
const mealNameEl = mustQuery<HTMLSpanElement>("#mealName");
const mealTimeEl = mustQuery<HTMLSpanElement>("#mealTime");
const mealTagsEl = mustQuery<HTMLSpanElement>("#mealTags");
const categoryFilter = mustQuery<HTMLDivElement>("#categoryFilter");
const thumbnailRail = mustQuery<HTMLDivElement>("#thumbnailRail");
const cardSceneEl = mustQuery<HTMLDivElement>("#cardScene");
const cardSideEl = mustQuery<HTMLSpanElement>("#cardSide");
const cardSignalEl = mustQuery<HTMLSpanElement>("#cardSignal");
const nextButton = mustQuery<HTMLButtonElement>("#nextButton");
const saveButton = mustQuery<HTMLButtonElement>("#saveButton");
const savedButton = mustQuery<HTMLButtonElement>("#savedButton");
const themeToggle = mustQuery<HTMLButtonElement>("#themeToggle");
const themeGlyph = mustQuery<HTMLSpanElement>("#themeGlyph");
const savedCountEl = mustQuery<HTMLSpanElement>("#savedCount");
const drawer = mustQuery<HTMLElement>("#collectionDrawer");
const closeDrawerButton = mustQuery<HTMLButtonElement>("#closeDrawerButton");
const savedList = mustQuery<HTMLDivElement>("#savedList");
const donateLink = mustQuery<HTMLAnchorElement>("#donateLink");
const installPrompt = mustQuery<HTMLElement>("#installPrompt");
const installButton = mustQuery<HTMLButtonElement>("#installButton");
const dismissInstallButton = mustQuery<HTMLButtonElement>("#dismissInstallButton");

donateLink.href = DONATION_URL;
applyTheme(readTheme());

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  preserveDrawingBuffer: true
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setClearColor(0x000000, 0);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
const defaultCameraZ = 8.55;
const focusedCameraZ = 7.75;
let targetCameraZ = defaultCameraZ;
camera.position.set(0, 0.08, defaultCameraZ);
const raycaster = new THREE.Raycaster();
const pointerNdc = new THREE.Vector2();

const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
keyLight.position.set(3, 4, 5);
scene.add(keyLight);
const fillLight = new THREE.DirectionalLight(0xfff0d0, 1.2);
fillLight.position.set(-4, -1, 4);
scene.add(fillLight);
scene.add(new THREE.AmbientLight(0xfff3df, 1.2));

const cardGroup = new THREE.Group();
cardGroup.rotation.x = -0.07;
scene.add(cardGroup);

const edgeMaterial = new THREE.MeshStandardMaterial({
  color: 0xfffaf2,
  roughness: 0.72,
  metalness: 0
});
const cardWidth = 3.2;
const cardHeight = 4.38;
const cardDepth = 0.18;
const cardRadius = 0.16;
const cardCoreGeometry = new THREE.ExtrudeGeometry(createRoundedRectShape(3.28, 4.46, 0.18), {
  depth: cardDepth,
  bevelEnabled: false,
  curveSegments: 18
});
cardCoreGeometry.translate(0, 0, -cardDepth / 2);
const cardCore = new THREE.Mesh(cardCoreGeometry, edgeMaterial);
cardCore.castShadow = true;
cardGroup.add(cardCore);

const frontMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.68,
  transparent: true
});
const backMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.68,
  transparent: true
});
const cardFaceGeometry = createRoundedFaceGeometry(cardWidth, cardHeight, cardRadius);
const frontFace = new THREE.Mesh(cardFaceGeometry, frontMaterial);
frontFace.position.z = cardDepth / 2 + 0.004;
const backFace = new THREE.Mesh(cardFaceGeometry.clone(), backMaterial);
backFace.position.z = -(cardDepth / 2 + 0.004);
backFace.rotation.y = Math.PI;
cardGroup.add(frontFace, backFace);

let savedIds = new Set<string>(readSavedIds());
let activeCategory: MealCategory = "all";
let currentMeal = pickRandomMeal();
let isFlipped = false;
let isCardFocused = false;
let targetRotation = 0;
let textureToken = 0;
let deferredInstallPrompt: BeforeInstallPromptEvent | null = null;
let pointerStartX = 0;
let pointerStartY = 0;
let pointerStartedOnCanvas = false;

function readSavedIds(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function persistSavedIds() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...savedIds]));
}

function readTheme(): "light" | "dark" {
  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: "light" | "dark") {
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  themeGlyph.textContent = theme === "dark" ? "☀" : "☾";
}

function toggleTheme() {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_KEY, nextTheme);
  applyTheme(nextTheme);
}

function filteredMeals(): Meal[] {
  if (activeCategory === "all") {
    return meals;
  }
  return meals.filter((meal) => meal.tags.includes(activeCategory));
}

function pickRandomMeal(excludeId?: string): Meal {
  const categoryMeals = filteredMeals();
  const pool = categoryMeals.filter((meal) => meal.id !== excludeId);
  const source = pool.length > 0 ? pool : categoryMeals.length > 0 ? categoryMeals : meals;
  return source[Math.floor(Math.random() * source.length)];
}

function updateCategoryButtons() {
  categoryFilter.querySelectorAll<HTMLButtonElement>("[data-category]").forEach((button) => {
    const isActive = button.dataset.category === activeCategory;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function selectCategory(category: MealCategory) {
  activeCategory = category;
  updateCategoryButtons();
  const pool = filteredMeals();
  if (!pool.some((meal) => meal.id === currentMeal.id)) {
    void setMeal(pickRandomMeal());
    return;
  }
  renderThumbnailRail();
}

async function setMeal(meal: Meal) {
  currentMeal = meal;
  isFlipped = false;
  targetRotation = 0;
  setCardFocused(false);
  mealNameEl.textContent = meal.name;
  mealTimeEl.textContent = `${meal.timeMinutes} min`;
  mealTagsEl.textContent = meal.tags.slice(0, 2).join(" / ");
  cardSideEl.textContent = "Photo side";
  cardSignalEl.textContent = "Loading photo";
  updateSaveButton();
  renderThumbnailRail();
  applyMaterialTexture(frontMaterial, makeInstantFrontTexture(meal));
  applyMaterialTexture(backMaterial, makeBackTexture(meal));

  const token = ++textureToken;
  const frontTexture = await makeFrontTexture(meal);

  if (token !== textureToken) {
    frontTexture.dispose();
    return;
  }

  applyMaterialTexture(frontMaterial, frontTexture);
  cardSignalEl.textContent = "Photo ready";
}

function createRoundedRectShape(width: number, height: number, radius: number): THREE.Shape {
  const x = -width / 2;
  const y = -height / 2;
  const shape = new THREE.Shape();
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

function createRoundedFaceGeometry(width: number, height: number, radius: number): THREE.ShapeGeometry {
  const geometry = new THREE.ShapeGeometry(createRoundedRectShape(width, height, radius), 18);
  const uv: number[] = [];
  const position = geometry.getAttribute("position");
  for (let index = 0; index < position.count; index += 1) {
    uv.push((position.getX(index) + width / 2) / width, (position.getY(index) + height / 2) / height);
  }
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  return geometry;
}

function disposeMaterialMap(material: THREE.MeshStandardMaterial) {
  if (material.map) {
    material.map.dispose();
    material.map = null;
  }
}

function applyMaterialTexture(material: THREE.MeshStandardMaterial, texture: THREE.Texture) {
  disposeMaterialMap(material);
  material.map = texture;
  material.needsUpdate = true;
}

function makeInstantFrontTexture(meal: Meal): THREE.Texture {
  const { canvas: textureCanvas, ctx } = createTextureCanvas();
  drawCardBase(ctx, "#fffaf2");
  drawPhotoFallback(ctx, meal.name);
  drawFrontContent(ctx, meal);
  return canvasToTexture(textureCanvas);
}

async function makeFrontTexture(meal: Meal): Promise<THREE.Texture> {
  const { canvas: textureCanvas, ctx } = createTextureCanvas();
  drawCardBase(ctx, "#fffaf2");

  const image = await loadImage(meal.imageUrl);
  if (image) {
    ctx.save();
    roundedPath(ctx, 64, 104, 896, 770, 28);
    ctx.clip();
    drawCoverImage(ctx, image, 64, 104, 896, 770);
    ctx.restore();
  } else {
    drawPhotoFallback(ctx, meal.name);
  }

  drawFrontContent(ctx, meal);
  return canvasToTexture(textureCanvas);
}

function drawFrontContent(ctx: CanvasRenderingContext2D, meal: Meal) {
  ctx.fillStyle = "#17211f";
  ctx.font = "800 76px Inter, Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  wrapText(ctx, meal.name, 74, 930, 880, 88, 2);

  drawPill(ctx, `${meal.timeMinutes} min`, 74, 1210, "#f75f3b", "#fff7ed");
  drawPill(ctx, formatCardTag(meal.tags[0]), 246, 1210, tagFill(meal.tags[0]), "#fffdf8");

  ctx.fillStyle = "#5c4640";
  ctx.font = "500 32px Inter, Arial, sans-serif";
  ctx.fillText("Photo card", 74, 1290);
}

function makeBackTexture(meal: Meal): THREE.Texture {
  const { canvas: textureCanvas, ctx } = createTextureCanvas();
  drawCardBase(ctx, "#fffdf8");

  ctx.fillStyle = "#f75f3b";
  ctx.font = "800 42px Inter, Arial, sans-serif";
  ctx.fillText("FLASH RECIPE", 74, 92);

  ctx.fillStyle = "#17211f";
  ctx.font = "800 68px Inter, Arial, sans-serif";
  wrapText(ctx, meal.name, 74, 160, 876, 78, 2);

  let y = 340;
  y = drawRecipeSection(ctx, "Ingredients", meal.ingredients, 74, y);
  drawRecipeSection(ctx, "Prep", meal.steps, 74, y + 32);

  ctx.fillStyle = "#2f6f73";
  ctx.font = "700 34px Inter, Arial, sans-serif";
  ctx.fillText("Saved locally when you collect it.", 74, 1290);

  return canvasToTexture(textureCanvas);
}

function createTextureCanvas(): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const scale = 2;
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = 1024 * scale;
  textureCanvas.height = 1400 * scale;
  const ctx = requireCanvasContext(textureCanvas);
  ctx.scale(scale, scale);
  return { canvas: textureCanvas, ctx };
}

function requireCanvasContext(textureCanvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = textureCanvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas rendering is unavailable.");
  }
  return ctx;
}

function canvasToTexture(textureCanvas: HTMLCanvasElement): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  texture.needsUpdate = true;
  return texture;
}

function drawCardBase(ctx: CanvasRenderingContext2D, fill: string) {
  ctx.clearRect(0, 0, 1024, 1400);
  ctx.fillStyle = fill;
  roundedPath(ctx, 24, 24, 976, 1352, 56);
  ctx.fill();
}

function drawRecipeSection(
  ctx: CanvasRenderingContext2D,
  title: string,
  items: string[],
  x: number,
  y: number
): number {
  ctx.fillStyle = "#2f6f73";
  ctx.font = "800 44px Inter, Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(title, x, y);
  let cursor = y + 72;
  const bulletX = x + 11;
  const textX = x + 38;
  const itemLineHeight = 44;

  ctx.fillStyle = "#312622";
  ctx.font = "500 34px Inter, Arial, sans-serif";
  for (const item of items) {
    const itemTop = cursor;
    ctx.fillStyle = "#f75f3b";
    ctx.beginPath();
    ctx.arc(bulletX, itemTop + 18, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#312622";
    cursor = wrapText(ctx, item, textX, itemTop, 820, itemLineHeight, 2) + 12;
  }

  return cursor;
}

function drawPill(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fill: string,
  textFill: string
) {
  ctx.font = "800 30px Inter, Arial, sans-serif";
  const width = Math.max(132, ctx.measureText(text).width + 58);
  ctx.fillStyle = fill;
  roundedPath(ctx, x, y, width, 64, 8);
  ctx.fill();
  ctx.fillStyle = textFill;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text.toUpperCase(), x + width / 2, y + 33);
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
}

function tagFill(tag = ""): string {
  const colors: Record<string, string> = {
    breakfast: "#2f6f73",
    lunch: "#2f6f73",
    dinner: "#7a4a25",
    microwave: "#8a5b25",
    snack: "#2f6f73",
    vegetarian: "#2f6f73"
  };
  return colors[tag.toLowerCase()] ?? "#2f6f73";
}

function formatCardTag(tag = "quick"): string {
  const labels: Record<string, string> = {
    vegetarian: "veggie",
    microwave: "micro",
    "no cook": "no-cook"
  };
  return labels[tag.toLowerCase()] ?? tag;
}

function roundedPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 10
): number {
  const words = text.split(" ");
  let line = "";
  let lines = 0;
  let cursor = y;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, cursor);
      cursor += lineHeight;
      lines += 1;
      line = word;
      if (lines >= maxLines) {
        return cursor;
      }
    } else {
      line = testLine;
    }
  }

  if (line && lines < maxLines) {
    ctx.fillText(line, x, cursor);
    cursor += lineHeight;
  }

  return cursor;
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const targetRatio = width / height;
  let sourceWidth = image.naturalWidth;
  let sourceHeight = image.naturalHeight;
  let sourceX = 0;
  let sourceY = 0;

  if (imageRatio > targetRatio) {
    sourceWidth = image.naturalHeight * targetRatio;
    sourceX = (image.naturalWidth - sourceWidth) / 2;
  } else {
    sourceHeight = image.naturalWidth / targetRatio;
    sourceY = (image.naturalHeight - sourceHeight) / 2;
  }

  ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
}

function drawPhotoFallback(ctx: CanvasRenderingContext2D, label: string) {
  const gradient = ctx.createLinearGradient(64, 104, 960, 874);
  gradient.addColorStop(0, "#2f6f73");
  gradient.addColorStop(0.55, "#ffcf5a");
  gradient.addColorStop(1, "#f75f3b");
  ctx.fillStyle = gradient;
  roundedPath(ctx, 64, 104, 896, 770, 28);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.font = "800 54px Inter, Arial, sans-serif";
  ctx.textAlign = "center";
  wrapText(ctx, label, 512, 420, 704, 66, 3);
  ctx.textAlign = "left";
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    let settled = false;
    const image = new Image();
    const finish = (result: HTMLImageElement | null) => {
      if (settled) {
        return;
      }
      settled = true;
      window.clearTimeout(timeoutId);
      resolve(result);
    };
    const timeoutId = window.setTimeout(() => finish(null), 12000);
    image.crossOrigin = "anonymous";
    image.decoding = "async";
    image.onload = () => finish(image);
    image.onerror = () => finish(null);
    image.src = src;
  });
}

function toggleFlip() {
  isFlipped = !isFlipped;
  targetRotation = isFlipped ? Math.PI : 0;
  cardSideEl.textContent = isFlipped ? "Recipe side" : "Photo side";
}

function setCardFocused(focused: boolean) {
  isCardFocused = focused;
  targetCameraZ = focused ? focusedCameraZ : defaultCameraZ;
  document.documentElement.classList.toggle("card-focus-active", focused);
  cardSceneEl.classList.toggle("is-focused", focused);
}

function isPointerOverCard(event: PointerEvent): boolean {
  const rect = canvas.getBoundingClientRect();
  const pointerX = (event.clientX - rect.left) / rect.width;
  const pointerY = (event.clientY - rect.top) / rect.height;

  if (pointerX < 0 || pointerX > 1 || pointerY < 0 || pointerY > 1) {
    return false;
  }

  pointerNdc.set(pointerX * 2 - 1, -(pointerY * 2 - 1));
  raycaster.setFromCamera(pointerNdc, camera);
  return raycaster.intersectObjects([frontFace, backFace, cardCore], false).length > 0;
}

function updateSaveButton() {
  const isSaved = savedIds.has(currentMeal.id);
  saveButton.textContent = isSaved ? "Saved" : "Save Card";
  saveButton.setAttribute("aria-pressed", String(isSaved));
  savedCountEl.textContent = String(savedIds.size);
}

function toggleSave() {
  if (savedIds.has(currentMeal.id)) {
    savedIds.delete(currentMeal.id);
  } else {
    savedIds.add(currentMeal.id);
  }

  persistSavedIds();
  updateSaveButton();
  renderSavedList();
}

function renderSavedList() {
  const savedMeals = meals.filter((meal) => savedIds.has(meal.id));

  if (savedMeals.length === 0) {
    savedList.innerHTML = `
      <div class="empty-state">
        <strong>No cards saved yet.</strong>
        <span>Save a meal to build your quick recipe collection.</span>
      </div>
    `;
    return;
  }

  savedList.innerHTML = savedMeals
    .map(
      (meal) => `
        <article class="saved-card">
          <img src="${meal.thumbnailUrl}" alt="" loading="eager" decoding="async" />
          <div>
            <h3>${meal.name}</h3>
            <p>${meal.ingredients.join(", ")}</p>
            <button class="small-action" data-meal-id="${meal.id}" type="button">Open Card</button>
          </div>
        </article>
      `
    )
    .join("");
}

function renderThumbnailRail() {
  const pool = filteredMeals();
  const sourceMeals = pool.length > 0 ? pool : meals;
  const currentIndex = Math.max(0, sourceMeals.findIndex((meal) => meal.id === currentMeal.id));
  const visibleMeals = Array.from({ length: Math.min(5, sourceMeals.length) }, (_value, offset) => sourceMeals[(currentIndex + offset) % sourceMeals.length]);
  thumbnailRail.innerHTML = visibleMeals
    .map(
      (meal) => `
        <button class="thumbnail-button${meal.id === currentMeal.id ? " is-active" : ""}" data-thumb-meal-id="${meal.id}" type="button" aria-label="Open ${meal.name}">
          <img src="${meal.thumbnailUrl}" alt="" loading="eager" decoding="async" />
        </button>
      `
    )
    .join("");
}

function showInstallPrompt() {
  if (localStorage.getItem(INSTALL_DISMISSED_KEY) === "true") {
    return;
  }
  if (window.matchMedia("(display-mode: standalone)").matches) {
    return;
  }
  installPrompt.setAttribute("aria-hidden", "false");
}

function hideInstallPrompt() {
  installPrompt.setAttribute("aria-hidden", "true");
}

async function installApp() {
  if (!deferredInstallPrompt) {
    hideInstallPrompt();
    return;
  }

  await deferredInstallPrompt.prompt();
  const choice = await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  hideInstallPrompt();

  if (choice.outcome === "dismissed") {
    localStorage.setItem(INSTALL_DISMISSED_KEY, "true");
  }
}

function dismissInstallPrompt() {
  localStorage.setItem(INSTALL_DISMISSED_KEY, "true");
  hideInstallPrompt();
}

function openDrawer() {
  renderSavedList();
  drawer.setAttribute("aria-hidden", "false");
}

function closeDrawer() {
  drawer.setAttribute("aria-hidden", "true");
}

function resize() {
  const { clientWidth, clientHeight } = canvas;
  const width = Math.max(1, clientWidth);
  const height = Math.max(1, clientHeight);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function animate() {
  requestAnimationFrame(animate);
  cardGroup.rotation.y += (targetRotation - cardGroup.rotation.y) * 0.13;
  cardGroup.rotation.z = Math.sin(performance.now() * 0.0007) * 0.018;
  camera.position.z += (targetCameraZ - camera.position.z) * 0.12;
  renderer.render(scene, camera);
}

function setupEvents() {
  canvas.addEventListener("pointerdown", (event) => {
    const pointerStartedOnCard = isPointerOverCard(event);
    if (isCardFocused && !pointerStartedOnCard) {
      setCardFocused(false);
      return;
    }

    pointerStartedOnCanvas = pointerStartedOnCard;
    if (!pointerStartedOnCanvas) {
      return;
    }

    pointerStartX = event.clientX;
    pointerStartY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointerup", (event) => {
    if (!pointerStartedOnCanvas) {
      return;
    }

    pointerStartedOnCanvas = false;
    const deltaX = event.clientX - pointerStartX;
    const deltaY = event.clientY - pointerStartY;
    const isHorizontalSwipe = Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2;

    if (isHorizontalSwipe) {
      setCardFocused(true);
      toggleFlip();
      return;
    }

    setCardFocused(true);
  });

  canvas.addEventListener("pointercancel", () => {
    pointerStartedOnCanvas = false;
  });

  canvas.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setCardFocused(true);
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      setCardFocused(true);
      toggleFlip();
    }
  });

  nextButton.addEventListener("click", () => {
    void setMeal(pickRandomMeal(currentMeal.id));
  });

  saveButton.addEventListener("click", toggleSave);
  themeToggle.addEventListener("click", toggleTheme);
  installButton.addEventListener("click", () => {
    void installApp();
  });
  dismissInstallButton.addEventListener("click", dismissInstallPrompt);
  savedButton.addEventListener("click", openDrawer);
  closeDrawerButton.addEventListener("click", closeDrawer);
  categoryFilter.addEventListener("click", (event) => {
    const categoryButton = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-category]");
    const category = categoryButton?.dataset.category;
    if (category === "all" || category === "breakfast" || category === "lunch" || category === "dinner") {
      selectCategory(category);
    }
  });
  thumbnailRail.addEventListener("click", (event) => {
    const thumbnailButton = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-thumb-meal-id]");
    if (!thumbnailButton?.dataset.thumbMealId) {
      return;
    }

    const meal = meals.find((candidate) => candidate.id === thumbnailButton.dataset.thumbMealId);
    if (meal) {
      void setMeal(meal);
    }
  });
  drawer.addEventListener("click", (event) => {
    if (event.target === drawer) {
      closeDrawer();
      return;
    }

    const openButton = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-meal-id]");
    if (openButton?.dataset.mealId) {
      const meal = meals.find((candidate) => candidate.id === openButton.dataset.mealId);
      if (meal) {
        closeDrawer();
        void setMeal(meal);
      }
    }
  });

  window.addEventListener("resize", resize);
  document.addEventListener("pointerdown", (event) => {
    if (!isCardFocused) {
      return;
    }

    if (cardSceneEl.contains(event.target as Node)) {
      return;
    }

    setCardFocused(false);
  });
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event as BeforeInstallPromptEvent;
    window.setTimeout(showInstallPrompt, 1400);
  });
  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    localStorage.setItem(INSTALL_DISMISSED_KEY, "true");
    hideInstallPrompt();
  });
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  if (!import.meta.env.PROD) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        void registration.unregister();
      });
    });
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      // The app still works as a static page if service worker registration is unavailable.
    });
  });
}

canvas.tabIndex = 0;
setupEvents();
resize();
renderSavedList();
updateSaveButton();
updateCategoryButtons();
void setMeal(currentMeal);
animate();
registerServiceWorker();
