import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';

interface ProcurementFormData {
  agencyName: string;
  designation: string;
  gender: string;
  dob: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  gstNumber: string;
}

// GST format: 2 digits state code, 10 char PAN, 1 entity code, Z, 1 checksum
const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

// DOB must be a valid date and person must be at least 18 years old
function dobValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null; // handled by required validator
  }

  const dob = new Date(control.value);
  if (isNaN(dob.getTime())) {
    return { invalidDate: true };
  }

  const today = new Date();
  if (dob > today) {
    return { futureDate: true };
  }

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  if (age < 18) {
    return { underage: true };
  }

  return null;
}

@Component({
  selector: 'app-procurement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './procurement.html',
  styleUrl: './procurement.scss',
})
export class Procurement implements OnInit {
  @Input() selectedEntityType = 'Procurement Agency';
  @Output() backClicked = new EventEmitter<void>();
  @Output() submitClicked = new EventEmitter<ProcurementFormData>();
  @Output() toastMessage = new EventEmitter<{ message: string; type: 'success' | 'error' | 'info' }>();

  procurementForm!: FormGroup;

  agencyOptions = [
    'Punjab State Agricultural Marketing Board',
    'Markfed',
    'Private Procurement Agency',
    'Cooperative Society',
  ];

  designationOptions = [
    'Authorized Signatory',
    'Manager',
    'Director',
    'Partner',
    'Proprietor',
  ];

  genderOptions = ['Male', 'Female', 'Other'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.procurementForm = this.fb.group({
      agencyName: ['', Validators.required],
      designation: ['', Validators.required],
      gender: ['Male', Validators.required],
      dob: ['', [Validators.required, dobValidator]],
      firstName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[6-9][0-9]{9}$/)]],
      gstNumber: ['', [Validators.required, Validators.pattern(GST_REGEX)]],
    });
  }

  // convenience getter for template access
  get f() {
    return this.procurementForm.controls;
  }

  onBack(): void {
    this.backClicked.emit();
  }

  onSubmit(): void {
    if (this.procurementForm.invalid) {
      this.procurementForm.markAllAsTouched();
      this.toastMessage.emit({ message: 'Please fill all required fields correctly', type: 'error' });
      return;
    }

    this.submitClicked.emit({ ...this.procurementForm.value });
  }
}