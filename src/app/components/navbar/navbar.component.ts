
import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeService } from 'src/app/services/recipe.service';
import { AuthService } from 'src/app/services/auth.service';
import { Category } from 'src/app/category.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  categories: Category[] = [];
  isMenuOpen = false;
  isDropdownOpen = false;
  isDesktopView = window.innerWidth > 768;
  cartCount = 0;
  private dropdownCloseTimer: any;

  constructor(
    private router: Router,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
  this.checkViewport();
  this.isLoggedIn = this.authService.hasToken();

  this.authService.isLoggedIn$.subscribe(status => {
    console.log('Login status changed:', status);
    this.isLoggedIn = status;
    if (status) {
      this.recipeService.updateCartCount(); // fetch initial count on login
    } else {
      this.cartCount = 0; // reset on logout
    }
  });

  // Subscribe to cartCount observable to update cartCount reactively
  this.recipeService.cartCount$.subscribe(count => {
    this.cartCount = count;
  });

  if (this.isLoggedIn) {
    this.recipeService.updateCartCount(); // fetch initial count on page load if logged in
  }

  this.getCategories();
}


  loadCartCount(): void {
    this.recipeService.getCartCount().subscribe({
      next: (res) => {
        this.cartCount = res.count;
      },
      error: (err) => {
        console.error('Error fetching cart count:', err);
      }
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.checkViewport();
    if (this.isDesktopView) {
      this.isMenuOpen = false;
    }
  }

  private checkViewport() {
    this.isDesktopView = window.innerWidth > 768;
  }

  onDropdownMouseEnter() {
    if (this.isDesktopView) {
      clearTimeout(this.dropdownCloseTimer);
      this.isDropdownOpen = true;
    }
  }

  onDropdownMouseLeave() {
    if (this.isDesktopView) {
      this.dropdownCloseTimer = setTimeout(() => {
        this.isDropdownOpen = false;
      }, 300);
    }
  }

  toggleDropdownMobile() {
    if (!this.isDesktopView) {
      this.isDropdownOpen = !this.isDropdownOpen;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getCategories() {
    this.recipeService.getCategories().subscribe((data: any) => {
      const rawCategories = data.results || data;

      this.categories = rawCategories.map((cat: any) => ({
        ...cat,
        image: this.getCategoryImage(cat.name)
      }));
    });
  }

  getCategoryImage(name: string): string {
    const formattedName = name.toLowerCase().replace(/\s+/g, '-');
    return `assets/images/${formattedName}.jpg`;
  }

  ngOnDestroy() {
    if (this.dropdownCloseTimer) {
      clearTimeout(this.dropdownCloseTimer);
    }
  }
}
