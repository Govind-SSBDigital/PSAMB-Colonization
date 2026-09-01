import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { CitizenServicesRedirectGuard } from './core/guards/citizen-services-redirect.guard';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home-page/home-page')
        .then(m => m.HomePage),
    pathMatch: 'full'
  },

  {
    path: 'login',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module')
        .then(m => m.AuthModule)
  },
  {
    path: 'new-login',
    loadChildren: () =>
      import('./features/auth/login/login.module')
        .then(m => m.LoginModule),
  },
  {
    path: 'new-signup',
    loadComponent: () =>
      import('./features/auth/signup/signup')
        .then(m => m.Signup),
  },
  {
    path: 'about-us',
    loadComponent: () =>
      import('./features/about-us/about-us')
        .then(m => m.AboutUs),
  },
  {
    path: 'citizen-services',
    canActivate: [CitizenServicesRedirectGuard],
    loadComponent: () =>
      import('./features/citizen-services/citizen-services')
        .then(m => m.CitizenServices),
  },
  {
    path: '',
    loadChildren: () =>
      import('./features/dashboard/dashboard.module')
        .then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/coming-soon',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }

