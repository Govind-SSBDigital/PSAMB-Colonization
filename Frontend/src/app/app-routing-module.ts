import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home-page/home-page').then(m => m.HomePage),
    pathMatch: 'full'
  },
  {
    path: 'login',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
    // canActivate: [AuthGuard]
  },
  {
    path: "register-property",
    redirectTo: 'dashboard/register-property',
    pathMatch: 'full'
  },
  {
    path: "property-bidder-registration",
    redirectTo: 'dashboard/property-bidder-registration',
    pathMatch: 'full'
  },
  {
    path: "property-verification",
    redirectTo: 'dashboard/property-verification',
    pathMatch: 'full'
  },
  {
    path: "profile",
    redirectTo: 'dashboard/profile',
    pathMatch: 'full'
  },
  {
    path: "verification-view",
    redirectTo: 'dashboard/verification-view',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

