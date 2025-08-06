import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  @ViewChild('registerForm') registerForm!: NgForm;
  
  username = '';
  email = '';
  password = '';
  confirmPassword = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    console.log('Form valid:', this.registerForm.valid);
    console.log('Form invalid:', this.registerForm.invalid);
    console.log('Form touched:', this.registerForm.touched);
    console.log('Form submitted:', this.registerForm.submitted);
      if (this.registerForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.values(this.registerForm.controls).forEach(control => {
        control.markAsTouched();
      });
      
      return;
    }

    // Frontend Validation Checks
    if (!this.username || this.username.length < 6) {
      alert('Username must be at least 6 characters.');
      return;
    }

    if (!this.email || !this.validateEmail(this.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!this.password || this.password.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    // Prepare data for API call
    const data = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    // API call through service
    this.authService.register(data).subscribe({
      next: () => {
        alert('Registration Successful!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration failed:', err);
        alert('Registration Failed! Please try again.');
      },
      complete: () => {
        console.log('Registration request completed.');
      }
    });
  }

  // Utility email validation method
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  
}
