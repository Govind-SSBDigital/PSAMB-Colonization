import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocationService } from '../../../../core/service/location.service';
=======
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
>>>>>>> 2ecc0f677ecb2ec440065cbcc7bb3771dba5051e

@Component({
  selector: 'app-documents-and-address',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documents-and-address.html',
  styleUrl: './documents-and-address.scss',
})
<<<<<<< HEAD
export class DocumentsAndAddress implements OnInit {
  @Input() selectedEntityType = '';
  @Input() signUpData: any;
=======
export class DocumentsAndAddress {
  @Input() selectedEntityType = '';
  @Input() signUpData: any;
  @Input() states: string[] = [];
  @Input() districts: string[] = [];
  @Input() cities: string[] = [];
>>>>>>> 2ecc0f677ecb2ec440065cbcc7bb3771dba5051e
  @Input() idDocTypes: string[] = [];
  @Input() addressDocTypes: string[] = [];
  @Input() uploadProgress: Record<string, number> = {};
  @Input() uploadingStates: Record<string, boolean> = {};
<<<<<<< HEAD
  @Output() fileSelected = new EventEmitter<{ event: Event; docType: string }>();

  states: any[] = [];
  districts: any[] = [];
  cities: any[] = [];
  isLoadingStates = false;
  isLoadingDistricts = false;
  isLoadingCities = false;

  constructor(private locationService: LocationService, private cdr: ChangeDetectorRef ) { }

   ngOnInit(): void {
    this.isLoadingStates = true;
    this.locationService.getStates().subscribe({
      next: (res) => {
        this.states = res.data;
        this.isLoadingStates = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('States error:', err);
        this.isLoadingStates = false;
        this.cdr.detectChanges(); 
      }
    });
  }
  onStateChange(): void {
    this.signUpData.addressDistrict = '';
    this.signUpData.addressDistrictId = 0;
    this.signUpData.addressCity = '';
    this.signUpData.addressCityId = 0;
    this.districts = [];
    this.cities = [];
    const selected = this.states.find((s: any) => s.stateName === this.signUpData.addressState);
    if (selected) {
      this.signUpData.addressStateId = selected.stateId;
      this.isLoadingDistricts = true;
      this.locationService.getDistricts(selected.stateId).subscribe({
        next: (res) => {
          this.districts = res.data;
          this.isLoadingDistricts = false;
        },
        error: (err) => {
          console.error('Districts error:', err);
          this.isLoadingDistricts = false;
        }
      });
    }
  }

  onDistrictChange(): void {
    this.signUpData.addressCity = '';
    this.signUpData.addressCityId = 0;
    this.cities = [];
    const selected = this.districts.find((d: any) => d.districtName === this.signUpData.addressDistrict);
    if (selected) {
      this.signUpData.addressDistrictId = selected.districtId;
      this.isLoadingCities = true;
      this.locationService.getCities(selected.districtId).subscribe({
        next: (res) => {
          this.cities = res.data;
          this.isLoadingCities = false;
        },
        error: (err) => {
          console.error('Cities error:', err);
          this.isLoadingCities = false;
        }
      });
    }
  }

  onCityChange(): void {
    const selected = this.cities.find((c: any) => c.cityName === this.signUpData.addressCity);
    if (selected) {
      this.signUpData.addressCityId = selected.cityId;
    }
  }

  // Document Type
  onDocumentTypeChange(): void {
    this.signUpData.idDocumentNumber = '';
  }

  getCurrentPattern(): string {
    const docType = this.signUpData.idDocumentType;
    switch (docType) {
      case 'Aadhaar Card': return '[0-9]{12}';
      case 'Voter Card': return '[A-Za-z0-9]{10}';
      case 'Passport': return '[A-Za-z0-9]{8}';
      case 'Driving License': return '[A-Za-z0-9]{15}';
      default: return '[A-Za-z0-9]+';
    }
  }

  getMaxLength(): number {
    const docType = this.signUpData.idDocumentType;
    switch (docType) {
      case 'Aadhaar Card': return 12;
      case 'Voter Card': return 10;
      case 'Passport': return 8;
      case 'Driving License': return 15;
      default: return 20;
    }
  }

  onInputFormatting(event: Event): void {
    const input = event.target as HTMLInputElement;
    const docType = this.signUpData.idDocumentType;
    if (docType === 'Aadhaar Card') {
      input.value = input.value.replace(/[^0-9]/g, '').slice(0, 12);
    } else if (docType === 'PAN Card') {
      input.value = input.value.toUpperCase().slice(0, 10);
    } else {
      input.value = input.value.slice(0, this.getMaxLength());
    }
    this.signUpData.idDocumentNumber = input.value;
  }

  onPanInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    this.signUpData.panNumber = input.value;
  }

  onPincodeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '').slice(0, 6);
    this.signUpData.addressPincode = input.value;
  }

  onAddressDocTypeChange(): void {
    this.signUpData.addressDocNumber = '';
  }

  getAddressDocPattern(): string {
    const docType = this.signUpData.addressDocType;
    switch (docType) {
      case 'Aadhaar Card': return '[0-9]{12}';
      case 'Passport': return '[A-Za-z0-9]{8}';
      default: return '[A-Za-z0-9]+';
    }
  }

  getAddressDocMaxLength(): number {
    const docType = this.signUpData.addressDocType;
    switch (docType) {
      case 'Aadhaar Card': return 12;
      case 'Passport': return 8;
      default: return 20;
    }
  }

  onAddressDocInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const docType = this.signUpData.addressDocType;
    if (docType === 'Aadhaar Card') {
      input.value = input.value.replace(/[^0-9]/g, '').slice(0, 12);
    } else {
      input.value = input.value.slice(0, this.getAddressDocMaxLength());
    }
    this.signUpData.addressDocNumber = input.value;
  }

  // Sections
  sectionsExpanded = { documents: true };

  toggleSection(section: 'documents'): void {
    this.sectionsExpanded[section] = !this.sectionsExpanded[section];
  }

  emitFileSelected(event: Event, docType: string): void {
    this.fileSelected.emit({ event, docType });
  }

  getPunjabiLabel(typeId: string): string {
=======

  @Output() fileSelected = new EventEmitter<{ event: Event; docType: string }>();

  sectionsExpanded = {
    documents: true,
  };

  toggleSection(section: 'documents') {
    this.sectionsExpanded[section] = !this.sectionsExpanded[section];
  }

  emitFileSelected(event: Event, docType: string) {
    this.fileSelected.emit({ event, docType });
  }

   getPunjabiLabel(typeId: string): string {
>>>>>>> 2ecc0f677ecb2ec440065cbcc7bb3771dba5051e
    switch (typeId) {
      case 'Individual': return 'ਵਿਅਕਤੀਗਤ';
      case 'Sole Proprietorship': return 'ਇਕੱਲੇ ਮਾਲਕ';
      case 'HUF': return 'ਹਿੰਦੂ ਅਣਵੰਡਿਆ ਪਰਿਵਾਰ';
      case 'Partnership Firm': return 'ਭਾਈਵਾਲੀ ਫਰਮ';
      case 'Company': return 'ਕੰਪਨੀ';
      case 'Procurement Agency': return 'ਖਰੀਦ ਏਜੰਸੀ';
<<<<<<< HEAD
      default: return 'ਹੋਰ';
    }
  }

  getDocumentsTitle(): string {
    if (!this.selectedEntityType) return 'Documents / ਦਸਤਾਵੇਜ਼';
    const type = this.selectedEntityType;
    if (type === 'Sole Proprietorship') return 'Documents of Sole Proprietor (ਸੋਲ ਪ੍ਰੋਪਰਾਇਟਰ ਦੇ ਦਸਤਾਵੇਜ਼)';
    return `Documents of ${type} (${this.getPunjabiLabel(type)} ਦੇ ਦਸਤਾਵੇਜ਼)`;
  }

  getAddressTitle(): string {
    if (!this.selectedEntityType) return 'Address / ਪਤਾ';
    const type = this.selectedEntityType;
    if (type === 'Sole Proprietorship') return 'Address of Sole Proprietor (ਇਕੱਲੇ ਮਾਲਕ ਦਾ ਪਤਾ)';
    return `Address of ${type} (${this.getPunjabiLabel(type)} ਦਾ ਪਤਾ)`;
  }
}
=======
      case 'Public Limited Company': return 'ਪਬਲਿਕ ਲਿਮਟਿਡ ਕੰਪਨੀ';
      case 'Private Limited Company': return 'ਪ੍ਰਾਈਵੇਟ ਲਿਮਟਿਡ ਕੰਪਨੀ';
      case 'Limited Liability Partnership': return 'ਸੀਮਿਤ ਜ਼ਿੰਮੇਵਾਰੀ ਭਾਈਵਾਲੀ';
      default: return 'Individual';
    }
  }
  onDocumentTypeChange(): void {
    this.signUpData.idDocumentNumber = '';
  }
  onInputFormatting(event: Event): void {
    const input = event.target as HTMLInputElement;
    const docType = this.signUpData.idDocumentType;

    if (docType === 'Aadhaar Card') {
      let value = input.value;
      // Strip out the prefix and spaces to analyze trailing numeric blocks
      let digits = value.replace(/^XXXXXXXX\s?/, '').replace(/\D/g, '');
      
      if (digits.length > 4) {
        digits = digits.substring(0, 4);
      }

      const maskedValue = 'XXXXXXXX ' + digits;
      this.signUpData.idDocumentNumber = maskedValue;
      input.value = maskedValue;

    }
  }
  getCurrentPattern(): string {
    const docType = this.signUpData.idDocumentType;
    if (docType === 'Aadhaar Card') {
      return '^XXXXXXXX \\d{4}$'; // Strictly expects the space and exactly 4 final digits on submit
    }
    return '.*'; // No specific pattern restriction for other document options
  }
  getMaxLength(): number {
    const docType = this.signUpData.idDocumentType;
    if (docType === 'Aadhaar Card') return 13; // "XXXXXXXX " (9 chars) + 4 digits = 13
    return 50;                                 // Standard default fallback limit
  }

  getDocumentsTitle(): string {
    if (!this.selectedEntityType) {
      return 'Documents / ਦਸਤਾਵੇਜ਼';
    }

    const type = this.selectedEntityType;
    if (type === 'Sole Proprietorship') {
      return 'Documents of Sole Proprietor (ਸੋਲ ਪ੍ਰੋਪਰਾਇਟਰ ਦੇ ਦਸਤਾਵੇਜ਼)';
    }

    const punjabi = this.getPunjabiLabel(type);
    return `Documents of ${type} (${punjabi} ਦੇ ਦਸਤਾਵੇਜ਼)`;
  }

  getAddressTitle(): string {
    if (!this.selectedEntityType) {
      return 'Address / ਪਤਾ';
    }

    const type = this.selectedEntityType;
    if (type === 'Sole Proprietorship') {
      return 'Address of Sole Proprietor (ਇਕੱਲੇ ਮਾਲਕ ਦਾ ਪਤਾ)';
    }

    const punjabi = this.getPunjabiLabel(type);
    return `Address of ${type} (${punjabi} ਦਾ ਪਤਾ)`;
  }
}
>>>>>>> 2ecc0f677ecb2ec440065cbcc7bb3771dba5051e
