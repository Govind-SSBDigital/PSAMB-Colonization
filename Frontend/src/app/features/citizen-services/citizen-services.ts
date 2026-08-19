import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
export interface CitizenService {
  srNo: number;
  serviceName: string;
  onlineCharges: string[];       
  psambFees: string;
  cdFees: string;
  status: 'Active' | 'In Active' ;
  applyLink?: string;
  payNowLink?: string;
}
@Component({
  selector: 'app-citizen-services',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './citizen-services.html',
  styleUrl: './citizen-services.scss',
})
export class CitizenServices implements OnInit {
 
  services: CitizenService[] = [
    {
      srNo: 1,
      serviceName: 'Payment of Instalments',
      onlineCharges: ['100'],
      psambFees: 'No',
      cdFees: 'No',
      status: 'In Active',
      payNowLink: '/services/payment-of-instalments'
    },
    {
      srNo: 2,
      serviceName: 'Permission to Sell',
      onlineCharges: ['600'],
      psambFees: 'No',
      cdFees: 'No',
      status: 'In Active',
      applyLink: '/services/permission-to-sell'
    },
    {
      srNo: 3,
      serviceName: 'Issuance of No Due Certificate',
      onlineCharges: ['150'],
      psambFees: 'No',
      cdFees: 'No',
      status: 'In Active',
      applyLink: '/services/no-due-certificate'
    },
    {
      srNo: 4,
      serviceName: 'Loan/Mortgage to Permission',
      onlineCharges: ['Booth - 950', 'Shop - 1800'],
      psambFees: 'No',
      cdFees: 'No',
      status: 'In Active',
      applyLink: '/services/loan-mortgage-permission'
    },
    {
      srNo: 5,
      serviceName: 'Lien Removal fee/Release from Mortgage',
      onlineCharges: ['Booth - 600', 'Shop - 950'],
      psambFees: 'No',
      cdFees: 'No',
      status: 'In Active',
      applyLink: '/services/lien-removal'
    },
    {
      srNo: 6,
      serviceName: 'Change of Ownership (Sale Deed)',
      onlineCharges: ['Booth - 1800', 'Shop - 3600'],
      psambFees: 'No',
      cdFees: 'No',
      status: 'In Active',
      applyLink: '/services/change-ownership-sale-deed'
    },
    {
      srNo: 7,
      serviceName: 'Change of Ownership (Gift Deed)',
      onlineCharges: ['Booth - 1800', 'Shop - 3600'],
      psambFees: 'No',
      cdFees: 'No',
      status: 'In Active',
      applyLink: '/services/change-ownership-gift-deed'
    }
  ];
 
  constructor() { }
 
  ngOnInit(): void {
  }
 
  onApply(service: CitizenService): void {
    if (!service.applyLink) {
      return;
    }
    // this.router.navigate([service.applyLink]);
    // console.log('Apply Now clicked for:', service.serviceName);
  }

  onPayNow(service: CitizenService): void {
    if (!service.payNowLink) {
      return;
    }
  }

}