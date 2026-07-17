// Updated d:\Projects\PSAMB-Colonization\Frontend\src\app\features\auth\signup-signin\personal-details\personal-details.ts

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

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

  ngOnInit() {
    this.maxDob = this.formatDate(new Date());
  }

  toggleSection(section: 'profile') {
    this.sectionsExpanded[section] = !this.sectionsExpanded[section];
  }

  onTextInput(field: string, value: string) {
    if (!this.signUpData) {
      return;
    }

    const sanitized = value.replace(/[^A-Za-z\s'-]/g, '');
    this.signUpData[field] = sanitized;
  }

  onDobChange() {
    this.validateDob();
  }

  validateDob() {
    this.ageError = false;
    this.futureDobError = false;

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

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age -= 1;
    }

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

   getPunjabiLabel(typeId: string): string {
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