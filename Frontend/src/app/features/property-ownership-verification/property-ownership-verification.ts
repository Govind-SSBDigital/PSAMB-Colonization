import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    private service: Propertybidderregn,
    private cdr: ChangeDetectorRef
  ) { }

  isLoading = false;

  searchText = '';
  selectedStatus = 'All';
  selectedDistrict = 'All';
  selectedMandi = 'All';
  selectedMarketCommittee = 'All';

  districtList: string[] = [];
  mandiList: string[] = [];
  marketCommitteeList: string[] = [];

  propertyList: OwnershipPropertyModel[] = [];
  filteredPropertyList: OwnershipPropertyModel[] = [];
  pagedPropertyList: OwnershipPropertyModel[] = [];

  pageIndex = 0;
  pageSize = 10;

  ngOnInit(): void {
    this.loadProperties();
  }

  mapStatus(statusId: number | null | undefined): string {
    if (statusId === 7) return 'Objection';
    if (statusId === 2 || statusId === 3 || statusId === 4) return 'Verified';
    return 'Pending';
  }

  loadProperties(): void {
    // this.isLoading = true;
        this.cdr.detectChanges();
  }

  buildFilterOptions(): void {
    this.marketCommitteeList = Array.from(
      new Set(this.propertyList.map(p => p.branch).filter(b => !!b && b !== 'N/A'))
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

      const matchesDistrict =
        this.selectedDistrict === 'All' ||
        property.district === this.selectedDistrict;

      const matchesMandi =
        this.selectedMandi === 'All' ||
        property.mandiName === this.selectedMandi;

      const matchesMarketCommittee =
        this.selectedMarketCommittee === 'All' ||
        property.branch === this.selectedMarketCommittee;

      return matchesSearch && matchesStatus && matchesDistrict && matchesMandi && matchesMarketCommittee;
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
    this.router.navigate(['/user-verification-view'], {
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
