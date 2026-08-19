import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Navbar } from '../../navbar/navbar';
import { DocumentsAndAddress } from './documents-and-address/documents-and-address';
import { PersonalDetails } from './personal-details/personal-details';
import { BusinessDetails } from './business-details/business-details';
import { Procurement } from './procurement/procurement';
import { AuthService } from '../../../core/service/auth.service';
import { Common } from '../../../core/service/CommonService/common';
import { MenuService } from '../../../core/service/MenuService/menu.service';

interface EntityType {
  id: string;
  label: string;
  icon: string;
  desc: string;
}
interface ResetPasswordModel {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

@Component({
  selector: 'app-signup-signin',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatCardModule, PersonalDetails, DocumentsAndAddress, BusinessDetails, Procurement],
  templateUrl: './signup-signin.html',
  styleUrl: './signup-signin.css',
})
export class SignupSignin implements OnInit {
  isLoggedIn = false;
  loginMethod: 'password' | 'otp' = 'password';

  sectionsExpanded = {
    documents: true,
    business: true
  };

  toggleSection(section: 'documents' | 'business') {
    this.sectionsExpanded[section] = !this.sectionsExpanded[section];
  }

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

  idDocTypes = ['Aadhaar Card', 'Voter Card', 'Passport', 'Driving License'];
  addressDocTypes = ['Aadhaar Card', 'Passport', 'Electricity Bill', 'Water Bill', 'Rent Agreement', 'Registry Deed'];

  selectedEntityType = '';
  authMode: 'landing' | 'signin' | 'signup' = 'signin';
  otpModalOpen = false;
  proceedToForm = false;

  // signUpData = {
  //   // Step 1: Profile Details
  //   gender: '',
  //   dob: '',
  //   firstName: '',
  //   lastName: '',
  //   fatherFirstName: '',
  //   fatherLastName: '',
  //   motherFirstName: '',
  //   motherLastName: '',
  //   emailAddress: '',
  //   mobileNumber: '',
  //   password: '',
  //   confirmPassword: '',

  //   // Step 2: Document Details
  //   idDocumentType: '',
  //   idDocumentNumber: '',
  //   idDocumentFileName: '',
  //   shareAadhaarDetails: false,
  //   panNumber: '',
  //   panFileName: '',
  //   photoFileName: '',

  //   // Step 2: Address Details
  //   addressState: '',
  //   addressDistrict: '',
  //   addressCity: '',
  //   addressPincode: '',
  //   addressLandmark: '',
  //   addressDocType: '',
  //   addressDocNumber: '',
  //   addressDocFileName: '',

  //   // Step 3: Business Details
  //   firmName: '',
  //   gstNumber: '',

  //   // Step 3: Business Address
  //   isSameAddress: false,
  //   businessState: '',
  //   businessDistrict: '',
  //   businessCity: '',
  //   businessPincode: '',
  //   businessLandmark: '',
  //   officePhotoFileName: '',
  //   mandiPropertyCode: ''
  // };

  // Mock Upload states
  uploadProgress: { [key: string]: number } = {};
  uploadingStates: { [key: string]: boolean } = {};
  signUpData = {
    // Personal
    gender: '',
    dob: '',
    firstName: '',
    lastName: '',
    relationType: 'father', // Default to 'father' for initial state
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

    // Documents
    idDocumentType: '',
    idDocumentTypeId: 0,
    idDocumentNumber: '',
    idDocumentFileName: '',
    shareAadhaarDetails: false,
    panNumber: '',
    panFileName: '',
    photoFileName: '',

    // Address
    addressState: '',
    addressStateId: 0,
    addressDistrict: '',
    addressDistrictId: 0,
    addressCity: '',
    addressCityId: 0,
    addressPincode: '',
    addressLandmark: '',
    addressDocType: '',
    addressDocTypeId: 0,
    addressDocNumber: '',
    addressDocFileName: '',

    // Business
    firmName: '',
    gstNumber: '',
    isSameAddress: false,
    businessState: '',
    businessStateId: 0,
    businessDistrict: '',
    businessDistrictId: 0,
    businessCity: '',
    businessCityId: 0,
    businessPincode: '',
    businessLandmark: '',
    officePhotoFileName: '',
    mandiPropertyCode: ''
  }
  // OTP data (Signup)
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

  // Generated info
  generatedUserId = '';
  generatedPassword = '';

  // Sign-In data
  loginData = {
    userId: '',
    password: ''
  };

