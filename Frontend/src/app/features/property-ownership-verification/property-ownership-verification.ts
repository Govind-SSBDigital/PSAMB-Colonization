import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Userservice } from '../../core/service/UserService/userservice';
import { Propertybidderregn } from '../../core/service/Property-Bidder-RegnService/propertybidderregn';

interface OwnershipPropertyModel {
  id: number;
  propertyNo: string;
  ownerName: string;
  district: string;
  branch: string;
  mandiName: string;
  plotType: string;
  plotNumber: string;
  status: string;
  registrationDate: string;
  registrationData?: Record<string, unknown>;
}

@Component({
  selector: 'app-property-ownership-verification',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatPaginatorModule,
    MatTooltipModule,
  ],
  templateUrl: './property-ownership-verification.html',
  styleUrl: './property-ownership-verification.scss',
})
export class PropertyOwnershipVerification implements OnInit {

  constructor(
    private router: Router,
    private userService: Userservice,
    private service: Propertybidderregn,
    private cdr: ChangeDetectorRef
  ) { }

  isLoading = false;

  searchText = '';
  selectedStatus = 'All';
  selectedMarketCommittee = 'All';

  districtList: string[] = [];
  mandiList: string[] = [];
  marketCommitteeList: string[] = [];

  propertyList: OwnershipPropertyModel[] = [];
  filteredPropertyList: OwnershipPropertyModel[] = [];
  pagedPropertyList: OwnershipPropertyModel[] = [];

  pageIndex = 0;
  pageSize = 10;
  selectedBranch = 'All';
  selectedDistrict = 'All';
  selectedMandi = 'All';
  ngOnInit(): void {
    this.GetPropertyOwnerVerification();
  }

