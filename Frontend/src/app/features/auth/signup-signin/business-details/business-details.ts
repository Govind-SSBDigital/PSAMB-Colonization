import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { LocationService } from '../../../../core/service/location.service';

@Component({
  selector: 'app-business-details',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './business-details.html',
  styleUrls: ['./business-details.scss']
})
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

  toggleSection() {
    this.isExpanded = !this.isExpanded;
  }

  getBusinessOfficeLabel(): string {
    return this.selectedEntityType || 'Sole Proprietor';
  }

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
          this.businessDistricts = res.data;  // ← YE LINE MISSING THI
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
      // Copy all address values from the individual address
      this.signUpData.businessState = this.signUpData.addressState;
      this.signUpData.businessStateId = this.signUpData.addressStateId;
      this.signUpData.businessDistrict = this.signUpData.addressDistrict;
      this.signUpData.businessDistrictId = this.signUpData.addressDistrictId;
      this.signUpData.businessCity = this.signUpData.addressCity;
      this.signUpData.businessCityId = this.signUpData.addressCityId;
      this.signUpData.businessPincode = this.signUpData.addressPincode;
      this.signUpData.businessLandmark = this.signUpData.addressLandmark;

      // The dropdowns need their options loaded — fetch districts for the copied
      // state, then fetch cities for the copied district so the <select> can
      // match and display the pre-selected values.
      if (this.signUpData.addressStateId) {
        this.isLoadingDistricts = true;
        this.businessDistricts = [];
        this.businessCities = [];

        this.locationService.getDistricts(this.signUpData.addressStateId).subscribe({
          next: (res) => {
            this.businessDistricts = res.data;
            this.isLoadingDistricts = false;

            // Now load cities for the copied district
            if (this.signUpData.addressDistrictId) {
              this.isLoadingCities = true;
              this.locationService.getCities(this.signUpData.addressDistrictId).subscribe({
                next: (cityRes) => {
                  this.businessCities = cityRes.data;
                  this.isLoadingCities = false;
                },
                error: (err) => {
                  console.error('Business cities error:', err);
                  this.isLoadingCities = false;
                }
              });
            }
          },
          error: (err) => {
            console.error('Business districts error:', err);
            this.isLoadingDistricts = false;
          }
        });
      }

      this.toastMessage.emit({ message: 'Address copied from Document Address', type: 'success' });
    } else {
      // Clear everything when unchecked
      this.signUpData.businessState = '';
      this.signUpData.businessStateId = 0;
      this.signUpData.businessDistrict = '';
      this.signUpData.businessDistrictId = 0;
      this.signUpData.businessCity = '';
      this.signUpData.businessCityId = 0;
      this.signUpData.businessPincode = '';
      this.signUpData.businessLandmark = '';
      this.businessDistricts = [];
      this.businessCities = [];
    }
  }

  restrictToNumbers(event: KeyboardEvent): void {
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End'
    ];

    // Allow system shortcuts (Ctrl+A, Ctrl+C, Ctrl+V, etc.)
    if (event.ctrlKey || event.metaKey) {
      return;
    }

    // Allow navigation and functional keys
    if (allowedKeys.includes(event.key)) {
      return;
    }

    // Block non-numeric keystrokes
    if (event.key < '0' || event.key > '9') {
      event.preventDefault();
    }
  }
}