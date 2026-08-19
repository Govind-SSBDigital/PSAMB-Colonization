import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocationService } from '../../../../core/service/location.service';

@Component({
  selector: 'app-documents-and-address',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documents-and-address.html',
  styleUrl: './documents-and-address.scss',
})
export class DocumentsAndAddress implements OnInit {
  @Input() selectedEntityType = '';
  @Input() signUpData: any;
  @Input() idDocTypes: string[] = [];
  @Input() addressDocTypes: string[] = [];
  @Input() uploadProgress: Record<string, number> = {};
  @Input() uploadingStates: Record<string, boolean> = {};
  @Output() fileSelected = new EventEmitter<{ event: Event; docType: string }>();

  states: any[] = [];
  districts: any[] = [];
  cities: any[] = [];
  isLoadingStates = false;
  isLoadingDistricts = false;
  isLoadingCities = false;

  constructor(private locationService: LocationService, private cdr: ChangeDetectorRef ) { }
  maskedIdDocumentNumber: string = '';

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
     this.maskedIdDocumentNumber = this.getDisplayDocumentNumber();
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
    this.maskedIdDocumentNumber = '';
    if (this.signUpData.addressDocType === this.signUpData.idDocumentType) {
      this.signUpData.addressDocType = '';
      this.signUpData.addressDocNumber = '';
    }
  }

  get filteredAddressDocTypes(): string[] {
    const selectedDoc = this.signUpData?.idDocumentType;
    if (!selectedDoc) {
      return this.addressDocTypes;
    }
    return this.addressDocTypes.filter((doc) => doc !== selectedDoc);
  }

  getDisplayDocumentNumber(): string {
    const raw = this.signUpData?.idDocumentNumber ?? '';
    if (this.signUpData?.idDocumentType === 'Aadhaar Card' && raw.length === 12) {
      return this.maskAadhaarNumber(raw);
    }
    return raw;
  }

  getCurrentPattern(): string {
    const docType = this.signUpData?.idDocumentType;
    if (!docType || docType === 'Aadhaar Card') return '';

    switch (docType) {
      case 'PAN Card': return '[A-Z0-9]{10}';
      case 'Voter Card': return '[A-Za-z0-9]{10}';
      case 'Passport': return '[A-Za-z0-9]{8}';
      case 'Driving License': return '[A-Za-z0-9]{15}';
      default: return '[A-Za-z0-9]+';
    }
  }

  getMaxLength(): number {
    const docType = this.signUpData?.idDocumentType;
    switch (docType) {
      case 'Aadhaar Card': return 12;
      case 'PAN Card': return 10;
      case 'Voter Card': return 10;
      case 'Passport': return 8;
      case 'Driving License': return 15;
      default: return 20;
    }
  }

  onDocumentNumberChange(value: string): void {
    const docType = this.signUpData.idDocumentType;
    if (docType === 'Aadhaar Card') {
      const cleaned = value.replace(/[^0-9]/g, '').slice(0, 12);
      this.signUpData.idDocumentNumber = cleaned;
      this.maskedIdDocumentNumber = cleaned.length === 12 ? this.maskAadhaarNumber(cleaned) : cleaned;
    } else if (docType === 'PAN Card') {
      const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
      this.signUpData.idDocumentNumber = cleaned;
      this.maskedIdDocumentNumber = cleaned;
    } else {
      const cleaned = value.slice(0, this.getMaxLength());
      this.signUpData.idDocumentNumber = cleaned;
      this.maskedIdDocumentNumber = cleaned;
    }
  }

  maskAadhaarNumber(number: string): string {
    if (!number) return '';
    if (number.length <= 8) {
      return 'X'.repeat(number.length);
    }
    return 'X'.repeat(8) + number.substring(8);
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

  getDisplayAddressDocNumber(): string {
    const raw = this.signUpData?.addressDocNumber ?? '';
    if (this.signUpData?.addressDocType === 'Aadhaar Card' && raw.length === 12) {
      return this.maskAadhaarNumber(raw);
    }
    return raw;
  }

  getAddressDocPattern(): string {
    const docType = this.signUpData?.addressDocType;
    if (!docType || docType === 'Aadhaar Card') return '';

    switch (docType) {
      case 'Passport': return '[A-Za-z0-9]{8}';
      default: return '[A-Za-z0-9]+';
    }
  }

  getAddressDocMaxLength(): number {
    const docType = this.signUpData?.addressDocType;
    switch (docType) {
      case 'Aadhaar Card': return 12;
      case 'Passport': return 8;
      default: return 20;
    }
  }

  onAddressDocNumberChange(value: string): void {
    const docType = this.signUpData.addressDocType;
    if (docType === 'Aadhaar Card') {
      const cleaned = value.replace(/[^0-9]/g, '').slice(0, 12);
      this.signUpData.addressDocNumber = cleaned;
    } else if (docType === 'Passport') {
      const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
      this.signUpData.addressDocNumber = cleaned;
    } else {
      const cleaned = value.slice(0, this.getAddressDocMaxLength());
      this.signUpData.addressDocNumber = cleaned;
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
    switch (typeId) {
      case 'Individual': return 'ਵਿਅਕਤੀਗਤ';
      case 'Sole Proprietorship': return 'ਇਕੱਲੇ ਮਾਲਕ';
      case 'HUF': return 'ਹਿੰਦੂ ਅਣਵੰਡਿਆ ਪਰਿਵਾਰ';
      case 'Partnership Firm': return 'ਭਾਈਵਾਲੀ ਫਰਮ';
      case 'Company': return 'ਕੰਪਨੀ';
      case 'Procurement Agency': return 'ਖਰੀਦ ਏਜੰਸੀ';
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
