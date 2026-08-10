import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Propertybidderregn } from '../../core/service/Property-Bidder-RegnService/propertybidderregn';
import { Common } from '../../core/service/CommonService/common';

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
  interestAmount: number;
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
  districts: any[] = [];
  mandis: any[] = [];
  isLoadingMandis = false;
  plotTypes: any[] = [];
  propertyCategories: any[] = [];
  bidderTypes: any[] = [];
  plans: any[] = [];
  relations = ['Son of (S/o)', 'Daughter of (D/o)', 'Wife of (W/o)'];
  auctionPropertyTypes: any[] = [];
  // Cleaned up list to match the visual "Installment X" pattern exactly
  installments = ['Installment 1', 'Installment 2', 'Installment 3', 'Installment 4', 'Installment 5', 'Installment 6'];
  paidStatuses = ['Pending', 'Fully Paid', 'Partially Paid'];
  plotStatuses = ['Sold', 'Unsold'];
  // Array that holds the calculated installments displayed in the HTML table
  calculatedSchedulesMatrix: InstallmentScheduleView[] = [];
  marketCommittees: any[] = [];
  isLoadingCommittees = false;
  installmentDateError: string | null = null;
  statusFields = [
    { control: 'isAssetResumed', label: 'Asset Resumed' },
    { control: 'IsAssetSurrendered', label: 'Asset Surrendered' },
    { control: 'IsLocked', label: 'Is Asset Locked' },
    { control: 'IsDefaulter', label: 'Is Defaulter' },
    { control: 'IsAnyComplaint', label: 'Any Complaint' },
    { control: 'IsNDCGenerated', label: 'NDC Generated' },
    { control: 'IsNDCIssued', label: 'NDC Issued' },
    { control: 'IsAssetVerified', label: 'Asset Verified' },
    { control: 'IsCourtCase', label: 'Court Case'}
  ];

  private auctionRequiredControls = [
    'auctionDate',
    'bidderTypeId',
    'email',
    'bidderName',
    'relation',
    'fatherOrHusbandName',
    'auctionPropertyType',
    'address',
    'reservePrice',
    'finalBidPrice',
    'formTransactionId',
    'formTxnDate',
    'formPaidAmount',
    'emdTxnId',
    'emdDate',
    'emdAmount',
    'allotmentTxnId',
    'allotmentDate',
    'allotmentAmount',
    'installmentNo',
    'dueDate',
    'paidStatus',
    'dueAmount',
    'accumulatedInterest',
  ];

  mode: 'view' | 'edit' | 'create' = 'create';
  readonlyMode = false;
  private destroy$ = new Subject<void>();
  propertyData: any;
  propTypes: any;

  constructor(
    private fb: FormBuilder,
    private service: Propertybidderregn,
    private commonService: Common,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {
    this.registerationForm = this.fb.group({

      branchId: ['', Validators.required],
      districtId: ['', Validators.required],
      mandiId: [''],
      // mandi: ['', Validators.required],
      propertycode: [''],

      plotsize: ['', [Validators.required, Validators.min(1)]],
      plotTypeId: ['', Validators.required],
      plotNo: ['', Validators.required],
      planId: ['', Validators.required],
      plotStatus: ['', Validators.required],
      propertyCategoryId: ['', Validators.required],

      isAssetResumed: [false],
      IsAssetSurrendered: [false],
      IsLocked: [false],
      IsDefaulter: [false],
      IsAnyComplaint: [false],
      IsNDCGenerated: [false],
      IsNDCIssued: [false],
      IsAssetVerified: [false],
      isAuctioned: [false],
      IsCourtCase: [false],
      auctionDateTime: [''],
      bidderType: ['Individual'],
      emailId: [''],
      h1BidderName: [''],
      bidderNames: this.fb.array([]),
      transfered: [false],
      relation: ['Son of (S/o)'],
      guardianName: [''],
      panNo: [''],
      aadharNo: ['', [ Validators.pattern(/^XXXXXXXX\d{4}$/)]],
      mobileNo: [''],
      auctionPropertyType: ['Commercial Plots'],
      communicationAddress: [''],
      reservePrice: [''],
      finalBidPrice: ['', Validators.required],

      formTransactionId: [''],
      formTxnDate: [''],
      formPaidAmount: [''],

      emdTxnId: [''],
      emdDate: [''],
      emdAmount: [''],

      allotmentDate: [''],
      allotmentTxnId: [''],
      allotmentAmount: [''],

      dueAmount: [''],
      accumulatedInterest: [0],
      totalDueWithInterest: [{ value: '', disabled: true }],

      installmentNo: ['Installment 1'],
      paidStatus: ['Pending'],
      dueDate: [''],

      receiptsFormArray: this.fb.array([]),
      remarks: []
    });
  }

  receiptList: Receipt[] = [];

  createReceiptForm(receipt?: any): FormGroup {
    return this.fb.group({
      receiptNo: [receipt?.receiptNo || ''],
      receiptDate: [receipt?.receiptDate || ''],
      draftNo: [receipt?.draftNo || ''],
      draftAmount: [receipt?.draftAmount || 0],
      draftDate: [receipt?.draftDate || ''],
      draftBank: [receipt?.draftBank || ''],
      principalAmount: [receipt?.principalAmount || 0],
      interestAmount: [receipt?.interestAmount || 0],
      otherAmount: [receipt?.otherAmount || 0],
      penaltyAmount: [receipt?.penaltyAmount || 0],
      penaltyType: [receipt?.penaltyType || ''],
      remarks: [receipt?.remarks || '']
    });
  }

  isPlanDropdownOpen = false;
  isDistrictDropdownOpen = false;
  isPlotTypeDropdownOpen = false;
  isPropTypeDropdownOpen = false;
  isMandiDropdownOpen = false;

  togglePlanDropdown(event: Event) {
    event.stopPropagation();
    this.isPlanDropdownOpen = !this.isPlanDropdownOpen;
    this.isDistrictDropdownOpen = false;
    this.isPlotTypeDropdownOpen = false;
    this.isPropTypeDropdownOpen = false;
    this.isMandiDropdownOpen = false;
  }

  selectPlan(planVal: any) {
    this.registerationForm.get('planId')?.setValue(planVal);
    this.registerationForm.get('planId')?.markAsTouched();
    this.isPlanDropdownOpen = false;
  }

  getSelectedPlanName(): string {
    const value = this.registerationForm?.get('planId')?.value;
    if (value === undefined || value === null || value === '') return '';
    const selected = this.plans?.find(p => {
      const id = p?.planId ?? p?.id ?? p;
      return String(id) === String(value);
    });
    if (!selected) return '';
    return selected.planName ?? selected.name ?? selected;
  }

  isPlanSelected(plan: any): boolean {
    const value = this.registerationForm?.get('planId')?.value;
    if (value === undefined || value === null || value === '') return false;
    const planId = plan?.planId ?? plan?.id ?? plan;
    return String(planId) === String(value);
  }

  toggleDistrictDropdown(event: Event) {
    event.stopPropagation();
    this.isDistrictDropdownOpen = !this.isDistrictDropdownOpen;
    this.isPlanDropdownOpen = false;
    this.isPlotTypeDropdownOpen = false;
    this.isPropTypeDropdownOpen = false;
    this.isMandiDropdownOpen = false;
  }

  selectDistrict(districtId: any) {
    this.registerationForm.get('districtId')?.setValue(districtId);
    this.registerationForm.get('districtId')?.markAsTouched();
    this.isDistrictDropdownOpen = false;
  }

  getSelectedDistrictName(): string {
    const value = this.registerationForm?.get('districtId')?.value;
    if (value === undefined || value === null || value === '') return '';
    const selected = this.districts?.find(d => String(d.districtId) === String(value));
    return selected ? selected.districtName : '';
  }

  isDistrictSelected(item: any): boolean {
    const value = this.registerationForm?.get('districtId')?.value;
    if (value === undefined || value === null || value === '') return false;
    return String(item?.districtId) === String(value);
  }

  togglePlotTypeDropdown(event: Event) {
    event.stopPropagation();
    this.isPlotTypeDropdownOpen = !this.isPlotTypeDropdownOpen;
    this.isPlanDropdownOpen = false;
    this.isDistrictDropdownOpen = false;
    this.isPropTypeDropdownOpen = false;
    this.isMandiDropdownOpen = false;
  }

  selectPlotType(val: any) {
    this.registerationForm.get('plotTypeId')?.setValue(val);
    this.registerationForm.get('plotTypeId')?.markAsTouched();
    this.isPlotTypeDropdownOpen = false;
  }

  getSelectedPlotTypeName(): string {
    const value = this.registerationForm?.get('plotTypeId')?.value;
    if (value === undefined || value === null || value === '') return '';
    const selected = this.plotTypes?.find(t => {
      const id = t?.plotTypeId ?? t?.id ?? t;
      return String(id) === String(value);
    });
    if (!selected) return '';
    return selected.plotType ?? selected.plotTypeName ?? selected.name ?? selected;
  }

  isPlotTypeSelected(item: any): boolean {
    const value = this.registerationForm?.get('plotTypeId')?.value;
    if (value === undefined || value === null || value === '') return false;
    const id = item?.plotTypeId ?? item?.id ?? item;
    return String(id) === String(value);
  }

  togglePropTypeDropdown(event: Event) {
    event.stopPropagation();
    this.isPropTypeDropdownOpen = !this.isPropTypeDropdownOpen;
    this.isPlanDropdownOpen = false;
    this.isDistrictDropdownOpen = false;
    this.isPlotTypeDropdownOpen = false;
    this.isMandiDropdownOpen = false;
  }

  selectPropType(val: any) {
    this.registerationForm.get('auctionPropertyType')?.setValue(val);
    this.registerationForm.get('auctionPropertyType')?.markAsTouched();
    this.isPropTypeDropdownOpen = false;
  }

  getSelectedPropTypeName(): string {
    const value = this.registerationForm?.get('auctionPropertyType')?.value;
    if (value === undefined || value === null || value === '') return '';
    const selected = this.auctionPropertyTypes?.find(t => {
      const id = t?.propertyTypeId ?? t?.id ?? t;
      return String(id) === String(value);
    });
    if (!selected) return '';
    return selected.propertyTypeName ?? selected.name ?? selected.propertyType ?? selected;
  }

  isPropTypeSelected(item: any): boolean {
    const value = this.registerationForm?.get('auctionPropertyType')?.value;
    if (value === undefined || value === null || value === '') return false;
    const id = item?.propertyTypeId ?? item?.id ?? item;
    return String(id) === String(value);
  }

  toggleMandiDropdown(event: Event) {
    event.stopPropagation();
    this.isMandiDropdownOpen = !this.isMandiDropdownOpen;
    this.isPlanDropdownOpen = false;
    this.isDistrictDropdownOpen = false;
    this.isPlotTypeDropdownOpen = false;
    this.isPropTypeDropdownOpen = false;
  }

  selectMandi(mandiId: any) {
    this.registerationForm.get('mandiId')?.setValue(mandiId);
    this.registerationForm.get('mandiId')?.markAsTouched();
    this.isMandiDropdownOpen = false;
  }

  getSelectedMandiName(): string {
    const value = this.registerationForm?.get('mandiId')?.value;
    if (value === undefined || value === null || value === '') return '';
    const selected = this.mandis?.find(m => {
      const id = m?.mandiId ?? m?.id ?? m;
      return String(id) === String(value);
    });
    if (!selected) return '';
    return selected.mandiName ?? selected.name ?? selected;
  }

  isMandiSelected(item: any): boolean {
    const value = this.registerationForm?.get('mandiId')?.value;
    if (value === undefined || value === null || value === '') return false;
    const id = item?.mandiId ?? item?.id ?? item;
    return String(id) === String(value);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    this.isPlanDropdownOpen = false;
    this.isDistrictDropdownOpen = false;
    this.isPlotTypeDropdownOpen = false;
    this.isPropTypeDropdownOpen = false;
    this.isMandiDropdownOpen = false;
  }

  ngOnInit(): void {
    // debugger
    this.loadDistricts();
    this.loadPropertyCategories();
    this.loadBidderTypes();
    this.loadPlans();
    this.loadPlotTypes();
    this.getPropertyTypes();
    this.setupCalculationListeners();
    this.registerationForm.get('districtId')?.valueChanges.subscribe((districtId) => {
      this.marketCommittees = [];
      this.registerationForm.get('branchId')?.setValue('', { emitEvent: false });
      this.mandis = [];
      this.registerationForm.get('mandiId')?.setValue('', { emitEvent: false });
      if (districtId) {
        this.loadMarketCommittees(districtId);
      }
    });
    this.registerationForm.get('branchId')?.valueChanges.subscribe((branchId) => {
      this.mandis = [];
      this.registerationForm.get('mandiId')?.setValue('', { emitEvent: false });
      if (branchId) {
        this.loadMandis(branchId);
      }
    });
    this.updateAuctionValidators(this.registerationForm.get('isAuctioned')?.value);
    this.registerationForm.get('isAuctioned')?.valueChanges.subscribe((isAuctioned) => {
      this.updateAuctionValidators(isAuctioned);
      if (isAuctioned) {
        // this.loadReceiptData();
        this.calculateUIInstallments();
      }
    });
    this.registerationForm.get('isTransferred')?.valueChanges.subscribe(() => {
      this.updateBidderNameValidators();
    });

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const mode = params['mode'] as string;
      const propertyCode = params['propertyCode'] as string;
      this.setMode(mode);
      if (propertyCode) {
        this.registerationForm.patchValue({ propertycode: propertyCode }, { emitEvent: false });
        this.onSearch();
      }
    });
  }

  loadMarketCommittees(districtId: any, callback?: () => void) {
    this.isLoadingCommittees = true;
    this.registerationForm.get('branchId')?.disable({ emitEvent: false });
    this.commonService.getMarketCommittees(districtId).subscribe({
      next: (res: any) => {
        console.log('API Market Committees:', res);
        this.marketCommittees = res.data || [];
        this.isLoadingCommittees = false;
        this.registerationForm.get('branchId')?.enable({ emitEvent: false });
        if (callback) callback();
      },
      error: (err: any) => {
        console.error('Error fetching market committees:', err);
        this.isLoadingCommittees = false;
        this.registerationForm.get('branchId')?.enable({ emitEvent: false });
      }
    });
  }

  loadMandis(branchId: any, callback?: () => void) {
    this.isLoadingMandis = true;
    this.registerationForm.get('mandiId')?.disable({ emitEvent: false });
    this.commonService.GetMandisByMarketCommiteeByDistrictAsync(branchId).subscribe({
      next: (res: any) => {
        console.log('API Mandis:', res);
        this.mandis = res.data || [];
        this.isLoadingMandis = false;
        this.registerationForm.get('mandiId')?.enable({ emitEvent: false });
        if (callback) callback();
      },
      error: (err: any) => {
        console.error('Error fetching mandis:', err);
        this.isLoadingMandis = false;
        this.registerationForm.get('mandiId')?.enable({ emitEvent: false });
      }
    });
  }

  loadPropertyCategories() {
    this.commonService.getPropertyCategories().subscribe({
      next: (res: any) => {
        console.log('API Property Categories:', res);
        this.propertyCategories = res.data || res || [];
      },
      error: (err: any) => {
        console.error('Error fetching property categories:', err);
      }
    });
  }

  loadBidderTypes() {
    this.commonService.getBidderTypes().subscribe({
      next: (res: any) => {
        this.bidderTypes = res.data || res || [];
      },
      error: (err: any) => {
        console.error('Error fetching bidder types:', err);
      }
    });
  }
  loadPlans() {
    this.commonService.getPlans().subscribe({
      next: (res: any) => {
        console.log('API Plans:', res);
        this.plans = res.data || res || [];
      },
      error: (err: any) => {
        console.error('Error fetching plans:', err);
      }
    });
  }
  loadPlotTypes() {
    this.commonService.getPlotTypes().subscribe({
      next: (res: any) => {
        console.log('API Plot Types:', res);
        this.plotTypes = res.data || res || [];
      },
      error: (err: any) => {
        console.error('Error fetching plot types:', err);
      }
    });
  }
  getPropertyTypes() {
    this.commonService.getPropertyTypes().subscribe({
      next: (res: any) => {
        console.log('API prop Types:', res);
        this.auctionPropertyTypes = res.data || res || [];
      },
      error: (err: any) => {
        console.error('Error fetching property types:', err);
      }
    });
  }
  get receiptsFormArray(): FormArray {
    return this.registerationForm.get('receiptsFormArray') as FormArray;
  }

  get bidderNamesFormArray(): FormArray {
    return this.registerationForm.get('transferredNames') as FormArray;
  }

  formatDate(date: string) {
    if (!date) return '';
    const d = new Date(date);
    return `${('0' + d.getDate()).slice(-2)}/${('0' + (d.getMonth() + 1)).slice(-2)
      }/${d.getFullYear()}`;
  }

  loadDistricts() {
    this.commonService.getAllDistrict().subscribe({
      next: (res: any) => {
        console.log('API:', res);

        this.districts = res.data;
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }
  mapBidderType(id: number) {
    return id === 1 ? 'Individual' : 'Company';
  }
  onSearch() {
    const propertycodeControl = this.registerationForm.get('propertycode');
    if (!propertycodeControl || propertycodeControl.invalid) {
      propertycodeControl?.markAsTouched();
      return;
    }
    const propertyCode = propertycodeControl.value;

    this.service.getPropertyByCode(propertyCode).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          const d = res.data;
          this.propertyData = d;
          console.log('data', d);

          const patchFormValues = () => {
            this.bidderNamesFormArray.clear();
            let displayBidderName = d.bidderName;
            if (d.isTransferred && d.bidderName) {
              const names = d.bidderName.split(',').map((n: string) => n.trim());
              if (names.length > 0) {
                displayBidderName = names[0];
                names.slice(1).forEach((name: string) => {
                  this.bidderNamesFormArray.push(this.fb.control(name, Validators.required));
                });
              }
            }

            this.registerationForm.patchValue({
              districtId: d.districtId,
              mandiId: d.mandiId,
              branchId: d.branchId,
              plotNo: d.plotNo,
              plotTypeId: d.plotTypeId,
              plotsize: d.plotSize,
              planId: d.planId,
              plotStatus: d.plotStatus,
              propertyCategoryId: d.propertyCategoryId,
              propertycode: d.propertyCode,
              isAssetResumed: d.assetResumed,
              isAssetSurrendered: d.assetSurrendered,
              isAssetLocked: d.isAssetLocked,
              isDefaulter: d.isDefaulter,
              anyComplaint: d.anyComplaint,
              ndcGenerated: d.ndcGenerated,
              ndcIssued: d.ndcIssued,
              assetVerified: d.assetVerified,
              isAuctioned: d.isAuctioned,
              auctionDate: d.auctionDate ? d.auctionDate.substring(0, 16) : '',
              bidderTypeId: d.bidderTypeId,
              email: d.email,
              bidderName: displayBidderName,
              isTransferred: d.isTransferred,
              relation: d.relation,
              fatherOrHusbandName: d.fatherOrHusbandName,
              panNo: d.panNo,
              aadhaarNo: d.aadhaarNo,
              mobileNo: d.mobileNo,
              address: d.address,
              auctionPropertyType: d.propertyTypeId,
              reservePrice: d.reservePrice,
              finalBidPrice: d.finalBidPrice,

              formTransactionId: d.formTransactionId,
              formTxnDate: d.formTxnDate ? d.formTxnDate.split('T')[0] : '',
              formPaidAmount: d.formPaidAmount,

              emdTxnId: d.emdTxnId,
              emdDate: d.emdDate ? d.emdDate.split('T')[0] : '',
              emdAmount: d.emdAmount,

              allotmentTxnId: d.allotmentTxnId,
              allotmentDate: d.allotmentDate ? d.allotmentDate.split('T')[0] : '',
              allotmentAmount: d.allotmentAmount,

              dueAmount: d.dueAmount,
              accumulatedInterest: d.totalDueWithInterest - d.dueAmount,
              totalDueWithInterest: d.totalDueWithInterest
            }, { emitEvent: false });

            const receiptsFromDb = d.installments || d.Installments || d.receipts || d.receiptList || d.receiptsFormArray || d.receiptAllocations || d.propertyBidderReceipts;
            if (receiptsFromDb && Array.isArray(receiptsFromDb)) {
              this.receiptList = receiptsFromDb.map((rec: any) => {
                const receiptNo = rec.receiptNo || rec.ReceiptNo || '';
                const receiptDate = rec.receiptDate || rec.ReceiptDate || '';
                const draftNo = rec.draftNo || rec.DraftNo || '';
                const draftAmount = rec.draftAmount !== undefined ? rec.draftAmount : rec.DraftAmount;
                const draftDate = rec.draftDate || rec.DraftDate || '';
                const draftBank = rec.draftBank || rec.DraftBank || '';
                const principalAmount = rec.principalAmount !== undefined ? rec.principalAmount : rec.PrincipalAmount;
                const interestAmount = rec.interestAmount !== undefined ? rec.interestAmount : rec.InterestAmount;
                const otherAmount = rec.otherAmount !== undefined ? rec.otherAmount : rec.OtherAmount;
                const penaltyAmount = rec.penaltyAmount !== undefined ? rec.penaltyAmount : rec.PenaltyAmount;
                const penaltyType = rec.penaltyType || rec.PenaltyType || 'N/A';
                const remarks = rec.remarks || rec.Remarks || '';
                const isVerified = rec.isVerified !== undefined ? rec.isVerified : rec.IsVerified;

                return {
                  receiptNo,
                  receiptDate: receiptDate ? receiptDate.split('T')[0] : '',
                  draftNo,
                  draftAmount: draftAmount || 0,
                  draftDate: draftDate ? draftDate.split('T')[0] : '',
                  draftBank,
                  principalAmount: principalAmount || 0,
                  interestAmount: interestAmount || 0,
                  otherAmount: otherAmount || 0,
                  penaltyAmount: penaltyAmount || 0,
                  penaltyType,
                  remarks,
                  isVerified
                };
              });
              this.populateReceiptsFormArray();
            }

            this.updateAuctionValidators(d.isAuctioned);
            if (d.isAuctioned) {
              this.calculateUIInstallments();
            }
            this.updateBidderNameValidators();
            this.toastr.success('Record found and loaded successfully.', 'Success');
          };

          if (d.districtId) {
            this.loadMarketCommittees(d.districtId, () => {
              if (d.branchId) {
                this.loadMandis(d.branchId, patchFormValues);
              } else {
                patchFormValues();
              }
            });
          } else {
            patchFormValues();
          }
        } else {
          this.toastr.error('No records found', 'Error');
          this.resetForm();
          this.registerationForm.patchValue({ propertycode: propertyCode });
        }
      },
      error: (err: any) => {
        console.error('API Error:', err);
        this.toastr.error('No records found', 'Error');
        this.resetForm();
        this.registerationForm.patchValue({ propertycode: propertyCode });
      }
    });
  }

  // loadReceiptData(): void {
  //   this.receiptList = [
  //     {
  //       receiptNo: 'REC-2026-001',
  //       receiptDate: '2026-07-10',
  //       draftNo: 'DRF987654',
  //       draftAmount: 55000.00,
  //       draftDate: '2026-07-09',
  //       draftBank: 'abc',
  //       principalAmount: 50000.00,
  //       interestAmount: 4500.00,
  //       otherAmount: 500.00,
  //       penaltyAmount: 0.00,
  //       penaltyType: 'N/A',
  //       remarks: '1st Installment received.'
  //     }
  //   ];
  //   // Set interest amount dynamically to Form State before running layout calculations
  //   const receiptInterest = this.receiptList.reduce((acc, rec) => acc + (rec.interestAmount || 0), 0);
  //   this.registerationForm.get('accumulatedInterest')?.setValue(receiptInterest, { emitEvent: false });
  //   this.populateReceiptsFormArray();
  // }

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

  addBidderName(): void {
    const bidderControl = this.registerationForm.get('bidderName');
    const bidderName = (bidderControl?.value || '').trim();
    if (!bidderName) {
      return;
    }

    this.bidderNamesFormArray.push(this.fb.control(bidderName, Validators.required));
    bidderControl?.setValue('');
    this.updateBidderNameValidators();
  }

  removeBidderName(index: number): void {
    this.bidderNamesFormArray.removeAt(index);
    this.updateBidderNameValidators();
  }

  get hasActiveReceiptRowEditing(): boolean {
    return this.receiptsFormArray.controls.some((control) => control.get('isEditing')?.value);
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

    this.receiptList[index] = rowGroup.getRawValue();

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

    const totalReceiptInterest = this.receiptList.reduce((acc, rec) => acc + (Number(rec.interestAmount) || 0), 0);
    this.registerationForm.get('accumulatedInterest')?.setValue(totalReceiptInterest, { emitEvent: false });

    this.calculateUIInstallments();
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

  private readonly ddmmyyyyPattern = /^\d{2}\/\d{2}\/\d{4}$/;

  private setMode(mode: string | undefined): void {
    if (mode === 'edit') {
      this.mode = 'edit';
      this.readonlyMode = false;
      this.registerationForm.enable({ emitEvent: false });
      this.registerationForm.get('totalDueWithInterest')?.disable({ emitEvent: false });
      this.enableReceiptRows();
    } else if (mode === 'view') {
      this.mode = 'view';
      this.readonlyMode = true;
      this.registerationForm.disable({ emitEvent: false });
      this.registerationForm.get('totalDueWithInterest')?.disable({ emitEvent: false });
      this.disableReceiptRows();
    } else {
      this.mode = 'create';
      this.readonlyMode = false;
      this.registerationForm.enable({ emitEvent: false });
      this.registerationForm.get('totalDueWithInterest')?.disable({ emitEvent: false });
      this.enableReceiptRows();
    }
  }

  private disableReceiptRows(): void {
    this.receiptsFormArray.controls.forEach(row => row.disable({ emitEvent: false }));
  }

  private enableReceiptRows(): void {
    this.receiptsFormArray.controls.forEach(row => row.enable({ emitEvent: false }));
  }

  formatDisplayDate(value: string | Date | null | undefined): string {
    if (!value) {
      return '';
    }

    const date = this.parseDdMmYyyy(value);
    if (!date) {
      return '';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private parseDdMmYyyy(value: string | Date): Date | null {
    if (value instanceof Date) {
      return isNaN(value.getTime()) ? null : value;
    }

    const stringValue = String(value).trim();
    if (this.ddmmyyyyPattern.test(stringValue)) {
      const parts = stringValue.split('/').map((part) => parseInt(part, 10));
      const [day, month, year] = parts;
      const parsed = new Date(year, month - 1, day);
      if (parsed.getFullYear() === year && parsed.getMonth() === month - 1 && parsed.getDate() === day) {
        return parsed;
      }
    }

    const fallbackDate = new Date(stringValue);
    return isNaN(fallbackDate.getTime()) ? null : fallbackDate;
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
    // debugger
    if (this.registerationForm.invalid) {
      this.registerationForm.markAllAsTouched();
      const invalidControls: string[] = [];
      const controls = this.registerationForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalidControls.push(name);
        }
      }
      console.warn('Form validation failed on controls:', invalidControls);
      this.toastr.warning(`Please fill in all the required fields correctly: ${invalidControls.join(', ')}`, 'Validation Warning');
      return;
    }

    const formRaw = this.registerationForm.getRawValue();

    // Clean receipts list to avoid model binding / decimal type issues on API
    const cleanReceipts = (formRaw.receiptsFormArray || []).map((receipt: any) => {
      const cleanedReceipt: any = {};
      const receiptNumericFields = [
        'draftAmount', 'principalAmount', 'interestAmount', 'otherAmount', 'penaltyAmount'
      ];
      Object.keys(receipt).forEach((key) => {
        const val = receipt[key];
        let cleanedVal = val;
        if (val === '') {
          cleanedVal = null;
        } else if (receiptNumericFields.includes(key) && val !== null && val !== undefined) {
          cleanedVal = Number(val);
        }

        cleanedReceipt[key] = cleanedVal;
        const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
        cleanedReceipt[pascalKey] = cleanedVal;
      });

      cleanedReceipt['PrincipalAmount'] = cleanedReceipt['principalAmount'];
      cleanedReceipt['InterestAmount'] = cleanedReceipt['interestAmount'];
      cleanedReceipt['PenaltyType'] = cleanedReceipt['penaltyType'];
      cleanedReceipt['IsVerified'] = receipt.isVerified || false;
      cleanedReceipt['isVerified'] = receipt.isVerified || false;

      return cleanedReceipt;
    });

    const token = localStorage.getItem('token');
    let applicantId: number | null = null;
    if (token) {
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        if (tokenPayload.ApplicantId) {
          applicantId = Number(tokenPayload.ApplicantId);
        }
      } catch (e) {
        console.error('Error parsing token for ApplicantId:', e);
      }
    }

    const sessionRaw = localStorage.getItem('cp_session');
    let currentUserId: number | null = null;
    if (sessionRaw) {
      try {
        const session = JSON.parse(sessionRaw);
        if (session.userId) {
          currentUserId = Number(session.userId);
        }
      } catch (e) {
        console.error('Error parsing cp_session:', e);
      }
    }

    if (!applicantId && this.propertyData) {
      applicantId = this.propertyData.applicantId || this.propertyData.ApplicantId;
    }

    let finalBidderName = (formRaw.bidderName || '').trim();
    if (formRaw.isTransferred) {
      const allNames: string[] = [];

      // 1. Get original name from propertyData (if any)
      if (this.propertyData && this.propertyData.bidderName) {
        const originalNames = this.propertyData.bidderName.split(',').map((n: string) => n.trim());
        if (originalNames.length > 0) {
          allNames.push(originalNames[0]);
        }
      }

      // 2. Get names from the grid
      const gridNames = this.bidderNamesFormArray.controls
        .map(c => (c.value || '').trim())
        .filter(v => v !== '');
      allNames.push(...gridNames);

      // 3. Get whatever is currently in the input field (if it's not already in the list)
      if (finalBidderName && !allNames.includes(finalBidderName)) {
        allNames.push(finalBidderName);
      }

      // Remove duplicate names and join with comma
      finalBidderName = allNames
        .map(n => n.trim())
        .filter((value, index, self) => value !== '' && self.indexOf(value) === index)
        .join(', ');
    }

    const payload = {
      ...(this.propertyData || {}),

      districtId: formRaw.districtId,
      mandiId: formRaw.mandiId,
      branchId: formRaw.branchId,
      propertyCode: formRaw.propertycode,

      applicantId: applicantId,
      ApplicantId: applicantId,

      plotNo: formRaw.plotNo,
      plotTypeId: formRaw.plotTypeId,
      plotSize: formRaw.plotsize,
      planId: formRaw.planId,
      plotStatus: formRaw.plotStatus,
      propertyCategoryId: formRaw.propertyCategoryId,

      isAssetResumed: formRaw.isAssetResumed,
      IsAssetResumed: formRaw.isAssetResumed,
      assetResumed: formRaw.isAssetResumed,

      isAssetSurrendered: formRaw.isAssetSurrendered,
      IsAssetSurrendered: formRaw.isAssetSurrendered,
      assetSurrendered: formRaw.isAssetSurrendered,

      isAssetLocked: formRaw.isAssetLocked,
      IsAssetLocked: formRaw.isAssetLocked,

      isDefaulter: formRaw.isDefaulter,
      IsDefaulter: formRaw.isDefaulter,

      anyComplaint: formRaw.anyComplaint,
      AnyComplaint: formRaw.anyComplaint,

      ndcGenerated: formRaw.ndcGenerated,
      NdcGenerated: formRaw.ndcGenerated,

      ndcIssued: formRaw.ndcIssued,
      NdcIssued: formRaw.ndcIssued,

      assetVerified: formRaw.assetVerified,
      AssetVerified: formRaw.assetVerified,

      isAuctioned: formRaw.isAuctioned,
      auctionDate: formRaw.auctionDate,
      bidderTypeId: formRaw.bidderTypeId,
      email: formRaw.email,
      bidderName: finalBidderName,
      BidderName: finalBidderName,
      isTransferred: formRaw.isTransferred,

      relation: formRaw.relation,
      fatherOrHusbandName: formRaw.fatherOrHusbandName,
      panNo: formRaw.panNo,
      PANNo: formRaw.panNo,
      aadhaarNo: formRaw.aadhaarNo,
      AadhaarNo: formRaw.aadhaarNo,
      mobileNo: formRaw.mobileNo,
      MobileNo: formRaw.mobileNo,
      address: formRaw.address,

      propertyTypeId: formRaw.auctionPropertyType,
      reservePrice: formRaw.reservePrice,
      finalBidPrice: formRaw.finalBidPrice,

      formTransactionId: formRaw.formTransactionId,
      formTxnDate: formRaw.formTxnDate,
      formPaidAmount: formRaw.formPaidAmount,

      emdTxnId: formRaw.emdTxnId,
      emdDate: formRaw.emdDate,
      emdAmount: formRaw.emdAmount,

      allotmentTxnId: formRaw.allotmentTxnId,
      allotmentDate: formRaw.allotmentDate,
      allotmentAmount: formRaw.allotmentAmount,

      dueAmount: formRaw.dueAmount,
      totalDueWithInterest: formRaw.totalDueWithInterest,

      createdBy: this.propertyData?.createdBy || this.propertyData?.CreatedBy || currentUserId,
      CreatedBy: this.propertyData?.createdBy || this.propertyData?.CreatedBy || currentUserId,
      modifiedBy: currentUserId,
      ModifiedBy: currentUserId,

      // Map both camelCase and PascalCase list property names
      installments: cleanReceipts,
      Installments: cleanReceipts
    };

    const numericFields = [
      'districtId', 'mandiId', 'branchId', 'propertyCategoryId', 'bidderTypeId', 'plotTypeId', 'planId', 'propertyTypeId',
      'reservePrice', 'finalBidPrice', 'formPaidAmount', 'emdAmount', 'allotmentAmount',
      'dueAmount', 'totalDueWithInterest', 'accumulatedInterest', 'applicantId', 'ApplicantId',
      'createdBy', 'CreatedBy', 'modifiedBy', 'ModifiedBy'
    ];
    const cleanedPayload: any = {};
    Object.keys(payload).forEach((key) => {
      const val = (payload as any)[key];
      if (val === '') {
        cleanedPayload[key] = null;
      } else if (numericFields.includes(key) && val !== null && val !== undefined) {
        cleanedPayload[key] = Number(val);
      } else {
        cleanedPayload[key] = val;
      }
    });

    console.log('Submission Payload:', cleanedPayload);

    const hasId = this.propertyData && (this.propertyData.id || this.propertyData.propertyId);
    const saveObservable = hasId
      ? this.service.UpdateRegisterPropertyAsync(cleanedPayload)
      : this.service.registerProperty(cleanedPayload);

    saveObservable.subscribe({
      next: (res: any) => {
        if (res.success || res.status === 'Success' || res.data) {
          this.toastr.success(res.message || 'Property bidder registration saved successfully.', 'Success');
        } else {
          this.toastr.error(res.message || 'Failed to save property registration.', 'Error');
        }
      },
      error: (err: any) => {
        console.error('Submit error:', err);
        this.toastr.error(err.error?.message || 'Error occurred while saving.', 'Error');
      }
    });
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
      isAuctioned: false,
      transfered: false,
      bidderType: 'Individual',
      relation: 'Son of (S/o)',
      auctionPropertyType: 'Commercial Plots',
      installmentNo: 'Installment 1',
      paidStatus: 'Pending',
    });
    this.receiptsFormArray.clear();
    this.bidderNamesFormArray.clear();
    this.calculatedSchedulesMatrix = [];
    this.propertyData = null;
  }

  private updateAuctionValidators(isAuctioned: boolean): void {
    this.auctionRequiredControls.forEach((controlName) => {
      if (controlName === 'bidderName') return;

      const control = this.registerationForm.get(controlName);
      if (!control) return;

      if (isAuctioned) {
        controlName === 'email'
          ? control.setValidators([Validators.required, Validators.email])
          : control.setValidators(Validators.required);
      } else {
        control.clearValidators();
      }
      control.updateValueAndValidity({ emitEvent: false });
    });

    this.updateBidderNameValidators();
  }

  private updateBidderNameValidators(): void {
    const bidderControl = this.registerationForm.get('bidderName');
    if (!bidderControl) return;

    const isAuctioned = this.registerationForm.get('isAuctioned')?.value;
    const isTransferred = this.registerationForm.get('isTransferred')?.value;
    const hasAddedNames = this.bidderNamesFormArray.length > 0;

    // bidderName input field is required if isAuctioned is true and (either transfer is off OR grid is empty)
    if (isAuctioned && (!isTransferred || !hasAddedNames)) {
      bidderControl.setValidators(Validators.required);
    } else {
      bidderControl.clearValidators();
    }
    bidderControl.updateValueAndValidity({ emitEvent: false });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupCalculationListeners(): void {
    // debugger
    this.registerationForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.calculateUIInstallments();
      });
  }
    // CORE CALCULATION ALGORITHM
  private calculateUIInstallments(): void {
    if (!this.registerationForm.get('isAuctioned')?.value) {
      return;
    }
    // debugger
    // 1. Fetch form variables safely
    const finalBidderPrice = Number(this.registerationForm.get('finalBidPrice')?.value) || 0;
    const allotmentPaid_25_percentage = Number(this.registerationForm.get('allotmentAmount')?.value) || 0;
    const milestoneDateStr = this.registerationForm.get('allotmentDate')?.value;
    const selectedInstallmentString = this.registerationForm.get('installmentNo')?.value || 'Installment 1';

    // 2. Calculate TOTAL Outstanding Principal Balance
    const outstandingPrincipal = finalBidderPrice - allotmentPaid_25_percentage;

    // Compute the base installment principal (1/6th of total outstanding principal)
    let computedDueAmount = 0;
    if (outstandingPrincipal > 0) {
      computedDueAmount = outstandingPrincipal / 6;
      computedDueAmount = Math.round((computedDueAmount + Number.EPSILON) * 100) / 100;
    }

    // 3. Validate milestone date presence BEFORE computing any interest
    this.installmentDateError = null;
    let baseYear = 0, baseMonth = 0, baseDay = 0;
    let dateIsValid = false;

    if (milestoneDateStr) {
      const parts = milestoneDateStr.split('-');
      if (parts.length === 3) {
        baseYear = parseInt(parts[0], 10);
        baseMonth = parseInt(parts[1], 10) - 1;
        baseDay = parseInt(parts[2], 10);
        dateIsValid = !isNaN(baseYear) && !isNaN(baseMonth) && !isNaN(baseDay);
      }
    }

    if (!dateIsValid) {
      this.installmentDateError = 'Please select the 25% Allotment Transaction Date to calculate installment interest.';
    }

    // 4. Determine interest rate based on the allotment transaction year
    //    < 1992 -> 6%, >= 1992 -> 12%
    const rateOfInterest = dateIsValid ? (baseYear < 1992 ? 6 : 12) : 0;

    // 5. Generate the 6-part amortization amortization matrix table
    const generatedMatrix: InstallmentScheduleView[] = [];
    let totalInterestAcrossInstallments = 0;

    for (let step = 1; step <= 6; step++) {
      let calculatedDateStr = '';

      if (dateIsValid) {
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

      const currentLabel = `Installment ${step}`;

      // Declining-balance interest calculation
      // remainingPrincipal(i) = outstandingPrincipal - (computedDueAmount * (i - 1))
      let computedInterestForStep = 0;
      if (dateIsValid && outstandingPrincipal > 0 && computedDueAmount > 0) {
        const remainingPrincipal = outstandingPrincipal - (computedDueAmount * (step - 1));
        const basisForInterest = remainingPrincipal > 0 ? remainingPrincipal : 0;

        computedInterestForStep = (basisForInterest * rateOfInterest * 182.5) / (365 * 100);
        computedInterestForStep = Math.round((computedInterestForStep + Number.EPSILON) * 100) / 100;
      }

      totalInterestAcrossInstallments += computedInterestForStep;

      const stepTotalWithInterest = computedDueAmount > 0 ? (computedDueAmount + computedInterestForStep) : 0;

      generatedMatrix.push({
        index: step,
        installmentLabel: currentLabel,
        dueDate: calculatedDateStr,
        baseAmountDue: computedDueAmount,
        interestAmount: computedInterestForStep,          // NEW: expose per-row interest to template
        totalWithInterest: Math.round((stepTotalWithInterest + Number.EPSILON) * 100) / 100
      });
    }

    this.calculatedSchedulesMatrix = generatedMatrix;
    totalInterestAcrossInstallments = Math.round((totalInterestAcrossInstallments + Number.EPSILON) * 100) / 100;

    // 6. Calculate total overall due (Full Principal + Sum of computed interest)
    const finalTotalDueIncludingInterest = outstandingPrincipal > 0
      ? (outstandingPrincipal + totalInterestAcrossInstallments)
      : 0;

    const activeNode = generatedMatrix.find(item => item.installmentLabel === selectedInstallmentString);
    const activeDueDate = activeNode ? activeNode.dueDate : '';

    // 7. Patch corrected, high-level overview values to UI inputs
    this.registerationForm.patchValue({
      dueAmount: outstandingPrincipal > 0 ? outstandingPrincipal : '',
      dueDate: activeDueDate,
      totalDueWithInterest: finalTotalDueIncludingInterest > 0 ? finalTotalDueIncludingInterest : ''
    }, { emitEvent: false });
  }
}