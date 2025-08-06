import { Component, OnInit } from '@angular/core';
import { RecipeService } from 'src/app/services/recipe.service';
import { Recipe } from 'src/app/recipe.model';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  purchasedRecipes: Recipe[] = [];

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipeService.getPurchasedRecipes().subscribe({
      next: (data) => {
        this.purchasedRecipes = data;
      },
      error: (err) => {
        console.error('❌ Error fetching purchased recipes', err);
      }
    });
  }
}
