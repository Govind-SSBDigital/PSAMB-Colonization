import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { Propertybidderregn } from '../../core/service/Property-Bidder-RegnService/propertybidderregn';

interface RegistrationRecord {
  allotteeCode: string;
  allotteeName: string;
  approvalStatus: 'Approved' | 'Rejected' | 'Pending' | 'Objection';
  remarks: string;
}

@Component({
  selector: 'app-deo-registration-status',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule],
  templateUrl: './deo-registration-status.html',
  styleUrl: './deo-registration-status.scss',
})
export class DeoRegistrationStatus implements OnInit {

  searchText: string = '';
  selectedFilter: string = 'Pending';
  pageIndex = 0;
  pageSize = 10;
  pagedPropertyList: RegistrationRecord[] = [];
  registrationList: RegistrationRecord[] = [];
  filteredList: RegistrationRecord[] = [];

  constructor(
    private router: Router,
    private _service: Propertybidderregn,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getRegistrationList();
  }

  onSearch(): void {
    this.pageIndex = 0;
    this.applyFilters();
    this.updatePagedList();
    this.cdr.detectChanges();
  }

  getRegistrationList(): void {
    this._service.GetAllRegisterPropertyById().subscribe({
      next: (res: any) => {
        if (res?.data && Array.isArray(res.data)) {
          this.registrationList = res.data.map((item: any) => ({
            allotteeCode: item.allotteeCode,
            allotteeName: item.allotteeName,
            approvalStatus: item.applicationStatusName,
            remarks: item.remarks
          }));
        } else {
          this.registrationList = [];
        }

        this.applyFilters();
        this.updatePagedList();
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Error loading registration list:', err);
        this.registrationList = [];
        this.filteredList = [];
        this.pagedPropertyList = [];
        this.cdr.detectChanges();
      }
    });
  }

  onFilterChange(): void {
    this.pageIndex = 0;
    this.applyFilters();
    this.updatePagedList();
    this.cdr.detectChanges();
  }

  setStatusFilter(status: string): void {
    if (status === '') {
      this.selectedFilter = '';
    } else if (this.selectedFilter.trim().toLowerCase() === status.trim().toLowerCase()) {
      this.selectedFilter = '';
    } else {
      this.selectedFilter = status;
    }
    this.pageIndex = 0;
    this.applyFilters();
    this.updatePagedList();
    this.cdr.detectChanges();
  }

  private applyFilters(): void {
    const term = (this.searchText || '').trim().toLowerCase();
    const filterStatus = (this.selectedFilter || '').trim().toLowerCase();

    this.filteredList = this.registrationList.filter(item => {
      const matchesSearch =
        term === '' ||
        (item.allotteeCode || '').toLowerCase().includes(term) ||
        (item.allotteeName || '').toLowerCase().includes(term);

      const itemStatus = (item.approvalStatus || '').trim().toLowerCase();
      const matchesStatus = filterStatus === '' || itemStatus === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }

  getTotalCount(): number {
    return this.registrationList.length;
  }

  getApprovedCount(): number {
    return this.registrationList.filter(item => (item.approvalStatus || '').trim().toLowerCase() === 'approved').length;
  }

  getPendingCount(): number {
    return this.registrationList.filter(item => (item.approvalStatus || '').trim().toLowerCase() === 'pending').length;
  }

  getObjectionCount(): number {
    return this.registrationList.filter(item => (item.approvalStatus || '').trim().toLowerCase() === 'objection').length;
  }

  getStatusClass(status: string | null | undefined): string {
    const s = (status || '').toLowerCase().trim();
    if (s.includes('objection')) return 'status-objection';
    if (s.includes('reject')) return 'status-rejected';
    if (s.includes('verified') || s.includes('clerk')) return 'status-verified';
    if (s.includes('approved')) return 'status-approved';
    if (s.includes('pending')) return 'status-pending';
    return 'status-default';
  }

  onView(item: RegistrationRecord): void {
    this.router.navigate(['/property-bidder-registration'], {
      queryParams: {
        mode: 'view',
        propertyCode: item.allotteeCode
      }
    });
  }

  onEdit(item: RegistrationRecord): void {
    debugger
    this.router.navigate(['/property-bidder-registration'], {
      queryParams: {
        mode: 'edit',
        propertyCode: item.allotteeCode
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updatePagedList();
    this.cdr.detectChanges();
  }

  updatePagedList(): void {
    const startIndex = this.pageIndex * this.pageSize;
    this.pagedPropertyList = this.filteredList.slice(startIndex, startIndex + this.pageSize);
  }
}