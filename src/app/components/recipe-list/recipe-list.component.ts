
import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/category.model';
import { Recipe } from 'src/app/recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  categories: Category[] = [];
  currentPage = 1;
  searchQuery = '';
  selectedCategoryId: number | null = null;
  currentUser: string | null = null;
  processVisible: { [key: number]: boolean } = {};

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.currentUser = localStorage.getItem('username')?.trim() || null;
    this.getCategories();

    this.route.queryParams.subscribe(params => {
      const categoryId = params['category'] ? +params['category'] : undefined;
      this.selectedCategoryId = categoryId ?? null;
      this.getRecipes(1, categoryId, this.searchQuery);
    });
  }

  getCategories() {
    this.recipeService.getCategories().subscribe((data: any) => {
      this.categories = data.results || data;
    });
  }

  getRecipes(page = 1, categoryId?: number, searchQuery: string = '') {
    this.recipeService.getRecipes(page, categoryId, searchQuery).subscribe((data: any) => {
      this.recipes = data.results;
      this.currentPage = page;
    });
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

  toggleProcess(recipeId: number) {
    if (this.processVisible[recipeId]) {
      this.processVisible[recipeId] = false;
      return;
    }

    const options: any = {
      key: 'rzp_test_ynjBWt3iryK1zJ',
      amount: 500 * 100,  // Razorpay accepts paise
      currency: 'INR',
      name: 'Foodie Heaven',
      description: 'Buy Recipe Process',
      handler: (response: any) => {
        const paymentId = response.razorpay_payment_id;
        alert('✅ Payment Successful! Payment ID: ' + paymentId);

        // Get the selected recipe
        const purchasedRecipe = this.recipes.find(r => r.id === recipeId);

        if (purchasedRecipe) {
          this.recipeService.saveOrders([purchasedRecipe], paymentId)
            .then(() => {
              alert('📝 Order saved successfully!');
              this.processVisible[recipeId] = true;
            })
            .catch(err => {
              console.error('❌ Failed to save order:', err);
              alert('Payment successful but failed to save order.');
            });
        } else {
          alert('Recipe not found to save order!');
        }
      },
      prefill: {
        name: this.currentUser || 'Guest User',
        email: ''
      },
      theme: {
        color: '#3399cc'
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  }

  searchRecipes() {
    if (this.searchQuery.trim() === '') {
      this.getRecipes();
    } else {
      this.getRecipes(1, this.selectedCategoryId ?? undefined, this.searchQuery.trim());
    }
  }

  addToCart(recipe: Recipe) {
    this.recipeService.addToCart(recipe.id!).subscribe({
      next: () => alert('✅ Added to cart'),
      error: (err) => console.error('❌ Error adding to cart', err)
    });

    alert(`${recipe.title} added to cart! 🛒`);
  }

  nextPage() {
    this.getRecipes(this.currentPage + 1, this.selectedCategoryId || undefined, this.searchQuery);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.getRecipes(this.currentPage - 1, this.selectedCategoryId || undefined, this.searchQuery);
    }
  }
}

