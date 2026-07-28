import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

@Component({
  selector: 'app-procurement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './procurement.html',
  styleUrl: './procurement.scss',
})
export class Procurement {
  @Input() selectedEntityType = 'Procurement Agency';
  @Output() backClicked = new EventEmitter<void>();
  @Output() submitClicked = new EventEmitter<ProcurementFormData>();
  @Output() toastMessage = new EventEmitter<{ message: string; type: 'success' | 'error' | 'info' }>();

  formData: ProcurementFormData = {
    agencyName: '',
    designation: '',
    gender: 'Male',
    dob: '',
    firstName: '',
    lastName: '',
    mobileNumber: '',
    gstNumber: '',
  };

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

  onBack(): void {
    this.backClicked.emit();
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.submitClicked.emit({ ...this.formData });
  }

  validateForm(): boolean {
    if (!this.formData.agencyName || this.formData.agencyName === '--Select Agency--') {
      this.toastMessage.emit({ message: 'Please select Name of Agency', type: 'error' });
      return false;
    }

    if (!this.formData.designation || this.formData.designation === 'Select Designation Type') {
      this.toastMessage.emit({ message: 'Please select Designation', type: 'error' });
      return false;
    }

    if (!this.formData.gender) {
      this.toastMessage.emit({ message: 'Please select Gender', type: 'error' });
      return false;
    }

    if (!this.formData.dob) {
      this.toastMessage.emit({ message: 'Please select Date of Birth', type: 'error' });
      return false;
    }

    if (!this.formData.firstName.trim()) {
      this.toastMessage.emit({ message: 'Please enter First Name', type: 'error' });
      return false;
    }

    if (!this.formData.lastName.trim()) {
      this.toastMessage.emit({ message: 'Please enter Last Name', type: 'error' });
      return false;
    }

    if (!/^[0-9]{10}$/.test(this.formData.mobileNumber)) {
      this.toastMessage.emit({ message: 'Please enter a valid 10-digit Mobile Number', type: 'error' });
      return false;
    }

    if (!this.formData.gstNumber.trim()) {
      this.toastMessage.emit({ message: 'Please enter GST Number', type: 'error' });
      return false;
    }

    return true;
  }
}
