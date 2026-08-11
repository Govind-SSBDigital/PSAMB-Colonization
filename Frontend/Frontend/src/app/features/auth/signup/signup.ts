import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DocumentsAndAddress } from '../signup-signin/documents-and-address/documents-and-address';
import { PersonalDetails } from '../signup-signin/personal-details/personal-details';
import { BusinessDetails } from '../signup-signin/business-details/business-details';
import { Procurement } from '../signup-signin/procurement/procurement';

interface EntityType {
  id: string;
  label: string;
  icon: string;
  desc: string;
}

@Component({
  selector: 'app-signup',
  imports: [CommonModule, FormsModule, PersonalDetails, DocumentsAndAddress, BusinessDetails, Procurement],
  standalone: true,
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  constructor(private router: Router) { }
  // categories = [
  //   { value: 'individual', label: 'Individual (ਵਿਅਕਤੀਗਤ)' },
  //   { value: 'sole_proprietorship', label: 'Sole Proprietorship (ਇਕੱਲੇ ਮਾਲਕ ਦਾ ਅਧਿਕਾਰ)' },
  //   { value: 'partnership_firm', label: 'Partnership Firm (ਭਾਈਵਾਲੀ ਫਰਮ)' },
  //   { value: 'huf', label: 'Hindu Undivided Family(HUF) (ਹਿੰਦੂ ਅਣਵੰਡਿਆ ਪਰਿਵਾਰ)' },
  //   { value: 'public_limited', label: 'Public Limited Company (ਪਬਲਿਕ ਲਿਮਟਿਡ ਕੰਪਨੀ)' },
  //   { value: 'private_limited', label: 'Private Limited Company (ਪ੍ਰਾਈਵੇਟ ਲਿਮਟਿਡ ਕੰਪਨੀ)' },
  //   { value: 'llp', label: 'Limited Liability Partnership (ਸੀਮਿਤ ਜ਼ਿੰਮੇਵਾਰੀ ਭਾਈਵਾਲੀ)' },
  //   { value: 'procurement_agency', label: 'Procurement Agency (ਖਰੀਦ ਏਜੰਸੀ)' }
  // ];

  selectedCategory: string = '';
  otpModalOpen = false;
  selectedEntityType = '';
  proceedToForm = false;
  uploadProgress: { [key: string]: number } = {};
  uploadingStates: { [key: string]: boolean } = {};

  entityTypes: EntityType[] = [
    { id: 'Individual', label: 'Individual', icon: 'person', desc: 'Any individual citizen of India' },
    { id: 'Sole Proprietorship', label: 'Sole Proprietorship', icon: 'work', desc: 'Single-owner business or trade' },
    { id: 'HUF', label: 'Hindu Undivided Family (HUF)', icon: 'groups', desc: 'Family-owned traditional business' },
    { id: 'Partnership Firm', label: 'Partnership Firm', icon: 'handshake', desc: 'Business managed by partnership deed' },
    { id: 'Public Limited Company', label: 'Public Limited Company', icon: 'business', desc: 'Registered Public Corporation' },
    { id: 'Private Limited Company', label: 'Private Limited Company', icon: 'business', desc: 'Registered Private Corporation' },
    { id: 'Limited Liability Partnership', label: 'Limited Liability Partnership', icon: 'business', desc: 'Hybrid business structure' },
    { id: 'Procurement Agency', label: 'Procurement Agency', icon: 'assignment', desc: 'Government or private procurement agency' }
  ];

  states = ['Punjab', 'Haryana', 'Delhi', 'Himachal Pradesh'];
  districts = ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala', 'Bathinda', 'Gurdaspur'];
  cities = ['Amritsar City', 'Ludhiana City', 'Jalandhar City', 'Patiala City', 'Bathinda City', 'Gurdaspur City', 'Other City'];
  idDocTypes = ['Aadhaar Card', 'Voter Card', 'Passport', 'Driving License'];
  addressDocTypes = ['Aadhaar Card', 'Passport', 'Electricity Bill', 'Water Bill', 'Rent Agreement', 'Registry Deed'];


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
  signUpData = {
    // Step 1: Profile Details
    gender: '',
    dob: '',
    firstName: '',
    lastName: '',
    fatherFirstName: '',
    fatherLastName: '',
    motherFirstName: '',
    motherLastName: '',
    spouseFirstName: '',
    spouseLastName: '',
    fatherSectionVisible: false,
    spouseSectionVisible: false,
    isManagingPartner: null,
    emailAddress: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',

    // Step 2: Document Details
    idDocumentType: '',
    idDocumentNumber: '',
    idDocumentFileName: '',
    shareAadhaarDetails: false,
    panNumber: '',
    panFileName: '',
    photoFileName: '',

    // Step 2: Address Details
    addressState: '',
    addressDistrict: '',
    addressCity: '',
    addressPincode: '',
    addressLandmark: '',
    addressDocType: '',
    addressDocNumber: '',
    addressDocFileName: '',

    // Step 3: Business Details
    firmName: '',
    gstNumber: '',

    // Step 3: Business Address
    isSameAddress: false,
    businessState: '',
    businessDistrict: '',
    businessCity: '',
    businessPincode: '',
    businessLandmark: '',
    officePhotoFileName: '',
    mandiPropertyCode: ''
  };
  otpData = {
    mobileOtpInput: '',
    emailOtpInput: '',
    sentMobileOtp: '123456',
    sentEmailOtp: '654321',
    mobileSent: false,
    emailSent: false,
    mobileVerified: false,
    emailVerified: false,
    mobileTimer: 0,
    emailTimer: 0
  };


  shouldShowProcurementSection(): boolean {
    return this.selectedEntityType === 'Procurement Agency';
  }
  onFileSelected(event: any, docType: string) {
    const file = event.target.files[0];
    if (file) {
      this.uploadingStates[docType] = true;
      this.uploadProgress[docType] = 0;

      const interval = setInterval(() => {
        if (this.uploadProgress[docType] < 100) {
          this.uploadProgress[docType] += 25;
        } else {
          clearInterval(interval);
          this.uploadingStates[docType] = false;

          if (docType === 'idDoc') this.signUpData.idDocumentFileName = file.name;
          else if (docType === 'pan') this.signUpData.panFileName = file.name;
          else if (docType === 'photo') this.signUpData.photoFileName = file.name;
          else if (docType === 'addressDoc') this.signUpData.addressDocFileName = file.name;
          else if (docType === 'officePhoto') this.signUpData.officePhotoFileName = file.name;

        }
      }, 120);
    }
  }
  shouldShowBusinessDetails(): boolean {
    return this.selectedEntityType !== 'Individual' && this.selectedEntityType !== 'Procurement Agency';
  }
  onBackToInstructions() {
    this.proceedToForm = false;
    window.scrollTo(0, 0);
  }

  onSubmitSignup() {
    if (this.signUpData.isSameAddress) {
      this.signUpData.businessState = this.signUpData.addressState;
      this.signUpData.businessDistrict = this.signUpData.addressDistrict;
      this.signUpData.businessCity = this.signUpData.addressCity;
      this.signUpData.businessPincode = this.signUpData.addressPincode;
      this.signUpData.businessLandmark = this.signUpData.addressLandmark;
    }

    if (!this.validateFullForm()) {
      return;
    }

    this.openOtpModal();
  }
  openOtpModal() {
    this.otpModalOpen = true;
    this.otpData.mobileVerified = false;
    this.otpData.emailVerified = false;
    this.otpData.mobileOtpInput = '';
    this.otpData.emailOtpInput = '';
    // this.sendMobileOtp();
    // this.sendEmailOtp();
  }
  //  sendMobileOtp() {
  //   this.otpData.mobileSent = true;
  //   this.otpData.mobileTimer = 30;

  //   const interval = setInterval(() => {
  //     if (this.otpData.mobileTimer > 0) {
  //       this.otpData.mobileTimer--;
  //     } else {
  //       clearInterval(interval);
  //     }
  //   }, 1000);
  // }

  // sendEmailOtp() {
  //   this.otpData.emailSent = true;
  //   this.otpData.emailTimer = 30;

  //   const interval = setInterval(() => {
  //     if (this.otpData.emailTimer > 0) {
  //       this.otpData.emailTimer--;
  //     } else {
  //       clearInterval(interval);
  //     }
  //   }, 1000);
  // }
  validateFullForm(): boolean {
    if (!this.validateStep1()) return false;
    if (!this.validateStep2()) return false;

    if (!this.shouldShowBusinessDetails()) {
      return true;
    }

    // Validate Step 3 Business Details
    if (!this.signUpData.firmName || this.signUpData.firmName.trim() === '') {
      return false;
    }
    if (!this.signUpData.businessState) {
      return false;
    }
    if (!this.signUpData.businessDistrict) {
      return false;
    }
    if (!this.signUpData.businessCity) {
      return false;
    }
    if (!this.signUpData.businessPincode || !/^\d{6}$/.test(this.signUpData.businessPincode)) {
      return false;
    }
    if (!this.signUpData.businessLandmark || this.signUpData.businessLandmark.trim() === '') {
      return false;
    }
    if (!this.signUpData.officePhotoFileName) {
      return false;
    }
    return true;
  }

  validateStep1(): boolean {
    if (!this.selectedEntityType) {
      return false;
    }
    if (!this.signUpData.gender) {
      return false;
    }
    if (!this.signUpData.dob) {
      return false;
    }
    if (!this.signUpData.firstName || this.signUpData.firstName.trim() === '') {
      return false;
    }
    if (this.signUpData.fatherSectionVisible) {
      if (!this.signUpData.fatherFirstName || this.signUpData.fatherFirstName.trim() === '') {
        return false;
      }
      if (!this.signUpData.motherFirstName || this.signUpData.motherFirstName.trim() === '') {
        return false;
      }
    }
    if (this.signUpData.spouseSectionVisible) {
      if (!this.signUpData.spouseFirstName || this.signUpData.spouseFirstName.trim() === '') {
        return false;
      }
      if (!this.signUpData.spouseLastName || this.signUpData.spouseLastName.trim() === '') {
        return false;
      }
    }
    if (!this.signUpData.emailAddress || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.signUpData.emailAddress)) {
      return false;
    }
    if (!this.signUpData.mobileNumber || !/^\d{10}$/.test(this.signUpData.mobileNumber)) {
      return false;
    }
    // if (!this.signUpData.password || this.signUpData.password.length < 6) {
    //   return false;
    // }
    // if (this.signUpData.password !== this.signUpData.confirmPassword) {
    //   return false;
    // }
    return true;
  }

  validateStep2(): boolean {
    if (!this.signUpData.idDocumentType) {
      return false;
    }
    if (!this.signUpData.idDocumentNumber || this.signUpData.idDocumentNumber.trim() === '') {
      return false;
    }
    if (!this.signUpData.idDocumentFileName) {
      return false;
    }
    if (!this.signUpData.photoFileName) {
      return false;
    }
    if (!this.signUpData.addressState) {
      return false;
    }
    if (!this.signUpData.addressDistrict) {
      return false;
    }
    if (!this.signUpData.addressCity) {
      return false;
    }
    if (!this.signUpData.addressPincode || !/^\d{6}$/.test(this.signUpData.addressPincode)) {
      return false;
    }
    if (!this.signUpData.addressLandmark || this.signUpData.addressLandmark.trim() === '') {
      return false;
    }
    if (!this.signUpData.addressDocType) {
      return false;
    }
    if (!this.signUpData.addressDocNumber || this.signUpData.addressDocNumber.trim() === '') {
      return false;
    }
    if (!this.signUpData.addressDocFileName) {
      return false;
    }
    return true;
  }

  onSignIn(): void {
    // wire up navigation / auth flow here
    console.log('Sign In clicked');
  }

  onSignUp(): void {
    console.log('Sign Up clicked');
  }

  onProceed(): void {
    if (!this.selectedCategory) {
      return;
    }
    console.log('Proceeding with category:', this.selectedCategory);
  }
  backToHome(): void {
    this.router.navigate(['/']);
  }
  onProceedToForm() {
    if (!this.selectedEntityType) {
      // this.triggerToast('Please select Category / ਸ਼੍ਰੇਣੀ ਚੁਣੋ', 'error');
      return;
    }
    this.proceedToForm = true;
    window.scrollTo(0, 0);
  }
}