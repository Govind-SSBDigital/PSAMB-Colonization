import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
 
import { PropertyBidderRegistrationModel } from './../../models/property-bidder-registration.model';
 
export type ClerkDecision = 'APPROVED' | 'REJECTED';
 
/** Local-only, UI-side concern — not part of the backend model. */
export interface ClerkHistoryEntry {
  id: string;
  action: 'Submitted' | 'Edited & Resubmitted' | 'Approved' | 'Rejected';
  actionBy: string;
  actionRole: 'Data Entry Operator' | 'Clerk';
  actionDate: string;
  remarks: string;
  status: 'PENDING' | 'EDITED' | 'APPROVED' | 'REJECTED';
}
 
const PLOT_TYPE_OPTIONS = ['Commercial', 'Residential', 'Industrial', 'Institutional'];
const PLOT_STATUS_OPTIONS = ['Vacant', 'Allotted', 'Auctioned', 'Under Litigation'];
const PROPERTY_CATEGORY_OPTIONS = ['General', 'Reserved', 'Corner Plot', 'Prime Location'];
const BIDDER_TYPE_OPTIONS = ['Individual', 'Company', 'Partnership Firm', 'Trust'];
const RELATION_OPTIONS = ['Son of (S/o)', 'Daughter of (D/o)', 'Wife of (W/o)'];
const AUCTION_PROPERTY_TYPE_OPTIONS = ['Commercial Plots', 'Residential Plots', 'Booth', 'SCO'];
const PAID_STATUS_OPTIONS = ['Paid', 'Unpaid', 'Partially Paid', 'Overdue'];
@Component({
  selector: 'app-deo-verification',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './deo-verification.html',
  styleUrl: './deo-verification.scss',
})
export class DeoVerification implements OnInit, OnChanges {
  private fb = inject(FormBuilder);
 
  /** Pass the record fetched from your own service. If omitted, demo data is used. */
  @Input() registration: PropertyBidderRegistrationModel | null = null;
 
  /** Pass prior audit trail entries from your own service, if you have them. */
  @Input() historyEntries: ClerkHistoryEntry[] = [];
 
  /** True while a parent-owned save/decision call is in flight — disables buttons + shows spinners. */
  @Input() isBusy = false;
 
  @Output() saved = new EventEmitter<PropertyBidderRegistrationModel>();
  @Output() approved = new EventEmitter<{ remarks: string; data: PropertyBidderRegistrationModel }>();
  @Output() rejected = new EventEmitter<{ remarks: string; data: PropertyBidderRegistrationModel }>();
 
  // ---- static option lists for the template ----
  readonly plotTypeOptions = PLOT_TYPE_OPTIONS;
  readonly plotStatusOptions = PLOT_STATUS_OPTIONS;
  readonly propertyCategoryOptions = PROPERTY_CATEGORY_OPTIONS;
  readonly bidderTypeOptions = BIDDER_TYPE_OPTIONS;
  readonly relationOptions = RELATION_OPTIONS;
  readonly auctionPropertyTypeOptions = AUCTION_PROPERTY_TYPE_OPTIONS;
  readonly paidStatusOptions = PAID_STATUS_OPTIONS;
 
  readonly assetStatusFlags: { key: keyof PropertyBidderRegistrationModel; label: string }[] = [
    { key: 'isAssetResumed', label: 'Asset Resumed' },
    { key: 'IsAssetSurrendered', label: 'Asset Surrendered' },
    { key: 'IsLocked', label: 'Is Asset Locked' },
    { key: 'IsDefaulter', label: 'Is Defaulter' },
    { key: 'IsAnyComplaint', label: 'Any Complaint' },
    { key: 'IsNDCGenerated', label: 'NDC Generated' },
    { key: 'IsNDCIssued', label: 'NDC Issued' },
    { key: 'IsAssetVerified', label: 'Asset Verified' },
    { key: 'IsCourtCase', label: 'Court Case' },
  ];
 
  // ---- state ----
  isEditMode = signal(false);
  showHistoryPanel = signal(false);
  showDecisionModal = signal(false);
  pendingDecision = signal<ClerkDecision | null>(null);
  localHistory = signal<ClerkHistoryEntry[]>([]);
 
  form!: FormGroup;
  remarksControl = this.fb.nonNullable.control('', [
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(500),
  ]);
 
