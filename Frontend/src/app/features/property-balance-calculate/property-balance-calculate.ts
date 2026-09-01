import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Propertybidderregn } from '../../core/service/Property-Bidder-RegnService/propertybidderregn';
import { PropertyBalanceResponse } from '../../models/property-balance-calculatation.model';

@Component({
  selector: 'app-property-balance-calculate',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './property-balance-calculate.html',
  styleUrl: './property-balance-calculate.scss',
})
export class PropertyBalanceCalculate implements OnInit {

  balanceForm!: FormGroup;

  districts: any[] = [];
  marketCommittees: any[] = [];
  propertyTypes: any[] = [];
  mandis: any[] = [];
  plotNumbers: any[] = [];
  plotTypes: any[] = [];

  isSearching = false;
  isCalculating = false;

  showResults = false;
  balanceData: PropertyBalanceResponse | null = null;
  propertyDetails: any = null;

  constructor(
    private fb: FormBuilder,
    private service: Propertybidderregn,
    private toastr: ToastrService) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadMasterData();
  }

  private buildForm(): void {
    this.balanceForm = this.fb.group({
      allotteeCode: [''],
      districtId: ['', Validators.required],
      branchId: ['', Validators.required],
      plotTypeId: ['', Validators.required],
      mandiId: ['', Validators.required],
      plotNo: ['', Validators.required]
    });
  }

  private loadMasterData(): void {
    this.service.getPropertyDistricts().subscribe({
      next: (res: any) => {
        this.districts = res?.data || res || [];
      },
      error: (err: any) => console.error('Error loading districts:', err)
    });
  }

  onDistrictChange(): void {
    const districtId = this.balanceForm.get('districtId')?.value;
    this.balanceForm.patchValue({
      branchId: '',
      mandiId: '',
      plotNo: ''
    });
    this.marketCommittees = [];
    this.propertyTypes = [];
    this.mandis = [];
    this.plotNumbers = [];

    if (districtId) {
      this.service.getPropertyBranches(districtId).subscribe({
        next: (res: any) => {
          this.marketCommittees = res?.data || res || [];
        },
        error: (err: any) => console.error('Error loading market committees:', err)
      });
    }
  }

  onMarketCommitteeChange(): void {
    const branchId = this.balanceForm.get('branchId')?.value;
    this.balanceForm.patchValue({
      mandiId: '',
      plotNo: ''
    });
    this.propertyTypes = [];
    this.mandis = [];
    this.plotNumbers = [];

    if (branchId) {
      this.loadPropertyCategories(branchId);
    }
  }

  private loadPropertyCategories(branchId: any): void {
    this.service.getPropertyDistricts().subscribe({
      next: (res: any) => {
        const all = res?.data || res || [];
        const filtered = all.filter((p: any) =>
          !branchId || String(p.branchId ?? p.marketCommitteeId ?? '') === String(branchId) || String(p.parentId ?? '') === String(branchId)
        );
        this.propertyTypes = filtered;
      },
      error: (err: any) => console.error('Error loading categories:', err)
    });
  }

  onMandiChange(): void {
    const mandiId = this.balanceForm.get('mandiId')?.value;
    this.balanceForm.patchValue({ plotNo: '' });
    this.plotNumbers = [];

    if (mandiId) {
      this.service.getPropertyPlotTypes(mandiId).subscribe({
        next: (res: any) => {
          this.plotTypes = res?.data || res || [];
        },
        error: (err: any) => console.error('Error loading plot types:', err)
      });
    }
  }

  get f() {
    return this.balanceForm.controls;
  }

  isInvalid(controlName: string): boolean {
    const control = this.balanceForm.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  onSearch(): void {
    const allotteeCodeControl = this.balanceForm.get('allotteeCode');
    const propertyCode = (allotteeCodeControl?.value || '').toString().trim();

    if (!propertyCode) {
      allotteeCodeControl?.markAsTouched();
      this.toastr.warning('Please enter an Allottee Code to search.', 'Validation');
      return;
    }

    this.isSearching = true;
    this.showResults = false;
    this.balanceData = null;
    this.propertyDetails = null;

    this.service.GetPropertyEAuctionDetailsByPropertyCodeAsync(propertyCode).subscribe({
      next: (res: any) => {
        this.isSearching = false;
        const d = res?.data;
        const hasValidData =
          !!res?.success && !!d && (
            (d.id && d.id > 0) ||
            (d.propertyId && d.propertyId > 0) ||
            !!d.propertyCode ||
            d.plotNo !== null && d.plotNo !== undefined ||
            !!d.bidderName
          );

        if (hasValidData) {
          this.propertyDetails = d;
          this.bindPropertyDetails(d, () => {
            this.balanceData = this.buildBalanceDataFromResponse(d);
            this.showResults = true;
          });
          this.toastr.success('Property details loaded successfully.', 'Success');
        } else {
          this.toastr.warning('No records found related to this Allottee Code', 'Not Found');
        }
      },
      error: (err: any) => {
        this.isSearching = false;
        console.error('Error fetching property details by code:', err);
        this.toastr.warning('No records found related to this Allottee Code', 'Error');
      }
    });
  }

  private bindPropertyDetails(d: any, onComplete?: () => void): void {
    const districtId = d.districtId;
    const branchId = d.branchId;
    const plotTypeId = d.plotTypeId;
    const mandiId = d.mandiId;

    if (!districtId) {
      onComplete?.();
      return;
    }

    this.service.getPropertyBranches(districtId).subscribe({
      next: (res: any) => {
        this.marketCommittees = res?.data || res || [];
        if (branchId) {
          this.loadPropertyCategories(branchId);
          this.service.getPropertyMandis(branchId).subscribe({
            next: (mres: any) => {
              this.mandis = mres?.data || mres || [];
              this.patchFormAndLoadDependents(districtId, branchId, plotTypeId, mandiId, d, onComplete);
            },
            error: (err: any) => {
              console.error('Error loading mandis:', err);
              onComplete?.();
            }
          });
        } else {
          this.patchFormDistrict(districtId);
          onComplete?.();
        }
      },
      error: (err: any) => {
        console.error('Error loading market committees:', err);
        onComplete?.();
      }
    });
  }

  private patchFormDistrict(districtId: any): void {
    this.balanceForm.patchValue({ districtId: districtId ?? '' });
  }

  private patchFormAndLoadDependents(
    districtId: any,
    branchId: any,
    plotTypeId: any,
    mandiId: any,
    d: any,
    onComplete?: () => void
  ): void {
    this.balanceForm.patchValue({
      districtId: districtId ?? '',
      branchId: branchId ?? ''
    });

    if (!mandiId) {
      this.balanceForm.patchValue({
        mandiId: '',
        plotTypeId: '',
        plotNo: ''
      });
      onComplete?.();
      return;
    }

    this.service.getPropertyPlotTypes(mandiId).subscribe({
      next: (res: any) => {
        this.plotTypes = res?.data || res || [];
        this.balanceForm.patchValue({
          mandiId: mandiId ?? '',
          plotTypeId: plotTypeId ?? '',
          plotNo: d.plotNo ?? ''
        });
        this.loadPlotNumbers(mandiId, plotTypeId);
        onComplete?.();
      },
      error: (err: any) => {
        console.error('Error loading plot types:', err);
        onComplete?.();
      }
    });
  }

  private loadPlotNumbers(mandiId: any, plotTypeId: any): void {
    this.service.getAuctionedPlots(mandiId, plotTypeId).subscribe({
      next: (res: any) => {
        this.plotNumbers = res?.data || res || [];
      },
      error: (err: any) => console.error('Error loading plots:', err)
    });
  }

  onCalculateBalance(): void {
    this.showResults = false;

    if (this.balanceForm.invalid) {
      this.balanceForm.markAllAsTouched();
      return;
    }

    this.isCalculating = true;
    this.balanceData = this.buildBalanceDataFromResponse(this.propertyDetails);
    this.showResults = true;
    this.isCalculating = false;
  }

  private formatDate(value: any): string {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d.getTime())) return String(value);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  }

  private buildBalanceDataFromResponse(d: any): PropertyBalanceResponse {
    const installments: any[] = Array.isArray(d.installments) ? d.installments : [];
    const sorted = [...installments].sort((a, b) =>
      new Date(a.receiptDate).getTime() - new Date(b.receiptDate).getTime()
    );

    const plotTypeObj = this.plotTypes.find((t: any) =>
      String(t.plotTypeId ?? t.id) === String(d.plotTypeId)
    );
    const plotTypeName = plotTypeObj
      ? (plotTypeObj.plotType ?? plotTypeObj.plotTypeName ?? plotTypeObj.name ?? '')
      : (d.plotType ?? d.plotTypeName ?? '');

    const initialDeposit = sorted[0]
      ? {
          receiptNo: sorted[0].receiptNo ?? '',
          receiptDate: this.formatDate(sorted[0].receiptDate),
          draftChequeRtgsNo: sorted[0].draftNo ?? '',
          draftChequeRtgsDate: this.formatDate(sorted[0].draftDate),
          paymentMode: sorted[0].paymentMode ?? '-',
          bank: sorted[0].draftBank ?? '-',
          amount: Number(sorted[0].draftAmount) || 0
        }
      : null;

    const installmentReceipts = sorted.slice(1).map((r: any) => ({
      receiptNo: r.receiptNo ?? '',
      receiptDate: this.formatDate(r.receiptDate),
      draftNo: r.draftNo ?? '',
      draftRtgsDate: this.formatDate(r.draftDate),
      paymentMode: r.paymentMode ?? '-',
      draftRtgsBank: r.draftBank ?? '-',
      draftAmount: Number(r.draftAmount) || 0
    }));

    const totalReceived = sorted.reduce(
      (sum, r) => sum + (Number(r.draftAmount) || 0),
      0
    );
    const finalBidPrice = Number(d.finalBidPrice) || 0;
    const totalBalance = Math.max(finalBidPrice - totalReceived, 0);

    return {
      propertyInfo: {
        allotteeCode: d.propertyCode ?? '',
        agencyName: 'Mandi Board',
        mandiName: d.mandiName ?? '',
        nameOfAllottee: d.bidderName ?? '',
        plotNo: d.plotNo != null ? String(d.plotNo) : '',
        address: d.address ?? '',
        sizeOfPlot: d.plotSize ?? '',
        plotType: plotTypeName,
        allotmentDate: this.formatDate(d.allotmentDate),
        allotmentAmount: Number(d.allotmentAmount) || 0,
        auctionDate: this.formatDate(d.auctionDate)
      },
      initialDeposits: initialDeposit ? [initialDeposit] : [],
      dueInstallments: [],
      installmentReceipts,
      futureInstallments: [],
      otherAmounts: [],
      summary: {
        rebate: 0,
        totalPaymentReceivedTillDate: totalReceived,
        totalBalanceFromSaleOfPlot: totalBalance,
        interestOnLateInstallments: 0,
        penaltyOnLateInstallments: 0,
        totalRecoverableAmount: totalBalance
      }
    };
  }

  printReport(): void {
    window.print();
  }

  // Sums a numeric field across a list of row objects for table footer totals.
  getTotal<T extends Record<string, unknown>>(rows: T[], field: keyof T): number {
    return rows.reduce((sum, row) => sum + (Number(row[field]) || 0), 0);
  }
}