<<<<<<< HEAD
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { LocationService } from '../../../../core/service/location.service';
=======
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
>>>>>>> 2ecc0f677ecb2ec440065cbcc7bb3771dba5051e

@Component({
  selector: 'app-business-details',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './business-details.html',
  styleUrls: ['./business-details.scss']
})
<<<<<<< HEAD
export class BusinessDetails implements OnInit {
  @Input() selectedEntityType: string = '';
  @Input() signUpData: any;
  @Output() toastMessage = new EventEmitter<{ message: string, type: 'success' | 'error' | 'info' }>();

  states: any[] = [];
  businessDistricts: any[] = [];
  businessCities: any[] = [];

  isLoadingStates = false;
  isLoadingDistricts = false;
  isLoadingCities = false;

  isExpanded = true;

  constructor(private locationService: LocationService) { }

  ngOnInit(): void {
    this.isLoadingStates = true;
    this.locationService.getStates().subscribe({
      next: (res) => {
        this.states = res.data;
        this.isLoadingStates = false;
      },
      error: (err) => {
        console.error('States error:', err);
        this.isLoadingStates = false;
      }
    });
  }

=======
export class BusinessDetails {
  @Input() selectedEntityType: string = '';
  @Input() signUpData: any;
  @Input() states: string[] = [];
  @Input() districts: string[] = [];
  @Input() cities: string[] = [];

  // Emits toast notifications back to the parent
  @Output() toastMessage = new EventEmitter<{ message: string, type: 'success' | 'error' | 'info' }>();

  isExpanded = true;

>>>>>>> 2ecc0f677ecb2ec440065cbcc7bb3771dba5051e
  toggleSection() {
    this.isExpanded = !this.isExpanded;
  }

  getBusinessOfficeLabel(): string {
    return this.selectedEntityType || 'Sole Proprietor';
  }

<<<<<<< HEAD
  onBusinessStateChange(): void {
    this.signUpData.businessDistrict = '';
    this.signUpData.businessDistrictId = 0;
    this.signUpData.businessCity = '';
    this.signUpData.businessCityId = 0;
    this.businessDistricts = [];
    this.businessCities = [];

    const selected = this.states.find((s: any) => s.stateName === this.signUpData.businessState);
    if (selected) {
      this.signUpData.businessStateId = selected.stateId;
      this.isLoadingDistricts = true;
      this.locationService.getDistricts(selected.stateId).subscribe({
        next: (res) => {
          this.businessDistricts = res.data;
          this.isLoadingDistricts = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoadingDistricts = false;
        }
      });
    }
  }

  onBusinessDistrictChange(): void {
    this.signUpData.businessCity = '';
    this.signUpData.businessCityId = 0;
    this.businessCities = [];

    const selected = this.businessDistricts.find((d: any) => d.districtName === this.signUpData.businessDistrict);
    if (selected) {
      this.signUpData.businessDistrictId = selected.districtId;
      this.isLoadingCities = true;
      this.locationService.getCities(selected.districtId).subscribe({
        next: (res) => {
          this.businessCities = res.data;
          this.isLoadingCities = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoadingCities = false;
        }
      });
    }
  }

  onBusinessCityChange(): void {
    const selected = this.businessCities.find((c: any) => c.cityName === this.signUpData.businessCity);
    if (selected) {
      this.signUpData.businessCityId = selected.cityId;
    }
  }

  onSameAddressChange() {
    if (this.signUpData.isSameAddress) {
      this.signUpData.businessState = this.signUpData.addressState;
      this.signUpData.businessStateId = this.signUpData.addressStateId;
      this.signUpData.businessDistrict = this.signUpData.addressDistrict;
      this.signUpData.businessDistrictId = this.signUpData.addressDistrictId;
      this.signUpData.businessCity = this.signUpData.addressCity;
      this.signUpData.businessCityId = this.signUpData.addressCityId;
=======
  onSameAddressChange() {
    if (this.signUpData.isSameAddress) {
      this.signUpData.businessState = this.signUpData.addressState;
      this.signUpData.businessDistrict = this.signUpData.addressDistrict;
      this.signUpData.businessCity = this.signUpData.addressCity;
>>>>>>> 2ecc0f677ecb2ec440065cbcc7bb3771dba5051e
      this.signUpData.businessPincode = this.signUpData.addressPincode;
      this.signUpData.businessLandmark = this.signUpData.addressLandmark;
      this.toastMessage.emit({ message: 'Address copied from Document Address', type: 'success' });
    } else {
      this.signUpData.businessState = '';
<<<<<<< HEAD
      this.signUpData.businessStateId = 0;
      this.signUpData.businessDistrict = '';
      this.signUpData.businessDistrictId = 0;
      this.signUpData.businessCity = '';
      this.signUpData.businessCityId = 0;
=======
      this.signUpData.businessDistrict = '';
      this.signUpData.businessCity = '';
>>>>>>> 2ecc0f677ecb2ec440065cbcc7bb3771dba5051e
      this.signUpData.businessPincode = '';
      this.signUpData.businessLandmark = '';
    }
  }
}