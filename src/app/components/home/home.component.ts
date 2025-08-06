import { Component } from '@angular/core';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private recipeService: RecipeService) {}

  subscribe(email: string) {
  this.recipeService.subscribeToNewsletter(email).subscribe({
    next: () => {
      alert('✅ Successfully subscribed!');
    },
    error: (err) => {
      if (err.status === 400) {
        alert('⚠️ This email is already subscribed.');
      } else {
        alert('❌ Subscription failed. Try again later.');
      }
    }
  });
}

}
