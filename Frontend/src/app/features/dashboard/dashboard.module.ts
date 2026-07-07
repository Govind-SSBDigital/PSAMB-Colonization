import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { Sidebar } from './sidebar/sidebar';
import { Header } from './header/header';
import { Footer } from './footer/footer';

@NgModule({
  declarations: [DashboardComponent, Sidebar, Header, Footer],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
        children: [
          {
            path: 'register-property',
            loadChildren: () => import('../register-property/register-property.module').then(m => m.RegisterPropertyModule),
          },
          {
            path: 'property-bidder-registration',
            loadChildren: () => import('../property-bidder-registration/property-bidder-registration.module').then(m => m.PropertyBidderRegistrationModule),
          },
        ],
      },
    ]),
  ],
})
export class DashboardModule {}
