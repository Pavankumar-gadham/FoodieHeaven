
import { Component, OnInit, NgZone } from '@angular/core';
import { RecipeService } from 'src/app/services/recipe.service';
import { Recipe } from 'src/app/recipe.model';
import { Router } from '@angular/router';
import { CartItem } from 'src/app/cart-item.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: Recipe[] = [];
  subtotal = 0;
  deliveryCharge = 40;
  grandTotal = 0;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.recipeService.getCartItems().subscribe({
      next: (items: CartItem[]) => {
        this.cartItems = items.map(item => item.recipe);
        this.calculateTotal();
      },
      error: (err) => {
        console.error('❌ Failed to load cart items', err);
      }
    });
  }

  calculateTotal() {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + Number(item.price), 0);
    this.grandTotal = this.subtotal + this.deliveryCharge;
  }

  payNow() {
    const totalAmount = this.cartItems.reduce((sum, item) => sum + Number(item.price), 0);

    const options: any = {
      key: 'rzp_test_ynjBWt3iryK1zJ',
      amount: totalAmount * 100,
      currency: 'INR',
      name: 'Foodie Haven',
      description: 'Recipe Purchase',
      handler: (response: any) => {
        const paymentId = response.razorpay_payment_id;

        this.recipeService.saveOrders(this.cartItems, paymentId)
          .then(() => {
            alert('✅ Payment successful and orders saved!');

            this.recipeService.clearCart().subscribe({
              next: () => {
                console.log('🧹 Cart cleared after successful order');
                this.cartItems = [];

                this.ngZone.run(() => {
                  this.router.navigate(['/my-orders']);
                });
              },
              error: (err) => {
                console.error('❌ Failed to clear cart after purchase:', err);
                alert('Purchase succeeded but cart clearing failed.');
              }
            });
          })
          .catch(error => {
            console.error('❌ Order saving failed:', error);
            alert('Payment succeeded but order saving failed.');
          });
      },
      prefill: {
        name: 'Foodie User',
        email: 'testuser@example.com'
      },
      theme: {
        color: '#f37254'
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  }
}
