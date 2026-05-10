export type Meal = {
  id: string;
  name: string;
  imageUrl: string;
  thumbnailUrl: string;
  ingredients: string[];
  steps: string[];
  tags: string[];
  timeMinutes: number;
};

const photo = (id: string) => ({
  imageUrl: `${import.meta.env.BASE_URL}meal-images/${id}.jpg`,
  thumbnailUrl: `${import.meta.env.BASE_URL}meal-images/${id}-thumb.jpg`
});

export const meals: Meal[] = [
  {
    id: "avocado-egg-toast",
    name: "Avocado Egg Toast",
    ...photo("avocado-egg-toast"),
    ingredients: ["1 slice toast", "1/2 avocado", "1 cooked egg", "Lemon juice", "Salt and chili flakes"],
    steps: ["Mash avocado with lemon and salt.", "Spread over hot toast.", "Top with egg and chili flakes."],
    tags: ["breakfast", "vegetarian"],
    timeMinutes: 5
  },
  {
    id: "tuna-cucumber-boats",
    name: "Tuna Cucumber Boats",
    ...photo("tuna-cucumber-boats"),
    ingredients: ["1 cucumber", "1 tuna pouch", "1 tbsp mayo or yogurt", "Pickle relish", "Black pepper"],
    steps: ["Split cucumber lengthwise and scoop the center.", "Mix tuna, mayo, relish, and pepper.", "Spoon into cucumber halves."],
    tags: ["lunch", "low carb"],
    timeMinutes: 5
  },
  {
    id: "caprese-pita",
    name: "Caprese Pita",
    ...photo("caprese-pita"),
    ingredients: ["1 pita", "Mozzarella slices", "Tomato slices", "Basil", "Balsamic glaze"],
    steps: ["Warm pita for 30 seconds.", "Fill with mozzarella, tomato, and basil.", "Drizzle with balsamic glaze."],
    tags: ["vegetarian", "lunch"],
    timeMinutes: 5
  },
  {
    id: "microwave-nachos",
    name: "Microwave Nachos",
    ...photo("microwave-nachos"),
    ingredients: ["Tortilla chips", "Shredded cheese", "Black beans", "Salsa", "Greek yogurt"],
    steps: ["Layer chips, cheese, and beans on a plate.", "Microwave 45 to 60 seconds.", "Top with salsa and yogurt."],
    tags: ["microwave", "snack"],
    timeMinutes: 5
  },
  {
    id: "hummus-veggie-wrap",
    name: "Hummus Veggie Wrap",
    ...photo("hummus-veggie-wrap"),
    ingredients: ["1 tortilla", "3 tbsp hummus", "Spinach", "Shredded carrot", "Cucumber strips"],
    steps: ["Spread hummus across tortilla.", "Add vegetables in a line.", "Roll tight and slice in half."],
    tags: ["vegetarian", "lunch"],
    timeMinutes: 5
  },
  {
    id: "peanut-noodles",
    name: "Peanut Noodles",
    ...photo("peanut-noodles"),
    ingredients: ["Instant noodles", "1 tbsp peanut butter", "Soy sauce", "Lime juice", "Green onion"],
    steps: ["Cook noodles and drain most water.", "Stir in peanut butter, soy, and lime.", "Top with green onion."],
    tags: ["microwave", "dinner"],
    timeMinutes: 5
  },
  {
    id: "greek-yogurt-bowl",
    name: "Greek Yogurt Bowl",
    ...photo("greek-yogurt-bowl"),
    ingredients: ["Greek yogurt", "Granola", "Berries", "Honey", "Chia seeds"],
    steps: ["Spoon yogurt into a bowl.", "Add berries and granola.", "Drizzle honey and sprinkle chia."],
    tags: ["breakfast", "vegetarian"],
    timeMinutes: 5
  },
  {
    id: "bbq-chicken-quesadilla",
    name: "BBQ Chicken Quesadilla",
    ...photo("bbq-chicken-quesadilla"),
    ingredients: ["1 tortilla", "Cooked chicken", "Shredded cheese", "BBQ sauce", "Red onion"],
    steps: ["Fill tortilla with chicken, cheese, sauce, and onion.", "Fold and toast in a skillet.", "Slice when cheese melts."],
    tags: ["dinner", "skillet"],
    timeMinutes: 5
  },
  {
    id: "apple-cheddar-plate",
    name: "Apple Cheddar Plate",
    ...photo("apple-cheddar-plate"),
    ingredients: ["1 apple", "Cheddar slices", "Crackers", "Turkey slices", "Mustard"],
    steps: ["Slice apple thinly.", "Arrange with cheddar, crackers, and turkey.", "Add mustard for dipping."],
    tags: ["snack", "no cook"],
    timeMinutes: 5
  },
  {
    id: "pizza-english-muffin",
    name: "Pizza Muffin",
    ...photo("pizza-english-muffin"),
    ingredients: ["English muffin", "Pizza sauce", "Mozzarella", "Pepperoni or olives", "Italian seasoning"],
    steps: ["Top muffin halves with sauce and cheese.", "Add toppings and seasoning.", "Toast until bubbly."],
    tags: ["snack", "toaster"],
    timeMinutes: 5
  },
  {
    id: "chickpea-salad-cup",
    name: "Chickpea Salad Cup",
    ...photo("chickpea-salad-cup"),
    ingredients: ["Canned chickpeas", "Mayo or yogurt", "Celery", "Dijon mustard", "Lettuce cups"],
    steps: ["Mash chickpeas lightly.", "Mix with mayo, celery, and Dijon.", "Spoon into lettuce cups."],
    tags: ["vegetarian", "no cook"],
    timeMinutes: 5
  },
  {
    id: "banana-peanut-rollup",
    name: "Banana Peanut Rollup",
    ...photo("banana-peanut-rollup"),
    ingredients: ["1 tortilla", "Peanut butter", "1 banana", "Cinnamon", "Honey"],
    steps: ["Spread peanut butter on tortilla.", "Place banana near one edge.", "Roll, slice, and dust with cinnamon."],
    tags: ["breakfast", "sweet"],
    timeMinutes: 5
  },
  {
    id: "ramen-egg-cup",
    name: "Ramen Egg Cup",
    ...photo("ramen-egg-cup"),
    ingredients: ["Instant ramen cup", "Boiling water", "Soft-boiled egg", "Spinach", "Sesame oil"],
    steps: ["Cook ramen with hot water.", "Stir in spinach to wilt.", "Top with egg and sesame oil."],
    tags: ["microwave", "dinner"],
    timeMinutes: 5
  },
  {
    id: "turkey-ranch-pinwheels",
    name: "Turkey Ranch Pinwheels",
    ...photo("turkey-ranch-pinwheels"),
    ingredients: ["1 tortilla", "Cream cheese", "Ranch seasoning", "Turkey slices", "Lettuce"],
    steps: ["Mix cream cheese with ranch seasoning.", "Spread on tortilla and add turkey.", "Roll tight and cut into pinwheels."],
    tags: ["lunch", "no cook"],
    timeMinutes: 5
  },
  {
    id: "tomato-soup-melt",
    name: "Tomato Soup Melt",
    ...photo("tomato-soup-melt"),
    ingredients: ["Tomato soup cup", "Toast", "Cheese slice", "Pepper", "Basil"],
    steps: ["Heat soup in the microwave.", "Melt cheese over toast.", "Dip toast into soup and finish with basil."],
    tags: ["microwave", "comfort"],
    timeMinutes: 5
  },
  {
    id: "smoked-salmon-bagel",
    name: "Salmon Bagel",
    ...photo("smoked-salmon-bagel"),
    ingredients: ["Bagel thin", "Cream cheese", "Smoked salmon", "Cucumber", "Capers"],
    steps: ["Toast bagel thin.", "Spread with cream cheese.", "Layer salmon, cucumber, and capers."],
    tags: ["breakfast", "lunch"],
    timeMinutes: 5
  },
  {
    id: "bean-cheese-burrito",
    name: "Bean Cheese Burrito",
    ...photo("bean-cheese-burrito"),
    ingredients: ["1 tortilla", "Refried beans", "Shredded cheese", "Salsa", "Hot sauce"],
    steps: ["Spread beans and cheese on tortilla.", "Microwave until warm.", "Add salsa, roll, and serve."],
    tags: ["microwave", "vegetarian"],
    timeMinutes: 5
  },
  {
    id: "cottage-cheese-savory-bowl",
    name: "Savory Cottage Bowl",
    ...photo("cottage-cheese-savory-bowl"),
    ingredients: ["Cottage cheese", "Cherry tomatoes", "Cucumber", "Everything seasoning", "Olive oil"],
    steps: ["Spoon cottage cheese into a bowl.", "Add chopped tomato and cucumber.", "Finish with seasoning and olive oil."],
    tags: ["breakfast", "no cook"],
    timeMinutes: 5
  },
  {
    id: "pesto-tortellini-cup",
    name: "Pesto Tortellini Cup",
    ...photo("pesto-tortellini-cup"),
    ingredients: ["Microwave tortellini", "Pesto", "Parmesan", "Cherry tomatoes", "Black pepper"],
    steps: ["Microwave tortellini as directed.", "Stir in pesto and tomatoes.", "Top with Parmesan and pepper."],
    tags: ["microwave", "dinner"],
    timeMinutes: 5
  },
  {
    id: "egg-salad-crackers",
    name: "Egg Salad Crackers",
    ...photo("egg-salad-crackers"),
    ingredients: ["2 boiled eggs", "Mayo or yogurt", "Dijon mustard", "Crackers", "Paprika"],
    steps: ["Chop eggs and mix with mayo and Dijon.", "Spoon onto crackers.", "Sprinkle with paprika."],
    tags: ["snack", "no cook"],
    timeMinutes: 5
  },
  {
    id: "teriyaki-rice-bowl",
    name: "Teriyaki Rice Bowl",
    ...photo("teriyaki-rice-bowl"),
    ingredients: ["Microwave rice", "Frozen edamame", "Teriyaki sauce", "Sesame seeds", "Green onion"],
    steps: ["Microwave rice and edamame together.", "Stir in teriyaki sauce.", "Top with sesame and green onion."],
    tags: ["microwave", "vegetarian"],
    timeMinutes: 5
  },
  {
    id: "prosciutto-melon-toast",
    name: "Melon Toast",
    ...photo("prosciutto-melon-toast"),
    ingredients: ["Toast", "Ricotta", "Melon slices", "Prosciutto", "Honey"],
    steps: ["Spread ricotta over toast.", "Add melon and prosciutto.", "Drizzle with honey."],
    tags: ["snack", "no cook"],
    timeMinutes: 5
  },
  {
    id: "buffalo-chickpea-wrap",
    name: "Buffalo Chickpea Wrap",
    ...photo("buffalo-chickpea-wrap"),
    ingredients: ["Tortilla", "Canned chickpeas", "Buffalo sauce", "Ranch", "Shredded lettuce"],
    steps: ["Mash chickpeas with buffalo sauce.", "Add to tortilla with lettuce.", "Drizzle ranch and roll."],
    tags: ["vegetarian", "lunch"],
    timeMinutes: 5
  },
  {
    id: "berry-almond-toast",
    name: "Berry Almond Toast",
    ...photo("berry-almond-toast"),
    ingredients: ["Toast", "Almond butter", "Sliced strawberries", "Blueberries", "Maple syrup"],
    steps: ["Spread almond butter on toast.", "Add berries.", "Drizzle maple syrup over the top."],
    tags: ["breakfast", "sweet"],
    timeMinutes: 5
  },
  {
    id: "blueberry-yogurt-parfait",
    name: "Blueberry Yogurt Parfait",
    ...photo("greek-yogurt-bowl"),
    ingredients: ["Greek yogurt", "Blueberries", "Granola", "Honey", "Lemon zest"],
    steps: ["Layer yogurt and blueberries.", "Add granola.", "Finish with honey and lemon zest."],
    tags: ["breakfast", "vegetarian"],
    timeMinutes: 5
  },
  {
    id: "cheddar-egg-bagel",
    name: "Cheddar Egg Bagel",
    ...photo("smoked-salmon-bagel"),
    ingredients: ["Bagel thin", "Cooked egg", "Cheddar", "Spinach", "Hot sauce"],
    steps: ["Toast the bagel.", "Layer egg, cheddar, and spinach.", "Add hot sauce and close."],
    tags: ["breakfast", "lunch"],
    timeMinutes: 5
  },
  {
    id: "strawberry-almond-bowl",
    name: "Strawberry Almond Bowl",
    ...photo("berry-almond-toast"),
    ingredients: ["Greek yogurt", "Sliced strawberries", "Almond butter", "Granola", "Maple syrup"],
    steps: ["Spoon yogurt into a bowl.", "Add strawberries and granola.", "Swirl in almond butter and syrup."],
    tags: ["breakfast", "sweet"],
    timeMinutes: 5
  },
  {
    id: "cottage-berry-toast",
    name: "Cottage Berry Toast",
    ...photo("cottage-cheese-savory-bowl"),
    ingredients: ["Toast", "Cottage cheese", "Berries", "Honey", "Black pepper"],
    steps: ["Spread cottage cheese on toast.", "Top with berries.", "Finish with honey and pepper."],
    tags: ["breakfast", "vegetarian"],
    timeMinutes: 5
  },
  {
    id: "banana-yogurt-crunch",
    name: "Banana Yogurt Crunch",
    ...photo("banana-peanut-rollup"),
    ingredients: ["Greek yogurt", "Banana slices", "Peanut butter", "Granola", "Cinnamon"],
    steps: ["Add yogurt to a bowl.", "Top with banana and granola.", "Drizzle peanut butter and cinnamon."],
    tags: ["breakfast", "sweet"],
    timeMinutes: 5
  },
  {
    id: "savory-avocado-plate",
    name: "Savory Avocado Plate",
    ...photo("avocado-egg-toast"),
    ingredients: ["Avocado", "Boiled egg", "Crackers", "Everything seasoning", "Lemon"],
    steps: ["Slice avocado and egg.", "Arrange with crackers.", "Season with lemon and everything seasoning."],
    tags: ["breakfast", "no cook"],
    timeMinutes: 5
  },
  {
    id: "breakfast-pita-pocket",
    name: "Breakfast Pita Pocket",
    ...photo("caprese-pita"),
    ingredients: ["Pita", "Scrambled egg", "Tomato", "Spinach", "Feta"],
    steps: ["Warm pita.", "Fill with egg, tomato, and spinach.", "Sprinkle feta inside."],
    tags: ["breakfast", "vegetarian"],
    timeMinutes: 5
  },
  {
    id: "apple-peanut-toast",
    name: "Apple Peanut Toast",
    ...photo("apple-cheddar-plate"),
    ingredients: ["Toast", "Peanut butter", "Apple slices", "Honey", "Cinnamon"],
    steps: ["Spread peanut butter on toast.", "Layer apple slices.", "Add honey and cinnamon."],
    tags: ["breakfast", "sweet"],
    timeMinutes: 5
  },
  {
    id: "chicken-caesar-wrap",
    name: "Chicken Caesar Wrap",
    ...photo("hummus-veggie-wrap"),
    ingredients: ["Tortilla", "Cooked chicken", "Romaine", "Caesar dressing", "Parmesan"],
    steps: ["Spread dressing on tortilla.", "Add chicken, romaine, and Parmesan.", "Roll tight and slice."],
    tags: ["lunch", "no cook"],
    timeMinutes: 5
  },
  {
    id: "turkey-apple-wrap",
    name: "Turkey Apple Wrap",
    ...photo("turkey-ranch-pinwheels"),
    ingredients: ["Tortilla", "Turkey slices", "Apple matchsticks", "Cheddar", "Dijon"],
    steps: ["Spread Dijon on tortilla.", "Add turkey, apple, and cheddar.", "Roll and cut in half."],
    tags: ["lunch", "no cook"],
    timeMinutes: 5
  },
  {
    id: "mediterranean-hummus-box",
    name: "Hummus Snack Box",
    ...photo("apple-cheddar-plate"),
    ingredients: ["Hummus", "Pita chips", "Cucumber", "Cherry tomatoes", "Feta"],
    steps: ["Spoon hummus into a cup.", "Pack pita chips and vegetables.", "Add feta on the side."],
    tags: ["lunch", "vegetarian"],
    timeMinutes: 5
  },
  {
    id: "chickpea-avocado-pita",
    name: "Chickpea Avocado Pita",
    ...photo("chickpea-salad-cup"),
    ingredients: ["Pita", "Canned chickpeas", "Avocado", "Lime", "Cilantro"],
    steps: ["Mash chickpeas with avocado and lime.", "Spoon into pita.", "Top with cilantro."],
    tags: ["lunch", "vegetarian"],
    timeMinutes: 5
  },
  {
    id: "salmon-cucumber-stack",
    name: "Salmon Cucumber Stack",
    ...photo("smoked-salmon-bagel"),
    ingredients: ["Cucumber rounds", "Cream cheese", "Smoked salmon", "Capers", "Dill"],
    steps: ["Spread cream cheese on cucumber.", "Add salmon.", "Top with capers and dill."],
    tags: ["lunch", "low carb"],
    timeMinutes: 5
  },
  {
    id: "tuna-white-bean-salad",
    name: "Tuna White Bean Salad",
    ...photo("tuna-cucumber-boats"),
    ingredients: ["Tuna pouch", "White beans", "Olive oil", "Lemon", "Parsley"],
    steps: ["Mix tuna and beans.", "Dress with olive oil and lemon.", "Add parsley."],
    tags: ["lunch", "no cook"],
    timeMinutes: 5
  },
  {
    id: "caprese-cracker-stack",
    name: "Caprese Cracker Stack",
    ...photo("caprese-pita"),
    ingredients: ["Crackers", "Mozzarella", "Tomato", "Basil", "Balsamic glaze"],
    steps: ["Layer mozzarella and tomato on crackers.", "Add basil.", "Drizzle balsamic glaze."],
    tags: ["lunch", "vegetarian"],
    timeMinutes: 5
  },
  {
    id: "buffalo-turkey-cup",
    name: "Buffalo Turkey Cup",
    ...photo("buffalo-chickpea-wrap"),
    ingredients: ["Turkey slices", "Buffalo sauce", "Ranch", "Celery", "Lettuce cups"],
    steps: ["Toss turkey with buffalo sauce.", "Spoon into lettuce cups.", "Top with ranch and celery."],
    tags: ["lunch", "low carb"],
    timeMinutes: 5
  },
  {
    id: "bbq-bean-rice-cup",
    name: "BBQ Bean Rice Cup",
    ...photo("teriyaki-rice-bowl"),
    ingredients: ["Microwave rice", "Black beans", "BBQ sauce", "Corn", "Green onion"],
    steps: ["Microwave rice and beans.", "Stir in BBQ sauce and corn.", "Top with green onion."],
    tags: ["dinner", "microwave"],
    timeMinutes: 5
  },
  {
    id: "spicy-peanut-rice",
    name: "Spicy Peanut Rice",
    ...photo("peanut-noodles"),
    ingredients: ["Microwave rice", "Peanut butter", "Soy sauce", "Sriracha", "Frozen peas"],
    steps: ["Heat rice and peas.", "Stir peanut butter with soy and sriracha.", "Fold sauce into rice."],
    tags: ["dinner", "microwave"],
    timeMinutes: 5
  },
  {
    id: "pesto-chicken-pita",
    name: "Pesto Chicken Pita",
    ...photo("pesto-tortellini-cup"),
    ingredients: ["Pita", "Cooked chicken", "Pesto", "Tomato", "Parmesan"],
    steps: ["Warm pita.", "Fill with chicken and tomato.", "Add pesto and Parmesan."],
    tags: ["dinner", "lunch"],
    timeMinutes: 5
  },
  {
    id: "ramen-spinach-bowl",
    name: "Ramen Spinach Bowl",
    ...photo("ramen-egg-cup"),
    ingredients: ["Instant ramen", "Spinach", "Soft-boiled egg", "Soy sauce", "Sesame seeds"],
    steps: ["Cook ramen.", "Stir in spinach.", "Top with egg, soy, and sesame."],
    tags: ["dinner", "microwave"],
    timeMinutes: 5
  },
  {
    id: "quesadilla-pizza-fold",
    name: "Pizza Quesadilla",
    ...photo("pizza-english-muffin"),
    ingredients: ["Tortilla", "Pizza sauce", "Mozzarella", "Pepperoni", "Italian seasoning"],
    steps: ["Fill tortilla with sauce, cheese, and pepperoni.", "Fold and toast.", "Cut into wedges."],
    tags: ["dinner", "skillet"],
    timeMinutes: 5
  },
  {
    id: "tomato-bean-toast",
    name: "Tomato Bean Toast",
    ...photo("tomato-soup-melt"),
    ingredients: ["Toast", "White beans", "Tomato sauce", "Basil", "Parmesan"],
    steps: ["Warm beans with tomato sauce.", "Spoon over toast.", "Finish with basil and Parmesan."],
    tags: ["dinner", "vegetarian"],
    timeMinutes: 5
  },
  {
    id: "teriyaki-chicken-cup",
    name: "Teriyaki Chicken Cup",
    ...photo("teriyaki-rice-bowl"),
    ingredients: ["Microwave rice", "Cooked chicken", "Teriyaki sauce", "Edamame", "Sesame seeds"],
    steps: ["Heat rice, chicken, and edamame.", "Stir in teriyaki sauce.", "Top with sesame seeds."],
    tags: ["dinner", "microwave"],
    timeMinutes: 5
  },
  {
    id: "loaded-nacho-rice",
    name: "Loaded Nacho Rice",
    ...photo("microwave-nachos"),
    ingredients: ["Microwave rice", "Shredded cheese", "Salsa", "Black beans", "Greek yogurt"],
    steps: ["Heat rice, beans, and cheese.", "Add salsa.", "Finish with Greek yogurt."],
    tags: ["dinner", "microwave"],
    timeMinutes: 5
  }
];
