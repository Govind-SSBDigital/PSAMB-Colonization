<<<<<<< HEAD
=======
// Updated d:\Projects\PSAMB-Colonization\Frontend\src\app\features\auth\signup-signin\personal-details\personal-details.ts

>>>>>>> 2ecc0f677ecb2ec440065cbcc7bb3771dba5051e
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
<<<<<<< HEAD
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
=======
>>>>>>> 2ecc0f677ecb2ec440065cbcc7bb3771dba5051e

@Component({
  selector: 'app-personal-details',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './personal-details.html',
  styleUrl: './personal-details.scss',
})
export class PersonalDetails implements OnInit {
  @Input() selectedEntityType = '';
  @Input() signUpData: any;

  maxDob = '';
  ageError = false;
  futureDobError = false;

  // Edit this list to control which entity types show the "Managing Partner" toggle
  managingPartnerVisibleTypes: string[] = [
    'Partnership Firm',
    'Limited Liability Partnership'
  ];

  // Verification state
<<<<<<< HEAD
  toastMessage = '';
  toastType: 'success' | 'error' | 'info' = 'info';
  showToast = false;

=======
>>>>>>> 2ecc0f677ecb2ec440065cbcc7bb3771dba5051e
  verification = {
    emailSent: false,
    emailVerified: false,
    emailOtpInput: '',
<<<<<<< HEAD
    emailTimer: 0,
    mobileSent: false,
    mobileVerified: false,
    mobileOtpInput: '',
    mobileTimer: 0
  };

  sectionsExpanded = { profile: true };

  constructor(private http: HttpClient) {}
=======
    mobileSent: false,
    mobileVerified: false,
    mobileOtpInput: ''
  };

  sectionsExpanded = {
    profile: true
  };
>>>>>>> 2ecc0f677ecb2ec440065cbcc7bb3771dba5051e

  ngOnInit() {
    this.maxDob = this.formatDate(new Date());
  }

