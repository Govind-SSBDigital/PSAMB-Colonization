import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Propertybidderregn } from '../../core/service/Property-Bidder-RegnService/propertybidderregn';

interface PropertyVerificationModel {
  id: number;
  propertyNo: string;
  ownerName: string;
  category: string;
  branch: string;
  district: string;
  mandiName: string;
  status: string;
  registrationDate: string;
  label: 'User' | 'DEO';
  firstName?: string;
  applicationStatusId?: number;
}

@Component({
  selector: 'app-property-verification',
  standalone: false,
  templateUrl: './property-verification.html',
  styleUrl: './property-verification.scss'
})
export class PropertyVerification implements OnInit {

  constructor(private router: Router, private service: Propertybidderregn, private cdr: ChangeDetectorRef) { }

  searchText = '';
  selectedStatus = 'All';
  selectedBranch = 'All';

  statusList: string[] = ['All', 'Pending', 'Verified', 'Rejected'];
  branchList: string[] = ['All', 'Chandigarh', 'Mohali'];

  propertyList: PropertyVerificationModel[] = [];
  filteredPropertyList: PropertyVerificationModel[] = [];
  pagedPropertyList: PropertyVerificationModel[] = [];

  pageIndex = 0;
  pageSize = 10;



  ngOnInit(): void {
    this.GetPendingForClerk();
  }

  mapStatus(statusId: number | null | undefined): string {
    if (statusId === 2) return 'Verified';
    if (statusId === 3 || statusId === 7) return 'Rejected';
    return 'Pending';
  }

  GetPendingForClerk() {
    this.service.GetPendingForClerk().subscribe({
      next: (res: any) => {
        // console.log('API prop Types:', res);
        const rawData = res.data || res || [];
        this.propertyList = rawData.map((d: any) => ({
          id: d.id,
          propertyNo: d.propertyCode || `PROP-${d.id}`,
          ownerName: d.bidderName || 'N/A',
          category: d.categoryName || 'N/A',
          branch: d.branchName || 'N/A',
          district: d.districtName || 'N/A',
          mandiName: d.mandiName || 'N/A',
          status: this.mapStatus(d.applicationStatusId),
          registrationDate: d.createdDate ? d.createdDate : new Date().toISOString(),
          label: d.label || 'User',
          firstName: d.firstName,
          applicationStatusId: d.applicationStatusId
        }));
        this.filteredPropertyList = [...this.propertyList];
        this.updatePagedList();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error fetching property types:', err);
      }
    });
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
    const targetRoute = property.label === 'DEO' ? '/deo-verification' : '/verification-view';
    const encryptedId = btoa(property.id.toString());
    this.router.navigate([targetRoute], { queryParams: { id: encryptedId } });
  }

  editProperty(property: PropertyVerificationModel): void {
    // console.log('Editing Property:', property);
  }

  viewHistory(property: PropertyVerificationModel): void {
    // console.log('Viewing Audit Trails:', property);
  }

  refreshData(): void {
    this.searchText = '';
    this.selectedStatus = 'All';
    this.selectedBranch = 'All';
    this.GetPendingForClerk();
  }

  OpenTotalRegistration() {
    this.selectedStatus = 'All';
    this.applyFilter();
  }
  OpenPendingRegistration() {
    this.selectedStatus = 'Pending';
    this.applyFilter();
  }
  OpenVerifiedRegistration() {
    this.selectedStatus = 'Verified';
    this.applyFilter();
  }
  OpenRejectedRegistration() {
    this.selectedStatus = 'Rejected';
    this.applyFilter();
  }


  get pendingCount(): number {
    return this.propertyList.filter(p => p.status === 'Pending').length;
  }

  get verifiedCount(): number {
    return this.propertyList.filter(p => p.status === 'Verified').length;
  }

  get rejectedCount(): number {
    return this.propertyList.filter(p => p.status === 'Rejected').length;
  }
}