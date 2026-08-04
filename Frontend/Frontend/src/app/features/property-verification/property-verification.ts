import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

interface PropertyVerificationModel {
  id: number;
  propertyNo: string;
  ownerName: string;
  category: string;
  branch: string;
  district: string;
  village: string;
  status: string;
  registrationDate: string;
}

@Component({
  selector: 'app-property-verification',
  standalone: false,
  templateUrl: './property-verification.html',
  styleUrl: './property-verification.scss'
})
export class PropertyVerification implements OnInit {

  // Search & Filter Bindings
  searchText = '';
  selectedStatus = 'All';
  selectedBranch = 'All';

  // Dropdown Master Data
  statusList: string[] = ['All', 'Pending', 'Verified', 'Rejected'];
  branchList: string[] = ['All', 'Chandigarh', 'Mohali'];

  // Data Arrays
  propertyList: PropertyVerificationModel[] = [];
  filteredPropertyList: PropertyVerificationModel[] = [];
  pagedPropertyList: PropertyVerificationModel[] = [];

  pageIndex = 0;
  pageSize = 10;

  

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.propertyList = [
      {
        id: 1,
        propertyNo: 'PROP-1001',
        ownerName: 'Vikas Singh',
        category: 'Residential',
        branch: 'Chandigarh',
        district: 'Chandigarh',
        village: 'Sector 22',
        status: 'Pending',
        registrationDate: '15-Jul-2026'
      },
      {
        id: 2,
        propertyNo: 'PROP-1002',
        ownerName: 'Amit Kumar',
        category: 'Commercial',
        branch: 'Ludhiana',
        district: 'Ludhiana',
        village: 'Model Town',
        status: 'Verified',
        registrationDate: '16-Jul-2026'
      },
      {
        id: 3,
        propertyNo: 'PROP-1003',
        ownerName: 'Rahul Sharma',
        category: 'Industrial',
        branch: 'Mohali',
        district: 'Mohali',
        village: 'Phase 8',
        status: 'Rejected',
        registrationDate: '18-Jul-2026'
      }
    ];

    this.filteredPropertyList = [...this.propertyList];
    this.updatePagedList();
  }

  applyFilter(): void {
    this.pageIndex = 0;
    this.filteredPropertyList = this.propertyList.filter(property => {
      const matchesSearch =
        property.propertyNo.toLowerCase().includes(this.searchText.toLowerCase()) ||
        property.ownerName.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesStatus =
        this.selectedStatus === 'All' ||
        property.status === this.selectedStatus;

      const matchesBranch =
        this.selectedBranch === 'All' ||
        property.branch === this.selectedBranch;

      return matchesSearch && matchesStatus && matchesBranch;
    });

    this.updatePagedList();
  }

  updatePagedList(): void {
    const startIndex = this.pageIndex * this.pageSize;
    this.pagedPropertyList = this.filteredPropertyList.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updatePagedList();
  }

  get visibleRangeStart(): number {
    return this.filteredPropertyList.length === 0 ? 0 : (this.pageIndex * this.pageSize) + 1;
  }

  get visibleRangeEnd(): number {
    return Math.min((this.pageIndex + 1) * this.pageSize, this.filteredPropertyList.length);
  }

  getStatusCount(status: string): number {
    return this.propertyList.filter(property => property.status === status).length;
  }

  viewDetails(property: PropertyVerificationModel): void {
    console.log('Viewing Details:', property);
  }

  editProperty(property: PropertyVerificationModel): void {
    console.log('Editing Property:', property);
  }

  viewHistory(property: PropertyVerificationModel): void {
    console.log('Viewing Audit Trails:', property);
  }

  refreshData(): void {
    this.searchText = '';
    this.selectedStatus = 'All';
    this.selectedBranch = 'All';
    this.loadProperties();
  }

 // Add these three getters to your existing component class
// (e.g. VerificationQueueComponent). They power the stat pills
// in the new hero header — no other logic changes required.

get pendingCount(): number {
    return this.filteredPropertyList.filter(p => p.status === 'Pending').length;
}

get verifiedCount(): number {
    return this.filteredPropertyList.filter(p => p.status === 'Verified').length;
}

get rejectedCount(): number {
    return this.filteredPropertyList.filter(p => p.status === 'Rejected').length;
}
}