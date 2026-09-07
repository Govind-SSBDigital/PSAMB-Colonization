import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { PropertyBidderRegistrationModule } from '../property-bidder-registration/property-bidder-registration.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators,FormControl} from '@angular/forms';
import { Common } from '../../core/service/CommonService/common';
import { Propertybidderregn } from '../../core/service/Property-Bidder-RegnService/propertybidderregn';
import { ActivatedRoute, Router } from '@angular/router';

export interface VerificationHistoryEntry {
  role: string;
  actorName: string;
  action: 'Approved' | 'Sent Back' | 'Submitted';
  remarks: string;
  date: string;
}


@Component({
  selector: 'app-data-entry-operator-verification-view',
  standalone: true,
  imports:[PropertyBidderRegistrationModule, CommonModule],
  templateUrl: './data-entry-operator-verification-view.html',
  styleUrl: './data-entry-operator-verification-view.scss',
})
export class DataEntryOperatorVerificationView {

   history: VerificationHistoryEntry[] = [
      {
        role: 'Clerk',
        actorName: 'Test',
        action: 'Submitted',
        remarks: 'Forwarded after initial document check.',
        date: '25 Jul 2026, 11:42 AM',
      },
    ];
  verificationStatusClass = 'status-pending';
  verificationStatus = 'Pending';
  submitting = false;
  activeDecision: 'approve' | 'sendback' | null = null;
  private readonly fb = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  showValidationHint = false;
  currentStage = 'Clerk';
  form!: FormGroup;
  remarksControl = this.fb.nonNullable.control('', [
    Validators.maxLength(500),
  ]);
  originalRegistrationDto: any;
  userRole = '';
  isAlreadyVerified = false;

constructor(
  private commonService: Common,
  private service: Propertybidderregn,
  private router: Router,
) { }

  private setVerificationStatus(statusId: number | null | undefined): void {
    if (statusId === 2 || statusId === 3 || statusId === 4) {
      this.verificationStatus = 'Verified';
      this.verificationStatusClass = 'status-verified';
    } else if (statusId === 7) {
      this.verificationStatus = 'Objection';
      this.verificationStatusClass = 'status-objection';
    } else {
      this.verificationStatus = 'Pending';
      this.verificationStatusClass = 'status-pending';
    }
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

    const token = sessionStorage.getItem('token');
    let currentUserId = 0;
    if (token) {
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const rawId = tokenPayload.ApplicantId || tokenPayload.UserId || tokenPayload.id;
        if (rawId) {
          currentUserId = Number(rawId);
        }
      } catch (e) {
        console.error('Error parsing token for currentUserId:', e);
      }
    }

    const payload = {
      id: this.originalRegistrationDto?.id || 0,
      remarks: this.remarksControl?.value || '',
      decision: this.activeDecision,
      modifiedBy: currentUserId,
      modifiedDate: new Date().toISOString(),
      role: this.userRole
    };

    this.service.VerifyByClerk(payload).subscribe({
      next: (res: any) => {
        this.submitting = false;

        const actionText = this.activeDecision === 'approve' ? 'approved' : 'sent back for changes';
        this.toastr.success(`Application has been successfully ${actionText}!`, 'Success');

        this.isAlreadyVerified = true;
        this.setVerificationStatus(this.activeDecision === 'approve' ? 2 : 7);
        this.remarksControl.disable({ emitEvent: false });

        const entry: VerificationHistoryEntry = {
          role: this.currentStage,
          actorName: 'You',
          action: this.activeDecision === 'approve' ? 'Approved' : 'Sent Back',
          remarks: payload.remarks,
          date: new Date().toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          }),
        };
        this.history.unshift(entry);

        this.activeDecision = null;
        setTimeout(() => {
          this.router.navigate(['/property-verification']);
        }, 1500);
      },
      error: (err: any) => {
        this.submitting = false;
        console.error('Error submitting clerk decision:', err);
        const errorMsg = err?.error?.message || 'Something went wrong while submitting the decision.';
        this.toastr.error(errorMsg, 'Error');
      }
    });
  }

  handleApprove(): void {
  this.activeDecision = 'approve';
  this.submitDecision();
}
handleSendBack(): void {
  if (this.activeDecision !== 'sendback') {
    this.activeDecision = 'sendback';
  } else {
    this.submitDecision();
  }
}
}
