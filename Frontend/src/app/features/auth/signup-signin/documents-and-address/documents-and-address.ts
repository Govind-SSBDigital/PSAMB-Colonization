import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-documents-and-address',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documents-and-address.html',
  styleUrl: './documents-and-address.scss',
})
export class DocumentsAndAddress {
  @Input() selectedEntityType = '';
  @Input() signUpData: any;
  @Input() states: string[] = [];
  @Input() districts: string[] = [];
  @Input() cities: string[] = [];
  @Input() idDocTypes: string[] = [];
  @Input() addressDocTypes: string[] = [];
  @Input() uploadProgress: Record<string, number> = {};
  @Input() uploadingStates: Record<string, boolean> = {};

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
    switch (typeId) {
      case 'Individual': return 'ਵਿਅਕਤੀਗਤ';
      case 'Sole Proprietorship': return 'ਇਕੱਲੇ ਮਾਲਕ';
      case 'HUF': return 'ਹਿੰਦੂ ਅਣਵੰਡਿਆ ਪਰਿਵਾਰ';
      case 'Partnership Firm': return 'ਭਾਈਵਾਲੀ ਫਰਮ';
      case 'Company': return 'ਕੰਪਨੀ';
      case 'Procurement Agency': return 'ਖਰੀਦ ਏਜੰਸੀ';
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
