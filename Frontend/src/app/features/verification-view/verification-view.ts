import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';

export interface UploadedDocument {
  key: string;
  label: string;
  hint?: string;
  fileName: string | null;
  fileUrl: string | null;
  uploaded: boolean;
}

export interface DataField {
  label: string;
  value: string;
  maskedValue?: string;
  isMasked?: boolean;
  isSecret?: boolean;
  copyable?: boolean;
  isEmail?: boolean;
  isPhone?: boolean;
  fullWidth?: boolean;
}

type VerificationStatus = 'pending' | 'verified' | 'objection';
type DecisionType = 'approve' | 'sendback' | null;

@Component({
  selector: 'app-verification-view',
  standalone: false,
  templateUrl: './verification-view.html',
  styleUrl: './verification-view.scss',
  providers: [ConfirmationService],
})
export class VerificationView implements OnInit {
  // ---- Header info (empty by default, to be set when new API is integrated) ----
  propertyCode = '—';
  submittedOn = '—';
  verificationStatus: VerificationStatus = 'pending';

  // ---- Property Details (Clean placeholders without fake data) ----
  propertyDetails: DataField[] = [
    { label: 'District', value: '—' },
    { label: 'Market Committee', value: '—' },
    { label: 'Mandi', value: '—' },
    { label: 'Plot Type', value: '—' },
    { label: 'Plot Number', value: '—', copyable: false },
    { label: 'Plot Size', value: '—' },
  ];

  // ---- Owner Information (Clean placeholders without fake data) ----
  ownerDetails: DataField[] = [
    { label: 'Current Owner Name', value: '—' },
    { label: "Father's / Husband Name", value: '—' },
    { label: 'Mobile Number', value: '—', copyable: false, isPhone: false },
    { label: 'Email', value: '—', copyable: false, isEmail: false },
    { label: 'State', value: '—' },
    { label: 'District', value: '—' },
    { label: 'City', value: '—' },
    { label: 'Address', value: '—', fullWidth: true },
    {
      label: 'Aadhaar Number',
      value: '—',
      maskedValue: '—',
      isMasked: true,
      isSecret: false,
      copyable: false,
    },
    {
      label: 'PAN No.',
      value: '—',
      maskedValue: '—',
      isMasked: true,
      isSecret: false,
      copyable: false,
    },
  ];

  // ---- Uploaded Documents list (All set to not uploaded, ready for real API) ----
  documents: UploadedDocument[] = [
    { key: 'allotmentLetter', label: 'Allotment Letter', fileName: null, fileUrl: null, uploaded: false },
    { key: 'lastPaymentReceipt', label: 'Last Payment Receipt', hint: 'Any one from last three receipts', fileName: null, fileUrl: null, uploaded: false },
    { key: 'noDueCertificate', label: 'No Due Certificate', fileName: null, fileUrl: null, uploaded: false },
    { key: 'bForm', label: 'B.Form', fileName: null, fileUrl: null, uploaded: false },
    { key: 'conveyanceDeed', label: 'Conveyance Deed', fileName: null, fileUrl: null, uploaded: false },
    { key: 'saleDeed', label: 'Sale Deed', fileName: null, fileUrl: null, uploaded: false },
    { key: 'transferOrder', label: 'Transfer Order', fileName: null, fileUrl: null, uploaded: false },
    { key: 'legalHeirCertificate', label: 'Legal Heir Certificate', fileName: null, fileUrl: null, uploaded: false },
    { key: 'aadhaarProof', label: 'Aadhaar Card Proof', fileName: null, fileUrl: null, uploaded: false },
    { key: 'passportProof', label: 'Passport Proof', fileName: null, fileUrl: null, uploaded: false },
  ];

  decisionForm!: FormGroup;
  submitting = false;
  activeDecision: DecisionType = null;
  showValidationHint = false;
  remarksReadOnly = '';
  previewDoc: UploadedDocument | null = null;
  copiedField: string | null = null;

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.decisionForm = this.fb.group({
      decision: [null, Validators.required],
      remarks: [''],
    });
  }

  get remarksControl() {
    return this.decisionForm.get('remarks')!;
  }

  get decisionControl() {
    return this.decisionForm.get('decision')!;
  }

  get showActionButtons(): boolean {
    return this.verificationStatus === 'pending';
  }

  get showRemarksReadOnly(): boolean {
    return this.verificationStatus === 'objection';
  }

  get isAlreadyVerified(): boolean {
    return this.verificationStatus === 'verified';
  }

  get verificationStatusClass(): string {
    switch (this.verificationStatus) {
      case 'verified':
        return 'bg-white text-success fw-semibold shadow-sm';
      case 'objection':
        return 'bg-white text-danger fw-semibold shadow-sm';
      default:
        return 'bg-white text-warning-emphasis fw-semibold shadow-sm';
    }
  }

  toggleFieldMask(field: DataField): void {
    field.isMasked = !field.isMasked;
  }

  copyValue(value: string, label: string): void {
    if (value && value !== '—' && navigator?.clipboard) {
      navigator.clipboard.writeText(value);
      this.copiedField = label;
      setTimeout(() => {
        if (this.copiedField === label) {
          this.copiedField = null;
        }
      }, 2000);
    }
  }

  viewDocument(doc: UploadedDocument): void {
    if (!doc.uploaded || !doc.fileUrl) return;
    this.previewDoc = doc;
  }

  closePreview(): void {
    this.previewDoc = null;
  }

  isPdf(doc: UploadedDocument | null): boolean {
    return !!doc?.fileUrl && doc.fileUrl.toLowerCase().endsWith('.pdf');
  }

  onDecisionChange(decision: 'approve' | 'sendback'): void {
    this.activeDecision = decision;
    this.decisionControl.setValue(decision);

    if (decision === 'sendback') {
      this.remarksControl.setValidators([Validators.required, Validators.minLength(10)]);
    } else {
      this.remarksControl.clearValidators();
    }
    this.remarksControl.updateValueAndValidity();
    this.showValidationHint = false;
  }

  handleApprove(): void {
    this.onDecisionChange('approve');

    this.confirmationService.confirm({
      header: 'Confirm Approval',
      message:
        'Are you sure you want to approve this property ownership verification? This action cannot be undone.',
      icon: 'fa-solid fa-circle-question text-success fs-4 me-2',
      acceptLabel: 'Yes, Approve',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'btn btn-success px-3',
      rejectButtonStyleClass: 'btn btn-outline-secondary px-3',
      accept: () => {
        // Ready for your new approval API call here
        console.log('Approve confirmed');
      },
    });
  }

  handleSendBack(): void {
    this.onDecisionChange('sendback');
    if (this.remarksControl.invalid) {
      this.showValidationHint = true;
      return;
    }
    // Ready for your new send-back API call here
    console.log('Send back submitted with remarks:', this.remarksControl.value);
  }
}
