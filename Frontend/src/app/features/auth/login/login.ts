import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm: FormGroup;
  showPassword = false;
  isSubmitting = false;
  loginError = '';
 
  // Simple captcha state — swap this for your real captcha service call
  captchaCode = this.generateCaptcha();
 
  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      captchaInput: ['', [Validators.required]]
    });
  }
 
  generateCaptcha(): string {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
 
  refreshCaptcha(): void {
    this.captchaCode = this.generateCaptcha();
    this.loginForm.get('captchaInput')?.reset();
  }
 
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
 
  onSubmit(): void {
    this.loginError = '';
 
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
 
    if (this.loginForm.value.captchaInput !== this.captchaCode) {
      this.loginError = 'Captcha does not match. Please try again.';
      this.refreshCaptcha();
      return;
    }
 
    this.isSubmitting = true;
 
    // replace with your real auth service call
    setTimeout(() => {
      this.isSubmitting = false;
      // this.router.navigate(['/dashboard']);
    }, 1200);
  }
 
  loginWithMobile(): void {
    // route to mobile OTP login flow
    this.router.navigate(['/auth/login-mobile']);
  }

  backToHome(): void {
    this.router.navigate(['/']);
  }
}

