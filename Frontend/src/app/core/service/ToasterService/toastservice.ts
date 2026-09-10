import { Injectable, inject } from '@angular/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';

export type ToastOptions = Partial<IndividualConfig>;
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastr = inject(ToastrService);

  success(message: string, title = 'Success', options?: ToastOptions): void {
    this.toastr.success(message, title, options);
  }

  error(message: string, title = 'Error', options?: ToastOptions): void {
    this.toastr.error(message, title, {
      timeOut: 5000, // errors stay a bit longer by default
      ...options,
    });
  }

  info(message: string, title = 'Info', options?: ToastOptions): void {
    this.toastr.info(message, title, options);
  }

  warning(message: string, title = 'Warning', options?: ToastOptions): void {
    this.toastr.warning(message, title, options);
  }

  clear(toastId?: number): void {
    this.toastr.clear(toastId);
  }

  //HTTP error interceptors 
  showHttpError(error: any, fallbackMessage = 'Something went wrong'): void {
    const message =
      error?.error?.message || error?.message || fallbackMessage;
    this.error(message);
  }
}