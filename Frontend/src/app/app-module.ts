import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { Navbar } from './features/navbar/navbar';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { Footer } from './features/footer/footer';
import { MainLayout } from './layouts/main-layout/main-layout';
import { PropertyBidderRegistrationModule } from './features/property-bidder-registration/property-bidder-registration.module';
@NgModule({
  declarations: [App, MainLayout],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    Navbar,
    Footer,
    PropertyBidderRegistrationModule,
    ToastrModule.forRoot()
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [App],
})
export class AppModule {}