import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Common } from '../../core/service/CommonService/common';
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
  private readonly defaultStateId = 1;

  constructor(
    private fb: FormBuilder,
    private service: Propertybidderregn,
    private commonService: Common,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef) {}

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
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error loading districts:', err)
    });
  }

  onDistrictChange(): void {
    const districtId = this.balanceForm.get('districtId')?.value;
    this.balanceForm.patchValue({
      branchId: '',
      mandiId: '',
      plotNo: '',
      plotTypeId: ''
    });
    this.marketCommittees = [];
    this.propertyTypes = [];
    this.mandis = [];
    this.plotNumbers = [];
    this.plotTypes = [];

    if (districtId) {
      this.service.getPropertyMandiBranchesByDistrict(districtId).subscribe({
        next: (res: any) => {
          this.marketCommittees = res?.data || res || [];
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Error loading market committees:', err)
      });
    }
  }

  onMarketCommitteeChange(): void {
    const branchId = this.balanceForm.get('branchId')?.value;
    this.balanceForm.patchValue({
      mandiId: '',
      plotTypeId: '',
      plotNo: ''
    });
    this.propertyTypes = [];
    this.mandis = [];
    this.plotNumbers = [];
    this.plotTypes = [];

    if (branchId) {
      this.service.getPropertyMandiBranchesByBranchId(branchId).subscribe({
        next: (res: any) => {
          this.mandis = res?.data || res || [];
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Error loading mandis:', err)
      });
    }
  }

  onMandiChange(): void {
    const mandiId = this.balanceForm.get('mandiId')?.value;
    this.balanceForm.patchValue({ plotNo: '', plotTypeId: '' });
    this.plotNumbers = [];
    this.plotTypes = [];

    if (mandiId) {
      this.service.getPropertyPlotTypesAsync(mandiId).subscribe({
        next: (res: any) => {
          this.plotTypes = res?.data || res || [];
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Error loading plot types:', err)
      });
    }
  }

  onPlotTypeChange(): void {
    const mandiId = this.balanceForm.get('mandiId')?.value;
    const plotTypeId = this.balanceForm.get('plotTypeId')?.value;

    this.balanceForm.patchValue({ plotNo: '' });
    this.plotNumbers = [];

    if (mandiId && plotTypeId) {
      this.loadPlotNumbers(mandiId, plotTypeId);
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

    this.service.getPropertyByCode(propertyCode).subscribe({
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
            this.cdr.detectChanges();
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
          this.service.getPropertyMandis(branchId).subscribe({
            next: (mres: any) => {
              this.mandis = mres?.data || mres || [];
              this.patchFormAndLoadDependents(districtId, branchId, plotTypeId, mandiId, d, onComplete);
              this.cdr.detectChanges();
            },
            error: (err: any) => {
              console.error('Error loading mandis:', err);
              onComplete?.();
            }
          });
        } else {
          this.patchFormDistrict(districtId);
          this.cdr.detectChanges();
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
        this.cdr.detectChanges();
        onComplete?.();
      },
      error: (err: any) => {
        console.error('Error loading plot types:', err);
        onComplete?.();
      }
    });
  }

  private loadPlotNumbers(mandiId: any, plotTypeId: any): void {
    this.service.getPlotsByPlotTypesAsync(mandiId, plotTypeId).subscribe({
      next: (res: any) => {
        this.plotNumbers = res?.data || res || [];
        this.cdr.detectChanges();
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

    const mandiId = this.balanceForm.get('mandiId')?.value;
    const plotTypeId = this.balanceForm.get('plotTypeId')?.value;
    const plotNo = this.balanceForm.get('plotNo')?.value;

    if (!mandiId || !plotTypeId || !plotNo) {
      this.toastr.warning('Please select mandi, plot type and plot number.', 'Validation');
      return;
    }

    this.isCalculating = true;
    this.balanceData = null;
    this.propertyDetails = null;
    this.showResults = false;

    this.service.getPropertyDetailsByMandiPlot(mandiId, plotTypeId, plotNo).subscribe({
      next: (res: any) => {
        const d = res?.data ?? res ?? null;
        const apiSuccess = res?.success !== false;
        const hasValidData = !!d && (
          (d.id && d.id > 0) ||
          (d.propertyId && d.propertyId > 0) ||
          !!d.propertyCode ||
          (d.plotNo !== null && d.plotNo !== undefined) ||
          !!d.bidderName ||
          !!d.plotSize
        );

        if (apiSuccess && hasValidData) {
          this.propertyDetails = d;
          this.balanceData = this.buildBalanceDataFromResponse(d);
          this.showResults = true;
          this.toastr.success('Property balance details loaded successfully.', 'Success');
        } else {
          this.balanceData = null;
          this.propertyDetails = null;
          this.showResults = false;
          this.toastr.warning('No data found for the selected mandi, plot type and plot number.', 'Not Found');
        }
        this.isCalculating = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.isCalculating = false;
        this.balanceData = null;
        this.propertyDetails = null;
        this.showResults = false;
        this.cdr.detectChanges();
        console.error('Error fetching property details by mandi plot:', err);
        this.toastr.warning('No data found for the selected mandi, plot type and plot number.', 'Error');
      }
    });
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

  private coerceNumber(value: any): number {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  }

  private buildBalanceDataFromResponse(d: any): PropertyBalanceResponse {
    if (!d) {
      return {
        propertyInfo: {
          allotteeCode: '',
          agencyName: '',
          mandiName: '',
          nameOfAllottee: '',
          plotNo: '',
          address: '',
          sizeOfPlot: '',
          plotType: '',
          allotmentDate: '',
          allotmentAmount: 0,
          auctionDate: ''
        },
        initialDeposits: [],
        dueInstallments: [],
        installmentReceipts: [],
        futureInstallments: [],
        otherAmounts: [],
        summary: {
          rebate: 0,
          totalPaymentReceivedTillDate: 0,
          totalBalanceFromSaleOfPlot: 0,
          interestOnLateInstallments: 0,
          penaltyOnLateInstallments: 0,
          totalRecoverableAmount: 0
        }
      };
    }

    const installments: any[] = Array.isArray(d.installments) ? d.installments : [];
    const sorted = [...installments].sort((a, b) =>
      new Date(a.receiptDate).getTime() - new Date(b.receiptDate).getTime()
    );

    const scheduleRows: any[] = Array.isArray(d.installmentSchedules)
      ? d.installmentSchedules
      : Array.isArray(d.installments)
        ? d.installments.filter((item: any) =>
            item && (
              item.installmentNo !== undefined ||
              item.installmentLabel !== undefined ||
              item.calculatedDueDate !== undefined ||
              item.dueDate !== undefined ||
              item.basePrincipal !== undefined ||
              item.dueAmount !== undefined ||
              item.interest !== undefined ||
              item.totalEstimatedAmount !== undefined ||
              item.totalDueAmount !== undefined
            )
          )
        : [];

    const dueInstallments = scheduleRows.map((item: any, index: number) => ({
      installmentNo: item.installmentNo ?? item.installmentLabel ?? `Installment ${index + 1}`,
      dueDate: this.formatDate(item.calculatedDueDate ?? item.dueDate ?? item.due_date),
      dueAmount: this.coerceNumber(item.basePrincipal ?? item.baseAmount ?? item.dueAmount ?? item.principalAmount ?? 0),
      interest: this.coerceNumber(item.interest ?? item.interestAmount ?? item.accumulatedInterest ?? 0),
      totalDueAmount: this.coerceNumber(
        item.totalEstimatedAmount ?? item.totalDueAmount ?? item.totalWithInterest ??
        (this.coerceNumber(item.basePrincipal ?? item.baseAmount ?? item.dueAmount ?? item.principalAmount ?? 0) +
          this.coerceNumber(item.interest ?? item.interestAmount ?? item.accumulatedInterest ?? 0))
      )
    }));

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
      dueInstallments,
      installmentReceipts,
      futureInstallments: Array.isArray(d.futureInstallments) ? d.futureInstallments : [],
      otherAmounts: Array.isArray(d.otherAmounts) ? d.otherAmounts : [],
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
  getTotal(rows: Array<Record<string, any>> | null | undefined, field: string): number {
    const safeRows = rows ?? [];
    return safeRows.reduce((sum, row) => sum + (Number(row?.[field]) || 0), 0);
  }

 getRateOfInterest(): number {
  const propertyDate =
    this.balanceData?.propertyInfo?.allotmentDate ||
    this.balanceData?.propertyInfo?.auctionDate ||
    '';

  if (!propertyDate) {
    return 0;
  }

  // Date format: DD-MM-YYYY
  const dateParts = propertyDate.split('-');

  if (dateParts.length !== 3) {
    return 0;
  }

  const year = Number(dateParts[2]);

  if (isNaN(year)) {
    return 0;
  }

  return year < 1972 ? 6 : 12;
}
}