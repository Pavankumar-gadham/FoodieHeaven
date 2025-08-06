
import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @ViewChild('loginForm') loginForm!: NgForm;

  username = '';
  password = '';

  constructor(
    private authservice: AuthService,
    private router: Router
  ) {}

  login() {
    if (this.loginForm.invalid) {
      Object.values(this.loginForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    this.authservice.login({ username: this.username, password: this.password }).subscribe({
      next: (res: any) => {
        console.log('New Token:', res.access); // Debug line
        // 🔥 Pass both token and username
        this.authservice.setToken(res.access, res.user.username);
        alert('Login Successful!.Redirecting to Home Page...');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        alert('Login Failed!');
      } 
    });
  }
}
