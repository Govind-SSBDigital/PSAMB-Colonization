import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface LookupItem {
  id: number;
  name: string;
}

export interface AllotmentRow {
  alloteeCode: string;
  name: string;
  district: string;
  mandi: string;
  plotType: string;
  plotNo: string;
  plotSize: string;
  auctionDate: string;
  allotmentDate: string;
  allotmentNo: string;
  allotmentPrice: number;
}

type SortKey = keyof AllotmentRow;

@Component({
  selector: 'app-mandi-wise-allotment-summary',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatPaginatorModule],
  templateUrl: './mandi-wise-allotment-summary.html',
  styleUrl: './mandi-wise-allotment-summary.scss',
})
export class MandiWiseAllotmentSummary implements OnInit {
  form!: FormGroup;

  districts: LookupItem[] = [];
  committees: LookupItem[] = [];
  mandis: LookupItem[] = [];

  rows: AllotmentRow[] = [];
  searched = false;
  loading = false;

  pageIndex = 0;
  pageSize = 10;

  sortKey: SortKey | null = null;
  sortAsc = true;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      districtId: [null, Validators.required],
      branchId: [{ value: null, disabled: true }, Validators.required],
      mandiId: [{ value: null, disabled: true }, Validators.required],
    });

    this.districts = [
      { id: 1, name: 'Ludhiana' },
      { id: 2, name: 'Amritsar' },
      { id: 3, name: 'Patiala' },
      { id: 4, name: 'Jalandhar' },
      { id: 5, name: 'Bathinda' },
      { id: 6, name: 'Sangrur' },
    ];
  }

  onDistrictChange(): void {
    const districtId = Number(this.form.get('districtId')!.value);
    const branch = this.form.get('branchId')!;
    const mandi = this.form.get('mandiId')!;

    this.committees = [];
    this.mandis = [];
    branch.reset(null, { emitEvent: false });
    mandi.reset(null, { emitEvent: false });
    mandi.disable();

    if (!districtId) {
      branch.disable();
      return;
    }

    const district = this.districts.find((d) => d.id === districtId)!;
    this.committees = [
      { id: 11, name: `${district.name} Market Committee` },
      { id: 12, name: `${district.name} Rural Committee` },
      { id: 13, name: `${district.name} City Committee` },
    ];
    branch.enable();
  }

  onCommitteeChange(): void {
    const branchId = Number(this.form.get('branchId')!.value);
    const mandi = this.form.get('mandiId')!;

    this.mandis = [];
    mandi.reset(null, { emitEvent: false });

    if (!branchId) {
      mandi.disable();
      return;
    }

    this.mandis = [
      { id: 101, name: 'Grain Market Mandi' },
      { id: 102, name: 'New Sabzi Mandi' },
      { id: 103, name: 'Focal Point Mandi' },
    ];
    mandi.enable();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const filters = this.form.getRawValue();

    setTimeout(() => {
      this.rows = this.mockRows(Number(filters.districtId), Number(filters.mandiId));
      this.searched = true;
      this.pageIndex = 0;
      this.sortKey = null;
      this.loading = false;
    }, 400);
  }

  onReset(): void {
    this.form.reset({ districtId: null, branchId: null, mandiId: null });
    this.form.get('branchId')!.disable();
    this.form.get('mandiId')!.disable();
    this.committees = [];
    this.mandis = [];
    this.rows = [];
    this.searched = false;
    this.pageIndex = 0;
    this.sortKey = null;
  }


  sortBy(key: SortKey): void {
    this.sortAsc = this.sortKey === key ? !this.sortAsc : true;
    this.sortKey = key;
    this.pageIndex = 0;
  }

  private get sortedRows(): AllotmentRow[] {
    if (!this.sortKey) return this.rows;
    const key = this.sortKey;
    const dir = this.sortAsc ? 1 : -1;
    return [...this.rows].sort((a, b) => {
      const x = a[key];
      const y = b[key];
      if (typeof x === 'number' && typeof y === 'number') return (x - y) * dir;
      return String(x).localeCompare(String(y)) * dir;
    });
  }

  get pagedRows(): AllotmentRow[] {
    const start = this.pageIndex * this.pageSize;
    return this.sortedRows.slice(start, start + this.pageSize);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }


  isInvalid(control: string): boolean {
    const c = this.form.get(control);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  get totalValue(): number {
    return this.rows.reduce((sum, r) => sum + r.allotmentPrice, 0);
  }

  get selectedMandiName(): string {
    const id = Number(this.form.get('mandiId')!.value);
    return this.mandis.find((m) => m.id === id)?.name ?? '';
  }

  trackByRow = (_: number, row: AllotmentRow): string => row.allotmentNo;

  skeletonRows = Array.from({ length: 6 });

  private mockRows(districtId: number, mandiId: number): AllotmentRow[] {
    const district = this.districts.find((d) => d.id === districtId)?.name ?? '';
    const mandi = this.mandis.find((m) => m.id === mandiId)?.name ?? '';
    return Array.from({ length: 13 }, (_, i) => ({
      alloteeCode: `ALT-${1000 + i}`,
      name: ['Gurpreet Singh', 'Manjit Kaur', 'Harnek Singh', 'Simran Kaur'][i % 4],
      district,
      mandi,
      plotType: i % 2 ? 'Commercial' : 'Residential',
      plotNo: `P-${i + 1}`,
      plotSize: `${100 + i * 5} sq yd`,
      auctionDate: '12-03-2025',
      allotmentDate: '28-03-2025',
      allotmentNo: `ALM/2025/${i + 1}`,
      allotmentPrice: 850000 + i * 25000,
    }));
  }
}