import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

// Custom validator: passwords must match
export function passwordsMatchValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
})
export class Profile implements OnInit {
  passwordModalOpen = false;
  passwordError = '';
  errorMessage: string | null = null;

  avatarUrl: string = '';

  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  private initialFormState: any;

  constructor(private fb: FormBuilder, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.buildProfileForm();
    this.buildPasswordForm();
    this.initialFormState = this.profileForm.getRawValue();
  }

  private buildProfileForm(): void {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/)
        ]
      ],
      altMobile: [
        '',
        [Validators.pattern(/^[0-9]{10}$/)]
      ],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      district: ['', [Validators.required]],
      state: ['', [Validators.required]],
      pincode: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{6}$/)
        ]
      ]
    });
  }

  private buildPasswordForm(): void {
    this.passwordForm = this.fb.group(
      {
        oldPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
        newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]]
      },
      { validators: passwordsMatchValidator() }
    );
  }

  // Convenience getters for template access
  get f() {
    return this.profileForm.controls;
  }

  get pf() {
    return this.passwordForm.controls;
  }

  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const maxSizeInBytes = 100 * 1024; // 100 KB

      if (file.size > maxSizeInBytes) {
        this.errorMessage = 'Image size must be less than 100 KB.';
        input.value = '';
        return;
      }
      this.errorMessage = null;
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  changePassword(): void {
    this.openPasswordModal();
  }

  openPasswordModal(): void {
    this.passwordModalOpen = true;
    this.passwordError = '';
    this.passwordForm.reset();
  }

  closePasswordModal(): void {
    this.passwordModalOpen = false;
    this.passwordError = '';
  }

  savePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();

      const oldPasswordErrors = this.pf['oldPassword'].errors;
      const newPasswordErrors = this.pf['newPassword'].errors;
      const confirmPasswordErrors = this.pf['confirmPassword'].errors;

      if (oldPasswordErrors?.['required']) {
        this.passwordError = 'Please enter your current password.';
      } else if (newPasswordErrors?.['required'] || confirmPasswordErrors?.['required']) {
        this.passwordError = 'Please enter and confirm your new password.';
      } else if (newPasswordErrors?.['minlength'] || confirmPasswordErrors?.['minlength']) {
        this.passwordError = 'Password must be at least 8 characters long.';
      } else if (this.passwordForm.errors?.['passwordMismatch']) {
        this.passwordError = 'New password and confirmation do not match.';
      } else {
        this.passwordError = 'Please fill the password fields correctly.';
      }
      return;
    }

    this.passwordError = '';
    this.passwordModalOpen = false;
    alert('Password updated successfully.');
  }

  resetForm(): void {
    this.profileForm.reset();
    this.avatarUrl = '';
    this.initialFormState = this.profileForm.getRawValue();
    this.passwordModalOpen = false;
    this.passwordError = '';
    this.passwordForm.reset();
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const payload = { ...this.profileForm.getRawValue(), avatarUrl: this.avatarUrl };
    // console.log('Payload Submitted:', payload);
    this.initialFormState = this.profileForm.getRawValue();
    this.showSuccess();
  }
  show() {
    this.toastr.error('Error message', 'Major Error');
  }
  showSuccess() {
    this.toastr.success('Profile updated successfully!', 'Success');
  }
}