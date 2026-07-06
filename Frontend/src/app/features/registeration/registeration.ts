import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-registeration',
  imports: [ReactiveFormsModule],
  templateUrl: './registeration.html',
})
export class Registeration implements OnInit {
  registerationForm!: FormGroup;

  branches = ['Main Corporate Branch', 'North Zone Mandi', 'South Zone Branch', 'Head Office'];
  mandis = ['Grain Market A', 'Regional Mandi B', 'Fruit & Vegetable Mandi', 'Cotton Mandi'];
  plotTypes = ['Commercial', 'Residential', 'Industrial'];
  propertyCategories = ['Premium Category', 'General Category'];
  bidderTypes = ['Individual', 'Joint Venture / Firm', 'Corporate Entity'];
  relations = ['Son of (S/o)', 'Daughter of (D/o)', 'Wife of (W/o)'];
  auctionPropertyTypes = ['Commercial Plots', 'Industrial Complex'];
  installments = ['1st Installment', '2nd Installment', '3rd Installment'];
  paidStatuses = ['Pending', 'Fully Paid', 'Partially Paid'];
  plotStatuses = ['Sold', 'Unsold'];

  statusFields = [
    { control: 'isAssetResumed', label: 'Asset Resumed' },
    { control: 'IsAssetSurrendered', label: 'Asset Surrendered' },
    { control: 'IsLocked', label: 'Is Asset Locked' },
    { control: 'IsDefaulter', label: 'Is Defaulter' },
    { control: 'IsAnyComplaint', label: 'Any Complaint' },
    { control: 'IsNDCGenerated', label: 'NDC Generated' },
    { control: 'IsNDCIssued', label: 'NDC Issued' },
    { control: 'IsAssetVerified', label: 'Asset Verified' },
  ];

  private auctionRequiredControls = [
    'auctionDateTime',
    'bidderType',
    'emailId',
    'h1BidderName',
    'relation',
    'guardianName',
    'panNo',
    'aadharNo',
    'mobileNo',
    'auctionPropertyType',
    'communicationAddress',
    'reservePrice',
    'h1BidderFinalPrice',
    'formFeeTransactionId',
    'formFeeTransactionDate',
    'formFeePaidAmount',
    'emdTransactionId',
    'emdTransactionDate',
    'emdPaidAmount',
    'allotmentTransactionId',
    'allotmentTransactionDate',
    'allotmentPaidAmount',
    'installmentNo',
    'dueDate',
    'paidStatus',
    'dueAmount',
    'accumulatedInterest',
  ];

  constructor(private fb: FormBuilder) {
    this.registerationForm = this.fb.group({
      branch: ['', Validators.required],
      mandi: ['', Validators.required],
      propertycode: ['', Validators.required],
      plotsize: ['', Validators.required],
      plottype: ['', Validators.required],
      plotno: ['', Validators.required],
      plan: ['', Validators.required],
      plotstatus: ['', Validators.required],
      propertycategory: ['', Validators.required],
      isAssetResumed: [false],
      IsAssetSurrendered: [false],
      IsLocked: [false],
      IsDefaulter: [false],
      IsAnyComplaint: [false],
      IsNDCGenerated: [false],
      IsNDCIssued: [false],
      IsAssetVerified: [false],
      Isauctioned: [false],
      auctionDateTime: [''],
      bidderType: ['Individual'],
      emailId: [''],
      h1BidderName: [''],
      transfered: [false],
      relation: ['Son of (S/o)'],
      guardianName: [''],
      panNo: [''],
      aadharNo: [''],
      mobileNo: [''],
      auctionPropertyType: ['Commercial Plots'],
      communicationAddress: [''],
      reservePrice: [''],
      h1BidderFinalPrice: [''],
      formFeeTransactionId: [''],
      formFeeTransactionDate: [''],
      formFeePaidAmount: [''],
      emdTransactionId: [''],
      emdTransactionDate: [''],
      emdPaidAmount: [''],
      allotmentTransactionId: [''],
      allotmentTransactionDate: [''],
      allotmentPaidAmount: [''],
      installmentNo: ['1st Installment'],
      dueDate: [''],
      paidStatus: ['Pending'],
      dueAmount: [''],
      accumulatedInterest: [''],
      totalDueAmount: [{ value: '', disabled: true }],
    });
  }

  ngOnInit(): void {
    this.updateAuctionValidators(this.registerationForm.get('Isauctioned')?.value);
    this.registerationForm.get('Isauctioned')?.valueChanges.subscribe((isAuctioned) => {
      this.updateAuctionValidators(isAuctioned);
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.registerationForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(controlName: string, label: string): string {
    const control = this.registerationForm.get(controlName);

    if (control?.hasError('email')) {
      return 'Please enter a valid email address.';
    }

    return `${label} is required.`;
  }

  onSubmit(): void {
    if (this.registerationForm.invalid) {
      this.registerationForm.markAllAsTouched();
      return;
    }

    console.log(this.registerationForm.getRawValue());
  }

  resetForm(): void {
    this.registerationForm.reset({
      isAssetResumed: false,
      IsAssetSurrendered: false,
      IsLocked: false,
      IsDefaulter: false,
      IsAnyComplaint: false,
      IsNDCGenerated: false,
      IsNDCIssued: false,
      IsAssetVerified: false,
      Isauctioned: false,
      transfered: false,
      bidderType: 'Individual',
      relation: 'Son of (S/o)',
      auctionPropertyType: 'Commercial Plots',
      installmentNo: '1st Installment',
      paidStatus: 'Pending',
    });
  }

  private updateAuctionValidators(isAuctioned: boolean): void {
    this.auctionRequiredControls.forEach((controlName) => {
      const control = this.registerationForm.get(controlName);

      if (!control) {
        return;
      }

      if (isAuctioned) {
        controlName === 'emailId'
          ? control.setValidators([Validators.required, Validators.email])
          : control.setValidators(Validators.required);
      } else {
        control.clearValidators();
      }

      control.updateValueAndValidity({ emitEvent: false });
    });
  }

  
}
