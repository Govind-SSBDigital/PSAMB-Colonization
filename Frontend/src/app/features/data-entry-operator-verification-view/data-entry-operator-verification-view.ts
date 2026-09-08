import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { PropertyBidderRegistrationModule } from '../property-bidder-registration/property-bidder-registration.module';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
  imports:[PropertyBidderRegistrationModule, CommonModule, ReactiveFormsModule],
  templateUrl: './data-entry-operator-verification-view.html',
  styleUrl: './data-entry-operator-verification-view.scss',
})
export class DataEntryOperatorVerificationView implements OnInit {
  propertyCode = 'BBB132-8391';
  originalRegistrationDto: any = null;
  history: VerificationHistoryEntry[] = [];
  verificationStatusClass = 'status-pending';
  verificationStatus = 'Pending';
  submitting = false;
  activeDecision: 'approve' | 'sendback' | null = null;
  private readonly fb = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(Propertybidderregn);
  private readonly commonService = inject(Common);

  showValidationHint = false;
  currentStage = 'Clerk';
  remarksControl = this.fb.nonNullable.control('', [
    Validators.maxLength(500),
  ]);
  userRole = '';
  isAlreadyVerified = false;

  getCurrentUserRole(): string {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const rawRole = tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
          || tokenPayload.role
          || tokenPayload.Role
          || tokenPayload.roles
          || tokenPayload.Roles;
        if (rawRole) return String(rawRole).trim();
      } catch (e) {
        console.error('Error parsing token for role:', e);
      }
    }
    return sessionStorage.getItem('role') || 'Clerk';
  }

  ngOnInit(): void {
    const role = this.getCurrentUserRole();
    this.userRole = role;
    this.currentStage = role;

    this.route.queryParams.subscribe(params => {
      const codeFromQuery = params['propertyCode'];
      if (codeFromQuery) {
        this.propertyCode = codeFromQuery;
      }
      const roleFromQuery = params['role'];
      if (roleFromQuery) {
        this.userRole = roleFromQuery;
        this.currentStage = roleFromQuery;
      }
      const encryptedId = params['id'];
      if (encryptedId) {
        try {
          const id = Number(atob(encryptedId));
          if (!isNaN(id) && id > 0) {
            this.service.getRegistrationById(id).subscribe({
              next: (res: any) => {
                if (res && res.data) {
                  this.onPropertyLoaded(res.data);
                }
              },
              error: (err: any) => console.error('Error fetching registration by id:', err)
            });
          }
        } catch (e) {
          console.error('Error decoding id', e);
        }
      }
    });

    const navState = history.state as { registrationData?: any };
    if (navState?.registrationData) {
      this.onPropertyLoaded(navState.registrationData);
    }
  }

  onPropertyLoaded(data: any): void {
    if (!data) return;
    this.originalRegistrationDto = data;
    if (data.propertyCode || data.allotteeCode) {
      this.propertyCode = data.propertyCode || data.allotteeCode;
    }
    const statusId = data.applicationStatusId ?? data.statusId;
    this.setVerificationStatus(statusId);
  }

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
