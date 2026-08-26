import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-comming-soon-pages',
  standalone: true,
  templateUrl: './comming-soon-pages.html',
  styleUrl: './comming-soon-pages.scss',
})
export class CommingSoonPages {
  @Input() pageName: string = '';

  constructor(private router: Router, private route: ActivatedRoute) {
    this.route.data.subscribe(data => {
      if (data['title']) {
        this.pageName = data['title'];
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}