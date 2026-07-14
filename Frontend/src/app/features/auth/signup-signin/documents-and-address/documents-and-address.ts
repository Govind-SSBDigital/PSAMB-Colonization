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
      default: return 'ਹੋਰ';
    }
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
