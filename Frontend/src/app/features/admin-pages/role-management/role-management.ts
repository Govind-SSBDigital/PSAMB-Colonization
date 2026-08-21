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
  role: 'Admin' | 'Clerk' | 'Senior Assistant' | 'Deputy Director';
  status: 'Active' | 'Inactive';
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

  users: UserRow[] = [
    { hrmsCode: 'HR-1042', name: 'abc', email: 'abc@gmail.com', role: 'Clerk', status: 'Active' },
    { hrmsCode: 'HR-1043', name: 'def', email: 'def@gmail.com', role: 'Admin', status: 'Inactive' },
    { hrmsCode: 'HR-1044', name: 'ghi', email: 'ghi@gmail.com', role: 'Senior Assistant', status: 'Active' },
    { hrmsCode: 'HR-1045', name: 'jkl', email: 'jkl@gmail.com', role: 'Deputy Director', status: 'Active' },
  ];

  pageSize = 10;
  pageIndex = 0;
  totalRecords = this.users.length;

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
    // hook up to your add-user modal / route here
  }

  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }
}