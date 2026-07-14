// Updated d:\Projects\PSAMB-Colonization\Frontend\src\app\features\auth\signup-signin\personal-details\personal-details.ts

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-personal-details',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './personal-details.html',
  styleUrl: './personal-details.scss',
})
export class PersonalDetails {
  @Input() selectedEntityType = '';
  @Input() signUpData: any;

  // Verification state
  verification = {
    emailSent: false,
    emailVerified: false,
    emailOtpInput: '',
    mobileSent: false,
    mobileVerified: false,
    mobileOtpInput: ''
  };

  sectionsExpanded = {
    profile: true
  };

  toggleSection(section: 'profile') {
    this.sectionsExpanded[section] = !this.sectionsExpanded[section];
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

  getPunjabiLabel(typeId: string): string {
    switch (typeId) {
      case 'Individual': return 'ਵਿਅਕਤੀਗਤ';
      case 'Sole Proprietorship': return 'ਇਕੱਲੇ ਮਾਲਕ';
      case 'HUF': return 'ਹਿੰਦੂ ਅਣਵੰਡਿਆ ਪਰਿਵਾਰ';
      case 'Partnership Firm': return 'ਭਾਈਵਾਲੀ ਫਰਮ';
      case 'Company': return 'ਕੰਪਨੀ';
      case 'Procurement Agency': return 'ਖਰੀਦ ਏਜੰਸੀ';
      default: return 'ਹੋਰ';
    }
  }

  getDynamicTitle(): string {
    if (!this.selectedEntityType) {
      return 'Personal Details / ਨਿੱਜੀ ਵੇਰਵੇ';
    }

    const type = this.selectedEntityType;
    if (type === 'Sole Proprietorship') {
      return 'Personal Details of Sole Proprietor (ਇਕੱਲੇ ਮਾਲਕ ਦੇ ਨਿੱਜੀ ਵੇਰਵੇ)';
    }

    const punjabi = this.getPunjabiLabel(type);
    return `Personal Details of ${type} (${punjabi} ਦੇ ਨਿੱਜੀ ਵੇਰਵੇ)`;
  }
}