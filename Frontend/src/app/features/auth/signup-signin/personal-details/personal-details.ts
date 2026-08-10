import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-personal-details',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule,MatTooltipModule],
  templateUrl: './personal-details.html',
  styleUrl: './personal-details.scss',
})
export class PersonalDetails implements OnInit {
  @Input() selectedEntityType = '';
  @Input() signUpData: any;
  @Output() toastMessage = new EventEmitter<{ message: string; type: 'success' | 'error' | 'info' }>();

  maxDob = '';
  ageError = false;
  futureDobError = false;

  // Edit this list to control which entity types show the "Managing Partner" toggle
  managingPartnerVisibleTypes: string[] = [
    'Partnership Firm',
    'Limited Liability Partnership'
  ];

  // Verification state
  verification = {
    emailSent: false,
    emailVerified: false,
    emailOtpInput: '',
    emailTimer: 0,
    emailSending: false,
    mobileSent: false,
    mobileVerified: false,
    mobileOtpInput: '',
    mobileTimer: 0,
    mobileSending: false
  };

  sectionsExpanded = { profile: true };
  private emailTimerInterval: any;
  private mobileTimerInterval: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.maxDob = this.formatDate(new Date());
  }

  triggerToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toastMessage.emit({ message, type });
  }

  // Email OTP
  sendEmailOtp() {
    if (this.verification.emailVerified) {
      return;
    }

    if (!this.signUpData?.emailAddress) {
      this.triggerToast('Please enter Email ID first', 'error');
      return;
    }

    if (this.verification.emailSending) {
      return;
    }

    this.verification.emailSending = true;
    this.verification.emailSent = true;
    this.verification.emailOtpInput = '';

    this.http.post(`${environment.apiUrl}/EmailVerification/send-otp`, {
      email: this.signUpData.emailAddress
    }).subscribe({
      next: (res: any) => {
        this.verification.emailSending = false;
        if (res.success) {
          this.startEmailTimer();
          this.triggerToast('OTP sent to your email', 'success');
        } else {
          this.verification.emailSent = false;
          this.triggerToast(res.message || 'Failed to send OTP', 'error');
        }
      },
      error: () => {
        this.verification.emailSending = false;
        this.verification.emailSent = false;
        this.triggerToast('Failed to send OTP. Try again.', 'error');
      }
    });
  }

  onEmailOtpInput() {
    this.verification.emailOtpInput = this.verification.emailOtpInput.replace(/\D/g, '').slice(0, 6);
    if (this.verification.emailOtpInput.length === 6) {
      this.verifyEmailOtp();
    }
  }

  verifyEmailOtp() {
    const otp = this.verification.emailOtpInput.trim();
    if (otp.length !== 6) {
      this.triggerToast('Please enter a valid 6 digit OTP', 'error');
      return;
    }

    this.http.post(`${environment.apiUrl}/EmailVerification/verify-otp`, {
      email: this.signUpData.emailAddress,
      otp
    }).subscribe({
      next: (res: any) => {
        if (res.verified) {
          this.verification.emailVerified = true;
          this.verification.emailSent = false;
          this.verification.emailOtpInput = '';
          this.triggerToast('Email verified successfully!', 'success');
        } else {
          this.verification.emailOtpInput = '';
          this.triggerToast(res.message || 'Invalid OTP. Please try again.', 'error');
        }
      },
      error: () => {
        this.verification.emailOtpInput = '';
        this.triggerToast('Verification failed. Try again.', 'error');
      }
    });
  }

  startEmailTimer() {
    if (this.emailTimerInterval) {
      clearInterval(this.emailTimerInterval);
    }

    this.verification.emailTimer = 10;
    this.emailTimerInterval = setInterval(() => {
      if (this.verification.emailTimer > 0) {
        this.verification.emailTimer--;
      } else {
        clearInterval(this.emailTimerInterval);
      }
    }, 1000);
  }

  // Mobile OTP
  sendMobileOtp() {
    if (this.verification.mobileVerified) {
      return;
    }

    if (!this.signUpData?.mobileNumber || this.signUpData.mobileNumber.length !== 10) {
      this.triggerToast('Please enter valid 10 digit mobile number first', 'error');
      return;
    }

    if (this.verification.mobileSending) {
      return;
    }

    this.verification.mobileSending = true;
    this.verification.mobileSent = true;
    this.verification.mobileOtpInput = '';

    this.http.post(`${environment.apiUrl}/MobileVerification/send-mobile-otp`, {
      mobileNumber: this.signUpData.mobileNumber
    }).subscribe({
      next: (res: any) => {
        this.verification.mobileSending = false;
        if (res.success) {
          this.startMobileTimer();
          this.triggerToast('OTP sent to your mobile', 'success');
        } else {
          this.verification.mobileSent = false;
          this.triggerToast(res.message || 'Failed to send OTP', 'error');
        }
      },
      error: () => {
        this.verification.mobileSending = false;
        this.verification.mobileSent = false;
        this.triggerToast('Failed to send OTP. Try again.', 'error');
      }
    });
  }

  onMobileOtpInput() {
    this.verification.mobileOtpInput = this.verification.mobileOtpInput.replace(/\D/g, '').slice(0, 6);
    if (this.verification.mobileOtpInput.length === 6) {
      this.verifyMobileOtp();
    }
  }

  verifyMobileOtp() {
    const otp = this.verification.mobileOtpInput.trim();
    if (otp.length !== 6) {
      this.triggerToast('Please enter a valid 6 digit OTP', 'error');
      return;
    }

    this.http.post(`${environment.apiUrl}/MobileVerification/verify-mobile-otp`, {
      mobileNumber: this.signUpData.mobileNumber,
      otp
    }).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.verification.mobileVerified = true;
          this.verification.mobileSent = false;
          this.verification.mobileOtpInput = '';
          this.triggerToast('Mobile verified successfully!', 'success');
        } else {
          this.verification.mobileOtpInput = '';
          this.triggerToast(res.message || 'Invalid OTP. Please try again.', 'error');
        }
      },
      error: () => {
        this.verification.mobileOtpInput = '';
        this.triggerToast('Verification failed. Try again.', 'error');
      }
    });
  }

  startMobileTimer() {
    if (this.mobileTimerInterval) {
      clearInterval(this.mobileTimerInterval);
    }

    this.verification.mobileTimer = 10;
    this.mobileTimerInterval = setInterval(() => {
      if (this.verification.mobileTimer > 0) {
        this.verification.mobileTimer--;
      } else {
        clearInterval(this.mobileTimerInterval);
      }
    }, 1000);
  }

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
    if (!this.signUpData) return;
    const sanitized = value.replace(/[^A-Za-z\s'-]/g, '');
    this.signUpData[field] = sanitized;
  }

  onDobChange() {
    this.validateDob();
  }

  validateDob() {
    this.ageError = false;
    this.futureDobError = false;
    if (!this.signUpData?.dob) return;
    const dob = new Date(this.signUpData.dob);
    const today = new Date();
    if (isNaN(dob.getTime())) return;
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
  // sendEmailOtp() {
  //   this.verification.emailSent = true;
  //   this.verification.emailOtpInput = '';
  //   // Simulated behavior
  // }

  // sendMobileOtp() {
  //   this.verification.mobileSent = true;
  //   this.verification.mobileOtpInput = '';
  //   // Simulated behavior
  // }

  // onEmailOtpInput() {
  //   if (this.verification.emailOtpInput.length === 6) {
  //     this.verifyEmailOtp();
  //   }
  // }

  // onMobileOtpInput() {
  //   if (this.verification.mobileOtpInput.length === 6) {
  //     this.verifyMobileOtp();
  //   }
  // }

  // verifyEmailOtp() {
  //   if (this.verification.emailOtpInput === '123456') {
  //     this.verification.emailVerified = true;
  //     this.verification.emailSent = false;
  //   }
  // }

  // verifyMobileOtp() {
  //   if (this.verification.mobileOtpInput === '654321') {
  //     this.verification.mobileVerified = true;
  //     this.verification.mobileSent = false;
  //   }
  // }

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
    if (!this.selectedEntityType) return 'Personal Details / ਨਿੱਜੀ ਵੇਰਵੇ';
    const type = this.selectedEntityType;
    if (type === 'Sole Proprietorship') {
      return 'Personal Details of Sole Proprietor (ਇਕੱਲੇ ਮਾਲਕ ਦੇ ਨਿੱਜੀ ਵੇਰਵੇ)';
    }
    const punjabi = this.getPunjabiLabel(type);
    return `Personal Details of ${type} (${punjabi} ਦੇ ਨਿੱਜੀ ਵੇਰਵੇ)`;
  }
}