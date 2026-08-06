import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
interface RegistrationRecord {
  allotteeCode: string;
  allotteeName: string;
  approvalStatus: 'Approved' | 'Rejected' | 'Pending';
  remarks: string;
}

@Component({
  selector: 'app-deo-registration-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deo-registration-status.html',
  styleUrl: './deo-registration-status.scss',
})
export class DeoRegistrationStatus implements OnInit {

  searchText: string = '';
  selectedFilter: string = '';

  registrationList: RegistrationRecord[] = [
    {
      allotteeCode: 'ALL-2026-001',
      allotteeName: 'VIKAS KUMAR',
      approvalStatus: 'Approved',
      remarks: 'All documents verified and payment confirmed.'
    },
    {
      allotteeCode: 'ALL-2026-002',
      allotteeName: 'HARPREET SINGH',
      approvalStatus: 'Rejected',
      remarks: 'Invalid PAN card document uploaded.'
    },
    {
      allotteeCode: 'ALL-2026-003',
      allotteeName: 'RAJESH SHARMA',
      approvalStatus: 'Pending',
      remarks: 'Awaiting senior officer approval.'
    }
  ];

  filteredList: RegistrationRecord[] = [];

  ngOnInit(): void {
    this.filteredList = [...this.registrationList];
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredList = this.registrationList.filter(item => {
      const matchesSearch = 
        item.allotteeCode.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.allotteeName.toLowerCase().includes(this.searchText.toLowerCase());
      
      const matchesStatus = this.selectedFilter === '' || item.approvalStatus === this.selectedFilter;

      return matchesSearch && matchesStatus;
    });
  }

  onExpand(item: RegistrationRecord): void {
    console.log('Expand details for:', item);
  }

  onPrint(item: RegistrationRecord): void {
    console.log('Printing record:', item);
  }

  onView(item: RegistrationRecord): void {
    console.log('Viewing details for:', item);
  }
}