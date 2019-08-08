import { Recipe } from './recipe.model';
import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/indredient.model';
import { ShoppingListService } from '../shopping-list/shopping.service';
import { Subject } from 'rxjs';
@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [];
  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'Tasty Schnitzel',
  //     'A super-tasty Schnitzel - just awesome!',
  //     'https://get.pxhere.com/photo/dish-meal-food-produce-vegetable-fish-breakfast-fast-food-meat-cuisine-chicken-asian-food-fry-up-vegetarian-food-cutlet-schnitzel-croquette-fried-food-chicken-cutlet-1039798.jpg',
  //     [new Ingredient('Meat', 1), new Ingredient('French Fries', 20)]
  //   ),
  //   new Recipe(
  //     'Big Fat Burger',
  //     'What else do you need to say?',
  //     'https://get.pxhere.com/photo/silhouette-light-abstract-restaurant-isolated-summer-dish-food-salad-green-pepper-red-color-fresh-kitchen-bbq-barbeque-flame-fire-garden-juicy-healthy-fast-food-meat-lunch-beef-bread-onion-health-hamburger-burger-sandwich-steak-lettuce-cheese-tomato-grill-bun-cheeseburger-eating-fat-nutrition-vegetables-beauty-pickle-fast-diet-grilled-slider-mayonnaise-unhealthy-whopper-charbroiled-veggie-burger-breakfast-sandwich-big-mac-819865.jpg',
  //     [new Ingredient('Meat', 1), new Ingredient('Buns', 2)]
  //   )
  // ];
  constructor(private shoppingListService: ShoppingListService) {}

  getRecipes() {
    return this.recipes.slice();
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipe(id: number) {
    return this.recipes[id];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }
  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }
  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