  getUserId(): string {
    try {
      const sessionStr = sessionStorage.getItem('cp_session') || localStorage.getItem('cp_session');
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        if (session?.userId) return String(session.userId);
        if (session?.id) return String(session.id);
        if (session?.applicantId) return String(session.applicantId);
      }
    } catch (e) {
      console.error('Error reading session data:', e);
    }

    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const uid = payload?.UserId || payload?.userId || payload?.id || payload?.ApplicantId || payload?.applicantId || payload?.sub;
        if (uid) return String(uid);
      }
    } catch (e) {
      console.error('Error decoding token:', e);
    }

    return '';
  }

  // mapStatus(statusId: number | null | undefined): string {
  //   if (statusId === 7) return 'Objection';
  //   if (statusId === 2 || statusId === 3 || statusId === 4) return 'Verified';
  //   return 'Pending';
  // }

  loadProperties(): void {
    this.GetPropertyOwnerVerification();
  }

  mapStatus(statusId: number | null | undefined, roleName: string | null | undefined
  ): string {
    // debugger
    const role = (roleName || '').trim().toLowerCase();

    // Objection
    if (statusId === 7) {
      return 'Objection';
    }
    if (role === 'senior assistant') {
      if (statusId === 2) {
        return 'Pending';
      }
      if (statusId === 3 || statusId === 4) {
        return 'Verified';
      }
      return 'Pending';
    }
    if (role === 'clerk') {
      if (statusId === 1) {
        return 'Pending';
      }

      if (statusId === 2 || statusId === 3 || statusId === 4) {
        return 'Verified';
      }
      return 'Pending';
    }

    if (statusId === 2 || statusId === 3 || statusId === 4) {
      return 'Verified';
    }
    return 'Pending';
  }
  GetPropertyOwnerVerification(searchCode?: string) {

    const roleName = this.getUserRole();
    this.userService.GetPropertyOwnerVerification(searchCode).subscribe({
      next: (res: any) => {
        const rawData = res.data || res || [];
        this.propertyList = rawData.map((d: any) => ({
          id: d.id,
          propertyNo: d.propertyCode || `PROP-${d.id}`,
          ownerName: d.currentOwnerName || 'N/A',
          branch: d.branchName || 'N/A',
          district: d.districtName || 'N/A',
          mandiName: d.mandiName || 'N/A',
          status: this.mapStatus(d.applicationStatusId, roleName),
          registrationDate: d.createdDate ? d.createdDate : new Date().toISOString(),
          label: d.label || 'User',
          plotNumber: d.plotNo,
          plotType: d.plotType,
          applicationStatusId: d.applicationStatusId,
          roleName: roleName,
          registrationData: d,
        }));
        this.buildFilterOptions();
        this.applyFilter();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error fetching property types:', err);
      }
    });
  }
  getUserRole(): string {
    try {
      // debugger
      const cpMenus = sessionStorage.getItem('cp_menus');

      if (!cpMenus) {
        return '';
      }

      const user = JSON.parse(cpMenus);
      return user?.profile?.roles?.[0] || '';

    } catch (error) {
      console.error('Error getting user role:', error);
      return '';
    }
  }
  buildFilterOptions(): void {
    this.marketCommitteeList = Array.from(
      new Set(this.propertyList.map(p => p.branch).filter(branch => !!branch && branch !== 'N/A'))
    ).sort();

    this.districtList = Array.from(
      new Set(this.propertyList.map(p => p.district).filter(d => !!d && d !== 'N/A'))
    ).sort();

    this.refreshMandiOptions();
  }

  refreshMandiOptions(): void {
    const source = this.selectedDistrict === 'All'
      ? this.propertyList
      : this.propertyList.filter(p => p.district === this.selectedDistrict);

    this.mandiList = Array.from(
      new Set(source.map(p => p.mandiName).filter(m => !!m && m !== 'N/A'))
    ).sort();

    // If the previously selected mandi no longer belongs to this district, reset it
    if (this.selectedMandi !== 'All' && !this.mandiList.includes(this.selectedMandi)) {
      this.selectedMandi = 'All';
    }
  }

  onDistrictChange(): void {
    this.refreshMandiOptions();
    this.applyFilter();
  }
  onMarketCommitteeChange(): void {
    this.applyFilter();
  }

  clearDistrict(event: Event): void {
    event.stopPropagation();
    this.selectedDistrict = 'All';
    this.onDistrictChange();
  }

  clearMandi(event: Event): void {
    event.stopPropagation();
    this.selectedMandi = 'All';
    this.applyFilter();
  }

  clearMarketCommittee(event: Event): void {
    event.stopPropagation();
    this.selectedMarketCommittee = 'All';
    this.onMarketCommitteeChange();
  }

  applyFilter(): void {
    this.pageIndex = 0;
    this.filteredPropertyList = this.propertyList.filter(property => {
      const matchesSearch =
        property.propertyNo.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesStatus =
        this.selectedStatus === 'All' ||
        property.status === this.selectedStatus;

      const matchesBranch =
        this.selectedBranch === 'All' ||
        property.branch === this.selectedBranch;

      const matchesDistrict =
        this.selectedDistrict === 'All' ||
        property.district === this.selectedDistrict;

      const matchesMandi =
        this.selectedMandi === 'All' ||
        property.mandiName === this.selectedMandi;

      const matchesMarketCommittee =
        this.selectedMarketCommittee === 'All' ||
        property.branch === this.selectedMarketCommittee;

      return matchesSearch && matchesStatus && matchesBranch && matchesDistrict && matchesMandi && matchesMarketCommittee;
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

  viewDetails(property: OwnershipPropertyModel): void {
    // const encryptedId = btoa(property.id.toString());
    this.router.navigate(['/user-verification'], {
      // queryParams: { id: encryptedId },
      // state: { registrationData: property.registrationData },
    });
  }

  OpenTotalRegistration(): void {
    this.selectedStatus = 'All';
    this.applyFilter();
  }

  OpenPendingRegistration(): void {
    this.selectedStatus = 'Pending';
    this.applyFilter();
  }

  OpenVerifiedRegistration(): void {
    this.selectedStatus = 'Verified';
    this.applyFilter();
  }

  OpenRejectedRegistration(): void {
    this.selectedStatus = 'Objection';
    this.applyFilter();
  }

  get pendingCount(): number {
    return this.propertyList.filter(p => p.status === 'Pending').length;
  }

  get verifiedCount(): number {
    return this.propertyList.filter(p => p.status === 'Verified').length;
  }

  get objectionCount(): number {
    return this.propertyList.filter(p => p.status === 'Objection').length;
  }
}
