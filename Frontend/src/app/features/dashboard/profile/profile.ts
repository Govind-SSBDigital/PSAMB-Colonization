import { Component,OnInit } from '@angular/core';

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

  user: UserProfile = {
    name: 'Abc',
    email: 'abc@domain.com',
    mobile: '+91 234 567 890',
    altMobile: '',
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    district: 'West Province',
    state: 'Oregon',
    pincode: '97477',
    avatarUrl: ''
  };

  private initialFormState!: UserProfile;

  ngOnInit(): void {
    this.initialFormState = { ...this.user };
  }

  onAvatarChange(event: Event): void {
    const element = event.target as HTMLInputElement;
    const fileList: FileList | null = element.files;
    
    if (fileList && fileList[0]) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.user.avatarUrl = e.target.result as string;
        }
      };
      reader.readAsDataURL(fileList[0]);
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
    this.user = { ...this.initialFormState };
  }

  saveProfile(): void {
    console.log('Payload Submitted:', this.user);
    this.initialFormState = { ...this.user };
    alert('Profile data saved successfully.');
  }
}