<<<<<<< HEAD
  triggerToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 4000);
  }

  // Email OTP
  sendEmailOtp() {
    if (!this.signUpData?.emailAddress) {
      this.triggerToast('Please enter Email ID first', 'error');
      return;
    }

    this.http.post(`${environment.apiUrl}/EmailVerification/send-otp`, {
      email: this.signUpData.emailAddress
    }).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.verification.emailSent = true;
          this.verification.emailOtpInput = '';
          this.startEmailTimer();
          this.triggerToast('OTP sent to your email', 'success');
        } else {
          this.triggerToast(res.message || 'Failed to send OTP', 'error');
        }
      },
      error: () => {
        this.triggerToast('Failed to send OTP. Try again.', 'error');
      }
    });
  }

  onEmailOtpInput() {
    if (this.verification.emailOtpInput.length === 6) {
      this.verifyEmailOtp();
    }
  }

  verifyEmailOtp() {
    this.http.post(`${environment.apiUrl}/EmailVerification/verify-otp`, {
      email: this.signUpData.emailAddress,
      otp: this.verification.emailOtpInput
    }).subscribe({
      next: (res: any) => {
        if (res.verified) {
          this.verification.emailVerified = true;
          this.verification.emailSent = false;
          this.triggerToast('Email verified successfully!', 'success');
        } else {
          this.triggerToast('Invalid OTP. Please try again.', 'error');
          this.verification.emailOtpInput = '';
        }
      },
      error: () => {
        this.triggerToast('Verification failed. Try again.', 'error');
      }
    });
  }

  startEmailTimer() {
    this.verification.emailTimer = 30;
    const interval = setInterval(() => {
      if (this.verification.emailTimer > 0) {
        this.verification.emailTimer--;
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }

  // Mobile OTP
  sendMobileOtp() {
    if (!this.signUpData?.mobileNumber || this.signUpData.mobileNumber.length !== 10) {
      this.triggerToast('Please enter valid 10 digit mobile number first', 'error');
      return;
    }

    this.http.post(`${environment.apiUrl}/MobileVerification/send-mobile-otp`, {
      mobileNumber: this.signUpData.mobileNumber
    }).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.verification.mobileSent = true;
          this.verification.mobileOtpInput = '';
          this.startMobileTimer();
          this.triggerToast('OTP sent to your mobile', 'success');
        } else {
          this.triggerToast(res.message || 'Failed to send OTP', 'error');
        }
      },
      error: () => {
        this.triggerToast('Failed to send OTP. Try again.', 'error');
      }
    });
  }

  onMobileOtpInput() {
    if (this.verification.mobileOtpInput.length === 6) {
      this.verifyMobileOtp();
    }
  }

  verifyMobileOtp() {
    this.http.post(`${environment.apiUrl}/MobileVerification/verify-mobile-otp`, {
      mobileNumber: this.signUpData.mobileNumber,
      otp: this.verification.mobileOtpInput
    }).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.verification.mobileVerified = true;
          this.verification.mobileSent = false;
          this.triggerToast('Mobile verified successfully!', 'success');
        } else {
          this.triggerToast('Invalid OTP. Please try again.', 'error');
          this.verification.mobileOtpInput = '';
        }
      },
      error: () => {
        this.triggerToast('Verification failed. Try again.', 'error');
      }
    });
  }

  startMobileTimer() {
    this.verification.mobileTimer = 30;
    const interval = setInterval(() => {
      if (this.verification.mobileTimer > 0) {
        this.verification.mobileTimer--;
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }

=======
>>>>>>> 2ecc0f677ecb2ec440065cbcc7bb3771dba5051e
  toggleSection(section: 'profile') {
    this.sectionsExpanded[section] = !this.sectionsExpanded[section];
  }

  get isManagingPartnerVisible(): boolean {
    return this.managingPartnerVisibleTypes.includes(this.selectedEntityType);
  }

  onRelationTypeChange() {
    if (!this.signUpData) return;

    if (this.signUpData.relationType === 'father') {
      this.signUpData.spouseFirstName = '';
      this.signUpData.spouseLastName = '';
    } else if (this.signUpData.relationType === 'spouse') {
      this.signUpData.fatherFirstName = '';
      this.signUpData.fatherLastName = '';
      this.signUpData.motherFirstName = '';
      this.signUpData.motherLastName = '';
      this.signUpData.isManagingPartner = null;
    }
  }

   setManagingPartner(value: boolean) {
    if (!this.signUpData) return;
    this.signUpData.isManagingPartner = value;
  }

  onTextInput(field: string, value: string) {
<<<<<<< HEAD
    if (!this.signUpData) return;
=======
    if (!this.signUpData) {
      return;
    }

>>>>>>> 2ecc0f677ecb2ec440065cbcc7bb3771dba5051e
    const sanitized = value.replace(/[^A-Za-z\s'-]/g, '');
    this.signUpData[field] = sanitized;
  }

  onDobChange() {
    this.validateDob();
  }

  validateDob() {
    this.ageError = false;
    this.futureDobError = false;
<<<<<<< HEAD
    if (!this.signUpData?.dob) return;
    const dob = new Date(this.signUpData.dob);
    const today = new Date();
    if (isNaN(dob.getTime())) return;
    if (dob > today) {
      this.futureDobError = true;
    }
=======

    if (!this.signUpData?.dob) {
      return;
    }

    const dob = new Date(this.signUpData.dob);
    const today = new Date();
    if (isNaN(dob.getTime())) {
      return;
    }

    if (dob > today) {
      this.futureDobError = true;
    }

>>>>>>> 2ecc0f677ecb2ec440065cbcc7bb3771dba5051e
    const age = this.calculateAge(dob);
    if (age < 18) {
      this.ageError = true;
    }
  }

  calculateAge(dob: string | Date): number {
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();
<<<<<<< HEAD
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age -= 1;
    }
=======

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age -= 1;
    }

>>>>>>> 2ecc0f677ecb2ec440065cbcc7bb3771dba5051e
    return age;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // OTP Methods
  sendEmailOtp() {
    this.verification.emailSent = true;
    this.verification.emailOtpInput = '';
    // Simulated behavior
  }

  sendMobileOtp() {
    this.verification.mobileSent = true;
    this.verification.mobileOtpInput = '';
    // Simulated behavior
  }

  onEmailOtpInput() {
    if (this.verification.emailOtpInput.length === 6) {
      this.verifyEmailOtp();
    }
  }

  onMobileOtpInput() {
    if (this.verification.mobileOtpInput.length === 6) {
      this.verifyMobileOtp();
    }
  }

  verifyEmailOtp() {
    if (this.verification.emailOtpInput === '123456') {
      this.verification.emailVerified = true;
      this.verification.emailSent = false;
    }
  }

  verifyMobileOtp() {
    if (this.verification.mobileOtpInput === '654321') {
      this.verification.mobileVerified = true;
      this.verification.mobileSent = false;
    }
  }

<<<<<<< HEAD
   getPunjabiLabel(typeId: string): string {
=======
  getPunjabiLabel(typeId: string): string {
>>>>>>> 2ecc0f677ecb2ec440065cbcc7bb3771dba5051e
    switch (typeId) {
      case 'Individual': return 'ਵਿਅਕਤੀਗਤ';
      case 'Sole Proprietorship': return 'ਇਕੱਲੇ ਮਾਲਕ';
      case 'HUF': return 'ਹਿੰਦੂ ਅਣਵੰਡਿਆ ਪਰਿਵਾਰ';
      case 'Partnership Firm': return 'ਭਾਈਵਾਲੀ ਫਰਮ';
      case 'Company': return 'ਕੰਪਨੀ';
      case 'Procurement Agency': return 'ਖਰੀਦ ਏਜੰਸੀ';
      case 'Public Limited Company': return 'ਪਬਲਿਕ ਲਿਮਟਿਡ ਕੰਪਨੀ';
      case 'Private Limited Company': return 'ਪ੍ਰਾਈਵੇਟ ਲਿਮਟਿਡ ਕੰਪਨੀ';
      case 'Limited Liability Partnership': return 'ਸੀਮਿਤ ਜ਼ਿੰਮੇਵਾਰੀ ਭਾਈਵਾਲੀ';
      default: return 'Individual';
    }
  }

  getDynamicTitle(): string {
<<<<<<< HEAD
    if (!this.selectedEntityType) return 'Personal Details / ਨਿੱਜੀ ਵੇਰਵੇ';
=======
    if (!this.selectedEntityType) {
      return 'Personal Details / ਨਿੱਜੀ ਵੇਰਵੇ';
    }

>>>>>>> 2ecc0f677ecb2ec440065cbcc7bb3771dba5051e
    const type = this.selectedEntityType;
    if (type === 'Sole Proprietorship') {
      return 'Personal Details of Sole Proprietor (ਇਕੱਲੇ ਮਾਲਕ ਦੇ ਨਿੱਜੀ ਵੇਰਵੇ)';
    }
<<<<<<< HEAD
=======

>>>>>>> 2ecc0f677ecb2ec440065cbcc7bb3771dba5051e
    const punjabi = this.getPunjabiLabel(type);
    return `Personal Details of ${type} (${punjabi} ਦੇ ਨਿੱਜੀ ਵੇਰਵੇ)`;
  }
}