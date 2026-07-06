import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';

interface Announcement {
  id: number;
  date: string;
  title: string;
  isNew: boolean;
}

interface Scheme {
  id: number;
  title: string;
  punjabiTitle: string;
  desc: string;
  punjabiDesc: string;
  image: string;
}

interface QuickLink {
  id: number;
  title: string;
  punjabiTitle: string;
  icon: string;
  route: string;
  color: string;
  queryParams?: any;
}

interface VideoItem {
  id: number;
  title: string;
  duration: string;
  thumbnail: string;
}

interface PhotoItem {
  id: number;
  title: string;
  image: string;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule, Navbar, Footer],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})

export class HomePage {
  announcements: Announcement[] = [
    { id: 1, date: 'June 25, 2026', title: 'Upcoming e-Auction Notice No. 2026/04 for commercial and residential booths in Jalandhar Mandi.', isNew: true },
    { id: 2, date: 'June 20, 2026', title: 'Notification regarding revision of building regularization guidelines and lease extension rates.', isNew: true },
    { id: 3, date: 'June 15, 2026', title: 'Launch of Online Land Mutation and Digital NOC Tracking System for citizen convenience.', isNew: false },
    { id: 4, date: 'June 10, 2026', title: 'Office Order: Allotment list of residential plots under the Command Area Development Scheme (Phase II).', isNew: false },
    { id: 5, date: 'June 05, 2026', title: 'Instructions for submitting online bids and depositing EMD via the integrated payment gateway.', isNew: false }
  ];

  schemes: Scheme[] = [
    {
      id: 1,
      title: 'Mandi Allotment & Development',
      punjabiTitle: 'ਮੰਡੀ ਅਲਾਟਮੈਂਟ ਅਤੇ ਵਿਕਾਸ',
      desc: 'Structured allotment of commercial booths and shops inside newly established state-of-the-art Mandis across Punjab.',
      punjabiDesc: 'ਪੂਰੇ ਪੰਜਾਬ ਵਿੱਚ ਨਵੀਆਂ ਮੰਡੀਆਂ ਅੰਦਰ ਵਪਾਰਕ ਬੂਥਾਂ ਅਤੇ ਦੁਕਾਨਾਂ ਦੀ ਯੋਜਨਾਬੱਧ ਅਲਾਟਮੈਂਟ।',
      image: 'https://images.unsplash.com/photo-1582034986517-30d163ea1099?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 2,
      title: 'Command Area Development (CADP)',
      punjabiTitle: 'ਕਮਾਂਡ ਏਰੀਆ ਡਿਵੈਲਪਮੈਂਟ',
      desc: 'Development of command area properties, watercourse layouts, and commercial property infrastructure for optimized land usage.',
      punjabiDesc: 'ਜ਼ਮੀਨ ਦੀ ਸੁਚੱਜੀ ਵਰਤੋਂ ਲਈ ਕਮਾਂਡ ਖੇਤਰ ਦੀਆਂ ਜਾਇਦਾਦਾਂ ਅਤੇ ਵਪਾਰਕ ਬੁਨਿਆਦੀ ਢਾਂਚੇ ਦਾ ਵਿਕਾਸ।',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 3,
      title: 'Property Regularization Campaign',
      punjabiTitle: 'ਪ੍ਰਾਪਰਟੀ ਰੈਗੂਲਰਾਈਜ਼ੇਸ਼ਨ ਮੁਹਿੰਮ',
      desc: 'Online regularizing schemes for existing residential holdings, commercial plots, and unauthorized structures under new rules.',
      punjabiDesc: 'ਨਵੇਂ ਨਿਯਮਾਂ ਅਧੀਨ ਰਿਹਾਇਸ਼ੀ ਹੋਲਡਿੰਗਾਂ ਅਤੇ ਵਪਾਰਕ ਪਲਾਟਾਂ ਨੂੰ ਆਨਲਾਈਨ ਨਿਯਮਤ ਕਰਨ ਦੀ ਮੁਹਿੰਮ।',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600'
    }
  ];

  quickLinks: QuickLink[] = [
    { id: 1, title: 'Citizen Login', punjabiTitle: 'ਬਿਨੈਕਾਰ ਲੋਗਇਨ', icon: 'login', route: '/login', color: 'blue', queryParams: { mode: 'signin' } },
    { id: 2, title: 'New Registration', punjabiTitle: 'ਨਵੀਂ ਰਜਿਸਟ੍ਰੇਸ਼ਨ', icon: 'person_add', route: '/login', color: 'teal', queryParams: { mode: 'signup' } },
    { id: 3, title: 'Active e-Auctions', punjabiTitle: 'ਚੱਲ ਰਹੀਆਂ ਬੋਲੀਆਂ', icon: 'gavel', route: '/login', color: 'purple', queryParams: { mode: 'signin' } },
    { id: 4, title: 'Verify Property', punjabiTitle: 'ਜਾਇਦਾਦ ਦੀ ਜਾਂਚ', icon: 'fact_check', route: '/login', color: 'orange', queryParams: { mode: 'signin' } },
    { id: 5, title: 'Apply for NOC', punjabiTitle: 'NOC ਲਈ ਅਪਲਾਈ ਕਰੋ', icon: 'article', route: '/login', color: 'emerald', queryParams: { mode: 'signin' } },
    { id: 6, title: 'Grievance Redressal', punjabiTitle: 'ਸ਼ਿਕਾਇਤ ਨਿਵਾਰਨ', icon: 'support_agent', route: '/login', color: 'rose', queryParams: { mode: 'signin' } }
  ];

  videos: VideoItem[] = [
    {
      id: 1,
      title: 'Guide: Registering & Bidding on the Punjab State e-Auction Portal',
      duration: '4:25',
      thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 2,
      title: 'Overview of Colonization Land Allotment and Development Policies 2026',
      duration: '8:40',
      thumbnail: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600'
    }
  ];

  photos: PhotoItem[] = [
    { id: 1, title: 'Modernized Grain Mandi Layout Jalandhar', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600' },
    { id: 2, title: 'e-Auction Citizen Training Camp Ludhiana', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600' },
    { id: 3, title: 'State-of-the-Art Office Complex Mohali', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600' },
    { id: 4, title: 'Command Area Canalization Projects Bathinda', image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=600' }
  ];
}
