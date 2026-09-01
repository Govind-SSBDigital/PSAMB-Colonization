import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { PropertyBidderRegistrationModule } from '../property-bidder-registration/property-bidder-registration.module';
import { Propertybidderregn } from '../../core/service/Property-Bidder-RegnService/propertybidderregn';

@Component({
  selector: 'app-deo-verification-view',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PropertyBidderRegistrationModule],
  templateUrl: './deo-verification-view-component.html',
  styleUrl: './deo-verification-view-component.scss',
})
export class DeoVerificationViewComponent implements OnInit, OnDestroy {
  registrationData: any = null;
  registrationId: number | null = null;
  loading = true;
  submitting = false;
  activeDecision: 'approve' | 'objection' | null = null;
  showValidationHint = false;
  isAlreadyVerified = false;
  remarksControl = new FormControl('', [Validators.maxLength(1000)]);
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly service: Propertybidderregn,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = this.decodeId(params.get('id'));
      if (!id) {
        this.loading = false;
        this.toastr.error('A valid registration id is required.', 'Unable to load registration');
        return;
      }
      this.registrationId = id;
      this.loadRegistration(id);
    });
  }
  private decodeId(value: string | null): number | null {
    if (!value) return null;
    try {
      const id = Number(atob(value));
      return Number.isInteger(id) && id > 0 ? id : null;
    } catch {
      return null;
    }
  }
  private loadRegistration(id: number): void {
    this.loading = true;
    this.service
      .getRegistrationById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.registrationData = response?.data ?? response;
          this.isAlreadyVerified = [2, 3, 4, 7].includes(
            Number(this.registrationData?.applicationStatusId),
          );
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.toastr.error(
            'The submitted registration could not be loaded.',
            'Unable to load registration',
          );
        },
      });
  }
  selectDecision(decision: 'approve' | 'objection'): void {
    this.activeDecision = decision;
    this.showValidationHint = false;
    this.remarksControl.setValidators(
      decision === 'objection'
        ? [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]
        : [Validators.maxLength(1000)],
    );
    this.remarksControl.updateValueAndValidity();
  }
  submitDecision(): void {
    if (!this.registrationId || !this.activeDecision || this.submitting) return;
    if (this.activeDecision === 'objection' && this.remarksControl.invalid) {
      this.showValidationHint = true;
      this.remarksControl.markAsTouched();
      return;
    }
    this.submitting = true;
    const decision = this.activeDecision;
    const payload = {
      id: this.registrationId,
      remarks: this.remarksControl.value?.trim() ?? '',
      decision,
      modifiedBy: this.currentUserId(),
      modifiedDate: new Date().toISOString(),
      role: this.currentUserRole(),
    };
    this.service
      .VerifyByClerk(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.submitting = false;
          this.isAlreadyVerified = true;
          this.activeDecision = null;
          this.toastr.success(
            `Application ${decision === 'approve' ? 'approved' : 'objection'}.`,
            'Verification complete',
          );
        },
        error: () => {
          this.submitting = false;
          this.toastr.error(
            'The verification action could not be completed.',
            'Verification failed',
          );
        },
      });
  }
  private currentUserId(): number {
    try {
      const token = sessionStorage.getItem('token');
      return token ? Number(JSON.parse(atob(token.split('.')[1])).ApplicantId ?? 0) : 0;
    } catch {
      return 0;
    }
  }
  private currentUserRole(): string {
    try {
      return JSON.parse(sessionStorage.getItem('cp_menus') ?? '{}')?.profile?.roles?.[0] ?? '';
    } catch {
      return '';
    }
  }
  goBack(): void {
    this.router.navigate(['/property-verification']);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
