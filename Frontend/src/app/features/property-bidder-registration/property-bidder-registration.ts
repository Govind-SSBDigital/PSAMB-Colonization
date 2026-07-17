import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormArray } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface Receipt {
  receiptNo: string;
  receiptDate: string;
  draftNo: string;
  draftAmount: number;
  draftDate: string;
  draftBank: string;
  principalAmount: number;
  interestAmount: number;
  otherAmount: number;
  penaltyAmount: number;
  penaltyType: string;
  remarks: string;
  isEditing?: boolean; 
}

// Complete structural model representation for structural visualization grid loops
export interface InstallmentScheduleView {
  index: number;
  installmentLabel: string;
  dueDate: string;
  baseAmountDue: number;
  totalWithInterest: number;
}

@Component({
  selector: 'app-property-bidder-registration',
  standalone: false,
  templateUrl: './property-bidder-registration.html',
  styleUrl: './property-bidder-registration.scss',
})
export class PropertyBidderRegistration implements OnInit, OnDestroy {

  registerationForm!: FormGroup;

  branches = ['Main Corporate Branch', 'North Zone Mandi', 'South Zone Branch', 'Head Office'];
  mandis = ['Grain Market A', 'Regional Mandi B', 'Fruit & Vegetable Mandi', 'Cotton Mandi'];
  plotTypes = ['Commercial', 'Residential', 'Industrial'];
  propertyCategories = ['Premium Category', 'General Category'];
  bidderTypes = ['Individual', 'Joint Venture / Firm', 'Corporate Entity'];
  relations = ['Son of (S/o)', 'Daughter of (D/o)', 'Wife of (W/o)'];
  auctionPropertyTypes = ['Commercial Plots', 'Industrial Complex'];
  // Cleaned up list to match the visual "Installment X" pattern exactly
  installments = ['Installment 1', 'Installment 2', 'Installment 3', 'Installment 4', 'Installment 5', 'Installment 6'];
  paidStatuses = ['Pending', 'Fully Paid', 'Partially Paid'];
  plotStatuses = ['Sold', 'Unsold'];
  // Array that holds the calculated installments displayed in the HTML table
  calculatedSchedulesMatrix: InstallmentScheduleView[] = [];

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

  private destroy$ = new Subject<void>();

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
      aadharNo: ['', [Validators.required, Validators.pattern(/^XXXXXXXX\d{4}$/)]],
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
      // Changed from '1st Installment' to match HTML UI labeling pattern
      installmentNo: ['Installment 1'],
      dueDate: [''],
      paidStatus: ['Pending'],
      dueAmount: [''],
      // Will load with interest fetched from receipt records
      accumulatedInterest: [0],
      totalDueAmount: [{ value: '', disabled: true }],
      receiptsFormArray: this.fb.array([])
    });
  }
  
  receiptList: Receipt[] = [];

  get receiptsFormArray(): FormArray {
    return this.registerationForm.get('receiptsFormArray') as FormArray;
  }
  
  loadReceiptData(): void {
    this.receiptList = [
      {
        receiptNo: 'REC-2026-001',
        receiptDate: '2026-07-10',
        draftNo: 'DRF987654',
        draftAmount: 55000.00,
        draftDate: '2026-07-09',
        draftBank: 'abc',
        principalAmount: 50000.00,
        interestAmount: 4500.00,
        otherAmount: 500.00,
        penaltyAmount: 0.00,
        penaltyType: 'N/A',
        remarks: 'First installment received.'
      }
    ];
    // Set interest amount dynamically to Form State before running layout calculations
    const receiptInterest = this.receiptList.reduce((acc, rec) => acc + (rec.interestAmount || 0), 0);
    this.registerationForm.get('accumulatedInterest')?.setValue(receiptInterest, { emitEvent: false });
    this.populateReceiptsFormArray();
  }

  private populateReceiptsFormArray(): void {
    this.receiptsFormArray.clear();
    this.receiptList.forEach(receipt => {
      this.receiptsFormArray.push(this.createReceiptRowFormGroup(receipt));
    });
  }
