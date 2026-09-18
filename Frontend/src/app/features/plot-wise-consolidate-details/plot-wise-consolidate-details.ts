import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Subject, takeUntil } from 'rxjs';

export interface PlotSummaryRow {
  plotType: string;
  plotSize: string;
  totalPlots: number;
  allPlots: number;
  soldPlots: number;
  unsoldPlots: number;
}

export interface MandiOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-plot-wise-consolidate-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatPaginatorModule],
  templateUrl: './plot-wise-consolidate-details.html',
  styleUrl: './plot-wise-consolidate-details.scss',
})
export class PlotWiseConsolidateDetails implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();


  mandiOptions: MandiOption[] = [
    { value: 'mandi1', label: 'Mandi 1 - Ludhiana' },
    { value: 'mandi2', label: 'Mandi 2 - Khanna' },
    { value: 'mandi3', label: 'Mandi 3 - Jagraon' },
  ];

  allRows: PlotSummaryRow[] = [];

  pagedRows: PlotSummaryRow[] = [];

  loading = false;
  searched = false;
  errorMessage = '';

  pageIndex = 0;
  pageSize = 10;

  filterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      mandi: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.filterForm
      .get('mandi')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((mandi: string) => {
        if (mandi) {
          this.fetchMandiSummary(mandi);
        } else {
          this.resetResults();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get mandiControl() {
    return this.filterForm.get('mandi');
  }

  get selectedMandiLabel(): string {
    const value = this.mandiControl?.value;
    return this.mandiOptions.find((m) => m.value === value)?.label ?? '';
  }

  private fetchMandiSummary(mandi: string): void {
    this.loading = true;
    this.searched = true;
    this.errorMessage = '';
    this.pageIndex = 0;

    setTimeout(() => {
      this.allRows = this.getMockData(mandi);
      this.updatePagedRows();
      this.loading = false;
    }, 500);
  }

  private resetResults(): void {
    this.allRows = [];
    this.pagedRows = [];
    this.searched = false;
    this.loading = false;
    this.pageIndex = 0;
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedRows();
  }

  private updatePagedRows(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pagedRows = this.allRows.slice(start, end);
  }

  rowNumber(indexInPage: number): number {
    return this.pageIndex * this.pageSize + indexInPage + 1;
  }

  onClear(): void {
    this.filterForm.reset({ mandi: '' });
  }

  exportToExcel(): void {
    console.log('Exporting to Excel for mandi:', this.mandiControl?.value, this.allRows);
  }

  printTable(): void {
    window.print();
  }

  private getMockData(mandi: string): PlotSummaryRow[] {
    const base: PlotSummaryRow[] = [
      { plotType: 'Residential', plotSize: '100 sq. yd.', totalPlots: 120, allPlots: 120, soldPlots: 95, unsoldPlots: 25 },
      { plotType: 'Residential', plotSize: '150 sq. yd.', totalPlots: 80, allPlots: 80, soldPlots: 60, unsoldPlots: 20 },
      { plotType: 'Commercial', plotSize: '200 sq. yd.', totalPlots: 40, allPlots: 40, soldPlots: 30, unsoldPlots: 10 },
      { plotType: 'Commercial', plotSize: '300 sq. yd.', totalPlots: 25, allPlots: 25, soldPlots: 18, unsoldPlots: 7 },
      { plotType: 'Industrial', plotSize: '500 sq. yd.', totalPlots: 15, allPlots: 15, soldPlots: 10, unsoldPlots: 5 },
      { plotType: 'Institutional', plotSize: '250 sq. yd.', totalPlots: 10, allPlots: 10, soldPlots: 4, unsoldPlots: 6 },
      { plotType: 'Residential', plotSize: '200 sq. yd.', totalPlots: 60, allPlots: 60, soldPlots: 45, unsoldPlots: 15 },
      { plotType: 'Commercial', plotSize: '150 sq. yd.', totalPlots: 35, allPlots: 35, soldPlots: 20, unsoldPlots: 15 },
      { plotType: 'Residential', plotSize: '250 sq. yd.', totalPlots: 50, allPlots: 50, soldPlots: 38, unsoldPlots: 12 },
      { plotType: 'Industrial', plotSize: '400 sq. yd.', totalPlots: 12, allPlots: 12, soldPlots: 9, unsoldPlots: 3 },
      { plotType: 'Institutional', plotSize: '350 sq. yd.', totalPlots: 8, allPlots: 8, soldPlots: 5, unsoldPlots: 3 },
      { plotType: 'Residential', plotSize: '300 sq. yd.', totalPlots: 30, allPlots: 30, soldPlots: 22, unsoldPlots: 8 },
    ];

    const multiplier = mandi === 'mandi2' ? 0.7 : mandi === 'mandi3' ? 1.3 : 1;
    return base.map((row) => ({
      ...row,
      totalPlots: Math.round(row.totalPlots * multiplier),
      allPlots: Math.round(row.allPlots * multiplier),
      soldPlots: Math.round(row.soldPlots * multiplier),
      unsoldPlots: Math.round(row.unsoldPlots * multiplier),
    }));
  }

  get totalTotalPlots(): number {
    return this.allRows.reduce((sum, r) => sum + r.totalPlots, 0);
  }
  get totalSoldPlots(): number {
    return this.allRows.reduce((sum, r) => sum + r.soldPlots, 0);
  }
  get totalUnsoldPlots(): number {
    return this.allRows.reduce((sum, r) => sum + r.unsoldPlots, 0);
  }
}