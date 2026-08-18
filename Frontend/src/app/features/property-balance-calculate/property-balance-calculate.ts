import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PropertyBalanceFilter, PropertyBalanceResponse } from '../../models/property-balance-calculatation.model';

@Component({
  selector: 'app-property-balance-calculate',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './property-balance-calculate.html',
  styleUrl: './property-balance-calculate.scss',
})
export class PropertyBalanceCalculate implements OnInit {

  balanceForm!: FormGroup;

  districts: string[] = ['District A', 'District B', 'District C'];
  marketCommittees: string[] = ['Market Committee 1', 'Market Committee 2', 'Market Committee 3'];
  propertyTypes: string[] = ['Residential', 'Commercial', 'Industrial'];
  mandiCategories: string[] = ['Category A', 'Category B', 'Category C'];
  mandis: string[] = ['Mandi 1', 'Mandi 2', 'Mandi 3'];
  plotNumbers: string[] = ['Plot 101', 'Plot 102', 'Plot 103'];
  installmentPenaltyOptions: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  isSearching = false;
  isCalculating = false;

  showResults = false;
  balanceData: PropertyBalanceResponse | null = null;

  // Cutoff date used for the penalty note shown under the Calculate button.
  readonly penaltyNoticeDate = '26/10/2016';

  constructor(
    private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadMasterData();
  }

  private buildForm(): void {
    this.balanceForm = this.fb.group({
      allotteeCode: [''],
      district: ['', Validators.required],
      marketCommittee: ['', Validators.required],
      propertyType: ['', Validators.required],
      mandiCategory: ['', Validators.required],
      mandi: ['', Validators.required],
      plotNumber: ['', Validators.required],
      dispatched: [false],
      installmentPenalty: [3, Validators.required],
      balanceDate: [this.getToday(), Validators.required]
    });
  }

  private loadMasterData(): void {
  }

  private getToday(): string {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  }

  get f() {
    return this.balanceForm.controls;
  }

  isInvalid(controlName: string): boolean {
    const control = this.balanceForm.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  // onDistrictChange(): void {
  //   const district = this.balanceForm.get('district')?.value;
  //   this.balanceForm.patchValue({ marketCommittee: '', mandi: '', plotNumber: '' });
  //   this.mandis = [];
  //   this.plotNumbers = [];
  //   if (district) {
  //   } else {
  //     this.marketCommittees = [];
  //   }
  // }

  // onMarketCommitteeChange(): void {
  //   const marketCommittee = this.balanceForm.get('marketCommittee')?.value;
  //   this.balanceForm.patchValue({ mandi: '', plotNumber: '' });
  //   this.plotNumbers = [];
  //   if (marketCommittee) {
  //   } else {
  //     this.mandis = [];
  //   }
  // }

  // onMandiChange(): void {
  //   const mandi = this.balanceForm.get('mandi')?.value;
  //   this.balanceForm.patchValue({ plotNumber: '' });
  //   if (mandi) {
  //   } else {
  //     this.plotNumbers = [];
  //   }
  // }

  onSearch(): void {
    const allotteeCode = this.balanceForm.get('allotteeCode')?.value?.trim();
    if (!allotteeCode) {
      return;
    }

    this.isSearching = true;

    setTimeout(() => {
      this.isSearching = false;
    }, 300);
  }

  onCalculateBalance(): void {
    this.showResults = false;

    if (this.balanceForm.invalid) {
      this.balanceForm.markAllAsTouched();
      return;
    }

    this.isCalculating = true;
    const filter = this.balanceForm.value as PropertyBalanceFilter;

    setTimeout(() => {
      this.balanceData = this.buildMockBalanceData(filter);
      this.showResults = true;
      this.isCalculating = false;
    }, 300);
  }

  private buildMockBalanceData(filter: PropertyBalanceFilter): PropertyBalanceResponse {
    return {
      propertyInfo: {
        allotteeCode: filter.allotteeCode || 'LSS9-50880',
        agencyName: 'Mandi Board After 26-Oct-2016',
        mandiName: filter.mandi || ' GRAIN MARKET',
        nameOfAllottee: '1. abc',
        plotNo: filter.plotNumber || '9',
        address: 'fgfg',
        sizeOfPlot: '20 x 80',
        plotType: filter.propertyType || 'SCF',
        allotmentDate: '10-08-2026',
        allotmentAmount: 1370000,
        auctionDate: '24-12-2024'
      },
      initialDeposits: [
        {
          receiptNo: '6383',
          receiptDate: '13-01-2025',
          draftChequeRtgsNo: '',
          draftChequeRtgsDate: '13-01-2025',
          paymentMode: '(ICICI Bank)',
          bank: 'Other',
          amount: 50000
        },
        {
          receiptNo: '6429',
          receiptDate: '17-01-2025',
          draftChequeRtgsNo: '257576072',
          draftChequeRtgsDate: '17-01-2025',
          paymentMode: 'Online',
          bank: 'Other',
          amount: 292500
        }
      ],
      dueInstallments: [
        { installmentNo: '1st', dueDate: '10-02-2027', dueAmount: 250, interest: 650, totalDueAmount: 200 },
        { installmentNo: '2nd', dueDate: '10-08-2027', dueAmount: 1750, interest: 515, totalDueAmount: 625 },
        { installmentNo: '3rd', dueDate: '10-02-2028', dueAmount: 150, interest: 410, totalDueAmount: 350 },
        { installmentNo: '4th', dueDate: '10-08-2028', dueAmount: 170, interest: 305, totalDueAmount: 275 },
        { installmentNo: '5th', dueDate: '10-02-2029', dueAmount: 1250, interest: 2550, totalDueAmount: 800 },
        { installmentNo: '6th', dueDate: '10-08-2029', dueAmount: 1750, interest: 175, totalDueAmount: 525 }
      ],
      installmentReceipts: [],
      futureInstallments: [],
      otherAmounts: [
        {
          paymentType: 'E-Auction Processing Fees',
          receiptNo: '6365',
          receiptDate: '13-01-2025',
          draftNo: '',
          draftRtgsDate: '13-01-2025',
          paymentMode: 'E-Tendering (ICICI Bank)',
          draftRtgsBank: 'Other',
          draftAmount: 2360
        }
      ],
      summary: {
        rebate: 0,
        totalPaymentReceivedTillDate: 342500,
        totalBalanceFromSaleOfPlot: 1027500,
        interestOnLateInstallments: 0,
        penaltyOnLateInstallments: 0,
        totalRecoverableAmount: 1027
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