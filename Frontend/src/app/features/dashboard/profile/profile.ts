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

  user: UserProfile = {
    name: 'Aris Vance',
    email: 'aris.vance@domain.com',
    mobile: '+1 555-0199',
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
    // Implement your routing logic or modal pop-up here
    console.log('Redirecting to password update workflow...');
    alert('Change password trigger called.');
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