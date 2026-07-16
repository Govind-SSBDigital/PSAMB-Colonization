import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-business-details',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './business-details.html',
  styleUrls: ['./business-details.scss']
})
export class BusinessDetails {
  @Input() selectedEntityType: string = '';
  @Input() signUpData: any;
  @Input() states: string[] = [];
  @Input() districts: string[] = [];
  @Input() cities: string[] = [];

  // Emits toast notifications back to the parent
  @Output() toastMessage = new EventEmitter<{ message: string, type: 'success' | 'error' | 'info' }>();

  isExpanded = true;

  toggleSection() {
    this.isExpanded = !this.isExpanded;
  }

  getBusinessOfficeLabel(): string {
    return this.selectedEntityType || 'Sole Proprietor';
  }

  onSameAddressChange() {
    if (this.signUpData.isSameAddress) {
      this.signUpData.businessState = this.signUpData.addressState;
      this.signUpData.businessDistrict = this.signUpData.addressDistrict;
      this.signUpData.businessCity = this.signUpData.addressCity;
      this.signUpData.businessPincode = this.signUpData.addressPincode;
      this.signUpData.businessLandmark = this.signUpData.addressLandmark;
      this.toastMessage.emit({ message: 'Address copied from Document Address', type: 'success' });
    } else {
      this.signUpData.businessState = '';
      this.signUpData.businessDistrict = '';
      this.signUpData.businessCity = '';
      this.signUpData.businessPincode = '';
      this.signUpData.businessLandmark = '';
    }
  }
}