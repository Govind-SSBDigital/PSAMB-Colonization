import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
 constructor(private router: Router) {}
  categories = [
    { value: 'individual', label: 'Individual (ਵਿਅਕਤੀਗਤ)' },
    { value: 'sole_proprietorship', label: 'Sole Proprietorship (ਇਕੱਲੇ ਮਾਲਕ ਦਾ ਅਧਿਕਾਰ)' },
    { value: 'partnership_firm', label: 'Partnership Firm (ਭਾਈਵਾਲੀ ਫਰਮ)' },
    { value: 'huf', label: 'Hindu Undivided Family(HUF) (ਹਿੰਦੂ ਅਣਵੰਡਿਆ ਪਰਿਵਾਰ)' },
    { value: 'public_limited', label: 'Public Limited Company (ਪਬਲਿਕ ਲਿਮਟਿਡ ਕੰਪਨੀ)' },
    { value: 'private_limited', label: 'Private Limited Company (ਪ੍ਰਾਈਵੇਟ ਲਿਮਟਿਡ ਕੰਪਨੀ)' },
    { value: 'llp', label: 'Limited Liability Partnership (ਸੀਮਿਤ ਜ਼ਿੰਮੇਵਾਰੀ ਭਾਈਵਾਲੀ)' },
    { value: 'procurement_agency', label: 'Procurement Agency (ਖਰੀਦ ਏਜੰਸੀ)' }
  ];
 
  selectedCategory: string = '';
 
  onSignIn(): void {
    // wire up navigation / auth flow here
    console.log('Sign In clicked');
  }
 
  onSignUp(): void {
    console.log('Sign Up clicked');
  }
 
  onProceed(): void {
    if (!this.selectedCategory) {
      return;
    }
    console.log('Proceeding with category:', this.selectedCategory);
  }
   backToHome(): void {
    this.router.navigate(['/']);
  }
}