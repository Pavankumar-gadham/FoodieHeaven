
import { Component, OnInit } from '@angular/core';
import { RecipeService } from 'src/app/services/recipe.service';
import { Recipe } from 'src/app/recipe.model';

interface CartItem {
  id: number;
  recipe: Recipe;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalAmount = 0;

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.recipeService.getCartItems().subscribe({
      next: (items: CartItem[]) => {
        this.cartItems = items;
        console.log('Cart data:', items);
        this.calculateTotal();
      },
      error: (err) => {
        console.error('❌ Failed to load cart items', err);
      }
    });
  }

  calculateTotal() {
    this.totalAmount = this.cartItems.reduce(
      (sum, item) => sum + Number(item.recipe.price),
      0
    );
  }

  // Removes a recipe from cart using the CartItem ID (not recipe ID)
  removeFromCart(cartItemId: number) {
    this.recipeService.removeFromCart(cartItemId).subscribe({
      next: () => this.loadCart(),
      error: (err) => {
        if (err.status === 404) {
          alert('This item is not in your cart anymore.');
        }
        console.error('❌ Failed to remove from cart', err);
      }
    });
  }

  // Clears the cart for the user
  clearCart() {
    this.recipeService.clearCart().subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('❌ Failed to clear cart', err)
    });
  }
}
