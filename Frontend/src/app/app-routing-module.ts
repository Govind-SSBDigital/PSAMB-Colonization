import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'property-bidder-registration',
    loadChildren: () => import('./features/property-bidder-registration/property-bidder-registration.module').then(m => m.PropertyBidderRegistrationModule),
    // canActivate: [AuthGuard]
  },

  {
    path: 'register-property',
    loadChildren: () => import('./features/register-property/register-property.module').then(m => m.RegisterPropertyModule),
    // canActivate: [AuthGuard]
  },
  
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
