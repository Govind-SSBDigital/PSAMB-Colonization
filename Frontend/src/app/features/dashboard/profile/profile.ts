import { Component,OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

interface UserProfile {
  name: string;
  email: string;
  mobile: string;
  altMobile: string;
  state: string;
  district: string;
  city: string;
  address: string;
  pincode: string;
  avatarUrl: string;
}
@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
})
export class Profile implements OnInit {
  passwordModalOpen = false;
  passwordForm = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  passwordError = '';
  errorMessage: string | null = null;
  user: UserProfile = {
    name: '',
    email: '',
    mobile: '',
    altMobile: '',
    address: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
    avatarUrl: ''
  };
  constructor(private toastr: ToastrService) {}
  private initialFormState!: UserProfile;

  ngOnInit(): void {
    this.initialFormState = { ...this.user };
  }


  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const maxSizeInBytes = 100 * 1024; // 102,400 bytes (100 KB)

      // Validate file size
      if (file.size > maxSizeInBytes) {
        this.errorMessage = 'Image size must be less than 100 KB.';
        input.value = '';
        return;
      }
      this.errorMessage = null;
      const reader = new FileReader();
      reader.onload = () => {
        this.user.avatarUrl = reader.result as string;
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
    this.passwordForm = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  closePasswordModal(): void {
    this.passwordModalOpen = false;
    this.passwordError = '';
  }

  savePassword(): void {
    if (!this.passwordForm.oldPassword) {
      this.passwordError = 'Please enter your current password.';
      return;
    }

    if (!this.passwordForm.newPassword || !this.passwordForm.confirmPassword) {
      this.passwordError = 'Please enter and confirm your new password.';
      return;
    }

    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.passwordError = 'New password and confirmation do not match.';
      return;
    }

    this.passwordError = '';
    this.passwordModalOpen = false;
    alert('Password updated successfully.');
  }

  resetForm(): void {
    this.user = {
      name: '',
      email: '',
      mobile: '',
      altMobile: '',
      address: '',
      city: '',
      district: '',
      state: '',
      pincode: '',
      avatarUrl: ''
    };
    this.initialFormState = { ...this.user };
    this.passwordModalOpen = false;
    this.passwordError = '';
    this.passwordForm = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  saveProfile(): void {
    console.log('Payload Submitted:', this.user);
    this.initialFormState = { ...this.user };
    this.showSuccess();
  }
  show() {
    this.toastr.error('Error message', 'Major Error');
  }
  showSuccess() {
    this.toastr.success('Profile updated successfully!', 'Success');
  }
}