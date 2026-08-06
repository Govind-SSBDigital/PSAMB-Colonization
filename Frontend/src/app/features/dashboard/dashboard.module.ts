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
            path: '',
            redirectTo: 'home',
            pathMatch: 'full',
          },
          {
            path: 'home',
            loadComponent: () => import('./dashboard-home/dashboard-home').then((m) => m.DashboardHome),
          },
          {
            path: 'register-property',
            loadChildren: () =>
              import('../register-property/register-property.module').then(
                (m) => m.RegisterPropertyModule,
              ),
          },
          {
            path: 'property-bidder-registration',
            loadChildren: () =>
              import('../property-bidder-registration/property-bidder-registration.module').then(
                (m) => m.PropertyBidderRegistrationModule,
              ),
          },
          {
            path: 'property-verification',
            loadChildren: () =>
              import('../property-verification/property-verification.module').then(
                (m) => m.PropertyVerificationModule,
              ),
          },
          {
            path: 'profile',
            loadChildren: () => import('./profile/profile.module').then((m) => m.ProfileModule),
          },
          {
            path: 'verification-view',
            loadChildren: () =>
              import('../verification-view/verification-view.module').then(
                (m) => m.VerificationViewModule,
              ),
          },
          {
            path: "citizen-services",
            loadComponent: () => import('../citizen-services/citizen-services').then(m => m.CitizenServices),
          },
          {
            path: "deo-verification",
            loadComponent: () => import('../deo-verification/deo-verification').then(m => m.DeoVerification),
          }
        ],
      },
    ]),
  ],
})
export class DashboardModule {}