  ngOnInit(): void {
    this.buildForm();
    this.localHistory.set(this.historyEntries?.length ? this.historyEntries : []);
    this.patchForm(this.registration ?? this.getDemoData());
    this.form.disable({ emitEvent: false });
  }
 
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['registration'] && !changes['registration'].firstChange && this.form) {
      this.patchForm(this.registration ?? this.getDemoData());
      this.isEditMode.set(false);
      this.form.disable({ emitEvent: false });
    }
    if (changes['historyEntries'] && this.historyEntries) {
      this.localHistory.set(this.historyEntries);
    }
  }
 
  // Form construction — control names match PropertyBidderRegistrationModel exactly
  private buildForm(): void {
    this.form = this.fb.group({
      // Property Information
      propertycode: this.fb.nonNullable.control({ value: '', disabled: true }),
      district: this.fb.nonNullable.control('', Validators.required),
      branch: this.fb.nonNullable.control('', Validators.required),
      mandi: this.fb.nonNullable.control('', Validators.required),
      plotsize: this.fb.nonNullable.control('', Validators.required),
      plottype: this.fb.nonNullable.control('', Validators.required),
      plotno: this.fb.nonNullable.control('', Validators.required),
      plan: this.fb.nonNullable.control('', Validators.required),
      plotstatus: this.fb.nonNullable.control('', Validators.required),
      propertycategory: this.fb.nonNullable.control('', Validators.required),
 
      // Asset Status
      isAssetResumed: this.fb.nonNullable.control(false),
      IsAssetSurrendered: this.fb.nonNullable.control(false),
      IsLocked: this.fb.nonNullable.control(false),
      IsDefaulter: this.fb.nonNullable.control(false),
      IsAnyComplaint: this.fb.nonNullable.control(false),
      IsNDCGenerated: this.fb.nonNullable.control(false),
      IsNDCIssued: this.fb.nonNullable.control(false),
      IsAssetVerified: this.fb.nonNullable.control(false),
 
      // Auction Information
      Isauctioned: this.fb.nonNullable.control(false),
      auctionDateTime: this.fb.nonNullable.control(''),
      bidderType: this.fb.nonNullable.control('Individual'),
      emailId: this.fb.nonNullable.control('', [Validators.email]),
      h1BidderName: this.fb.nonNullable.control(''),
      transfered: this.fb.nonNullable.control(false),
      relation: this.fb.nonNullable.control(''),
      guardianName: this.fb.nonNullable.control(''),
      panNo: this.fb.nonNullable.control('', [Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)]),
      aadharNo: this.fb.nonNullable.control('', [Validators.pattern(/^\d{12}$/)]),
      mobileNo: this.fb.nonNullable.control('', [Validators.pattern(/^[6-9]\d{9}$/)]),
      auctionPropertyType: this.fb.nonNullable.control(''),
      communicationAddress: this.fb.nonNullable.control(''),
 
      // Financial Details
      reservePrice: this.fb.nonNullable.control(0, [Validators.required, Validators.min(0)]),
      h1BidderFinalPrice: this.fb.nonNullable.control(0, [Validators.required, Validators.min(0)]),
 
      // Form Fee
      formFeeTransactionId: this.fb.nonNullable.control(''),
      formFeeTransactionDate: this.fb.nonNullable.control(''),
      formFeePaidAmount: this.fb.nonNullable.control(0, [Validators.min(0)]),
 
      // EMD Details
      emdTransactionId: this.fb.nonNullable.control('', Validators.required),
      emdTransactionDate: this.fb.nonNullable.control('', Validators.required),
      emdPaidAmount: this.fb.nonNullable.control(0, [Validators.required, Validators.min(1)]),
 
      // 25% Allotment Details
      allotmentTransactionId: this.fb.nonNullable.control('', Validators.required),
      allotmentTransactionDate: this.fb.nonNullable.control('', Validators.required),
      allotmentPaidAmount: this.fb.nonNullable.control(0, [Validators.required, Validators.min(1)]),
 
      // Outstanding Dues
      installmentNo: this.fb.nonNullable.control(''),
      dueDate: this.fb.nonNullable.control(''),
      paidStatus: this.fb.nonNullable.control(''),
      dueAmount: this.fb.nonNullable.control(0, [Validators.min(0)]),
      accumulatedInterest: this.fb.nonNullable.control(0, [Validators.min(0)]),
      totalDueAmount: this.fb.nonNullable.control(0, [Validators.min(0)]),
    });
 
    this.form.get('Isauctioned')!.valueChanges.subscribe((auctioned) => this.setAuctionValidators(!!auctioned));
  }
 
  private setAuctionValidators(auctioned: boolean): void {
    const requiredWhenAuctioned = ['auctionDateTime', 'h1BidderName', 'guardianName', 'communicationAddress'];
    requiredWhenAuctioned.forEach((name) => {
      const control = this.form.get(name)!;
      auctioned ? control.addValidators(Validators.required) : control.removeValidators(Validators.required);
      control.updateValueAndValidity({ emitEvent: false });
    });
  }
 
  private patchForm(data: PropertyBidderRegistrationModel): void {
    this.form.patchValue(data);
    this.setAuctionValidators(data.Isauctioned);
  }
 
  // Edit mode
  toggleEditMode(): void {
    const next = !this.isEditMode();
    this.isEditMode.set(next);
    next ? this.form.enable({ emitEvent: false }) : this.form.disable({ emitEvent: false });
    this.form.get('propertycode')!.disable({ emitEvent: false }); // always read-only
  }
 
  cancelEdit(): void {
    this.isEditMode.set(false);
    this.patchForm(this.registration ?? this.getDemoData());
    this.form.disable({ emitEvent: false });
  }
 
  saveEdits(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue() as PropertyBidderRegistrationModel;
    this.saved.emit(value);
    this.localHistory.update((h) => [
      ...h,
      {
        id: crypto.randomUUID(),
        action: 'Edited & Resubmitted',
        actionBy: 'Clerk User',
        actionRole: 'Clerk',
        actionDate: new Date().toISOString(),
        remarks: 'Fields corrected by clerk prior to decision.',
        status: 'EDITED',
      },
    ]);
    this.isEditMode.set(false);
    this.form.disable({ emitEvent: false });
  }
 
  // Approve / Reject
  openDecisionModal(decision: ClerkDecision): void {
    this.pendingDecision.set(decision);
    this.remarksControl.reset('');
    this.showDecisionModal.set(true);
  }
 
  closeDecisionModal(): void {
    this.showDecisionModal.set(false);
    this.pendingDecision.set(null);
  }
 
  confirmDecision(): void {
    if (this.remarksControl.invalid) {
      this.remarksControl.markAsTouched();
      return;
    }
    const decision = this.pendingDecision();
    if (!decision) return;
 
    const value = this.form.getRawValue() as PropertyBidderRegistrationModel;
    const remarks = this.remarksControl.value;
 
    if (decision === 'APPROVED') {
      this.approved.emit({ remarks, data: value });
    } else {
      this.rejected.emit({ remarks, data: value });
    }
 
    this.localHistory.update((h) => [
      ...h,
      {
        id: crypto.randomUUID(),
        action: decision === 'APPROVED' ? 'Approved' : 'Rejected',
        actionBy: 'Clerk User',
        actionRole: 'Clerk',
        actionDate: new Date().toISOString(),
        remarks,
        status: decision,
      },
    ]);
 
    this.showDecisionModal.set(false);
    this.pendingDecision.set(null);
  }
 
  toggleHistoryPanel(): void {
    this.showHistoryPanel.update((v) => !v);
  }
 
  // Template helpers
  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }
 
  errorFor(controlName: string): ValidationErrors | null {
    return this.form.get(controlName)?.errors ?? null;
  }
 
  currentStatus(): 'PENDING' | 'EDITED' | 'APPROVED' | 'REJECTED' {
    const h = this.localHistory();
    return h.length ? h[h.length - 1].status : 'PENDING';
  }
 
  statusBadgeClass(status: string = this.currentStatus()): string {
    switch (status) {
      case 'APPROVED':
        return 'badge text-bg-success';
      case 'REJECTED':
        return 'badge text-bg-danger';
      case 'EDITED':
        return 'badge text-bg-info';
      default:
        return 'badge text-bg-warning';
    }
  }
 
  /** Local placeholder data so this component is viewable before you wire a real @Input(). */
  private getDemoData(): PropertyBidderRegistrationModel {
    return {
      propertycode: 'PROP-2026-00457',
      district: 'Ludhiana',
      branch: 'Ludhiana Market Committee',
      mandi: 'New Grain Market',
      plotsize: '200 Sq. Yards',
      plottype: 'Commercial',
      plotno: 'B-12',
      plan: 'Standard Allocation',
      plotstatus: 'Auctioned',
      propertycategory: 'Prime Location',
 
      isAssetResumed: false,
      IsAssetSurrendered: false,
      IsLocked: false,
      IsDefaulter: false,
      IsAnyComplaint: false,
      IsNDCGenerated: false,
      IsNDCIssued: false,
      IsAssetVerified: false,
      IsCourtCase: false,
 
      Isauctioned: true,
      auctionDateTime: '2026-07-09T11:00',
      bidderType: 'Individual',
      emailId: 'bidder@domain.com',
      h1BidderName: 'Rajinder Kumar',
      transfered: false,
      relation: 'Son of (S/o)',
      guardianName: 'Gurdev Singh',
      panNo: 'ABCDE1234F',
      aadharNo: '123456781234',
      mobileNo: '9876543210',
      auctionPropertyType: 'Commercial Plots',
      communicationAddress: 'House No. 45, Model Town, Ludhiana, Punjab - 141002',
 
      reservePrice: 4500000,
      h1BidderFinalPrice: 5500000,
 
      formFeeTransactionId: 'TXN998877',
      formFeeTransactionDate: '2026-06-01',
      formFeePaidAmount: 500,
 
      emdTransactionId: 'EMD556677',
      emdTransactionDate: '2026-06-15',
      emdPaidAmount: 450000,
 
      allotmentTransactionId: 'MS112233',
      allotmentTransactionDate: '2026-07-08',
      allotmentPaidAmount: 1375000,
 
      installmentNo: '1',
      dueDate: '2026-08-08',
      paidStatus: 'Paid',
      dueAmount: 50000,
      accumulatedInterest: 4500,
      totalDueAmount: 54500,
    };
  }
}