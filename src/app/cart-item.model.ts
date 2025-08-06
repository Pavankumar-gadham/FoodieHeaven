import { Recipe } from './recipe.model';

export interface CartItem {
  id: number;
  user: number;
  recipe: Recipe;
}
