import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-property',
  standalone: false,
  templateUrl: './register-property.html',
  styleUrl: './register-property.scss',
})
export class RegisterProperty {

  readonly allowedFileTypes = '.jpeg,.jpg,.png,.pdf';

  readonly districts = ['Fazilka','Barnala', 'Bathinda'];
  readonly marketCommittees = ['Ambala Market Committee', 'Hisar Market Committee', 'Karnal Market Committee'];
  readonly mandis = ['Grain Market A', 'New Sabzi Mandi', 'Regional Mandi B', 'Cotton Mandi'];
  readonly plots = ['Plot A-12', 'Plot B-21', 'Shop 18'];
  readonly plotTypes = ['Residential', 'Commercial', 'Industrial'];
  readonly states = ['Punjab', 'Delhi', 'Chandigarh'];
  readonly cities = ['Chandigarh','Mohali'];

  readonly documents = [
    { key: 'allotmentLetter', label: 'Allotment Letter' },
    { key: 'lastPaymentReceipt', label: 'Last Payment Receipt', hint: 'Any one from last three receipts' },
    { key: 'noDueCertificate', label: 'No Due Certificate' },
    { key: 'bForm', label: 'B.Form' },
    { key: 'conveyanceDeed', label: 'Conveyance Deed' },
    { key: 'saleDeed', label: 'Sale Deed' },
    { key: 'transferOrder', label: 'Transfer Order' },
    { key: 'legalHeirCertificate', label: 'Legal Heir Certificate' },
  ];

  protected propertyForm: FormGroup;

  constructor(private fb: FormBuilder) {
    const documentControls = this.documents.reduce<Record<string, unknown>>((controls, document) => {
      controls[`${document.key}Selected`] = [false];
      controls[`${document.key}File`] = [null];
      return controls;
    }, {});

    this.propertyForm = this.fb.group(
      {
        allotteeCode: ['', [Validators.pattern(/^[A-Za-z0-9/-]+$/)]],
        district: ['', Validators.required],
        marketCommittee: ['', Validators.required],
        mandi: ['', Validators.required],
        plotNumber: ['', Validators.required],
        plotType: ['', Validators.required],
        plotSize: ['', Validators.required],
        currentOwnerName: ['', Validators.required],
        guardianName: ['', Validators.required],
        mobileNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
        email: ['', [Validators.required, Validators.email]],
        state: ['', Validators.required],
        ownerDistrict: ['', Validators.required],
        city: ['', Validators.required],
        address: ['', Validators.required],
        aadhaarNumber: ['', [Validators.required, Validators.pattern(/^XXXXXXXX \d{0,4}$/)]],
        aadhaarProof: [null, [Validators.required, this.fileTypeValidator()]],
        passportNumber: [''],
        passportProof: [null, this.fileTypeValidator()],
        ...documentControls,
      },
      { validators: this.atLeastOneDocumentValidator() },
    );
  }

  maskInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Strip out the prefix temporarily to see what the user typed
    let digits = value.replace(/^XXXXXXXX\s?/, '').replace(/\D/g, '');

    // Limit the actual typed digits to 4
    if (digits.length > 4) {
      digits = digits.substring(0, 4);
    }

    // Combine the mask with the typed digits
    const maskedValue = 'XXXXXXXX' + ' ' + digits;

    // Update the form control and input display value
    this.propertyForm.get('aadhaarNumber')?.setValue(maskedValue, { emitEvent: false });
    input.value = maskedValue;
  }

  isInvalid(controlName: string): boolean {
    const control = this.propertyForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  hasDocumentError(): boolean {
    return !!this.propertyForm.hasError('documentRequired') && (this.propertyForm.dirty || this.propertyForm.touched);
  }

  fileName(controlName: string): string {
    const file = this.propertyForm.get(controlName)?.value as File | null;
    return file?.name ?? 'No file chosen';
  }

  onFileChange(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    const control = this.propertyForm.get(controlName);

    control?.setValue(file);
    control?.markAsDirty();
    control?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.propertyForm.invalid) {
      this.propertyForm.markAllAsTouched();
      return;
    }

    // console.log(this.propertyForm.value);
  }

  resetForm(): void {
    this.propertyForm.reset();
  }

  private fileTypeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value as File | null;

      if (!file) {
        return null;
      }

      const allowedExtensions = ['jpeg', 'jpg', 'png', 'pdf'];
      const extension = file.name.split('.').pop()?.toLowerCase();

      return extension && allowedExtensions.includes(extension) ? null : { fileType: true };
    };
  }

  private atLeastOneDocumentValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const hasUploadedDocument = this.documents.some((document) => {
        return !!group.get(`${document.key}Selected`)?.value && !!group.get(`${document.key}File`)?.value;
      });

      return hasUploadedDocument ? null : { documentRequired: true };
    };
  }
}