  // Reset Password Model 
  resetPasswordData: ResetPasswordModel = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  };
  showResetPassword = false;
  pendingFirstLoginToken: string | null = null;
  @ViewChild('resetPasswordModal') resetPasswordModal!: ElementRef;
  private bootstrapModal: any = null;

  // Captcha & Role OTP states
  captchaText = '';
  captchaInput = '';
  loginOtpModalOpen = false;
  loginOtpInput = '';
  loginOtpTimer = 0;
  pendingLoginUser: any = null;
  // 0 = User, 1 = Officer
  loginRole: boolean | number = false; // Default to User

  loginOtpData = {
    mobileNumber: '',
    otpInput: '',
    sentOtp: '112233',
    otpSent: false,
    timer: 0
  };

  // Toast Alerts & Notification states
  toastMessage = '';
  toastType: 'success' | 'error' | 'info' = 'info';
  showToast = false;
  showRegistrationSuccessAlert = false;
  errorMessage = '';
  private toastHideTimer: any = null;

  loggedInUser = {
    userId: '',
    fullName: '',
    entityType: '',
    mobile: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private common: Common,
    private menuService: MenuService
  ) { }

  ngOnInit() {
    // Seed test accounts in sessionStorage if not already present
    const existingUsersRaw = sessionStorage.getItem('cp_users');
    const existingUsers = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];

    sessionStorage.setItem('cp_users', JSON.stringify(existingUsers));

    const session = sessionStorage.getItem('cp_session');
    if (session) {
      this.loggedInUser = JSON.parse(session);
      this.isLoggedIn = true;
    }

    this.generateCaptcha();

    this.route.queryParams.subscribe(params => {
      const mode = params['mode'];
      const url = this.router.url;

      if (mode === 'signin') {
        this.router.navigate(['/auth/login']);
        return;
      }
      if (mode === 'signup') {
        this.router.navigate(['/auth/register']);
        return;
      }

      sessionStorage.removeItem('cp_session');
      this.isLoggedIn = false;
      this.loggedInUser = { userId: '', fullName: '', entityType: '', mobile: '' };

      if (url.includes('/register')) {
        this.openSignUp();
      } else {
        this.openSignIn();
        const successAlert = sessionStorage.getItem('registration_success');
        const registeredUserId = sessionStorage.getItem('registered_user_id');
        if (successAlert === 'true') {
          this.showRegistrationSuccessAlert = true;
          this.loginData.userId = registeredUserId || '';
          sessionStorage.removeItem('registration_success');
          sessionStorage.removeItem('registered_user_id');
        }
      }
    });
  }
  ngOnDestroy(): void {
    if (this.toastHideTimer) {
      clearTimeout(this.toastHideTimer);
      this.toastHideTimer = null;
    }
  }
  private hideToast(): void {
    this.showToast = false;
    this.toastMessage = '';
    this.cdr.detectChanges();
  }

  // Toast Helper
  triggerToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    if (this.toastHideTimer) {
      clearTimeout(this.toastHideTimer);
    }

    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    this.cdr.detectChanges();

    this.toastHideTimer = setTimeout(() => {
      this.hideToast();
      this.toastHideTimer = null;
    }, 5000);
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

  shouldShowBusinessDetails(): boolean {
    return this.selectedEntityType !== 'Individual' && this.selectedEntityType !== 'Procurement Agency';
  }

  shouldShowProcurementSection(): boolean {
    return this.selectedEntityType === 'Procurement Agency';
  }

  onEntityTypeChange() {
    this.triggerToast(`Entity Type changed to: ${this.selectedEntityType}`, 'info');
  }

  openSignUp() {
    if (!this.router.url.includes('/register')) {
      this.router.navigate(['/auth/register']);
      return;
    }
    this.authMode = 'signup';
    this.selectedEntityType = ''; // Default to empty so the form is hidden initially
    this.resetSignUpForm();
    this.showRegistrationSuccessAlert = false;
    this.errorMessage = '';
    this.proceedToForm = false;
  }

  onProceedToForm() {
    if (!this.selectedEntityType) {
      this.triggerToast('Please select Category / ਸ਼੍ਰੇਣੀ ਚੁਣੋ', 'error');
      return;
    }
    this.proceedToForm = true;
    window.scrollTo(0, 0);
  }

  onBackToInstructions() {
    this.proceedToForm = false;
    window.scrollTo(0, 0);
  }

  openSignIn() {
    if (!this.router.url.includes('/login')) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.authMode = 'signin';
    this.loginMethod = 'password'; // Ensure we start with username/password login
    this.resetSignInForm();
    this.generateCaptcha();
    this.showRegistrationSuccessAlert = false;
    this.errorMessage = '';
  }

  toggleLoginMethod(method: 'password' | 'otp') {
    this.loginMethod = method;
    this.errorMessage = '';
    this.resetSignInForm();
    if (method === 'password') {
      this.generateCaptcha();
    }
  }
  
  setLoginRole(flag: boolean) {
    this.loginRole = flag;
  }
  goBackFromLogin() {
    if (this.loginMethod === 'otp') {
      this.toggleLoginMethod('password');
      return;
    }

    this.goBackToLanding();
  }

  goBackToLanding() {
    this.router.navigate(['/']);
  }

  // Captcha Generator
  generateCaptcha() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.captchaText = code;
    this.captchaInput = '';
  }

  refreshCaptcha() {
    this.generateCaptcha();
    // this.triggerToast('Captcha refreshed / ਕੈਪਚਾ ਰਿਫ੍ਰੈਸ਼ ਕੀਤਾ ਗਿਆ', 'info');
  }

  // Role-based OTP Check
  requiresLoginOtp(user: any): boolean {
    const isStaff = user.userId.toLowerCase().startsWith('pmb');
    const isBusiness = user.entityType !== 'Individual' && user.entityType !== 'Other';
    return isStaff || isBusiness;
  }

  // openLoginOtpModal() {
  //   this.loginOtpModalOpen = true;
  //   this.loginOtpInput = '';
  //   this.loginOtpTimer = 30;
  //   this.triggerToast('Login OTP sent (Use: 778899)', 'info');

  //   const interval = setInterval(() => {
  //     if (this.loginOtpTimer > 0) {
  //       this.loginOtpTimer--;
  //     } else {
  //       clearInterval(interval);
  //     }
  //   }, 1000);
  // }

  // closeLoginOtpModal() {
  //   this.loginOtpModalOpen = false;
  //   this.pendingLoginUser = null;
  // }

  // resendLoginOtp() {
  //   this.loginOtpTimer = 30;
  //   this.triggerToast('Login OTP resent (Use: 778899)', 'info');
  // }

  // Step 1 Validation
  validateStep1(): boolean {
    if (!this.selectedEntityType) {
      this.triggerToast('Please select Applicant Registration Type / ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਕਿਸਮ ਦੀ ਚੋਣ ਕਰੋ', 'error');
      return false;
    }
    if (!this.signUpData.gender) {
      this.triggerToast('Please select Gender / ਲਿੰਗ ਚੁਣੋ', 'error');
      return false;
    }
    if (!this.signUpData.dob) {
      this.triggerToast('Please enter Date of Birth / ਜਨਮ ਤਾਰੀਖ ਦਰਜ ਕਰੋ', 'error');
      return false;
    }
    if (!this.signUpData.firstName || this.signUpData.firstName.trim() === '') {
      this.triggerToast('Please enter First Name / ਪਹਿਲਾ ਨਾਂ ਦਰਜ ਕਰੋ', 'error');
      return false;
    }
    if (this.signUpData.fatherSectionVisible) {
      if (!this.signUpData.fatherFirstName || this.signUpData.fatherFirstName.trim() === '') {
        this.triggerToast("Please enter Father's/Husband First Name / ਪਿਤਾ/ਪਤੀ ਦਾ ਪਹਿਲਾ ਨਾਂ ਦਰਜ ਕਰੋ", 'error');
        return false;
      }
      if (!this.signUpData.motherFirstName || this.signUpData.motherFirstName.trim() === '') {
        this.triggerToast("Please enter Mother's First Name / ਮਾਤਾ ਦਾ ਪਹਿਲਾ ਨਾਂ ਦਰਜ ਕਰੋ", 'error');
        return false;
      }
    }
    if (this.signUpData.spouseSectionVisible) {
      if (!this.signUpData.spouseFirstName || this.signUpData.spouseFirstName.trim() === '') {
        this.triggerToast("Please enter Spouse First Name / ਪਤਨੀ ਦਾ ਪਹਿਲਾ ਨਾਂ ਦਰਜ ਕਰੋ", 'error');
        return false;
      }
      if (!this.signUpData.spouseLastName || this.signUpData.spouseLastName.trim() === '') {
        this.triggerToast("Please enter Spouse Last Name / ਪਤਨੀ ਦਾ ਆਖਰੀ ਨਾਂ ਦਰਜ ਕਰੋ", 'error');
        return false;
      }
    }
    if (!this.signUpData.emailAddress || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.signUpData.emailAddress)) {
      this.triggerToast('Please enter a valid Email ID / ਸਹੀ ਈ-ਮੇਲ ਦਰਜ ਕਰੋ', 'error');
      return false;
    }
    if (!this.signUpData.mobileNumber || !/^\d{10}$/.test(this.signUpData.mobileNumber)) {
      this.triggerToast('Please enter a valid 10-digit Mobile Number / 10-ਅੰਕਾਂ ਦਾ ਮੋਬਾਈਲ ਨੰਬਰ ਦਰਜ ਕਰੋ', 'error');
      return false;
    }
    // if (!this.signUpData.password || this.signUpData.password.length < 6) {
    //   this.triggerToast('Password must be at least 6 characters / ਪਾਸਵਰਡ ਘੱਟੋ-ਘੱਟ 6 ਅੱਖਰਾਂ ਦਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ', 'error');
    //   return false;
    // }
    // if (this.signUpData.password !== this.signUpData.confirmPassword) {
    //   this.triggerToast('Passwords do not match / ਪਾਸਵਰਡ ਮੇਲ ਨਹੀਂ ਖਾਂਦੇ', 'error');
    //   return false;
    // }
    return true;
  }

  // Step 2 Validation
  validateStep2(): boolean {
    if (!this.signUpData.idDocumentType) {
      this.triggerToast('Please select Identification Document / ਪਛਾਣ ਦਸਤਾਵੇਜ਼ ਚੁਣੋ', 'error');
      return false;
    }
    if (!this.signUpData.idDocumentNumber || this.signUpData.idDocumentNumber.trim() === '') {
      this.triggerToast('Please enter Document Number / ਨੰਬਰ ਦਰਜ ਕਰੋ', 'error');
      return false;
    }
    if (!this.signUpData.idDocumentFileName) {
      this.triggerToast('Please upload Identification Document / ਦਸਤਾਵੇਜ਼ ਅਪਲੋਡ ਕਰੋ', 'error');
      return false;
    }
    if (!this.signUpData.photoFileName) {
      this.triggerToast('Please upload Your Photo / ਆਪਣੀ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ', 'error');
      return false;
    }
    if (!this.signUpData.addressState) {
      this.triggerToast('Please select State / ਰਾਜ ਚੁਣੋ', 'error');
      return false;
    }
    if (!this.signUpData.addressDistrict) {
      this.triggerToast('Please select District / ਜ਼ਿਲ੍ਹਾ ਚੁਣੋ', 'error');
      return false;
    }
    if (!this.signUpData.addressCity) {
      this.triggerToast('Please select City / ਸ਼ਹਿਰ ਚੁਣੋ', 'error');
      return false;
    }
    if (!this.signUpData.addressPincode || !/^\d{6}$/.test(this.signUpData.addressPincode)) {
      this.triggerToast('Please enter a valid 6-digit Pin Code / ਪਿੰਨ ਕੋਡ ਦਰਜ ਕਰੋ', 'error');
      return false;
    }
    if (!this.signUpData.addressLandmark || this.signUpData.addressLandmark.trim() === '') {
      this.triggerToast('Please enter Plot/Street/Landmark / ਪਲਾਟ/ਗਲੀ/ਲੈਂਡਮਾਰਕ ਦਰਜ ਕਰੋ', 'error');
      return false;
    }
    if (!this.signUpData.addressDocType) {
      this.triggerToast('Please select Address Document / ਪਤਾ ਦਸਤਾਵੇਜ਼ ਚੁਣੋ', 'error');
      return false;
    }
    if (!this.signUpData.addressDocNumber || this.signUpData.addressDocNumber.trim() === '') {
      this.triggerToast('Please enter Address Document Number / ਨੰਬਰ ਦਰਜ ਕਰੋ', 'error');
      return false;
    }
    if (!this.signUpData.addressDocFileName) {
      this.triggerToast('Please upload Address Document / ਦਸਤਾਵੇਜ਼ ਅਪਲੋਡ ਕਰੋ', 'error');
      return false;
    }
    return true;
  }

  // Unified Full-Form Validation
  validateFullForm(): boolean {
    if (!this.validateStep1()) return false;
    if (!this.validateStep2()) return false;

    if (!this.shouldShowBusinessDetails()) {
      return true;
    }

    // Validate Step 3 Business Details
    if (!this.signUpData.firmName || this.signUpData.firmName.trim() === '') {
      this.triggerToast('Please enter Firm Name / ਫਰਮ ਦਾ ਨਾਮ ਦਰਜ ਕਰੋ', 'error');
      return false;
    }
    if (!this.signUpData.businessState) {
      this.triggerToast('Please select Business Office State / ਰਾਜ ਚੁਣੋ', 'error');
      return false;
    }
    if (!this.signUpData.businessDistrict) {
      this.triggerToast('Please select Business Office District / ਜ਼ਿਲ੍ਹਾ ਚੁਣੋ', 'error');
      return false;
    }
    if (!this.signUpData.businessCity) {
      this.triggerToast('Please select Business Office City / ਸ਼ਹਿਰ ਚੁਣੋ', 'error');
      return false;
    }
    if (!this.signUpData.businessPincode || !/^\d{6}$/.test(this.signUpData.businessPincode)) {
      this.triggerToast('Please enter a valid 6-digit Business Office Pin Code / ਪਿੰਨ ਕੋਡ ਦਰਜ ਕਰੋ', 'error');
      return false;
    }
    if (!this.signUpData.businessLandmark || this.signUpData.businessLandmark.trim() === '') {
      this.triggerToast('Please enter Business Office Plot/Street/Landmark / ਪਲਾਟ/ਗਲੀ/ਲੈਂਡਮਾਰਕ ਦਰਜ ਕਰੋ', 'error');
      return false;
    }
    // if (!this.signUpData.officePhotoFileName) {
    //   this.triggerToast('Please upload Front Photograph of Office Property / ਦਫ਼ਤਰ ਦੀ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ', 'error');
    //   return false;
    // }
    return true;
  }

  // Submit handler (called by single Submit button)
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

    //this.openOtpModal();
    this.completeRegistration();
  }

  // File Upload Simulations
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

          this.triggerToast('Document uploaded successfully!', 'success');
        }
      }, 120);
    }
  }

  // OTP Modal management (Signup)
  openOtpModal() {
    this.otpModalOpen = true;
    this.otpData.mobileVerified = false;
    this.otpData.emailVerified = false;
    this.otpData.mobileOtpInput = '';
    this.otpData.emailOtpInput = '';
    // this.sendMobileOtp();
    // this.sendEmailOtp();
  }

  closeOtpModal() {
    this.otpModalOpen = false;
  }

  // sendMobileOtp() {
  //   this.otpData.mobileSent = true;
  //   this.otpData.mobileTimer = 30;
  //   this.triggerToast(`Mobile OTP sent (Use: 123456)`, 'info');

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
  //   this.triggerToast(`Email OTP sent (Use: 654321)`, 'info');

  //   const interval = setInterval(() => {
  //     if (this.otpData.emailTimer > 0) {
  //       this.otpData.emailTimer--;
  //     } else {
  //       clearInterval(interval);
  //     }
  //   }, 1000);
  // }

  verifyMobileOtp() {
    if (this.otpData.mobileOtpInput === this.otpData.sentMobileOtp) {
      this.otpData.mobileVerified = true;
      this.triggerToast('Mobile Number verified successfully!', 'success');
      this.checkOtpVerificationProgress();
    } else {
      this.triggerToast('Invalid Mobile OTP. Please try 123456', 'error');
    }
  }

  verifyEmailOtp() {
    if (this.otpData.emailOtpInput === this.otpData.sentEmailOtp) {
      this.otpData.emailVerified = true;
      this.triggerToast('Email Address verified successfully!', 'success');
      this.checkOtpVerificationProgress();
    } else {
      this.triggerToast('Invalid Email OTP. Please try 654321', 'error');
    }
  }

  checkOtpVerificationProgress() {
    if (this.otpData.mobileVerified && this.otpData.emailVerified) {
      setTimeout(() => {
        this.completeRegistration();
      }, 600);
    }
  }
  completeRegistration() {
    this.closeOtpModal();

    // Backend ke hisaab se request banao
    const request = {
      categoryId: this.getCategoryId(this.selectedEntityType),
      gender: this.signUpData.gender === 'Male' ? 1 : 2,
      dateOfBirth: this.signUpData.dob,
      firstName: this.signUpData.firstName,
      lastName: this.signUpData.lastName,
      relationType:this.signUpData.relationType === 'father' ? 1 : 2, // 1 for Father, 2 for Husband
      fatherHusbandFirstName: this.signUpData.fatherFirstName,
      fatherHusbandLastName: this.signUpData.fatherLastName,
      motherFirstName: this.signUpData.motherFirstName,
      motherLastName: this.signUpData.motherLastName,
      email: this.signUpData.emailAddress,
      mobileNo: this.signUpData.mobileNumber,
      password: this.signUpData.password,
      confirmPassword: this.signUpData.confirmPassword,

      // Documents
      identDocTypeId: this.signUpData.idDocumentTypeId,
      identDocNumber: this.signUpData.idDocumentNumber,
      panNumber: this.signUpData.panNumber,

      // Address
      individualStateId: this.signUpData.addressStateId,
      individualDistrictId: this.signUpData.addressDistrictId,
      individualCityId: this.signUpData.addressCityId,
      individualPinCode: this.signUpData.addressPincode,
      individualPlotStreetLandmark: this.signUpData.addressLandmark,
      addrDocTypeId: this.signUpData.addressDocTypeId,
      addrDocNumber: this.signUpData.addressDocNumber,

      // Business
      firmName: this.signUpData.firmName,
      gstNumber: this.signUpData.gstNumber,
      mandiPropertyCode: this.signUpData.mandiPropertyCode,
      isSameAsIndividualAddress: this.signUpData.isSameAddress,
      businessStateId: this.signUpData.businessStateId,
      businessDistrictId: this.signUpData.businessDistrictId,
      businessCityId: this.signUpData.businessCityId,
      businessPinCode: this.signUpData.businessPincode,
      businessPlotStreetLandmark: this.signUpData.businessLandmark
    };

    this.authService.register(request).subscribe({
      next: (response) => {
        // Token save karo
        sessionStorage.setItem('token', response.data.token);

        const sessionData = {
          userId: response.data.userId,
          fullName: response.data.fullName,
          email: response.data.email,
          entityType: this.selectedEntityType
        };
        sessionStorage.setItem('cp_session', JSON.stringify(sessionData));

        sessionStorage.setItem('registration_success', 'true');
        sessionStorage.setItem('registered_user_id', response.data.userId);

        this.router.navigate(['/auth/login']);
        this.triggerToast('Account registered successfully!', 'success');
      },
      error: (err) => {
        this.triggerToast(err.message || 'Registration failed. Please try again.', 'error');
      }
    });
  }
  getCategoryId(entityType: string): number {
    const map: { [key: string]: number } = {
      'Individual': 1,
      'Sole Proprietorship': 2,
      'HUF': 3,
      'Partnership Firm': 4,
      'Company': 5,
      'Procurement Agency': 6,
      'Other': 7
    };
    return map[entityType] || 1;
  }
  // completeRegistration() {
  //   this.closeOtpModal();

  //   const randomNum = Math.floor(100000 + Math.random() * 900000);
  //   this.generatedUserId = `CP${randomNum}`;
  //   this.generatedPassword = this.signUpData.password;

  //   const existingUsersRaw = sessionStorage.getItem('cp_users');
  //   const existingUsers = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];

  //   const fullName = `${this.signUpData.firstName} ${this.signUpData.lastName}`.trim();
  //   const newUser = {
  //     userId: this.generatedUserId,
  //     password: this.generatedPassword,
  //     fullName: fullName,
  //     entityType: this.selectedEntityType,
  //     mobile: this.signUpData.mobileNumber,
  //     email: this.signUpData.emailAddress
  //   };

  //   existingUsers.push(newUser);
  //   sessionStorage.setItem('cp_users', JSON.stringify(existingUsers));

  //   // Prefill login form
  //   this.loginData.userId = this.generatedUserId;
  //   sessionStorage.setItem('registration_success', 'true');
  //   sessionStorage.setItem('registered_user_id', this.generatedUserId);
  //   this.router.navigate(['/auth/login']);
  //   this.generateCaptcha(); // Refresh captcha

  //   this.triggerToast('Account registered successfully!', 'success');
  // }

  // Reset Forms
  resetSignUpForm() {
    this.signUpData = {
      // Personal
      gender: '',
      dob: '',
      firstName: '',
      lastName: '',
      relationType: 'father', // Default to 'father' for initial state
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

      // Documents
      idDocumentType: '',
      idDocumentTypeId: 0,
      idDocumentNumber: '',
      idDocumentFileName: '',
      shareAadhaarDetails: false,
      panNumber: '',
      panFileName: '',
      photoFileName: '',

      // Address
      addressState: '',
      addressStateId: 0,
      addressDistrict: '',
      addressDistrictId: 0,
      addressCity: '',
      addressCityId: 0,
      addressPincode: '',
      addressLandmark: '',
      addressDocType: '',
      addressDocTypeId: 0,
      addressDocNumber: '',
      addressDocFileName: '',

      // Business
      firmName: '',
      gstNumber: '',
      isSameAddress: false,
      businessState: '',
      businessStateId: 0,
      businessDistrict: '',
      businessDistrictId: 0,
      businessCity: '',
      businessCityId: 0,
      businessPincode: '',
      businessLandmark: '',
      officePhotoFileName: '',
      mandiPropertyCode: ''
    }
    this.otpData = {
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
  }

  resetSignInForm() {
    this.loginData = { userId: '', password: '' };
    this.captchaInput = '';
    this.loginOtpData = { mobileNumber: '', otpInput: '', sentOtp: '112233', otpSent: false, timer: 0 };
  }

  // Sign-In via user/pass + captcha + role-based OTP
  onSignInSubmit() {
    // debugger;
    this.errorMessage = '';
    const { userId, password } = this.loginData;

    if (!userId || !password) {
      this.triggerToast('Please enter User ID and Password', 'error');
      return;
    }

    if (!this.captchaInput || this.captchaInput.trim() !== this.captchaText) {
      this.triggerToast('Invalid Captcha / ਅਵੈਧ ਕੈਪਚਾ', 'error');
      this.generateCaptcha();
      return;
    }
    // debugger
    this.loginRole= this.loginRole === true ? 1 : 0 ;
    this.authService.login(userId, password, this.loginRole).subscribe({
      next: (response) => {
        // Token save karo
        sessionStorage.setItem('token', response.data.token);

        if (response.data.isFirstLogin === true) {
          this.pendingFirstLoginToken = response.data.token;
          this.resetPasswordData = { currentPassword: '', newPassword: '', confirmNewPassword: '' };
          this.showResetPassword = true;
          this.isLoggedIn = false;
          sessionStorage.removeItem('cp_session');
          window.sessionStorage.setItem('token', response.data.token);
          this.cdr.detectChanges();

          setTimeout(() => {
            const modalEl = document.getElementById('resetPasswordModal');
            if (modalEl) {
              this.bootstrapModal = new (window as any).bootstrap.Modal(modalEl);
              this.bootstrapModal.show();
            }
          }, 0);
          return;
        }

        // Session save karo
        const sessionData = {
          userId: response.data.user?.id || '',
          fullName: response.data.user?.fullName || '',
          email: response.data.user?.email || '',
          entityType: response.data.entityType || 'Individual'
        };
        sessionStorage.setItem('cp_session', JSON.stringify(sessionData));

        this.menuService.clearMenusCache();
        this.triggerToast(`Welcome back!`, 'success');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Invalid User ID or Password.';
        this.triggerToast(this.errorMessage, 'error');
        this.generateCaptcha();
      }
    }); // <-- subscribe properly close
  }
  //  onSignInSubmit() {
  //     debugger
  //     this.errorMessage = '';
  //     const { userId, password } = this.loginData;

  //     if (!userId || !password) {
  //       this.triggerToast('Please enter User ID and Password', 'error');
  //       return;
  //     }

  //     if (!this.captchaInput || this.captchaInput.trim() !== this.captchaText) {
  //       this.triggerToast('Invalid Captcha / ਅਵੈਧ ਕੈਪਚਾ', 'error');
  //       this.generateCaptcha();
  //       return;
  //     }

  //     const existingUsersRaw = sessionStorage.getItem('cp_users');
  //     const existingUsers = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];

  //     const user = existingUsers.find((u: any) => u.userId.toLowerCase() === userId.trim().toLowerCase() && u.password === password);

  //     if (user) {
  //       if (this.requiresLoginOtp(user)) {
  //         this.pendingLoginUser = user;
  //         this.openLoginOtpModal();
  //       } else {
  //         this.loginSuccess(user);
  //       }
  //     } else {
  //       this.errorMessage = 'Invalid User ID or Password. Please check and try again.';
  //       this.triggerToast(this.errorMessage, 'error');
  //       this.generateCaptcha();
  //     }
  //   }


  onSignInOtpSubmit() {
    this.errorMessage = '';
    const { mobileNumber, otpInput } = this.loginOtpData;

    if (!mobileNumber || !otpInput) {
      this.triggerToast('Please enter Mobile Number and OTP', 'error');
      return;
    }
    this.loginRole= this.loginRole === true ;
    this.authService.loginWithOtp(mobileNumber, otpInput, this.loginRole).subscribe({
      next: (response) => {
        sessionStorage.setItem('token', response.data.token);
        const sessionData = {
          userId: response.data.user?.id || '',
          fullName: response.data.user?.fullName || '',
          email: response.data.user?.email || '',
          entityType: 'Individual'
        };
        sessionStorage.setItem('cp_session', JSON.stringify(sessionData));
        this.menuService.clearMenusCache();
        this.triggerToast('Welcome back!', 'success');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Invalid OTP';
        this.triggerToast(this.errorMessage, 'error');
      }
    });
  }

  sendLoginOtp() {
    // debugger
    if (!this.loginOtpData.mobileNumber || !/^\d{10}$/.test(this.loginOtpData.mobileNumber)) {
      this.triggerToast('Please enter a valid registered 10-digit Mobile Number', 'error');
      return;
    }

    this.authService.sendLoginOtp(this.loginOtpData.mobileNumber).subscribe({
      next: (res) => {
        if (res.success) {
          // debugger
          this.loginOtpData.otpSent = true;
          this.triggerToast('OTP sent to your mobile', 'success');
        }
      },
      error: (err) => {
        this.triggerToast(err.error?.message || 'Failed to send OTP', 'error');
      }
    });
  }

  loginSuccess(user: any) {
    this.loggedInUser = {
      userId: user.userId,
      fullName: user.fullName,
      entityType: user.entityType || 'Individual',
      mobile: user.mobile
    };
    sessionStorage.setItem('cp_session', JSON.stringify(this.loggedInUser));
    this.isLoggedIn = true;
    this.menuService.clearMenusCache();
    this.triggerToast(`Welcome back, ${user.fullName}!`, 'success');

    if (user.userId.toLowerCase() === 'dataentryoprt') {
      this.router.navigate(['/register']);
    }
  }

  // Reset Password Methods
  validateResetPassword(): boolean {
    const { currentPassword, newPassword, confirmNewPassword } = this.resetPasswordData;

    if (!currentPassword || currentPassword.trim() === '') {
      this.triggerToast('Please enter your current password / ਮੌਜੂਦਾ ਪਾਸਵਰਡ ਦਰਜ ਕਰੋ', 'error');
      return false;
    }
    if (!newPassword || newPassword.length < 6) {
      this.triggerToast('New password must be at least 6 characters / ਨਵਾਂ ਪਾਸਵਰਡ ਘੱਟੋ-ਘੱਟ 6 ਅੱਖਰਾਂ ਦਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ', 'error');
      return false;
    }
    if (newPassword !== confirmNewPassword) {
      this.triggerToast('Passwords do not match / ਪਾਸਵਰਡ ਮੇਲ ਨਹੀਂ ਖਾਂਦੇ', 'error');
      return false;
    }
    if (currentPassword === newPassword) {
      this.triggerToast('New password must be different from current password / ਨਵਾਂ ਪਾਸਵਰਡ ਮੌਜੂਦਾ ਪਾਸਵਰਡ ਤੋਂ ਵੱਖਰਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ', 'error');
      return false;
    }
    return true;
  }

  onResetPasswordSubmit() {
    if (!this.validateResetPassword()) {
      return;
    }

    const payload = {
      currentPassword: this.resetPasswordData.currentPassword,
      newPassword: this.resetPasswordData.newPassword,
      confirmNewPassword: this.resetPasswordData.confirmNewPassword
    };

    this.authService.resetPassword(payload).subscribe({
      next: (response) => {
        this.closeResetPasswordModal();
        this.pendingFirstLoginToken = null;
        this.triggerToast('Password updated successfully! Please login with your new password / ਪਾਸਵਰਡ ਸਫਲਤਾਪੂਰਵਕ ਅੱਪਡੇਟ ਹੋ ਗਿਆ!', 'success');
        this.resetSignInForm();
        this.generateCaptcha();
      },
      error: (err) => {
        console.error('First-login password reset failed:', {
          status: err.status,
          response: err.original?.error ?? err.error
        });
        const responseBody = err.original?.error ?? err.error;
        const message = typeof responseBody === 'string'
          ? responseBody
          : responseBody?.message || err.message || 'Password reset failed. Please try again.';
        this.triggerToast(message, 'error');
      }
    });
  }

  closeResetPasswordModal() {
    if (this.bootstrapModal) {
      this.bootstrapModal.hide();
      this.bootstrapModal.dispose();
      this.bootstrapModal = null;
    }
    this.showResetPassword = false;
    this.pendingFirstLoginToken = null;
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refresh_token');
    this.resetPasswordData = { currentPassword: '', newPassword: '', confirmNewPassword: '' };
    this.resetSignInForm();
    this.generateCaptcha();
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    this.triggerToast('Copied to clipboard!', 'success');
  }

}
