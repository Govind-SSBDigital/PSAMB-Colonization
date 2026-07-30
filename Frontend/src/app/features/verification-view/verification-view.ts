import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators
} from '@angular/forms';


export interface VerificationHistoryEntry {
  role: string;
  actorName: string;
  action: 'Approved' | 'Sent Back' | 'Submitted';
  remarks: string;
  date: string;
}
 
export interface DocumentItem {
  key: string;
  label: string;
  hint?: string;
  submitted: boolean;
  fileName: string | null;
  fileUrl: string | null;
}

@Component({
  selector: 'app-verification-view',
  standalone: false,
  templateUrl: './verification-view.html',
  styleUrl: './verification-view.scss',
})
export class VerificationView implements OnInit {
 
  /** Master edit toggle - flips every field between read-only and editable */
  editMode = false;
 
  /** Which decision is currently active in the action panel */
  activeDecision: 'approve' | 'sendback' | null = null;
 
  submitting = false;
  showValidationHint = false;
 
  allotteeCode = 'AAA1-1';
  applicationId = 'PR-2026-004821';
  submittedOn = '24 Jul 2026';
  currentStage = 'Superintendent Review';
 
  verificationForm!: FormGroup;
 
  documents: DocumentItem[] = [
    { key: 'allotmentLetter', label: 'Allotment Letter', submitted: true, fileName: 'allotment_letter.pdf', fileUrl: '#' },
    { key: 'lastPaymentReceipt', label: 'Last Payment Receipt', hint: 'Any one from last three receipts', submitted: true, fileName: 'payment_receipt_mar26.pdf', fileUrl: '#' },
    { key: 'noDueCertificate', label: 'No Due Certificate', submitted: false, fileName: null, fileUrl: null },
    { key: 'bForm', label: 'B.Form', submitted: true, fileName: 'b_form.pdf', fileUrl: '#' },
    { key: 'conveyanceDeed', label: 'Conveyance Deed', submitted: false, fileName: null, fileUrl: null },
    { key: 'saleDeed', label: 'Sale Deed', submitted: true, fileName: 'sale_deed.pdf', fileUrl: '#' },
    { key: 'transferOrder', label: 'Transfer Order', submitted: false, fileName: null, fileUrl: null },
    { key: 'legalHeirCertificate', label: 'Legal Heir Certificate', submitted: false, fileName: null, fileUrl: null }
  ];
 
  history: VerificationHistoryEntry[] = [
    { role: 'Clerk', actorName: 'Test', action: 'Submitted', remarks: 'Forwarded after initial document check.', date: '25 Jul 2026, 11:42 AM' }
  ];
 
  districts = ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'];
  states = ['Punjab', 'Haryana', 'Delhi', 'Chandigarh'];
  committees = ['Ludhiana Market Committee', 'Khanna Market Committee', 'Jagraon Market Committee'];
  mandis = ['New Grain Market', 'Sabzi Mandi', 'Anaj Mandi'];
  plotTypes = ['Commercial', 'Residential', 'Industrial', 'Booth'];
 
  constructor(private fb: FormBuilder) {}
 
  ngOnInit(): void {
    this.buildForm();
  }
 
  private buildForm(): void {
    this.verificationForm = this.fb.group({
      propertyDetails: this.fb.group({
        district: ['Ludhiana', Validators.required],
        marketCommittee: ['Ludhiana Market Committee', Validators.required],
        mandi: ['New Grain Market', Validators.required],
        plotNumber: ['PLT-0231', Validators.required],
        plotType: ['Commercial', Validators.required],
        plotSize: ['1800', Validators.required]
      }),
      ownerInfo: this.fb.group({
        currentOwnerName: ['Test Name', Validators.required],
        fatherHusbandName: ['Test Name2', Validators.required],
        mobileNumber: ['9876543210', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        email: ['test@example.com', [Validators.required, Validators.email]],
        state: ['Punjab', Validators.required],
        district: ['Ludhiana', Validators.required],
        city: ['Ludhiana', Validators.required],
        address: ['House No. 22, Model Town, Ludhiana', Validators.required],
        aadhaarNumber: ['XXXXXXXX4231', Validators.required],
        passportNumber: ['']
      }),
      decision: this.fb.group({
        remarks: ['']
      })
    });
 
    // Read-only until Edit All Fields is switched on
    this.setFormDisabled(true);
  }
 
  private setFormDisabled(disabled: boolean): void {
    const propertyGroup = this.verificationForm.get('propertyDetails');
    const ownerGroup = this.verificationForm.get('ownerInfo');
    if (disabled) {
      propertyGroup?.disable({ emitEvent: false });
      ownerGroup?.disable({ emitEvent: false });
    } else {
      propertyGroup?.enable({ emitEvent: false });
      ownerGroup?.enable({ emitEvent: false });
    }
  }
 
  toggleEditMode(): void {
    this.editMode = !this.editMode;
    this.setFormDisabled(!this.editMode);
  }
 
  cancelEdits(): void {
    this.editMode = false;
    this.setFormDisabled(true);
  }
 
  onDocumentFileChange(doc: DocumentItem, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      doc.fileName = input.files[0].name;
      doc.submitted = true;
    }
  }
 
  get remarksControl() {
    return this.verificationForm.get('decision.remarks');
  }
 
  selectDecision(decision: 'approve' | 'sendback'): void {
    this.activeDecision = decision;
    this.showValidationHint = false;
    if (decision === 'sendback') {
      this.remarksControl?.setValidators([Validators.required, Validators.minLength(10)]);
    } else {
      this.remarksControl?.setValidators([]);
    }
    this.remarksControl?.updateValueAndValidity();
  }
 
  submitDecision(): void {
    if (!this.activeDecision) {
      return;
    }
    if (this.activeDecision === 'sendback' && this.remarksControl?.invalid) {
      this.showValidationHint = true;
      this.remarksControl.markAsTouched();
      return;
    }
 
    this.submitting = true;
 
    const entry: VerificationHistoryEntry = {
      role: this.currentStage,
      actorName: 'You',
      action: this.activeDecision === 'approve' ? 'Approved' : 'Sent Back',
      remarks: this.remarksControl?.value || 'No remarks added.',
      date: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })
    };
 
    // Simulate an API call
    setTimeout(() => {
      this.history.unshift(entry);
      this.submitting = false;
      this.activeDecision = null;
      this.remarksControl?.reset('');
    }, 600);
  }
}
