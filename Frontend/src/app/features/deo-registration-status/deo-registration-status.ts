import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
interface RegistrationRecord {
  allotteeCode: string;
  allotteeName: string;
  approvalStatus: 'Approved' | 'Rejected' | 'Pending' | 'Objection';
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
    },
    {
      allotteeCode: 'ALL-2026-004',
      allotteeName: 'SURESH KUMAR',
      approvalStatus: 'Objection',
      remarks: 'Documents returned for clarification.'
    }
  ];

  filteredList: RegistrationRecord[] = [];

  constructor(private router: Router) {}

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

  getApprovedCount(): number {
    return this.filteredList.filter(item => item.approvalStatus === 'Approved').length;
  }

  getPendingCount(): number {
    return this.filteredList.filter(item => item.approvalStatus === 'Pending').length;
  }

  getObjectionCount(): number {
    return this.filteredList.filter(item => item.approvalStatus === 'Objection').length;
  }

  onView(item: RegistrationRecord): void {
    this.router.navigate(['/dashboard/property-bidder-registration'], {
      queryParams: {
        mode: 'view',
        propertyCode: item.allotteeCode
      }
    });
  }

  onEdit(item: RegistrationRecord): void {
    this.router.navigate(['/dashboard/property-bidder-registration'], {
      queryParams: {
        mode: 'edit',
        propertyCode: item.allotteeCode
      }
    });
  }
}