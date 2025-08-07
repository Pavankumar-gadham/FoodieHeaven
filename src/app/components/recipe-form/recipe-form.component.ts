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
    price: 0,
    created_at: 0
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

  selectedFilePreview: string | ArrayBuffer | null = null;

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.fileError = false;

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFilePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile!);
    } else {
      this.fileError = true;
      this.selectedFilePreview = null;
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

    // If new image selected, upload to Cloudinary first
    if (this.selectedFile) {
      const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dusufolry/image/upload';
      const cloudinaryPreset = 'presetimages';

      const uploadData = new FormData();
      uploadData.append('file', this.selectedFile);
      uploadData.append('upload_preset', cloudinaryPreset);

      fetch(cloudinaryUrl, {
        method: 'POST',
        body: uploadData
      })
        .then(response => response.json())
        .then(cloudinaryRes => {
          const imageUrl = cloudinaryRes.secure_url;

          const formData = new FormData();
          formData.append('image', imageUrl);
          formData.append('title', this.recipe.title);
          formData.append('description', this.recipe.description);
          formData.append('category', this.recipe.category.toString());
          formData.append('preparation_time', this.recipe.preparation_time.toString());
          formData.append('cooking_time', this.recipe.cooking_time.toString());
          formData.append('rating', this.recipe.rating.toString());
          formData.append('process', this.recipe.process);

          if (this.isEdit) {
            this.recipeService.updateRecipe(this.recipeId, formData).subscribe({
              next: () => {
                alert('Recipe updated!');
                this.router.navigate(['/my-recipes']);
              },
              error: (err) => {
                console.error('Failed to update recipe:', err);
                alert('Failed to update recipe!');
              }
            });
          } else {
            this.recipeService.addRecipe(formData).subscribe({
              next: () => {
                alert('Recipe added!');
                this.router.navigate(['/my-recipes']);
              },
              error: (err) => {
                console.error('Failed to add recipe:', err);
                alert('Failed to add recipe!');
              }
            });
          }
        })
        .catch(error => {
          console.error('Cloudinary upload error:', error);
          alert('Image upload failed!');
        });

    } else {
      // Edit mode with no new image
      const formData = new FormData();
      formData.append('title', this.recipe.title);
      formData.append('description', this.recipe.description);
      formData.append('category', this.recipe.category.toString());
      formData.append('preparation_time', this.recipe.preparation_time.toString());
      formData.append('cooking_time', this.recipe.cooking_time.toString());
      formData.append('rating', this.recipe.rating.toString());
      formData.append('process', this.recipe.process);

      this.recipeService.updateRecipe(this.recipeId, formData).subscribe({
        next: () => {
          alert('Recipe updated!');
          this.router.navigate(['/my-recipes']);
        },
        error: (err) => {
          console.error('Failed to update recipe:', err);
          alert('Failed to update recipe!');
        }
      });
    }
  }
}
