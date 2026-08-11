import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard-home',
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  standalone: true,
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.scss',
})
export class DashboardHome {
  isLoggedIn = true;

  loggedInUser = {
    userId: 'pmb.mcabo-ms',
    fullName: 'Board Officer (MCABO-MS)',
    entityType: 'Sole Proprietorship',
    mobile: '9876543210',
  };
}
