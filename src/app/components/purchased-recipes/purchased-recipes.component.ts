import { Component, OnInit } from '@angular/core';
import { RecipeService } from 'src/app/services/recipe.service';
import { Recipe } from 'src/app/recipe.model';

@Component({
  selector: 'app-purchased-recipes',
  templateUrl: './purchased-recipes.component.html',
  styleUrls: ['./purchased-recipes.component.css']
})
export class PurchasedRecipesComponent implements OnInit {
  purchasedRecipes: Recipe[] = [];
  showDetails: { [key: number]: boolean } = {};  // Track toggle per recipe

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipeService.getPurchasedRecipes().subscribe({
      next: (recipes) => this.purchasedRecipes = recipes,
      error: (err) => console.error('Failed to load purchased recipes', err)
    });
  }

  toggleDetails(recipeId: number) {
    this.showDetails[recipeId] = !this.showDetails[recipeId];
  }
}
