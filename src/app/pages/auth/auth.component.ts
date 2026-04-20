import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {

  activeTab: 'login' | 'signup' = 'login';
  showPassword = false;
  errorMessage = '';
  successMessage = '';
  loading = false;
  redirectAfterLogin = '/home';

  // Login — supports username OR email
  loginData = { usernameOrEmail: '', password: '' };

  // Signup — username + email + password
  signupData = { username: '', email: '', password: '' };

  googleAuthUrl = 'http://localhost:8080/oauth2/authorization/google';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
      return;
    }

    this.route.queryParams.subscribe(params => {
      if (params['redirect'] === 'history') {
        this.redirectAfterLogin = '/history';
        this.successMessage = 'Please login to view history';
        this.cdr.markForCheck();
      }
    });
  }

  switchTab(tab: 'login' | 'signup') {
    this.activeTab = tab;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.markForCheck();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
    this.cdr.markForCheck();
  }

  loginWithGoogle() {
    window.location.href = this.googleAuthUrl;
  }

  onLogin() {
    if (!this.loginData.usernameOrEmail || !this.loginData.password) {
      this.errorMessage = 'Please fill in all fields';
      this.cdr.markForCheck();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    // Detect if input is email or username
    const isEmail = this.loginData.usernameOrEmail.includes('@');
    const loginPayload = isEmail
      ? { email: this.loginData.usernameOrEmail, password: this.loginData.password }
      : { username: this.loginData.usernameOrEmail, password: this.loginData.password };

    this.authService.login(loginPayload).subscribe({
      next: () => {
        this.loading = false;
        this.cdr.markForCheck();
        this.router.navigate([this.redirectAfterLogin]);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Invalid credentials';
        this.cdr.markForCheck();
      }
    });
  }

  onSignup() {
    if (!this.signupData.username || !this.signupData.password) {
      this.errorMessage = 'Username and password are required';
      this.cdr.markForCheck();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.authService.register({
      username: this.signupData.username,
      email: this.signupData.email || undefined,
      password: this.signupData.password
    }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Account created! Please login.';
        this.signupData = { username: '', email: '', password: '' };
        this.cdr.markForCheck();
        setTimeout(() => this.switchTab('login'), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Registration failed';
        this.cdr.markForCheck();
      }
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
