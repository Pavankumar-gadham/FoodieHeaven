
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Recipe } from '../recipe.model';
import { CartItem } from '../cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  apiUrl = 'http://127.0.0.1:8000/api';

  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  updateCartCount() {
    this.getCartCount().subscribe({
      next: (res) => this.cartCountSubject.next(res.count),
      error: () => this.cartCountSubject.next(0)
    });
  }

  // ===================== RECIPE METHODS =====================

  getRecipes(page: number = 1, categoryId?: number, searchQuery?: string) {
    const limit = 5;
    const offset = (page - 1) * limit;
    let params: any = { limit, offset };

    if (categoryId) params.category = categoryId;
    if (searchQuery) params.search = searchQuery;

    return this.http.get(`${this.apiUrl}/recipes/`, { params });
  }

  addRecipe(data: FormData) {
    return this.http.post(`${this.apiUrl}/recipes/`, data, { headers: this.getAuthHeaders() });
  }

  updateRecipe(id: number, data: FormData) {
    return this.http.put(`${this.apiUrl}/recipes/${id}/`, data, { headers: this.getAuthHeaders() });
  }

  getMyRecipes(page: number = 1) {
    const limit = 5;
    const offset = (page - 1) * limit;
    const params: any = { limit, offset };
    return this.http.get(`${this.apiUrl}/my-recipes/`, { params, headers: this.getAuthHeaders() });
  }

  deleteRecipe(id: number) {
    return this.http.delete(`${this.apiUrl}/recipes/${id}/`, { headers: this.getAuthHeaders() });
  }

  getRecipesById(id: number) {
    return this.http.get(`${this.apiUrl}/recipes/${id}/`);
  }

  getCategories() {
    return this.http.get(`${this.apiUrl}/categories/`);
  }

  subscribeToNewsletter(email: string) {
    return this.http.post(`${this.apiUrl}/subscribe/`, { email });
  }

  searchRecipes(query: string) {
    const limit = 10;
    const offset = 0;
    return this.http.get(`${this.apiUrl}/recipes/`, {
      params: { search: query, limit, offset }
    });
  }

  searchMyRecipes(query: string, page: number = 1) {
    const limit = 10;
    const offset = (page - 1) * limit;
    let params: any = { limit, offset };
    if (query) params.search = query;
    return this.http.get(`${this.apiUrl}/my-recipes/`, { params, headers: this.getAuthHeaders() });
  }

  createPaymentOrder(amount: number) {
    return this.http.post<any>(`${this.apiUrl}/create-payment-order/`, { amount });
  }

  checkIfPurchased(recipeId: number) {
    return this.http.get<{ purchased: boolean }>(
      `${this.apiUrl}/has-purchased/${recipeId}/`,
      { headers: this.getAuthHeaders() }
    );
  }

  getPurchasedRecipes() {
    return this.http.get<Recipe[]>(`${this.apiUrl}/purchased-recipes/`, {
      headers: this.getAuthHeaders()
    });
  }

  // ===================== CART METHODS =====================

  addToCart(recipeId: number) {
    console.log('Sending cart payload:', { recipe_id: recipeId });
    return this.http.post(`${this.apiUrl}/cart/`, { recipe_id: recipeId }, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => this.updateCartCount())
    );
  }

  getCartItems() {
    return this.http.get<CartItem[]>(`${this.apiUrl}/cart/`, {
      headers: this.getAuthHeaders()
    });
  }

  removeFromCart(cartItemId: number) {
    return this.http.delete(`${this.apiUrl}/cart/${cartItemId}/`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => this.updateCartCount())
    );
  }

  clearCart() {
    return this.http.delete(`${this.apiUrl}/cart/clear/`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => this.updateCartCount())
    );
  }

  getCartCount() {
    return this.http.get<{ count: number }>(`${this.apiUrl}/cart/count/`, {
      headers: this.getAuthHeaders()
    });
  }

  // ===================== ORDER METHODS =====================

  saveOrders(recipes: Recipe[], paymentId: string) {
    const headers = this.getAuthHeaders();

    const requests = recipes.map(recipe => {
      const payload = {
        recipe: recipe.id,
        payment_id: paymentId
      };
      console.log('Sending order payload:', payload);
      return this.http.post(`${this.apiUrl}/orders/`, payload, { headers }).toPromise();
    });

    return Promise.all(requests);
  }
}


