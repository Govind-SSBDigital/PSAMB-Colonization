import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

interface UserRow {
  hrmsCode: string;
  name: string;
  email: string;
  // role: 'Admin' | 'Clerk' | 'Senior Assistant' | 'Deputy Director';
  role: string;
  status: 'Active' | 'Inactive';
  district: string;
  marketCommittee: string;
  mandi: string;
}

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './role-management.html',
  styleUrl: './role-management.scss',
})
export class RoleManagement {
  showFilters = false;

  searchTerm = '';
  selectedDistrict = 'All';
  selectedMarketCommittee = 'All';
  selectedMandi = 'All';

  districtList: string[] = ['Ludhiana', 'Amritsar', 'Patiala', 'Jalandhar'];
  marketCommitteeList: string[] = ['MC-1', 'MC-2', 'MC-3'];
  mandiList: string[] = ['Mandi A', 'Mandi B', 'Mandi C'];
  roleList: string[] = ['Admin', 'Clerk', 'Senior Assistant', 'Deputy Director'];

  users: UserRow[] = [
    { hrmsCode: 'HR-1042', name: 'abc', email: 'abc@gmail.com', role: 'Clerk', status: 'Active', district: 'Ludhiana', marketCommittee: 'MC-1', mandi: 'Mandi A' },
    { hrmsCode: 'HR-1043', name: 'def', email: 'def@gmail.com', role: 'Admin', status: 'Inactive', district: 'Amritsar', marketCommittee: 'MC-2', mandi: 'Mandi B' },
    { hrmsCode: 'HR-1044', name: 'ghi', email: 'ghi@gmail.com', role: 'Senior Assistant', status: 'Active', district: 'Patiala', marketCommittee: 'MC-3', mandi: 'Mandi C' },
    { hrmsCode: 'HR-1045', name: 'jkl', email: 'jkl@gmail.com', role: 'Deputy Director', status: 'Active', district: 'Jalandhar', marketCommittee: 'MC-1', mandi: 'Mandi A' },
  ];

  pageSize = 10;
  pageIndex = 0;
  totalRecords = this.users.length;

  showViewModal = false;
  selectedUser: UserRow | null = null;

  viewForm = {
    district: '',
    marketCommittee: '',
    mandi: '',
    role: '',
  };

  private viewFormSnapshot = {
    district: '',
    marketCommittee: '',
    mandi: '',
    role: '',
  };

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedDistrict = 'All';
    this.selectedMarketCommittee = 'All';
    this.selectedMandi = 'All';
  }

  addNewUser(): void {
  }

  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }

  openViewDetails(user: UserRow): void {
    this.selectedUser = user;
    this.viewForm = {
      district: user.district,
      marketCommittee: user.marketCommittee,
      mandi: user.mandi,
      role: user.role,
    };
    this.viewFormSnapshot = { ...this.viewForm };
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedUser = null;
  }

  get isViewFormDirty(): boolean {
    return (
      this.viewForm.district !== this.viewFormSnapshot.district ||
      this.viewForm.marketCommittee !== this.viewFormSnapshot.marketCommittee ||
      this.viewForm.mandi !== this.viewFormSnapshot.mandi ||
      this.viewForm.role !== this.viewFormSnapshot.role
    );
  }

  onViewModalPrimaryAction(): void {
    if (this.isViewFormDirty && this.selectedUser) {
      this.selectedUser.district = this.viewForm.district;
      this.selectedUser.marketCommittee = this.viewForm.marketCommittee;
      this.selectedUser.mandi = this.viewForm.mandi;
      this.selectedUser.role = this.viewForm.role;
    }
    this.closeViewModal();
  }
}