// Creates a new FormGroup for a receipt row with default values and validation rules
  private createReceiptRowFormGroup(receipt: Partial<Receipt>): FormGroup {
    return this.fb.group({
      receiptNo: [receipt.receiptNo || '', Validators.required],
      receiptDate: [receipt.receiptDate || '', Validators.required],
      draftNo: [receipt.draftNo || '', Validators.required],
      draftAmount: [receipt.draftAmount || 0, [Validators.required, Validators.min(0)]],
      draftDate: [receipt.draftDate || '', Validators.required],
      draftBank: [receipt.draftBank || '', Validators.required],
      principalAmount: [receipt.principalAmount || 0, [Validators.required, Validators.min(0)]],
      interestAmount: [receipt.interestAmount || 0, Validators.min(0)],
      otherAmount: [receipt.otherAmount || 0, Validators.min(0)],
      penaltyAmount: [receipt.penaltyAmount || 0, Validators.min(0)],
      penaltyType: [receipt.penaltyType || 'N/A'],
      remarks: [receipt.remarks || ''],
      isEditing: [receipt.isEditing || false]
    });
  }
//Add new receipt row with default values and set it to editing mode
  addNewReceiptRow(): void {
    const newEmptyRecord: Partial<Receipt> = {
      receiptNo: `REC-2026-00${this.receiptsFormArray.length + 1}`,
      receiptDate: new Date().toISOString().split('T')[0],
      draftDate: new Date().toISOString().split('T')[0],
      draftAmount: 0,
      principalAmount: 0,
      interestAmount: 0,
      otherAmount: 0,
      penaltyAmount: 0,
      penaltyType: 'N/A',
      isEditing: true
    };
    
    this.receiptsFormArray.push(this.createReceiptRowFormGroup(newEmptyRecord));
  }

  enableRowEditing(index: number): void {
    this.receiptsFormArray.at(index).get('isEditing')?.setValue(true);
  }

  saveRowData(index: number): void {
    const rowGroup = this.receiptsFormArray.at(index) as FormGroup;
    if (rowGroup.invalid) {
      rowGroup.markAllAsTouched();
      return;
    }
    rowGroup.get('isEditing')?.setValue(false);
    
    // Updates internal datastore tracking parameters
    this.receiptList[index] = rowGroup.getRawValue();

    // Re-calculate sum of all receipt interests and push back to form to keep scheduler synced
    const totalReceiptInterest = this.receiptList.reduce((acc, rec) => acc + (Number(rec.interestAmount) || 0), 0);
    this.registerationForm.get('accumulatedInterest')?.setValue(totalReceiptInterest, { emitEvent: false });
    
    this.calculateUIInstallments();
  }

  cancelRowEditing(index: number, isNew: boolean): void {
    if (isNew && !this.receiptList[index]) {
      this.removeReceiptRow(index);
    } else {
      const originalValue = this.receiptList[index];
      if (originalValue) {
        originalValue.isEditing = false;
        this.receiptsFormArray.at(index).patchValue(originalValue);
      }
    }
  }

  removeReceiptRow(index: number): void {
    this.receiptsFormArray.removeAt(index);
    if (this.receiptList[index]) {
      this.receiptList.splice(index, 1);
    }

    // Re-calculate sum of all remaining receipt interests
    const totalReceiptInterest = this.receiptList.reduce((acc, rec) => acc + (Number(rec.interestAmount) || 0), 0);
    this.registerationForm.get('accumulatedInterest')?.setValue(totalReceiptInterest, { emitEvent: false });

    this.calculateUIInstallments();
  }

  ngOnInit(): void {
    this.updateAuctionValidators(this.registerationForm.get('Isauctioned')?.value);
    this.registerationForm.get('Isauctioned')?.valueChanges.subscribe((isAuctioned) => {
      this.updateAuctionValidators(isAuctioned);
      if (isAuctioned) {
        this.loadReceiptData();
        this.setupCalculationListeners();
        // Trigger initialization calculation run instantly
        this.calculateUIInstallments();
      }
    });
  }
  maskInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    let digits = value.replace(/^XXXXXXXX/, '').replace(/\D/g, '');

    if (digits.length > 4) {
      digits = digits.substring(0, 4);
    }

    const maskedValue = 'XXXXXXXX' + digits;
    this.registerationForm.get('aadharNo')?.setValue(maskedValue, { emitEvent: false });
    input.value = maskedValue;
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
      installmentNo: 'Installment 1',
      paidStatus: 'Pending',
    });
    this.receiptsFormArray.clear();
    this.calculatedSchedulesMatrix = [];
  }

  private updateAuctionValidators(isAuctioned: boolean): void {
    this.auctionRequiredControls.forEach((controlName) => {
      const control = this.registerationForm.get(controlName);
      if (!control) return;

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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupCalculationListeners(): void {
    this.registerationForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.calculateUIInstallments();
      });
  }
    // CORE CALCULATION ALGORITHM

    // Core calculation logic for dynamic installment schedule generation and UI binding
   private calculateUIInstallments(): void {
    // 1. Fetch form variables safely
    const finalBidderPrice = Number(this.registerationForm.get('h1BidderFinalPrice')?.value) || 0;
    const emdPaid = Number(this.registerationForm.get('emdPaidAmount')?.value) || 0;
    const allotmentPaid = Number(this.registerationForm.get('allotmentPaidAmount')?.value) || 0;
    const milestoneDateStr = this.registerationForm.get('allotmentTransactionDate')?.value;
    const selectedInstallmentString = this.registerationForm.get('installmentNo')?.value || 'Installment 1';
    const currentInterest = Number(this.registerationForm.get('accumulatedInterest')?.value) || 0;

    // 2. Calculate TOTAL Outstanding Principal Balance
    const downPaymentsTotal = emdPaid + allotmentPaid;
    const outstandingPrincipal = finalBidderPrice - downPaymentsTotal;

    // Compute the base installment rate (1/6th of total outstanding principal)
    let computedDueAmount = 0;
    if (outstandingPrincipal > 0) {
      computedDueAmount = outstandingPrincipal / 6;
      computedDueAmount = Math.round((computedDueAmount + Number.EPSILON) * 100) / 100;
    }

    // NEW: Divide the interest evenly across all 6 installments
    let computedInterestPerInstallment = 0;
    if (currentInterest > 0) {
      computedInterestPerInstallment = currentInterest / 6;
      computedInterestPerInstallment = Math.round((computedInterestPerInstallment + Number.EPSILON) * 100) / 100;
    }

    // 3. Generate the 6-part amortization matrix table
    const generatedMatrix: InstallmentScheduleView[] = [];
    
    for (let step = 1; step <= 6; step++) {
      let calculatedDateStr = '';
      
      if (milestoneDateStr) {
        const parts = milestoneDateStr.split('-'); 
        if (parts.length === 3) {
          const baseYear = parseInt(parts[0], 10);
          const baseMonth = parseInt(parts[1], 10) - 1; 
          const baseDay = parseInt(parts[2], 10);
          
          const targetTotalMonths = baseMonth + (step * 6);
          const targetYear = baseYear + Math.floor(targetTotalMonths / 12);
          const targetMonth = targetTotalMonths % 12;
          
          const targetDateObj = new Date(targetYear, targetMonth, baseDay);
          
          if (targetDateObj.getDate() !== baseDay) {
            targetDateObj.setDate(0); 
          }
          
          const pad = (num: number) => num.toString().padStart(2, '0');
          calculatedDateStr = `${targetDateObj.getFullYear()}-${pad(targetDateObj.getMonth() + 1)}-${pad(targetDateObj.getDate())}`;
        }
      }

      const currentLabel = `Installment ${step}`;
      
      // Calculate total amount for this row (Base Principal + Evenly Split Interest)
      const stepTotalWithInterest = computedDueAmount > 0 ? (computedDueAmount + computedInterestPerInstallment) : 0;

      generatedMatrix.push({
        index: step,
        installmentLabel: currentLabel,
        dueDate: calculatedDateStr,
        baseAmountDue: computedDueAmount,
        totalWithInterest: Math.round((stepTotalWithInterest + Number.EPSILON) * 100) / 100
      });
    }

    this.calculatedSchedulesMatrix = generatedMatrix;

    // 4. Calculate total overall due (Full Principal + Accumulated Interest)
    const finalTotalDueIncludingInterest = outstandingPrincipal > 0 ? (outstandingPrincipal + currentInterest) : 0;
    const activeNode = generatedMatrix.find(item => item.installmentLabel === selectedInstallmentString);
    const activeDueDate = activeNode ? activeNode.dueDate : '';

    // 5. Patch corrected, high-level overview values to UI inputs
    this.registerationForm.patchValue({
      dueAmount: outstandingPrincipal > 0 ? outstandingPrincipal : '', // Displays 27,500.00
      dueDate: activeDueDate,
      totalDueAmount: finalTotalDueIncludingInterest > 0 ? finalTotalDueIncludingInterest : '' // Displays 32,000.00
    }, { emitEvent: false });
  }
}