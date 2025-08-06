import { Component, OnInit, ViewChild } from '@angular/core';
import { Recipe } from '../../recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css']
})
export class RecipeFormComponent implements OnInit {
  @ViewChild('recipeForm') recipeForm!: NgForm;

  recipe: Recipe = {
    image: '',
    title: '',
    description: '',
    category: 0,
    preparation_time: 0,
    cooking_time: 0,
    rating: 1,
    process: '',
    price:0,
    created_at:0
  };

  selectedFile: File | null = null;
  fileError = false;

  isEdit = false;
  recipeId: number = 0;
  categories: any[] = [];

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.recipeService.getCategories().subscribe((res: any) => {
      this.categories = res;
    });

    if (this.route.snapshot.paramMap.get('id')) {
      this.isEdit = true;
      this.recipeId = Number(this.route.snapshot.paramMap.get('id'));
      this.recipeService.getRecipesById(this.recipeId).subscribe((res: any) => {
        this.recipe = res;
      });
    }
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.fileError = false;
    } else {
      this.fileError = true;
    }
  }

  saveRecipe() {
    if (this.recipeForm.invalid || (!this.selectedFile && !this.isEdit)) {
      Object.values(this.recipeForm.controls).forEach(control => {
        control.markAsTouched();
      });
      if (!this.selectedFile && !this.isEdit) {
        this.fileError = true;
      }
      return;
    }

    const formData = new FormData();

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    formData.append('title', this.recipe.title);
    formData.append('description', this.recipe.description);
    formData.append('category', this.recipe.category.toString());
    formData.append('preparation_time', this.recipe.preparation_time.toString());
    formData.append('cooking_time', this.recipe.cooking_time.toString());
    formData.append('rating', this.recipe.rating.toString());
    formData.append('process', this.recipe.process);

    if (this.isEdit) {
      this.recipeService.updateRecipe(this.recipeId, formData).subscribe(() => {
        alert('Recipe updated!');
        this.router.navigate(['/my-recipes']);
      });
    } else {
      this.recipeService.addRecipe(formData).subscribe(() => {
        alert('Recipe added!');
        this.router.navigate(['/my-recipes']);
      });
    }

    error: (err: any) => {
  console.error('Failed to add recipe:', err);
  alert('Failed to add recipe!');
}

  }

  
}
