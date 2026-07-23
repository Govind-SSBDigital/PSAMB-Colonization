import { Component, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

type LoginMode = 'password' | 'otp';
type OtpStep = 'mobile' | 'verify';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnDestroy{
  loginForm: FormGroup;
  showPassword = false;
  isSubmitting = false;
  loginError = '';

  // Simple captcha state — swap this for your real captcha service call
  captchaCode = this.generateCaptcha();
  // ---- Mode switch: which module is showing in the right-hand panel ----
  loginMode: LoginMode = 'password';
  // ---- OTP login ----
  otpStep: OtpStep = 'mobile';
  mobileForm: FormGroup;
  otpForm: FormGroup;
  otpDigits = 6;
  isSendingOtp = false;
  isVerifyingOtp = false;
  otpError = '';
  resendSeconds = 0;
  private resendTimer: ReturnType<typeof setInterval> | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      captchaInput: ['', [Validators.required]],
    });

    this.mobileForm = this.fb.group({
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    });

    this.otpForm = this.fb.group({
      digits: this.fb.array(
        Array.from({ length: this.otpDigits }, () =>
          this.fb.control('', [Validators.required, Validators.pattern(/^\d$/)])
        )
      ),
    });
  }

  get otpDigitControls(): FormArray {
    return this.otpForm.get('digits') as FormArray;
  }

  get maskedMobile(): string {
    const num = this.mobileForm.value.mobileNumber || '';
    return num.length === 10 ? `+91 ${num.slice(0, 2)}XXXXXX${num.slice(-2)}` : num;
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
    this.loginMode = 'otp';
    this.otpStep = 'mobile';
    this.otpError = '';
  }

  backToPasswordLogin(): void {
    this.loginMode = 'password';
    this.clearResendTimer();
  }

  backToHome(): void {
    // While inside the OTP module, "Back" steps back through that module
    // first instead of leaving the page straight away.
    if (this.loginMode === 'otp') {
      if (this.otpStep === 'verify') {
        this.changeMobileNumber();
        return;
      }
      this.backToPasswordLogin();
      return;
    }

    this.router.navigate(['/']);
  }
  sendOtp(): void {
    this.otpError = '';

    if (this.mobileForm.invalid) {
      this.mobileForm.markAllAsTouched();
      return;
    }

    this.isSendingOtp = true;

    // replace with your real "send OTP" service call
    setTimeout(() => {
      this.isSendingOtp = false;
      this.otpStep = 'verify';
      this.otpDigitControls.reset();
      this.startResendTimer();
    }, 900);
  }

  resendOtp(): void {
    if (this.resendSeconds > 0 || this.isSendingOtp) {
      return;
    }
    this.sendOtp();
  }

  changeMobileNumber(): void {
    this.otpStep = 'mobile';
    this.otpError = '';
    this.clearResendTimer();
  }

  onOtpDigitInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const digit = input.value.replace(/\D/g, '').slice(-1);
    this.otpDigitControls.at(index).setValue(digit);

    if (digit && index < this.otpDigits - 1) {
      this.focusOtpDigit(index + 1);
    }
  }

  onOtpDigitKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.otpDigitControls.at(index).value && index > 0) {
      this.focusOtpDigit(index - 1);
    }
  }

  onOtpPaste(event: ClipboardEvent): void {
    const pasted = event.clipboardData?.getData('text').replace(/\D/g, '') ?? '';
    if (!pasted) {
      return;
    }
    event.preventDefault();
    pasted
      .slice(0, this.otpDigits)
      .split('')
      .forEach((digit, i) => this.otpDigitControls.at(i).setValue(digit));
    this.focusOtpDigit(Math.min(pasted.length, this.otpDigits) - 1);
  }

  verifyOtp(): void {
    this.otpError = '';

    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    this.isVerifyingOtp = true;

    // replace with your real "verify OTP" service call
    setTimeout(() => {
      this.isVerifyingOtp = false;
      // this.router.navigate(['/dashboard']);
    }, 1000);
  }

  private focusOtpDigit(index: number): void {
    document.getElementById('otp-digit-' + index)?.focus();
  }

  private startResendTimer(): void {
    this.resendSeconds = 30;
    this.clearResendTimer();
    this.resendTimer = setInterval(() => {
      this.resendSeconds--;
      if (this.resendSeconds <= 0) {
        this.clearResendTimer();
      }
    }, 1000);
  }

  private clearResendTimer(): void {
    if (this.resendTimer) {
      clearInterval(this.resendTimer);
      this.resendTimer = null;
    }
  }

  ngOnDestroy(): void {
    this.clearResendTimer();
  }
}