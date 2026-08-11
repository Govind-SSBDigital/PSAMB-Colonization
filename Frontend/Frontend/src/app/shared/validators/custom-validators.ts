import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  // Enforce strong password complexity rules matching backend identity configuration
  static strength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const hasUpperCase = /[A-Z]+/.test(value);
      const hasLowerCase = /[a-z]+/.test(value);
      const hasNumeric = /[0-9]+/.test(value);
      const hasSpecial = /[^A-Za-z0-9]+/.test(value);

      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial;
      
      return !passwordValid ? { passwordStrength: true } : null;
    };
  }

  // Enforce matching fields (e.g. password confirmation)
  static match(controlName: string, matchingControlName: string): ValidatorFn {
    return (abstractControl: AbstractControl): ValidationErrors | null => {
      const control = abstractControl.get(controlName);
      const matchingControl = abstractControl.get(matchingControlName);

      if (matchingControl?.errors && !matchingControl.errors['mustMatch']) {
        return null;
      }

      if (control?.value !== matchingControl?.value) {
        matchingControl?.setErrors({ mustMatch: true });
        return { mustMatch: true };
      } else {
        matchingControl?.setErrors(null);
        return null;
      }
    };
  }
}
