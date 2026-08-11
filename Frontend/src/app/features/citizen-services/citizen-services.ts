import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
export interface CitizenService {
  srNo: number;
  serviceName: string;
  onlineCharges: string[];       
  psambFees: string;
  cdFees: string;
  status: 'Active' | 'Deactive';
  applyLink?: string;
}
@Component({
  selector: 'app-citizen-services',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './citizen-services.html',
  styleUrl: './citizen-services.scss',
})
export class CitizenServices implements OnInit {
 
  title = 'Citizen Services and Fees';
 
  services: CitizenService[] = [
    {
      srNo: 1,
      serviceName: 'Payment of Instalments',
      onlineCharges: ['Rs 100'],
      psambFees: 'No',
      cdFees: 'No',
      status: 'Deactive'
    },
    {
      srNo: 2,
      serviceName: 'Permission to Sell',
      onlineCharges: ['Rs 600'],
      psambFees: 'No',
      cdFees: 'No',
      status: 'Active',
      applyLink: '/services/permission-to-sell'
    },
    {
      srNo: 3,
      serviceName: 'Issuance of No Due Certificate',
      onlineCharges: ['Rs 150'],
      psambFees: 'No',
      cdFees: 'No',
      status: 'Active',
      applyLink: '/services/no-due-certificate'
    },
    {
      srNo: 4,
      serviceName: 'Loan/Mortgage to Permission',
      onlineCharges: ['Booth - Rs 950', 'Shop - Rs 1800'],
      psambFees: 'No',
      cdFees: 'No',
      status: 'Active',
      applyLink: '/services/loan-mortgage-permission'
    },
    {
      srNo: 5,
      serviceName: 'Lien Removal fee/Release from Mortgage',
      onlineCharges: ['Booth - Rs 600', 'Shop - Rs 950'],
      psambFees: 'No',
      cdFees: 'No',
      status: 'Active',
      applyLink: '/services/lien-removal'
    },
    {
      srNo: 6,
      serviceName: 'Change of Ownership (Sale Deed)',
      onlineCharges: ['Booth - Rs 1800', 'Shop - Rs 3600'],
      psambFees: 'No',
      cdFees: 'No',
      status: 'Active',
      applyLink: '/services/change-ownership-sale-deed'
    },
    {
      srNo: 7,
      serviceName: 'Change of Ownership (Gift Deed)',
      onlineCharges: ['Booth - Rs 1800', 'Shop - Rs 3600'],
      psambFees: 'No',
      cdFees: 'No',
      status: 'Deactive'
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
 
}