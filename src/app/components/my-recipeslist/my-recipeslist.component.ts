import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/category.model';
import { Recipe } from 'src/app/recipe.model';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-my-recipeslist',
  templateUrl: './my-recipeslist.component.html',
  styleUrls: ['./my-recipeslist.component.css']
})
export class MyRecipesListComponent implements OnInit {
  recipes: Recipe[] = [];
  currentPage = 1;
  searchQuery = '';
  categories: Category[] = [];
  processVisible: { [key: number]: boolean } = {};

  constructor(
    private recipeService: RecipeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getMyRecipes();
  }

  deleteRecipe(id: number) {
    if (confirm('Confirm delete?')) {
      this.recipeService.deleteRecipe(id).subscribe(() => {
        this.recipes = this.recipes.filter(r => r.id !== id);
      });
    }
  }

  editRecipe(id: number) {
    this.router.navigate(['/edit-recipe', id]);
  }

  getMyRecipes(page: number = 1) {
  this.recipeService.getMyRecipes(page).subscribe((data: any) => {
    console.log(data.results); 
    this.recipes = data.results;
    this.currentPage = page;
  });
}

  toggleProcess(recipeId: number) {
  this.processVisible[recipeId] = !this.processVisible[recipeId];
  }

  searchRecipes() {
  this.recipeService.searchMyRecipes(this.searchQuery).subscribe((data: any) => {
    this.recipes = data.results;
    this.currentPage = 1;
  });
}


  nextPage() {
    this.getMyRecipes(this.currentPage + 1);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.getMyRecipes(this.currentPage - 1);
    }
  }
}
