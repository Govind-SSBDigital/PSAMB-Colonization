import { Component, ViewChild, ElementRef } from '@angular/core';
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
  imports: [CommonModule, MatIconModule, MatButtonModule, Navbar, Footer, RouterLink],
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
    { id: 1, title: 'Grain Mandi Project View Jalandhar', image: '/Mandi1.JPG' },
    { id: 2, title: 'Grain Mandi Project View Ludhiana', image: '/Mandi2.JPG' },
    { id: 3, title: 'Grain Mandi Project View Amritsar', image: '/Mandi3.JPG' },
    { id: 4, title: 'Grain Mandi Project View Bathinda', image: '/Mandi4.JPG' },
    { id: 5, title: 'Grain Mandi Project View Patiala', image: '/Mandi5.JPG' },
    { id: 6, title: 'Grain Mandi Project View Mohali', image: '/Mandi6.JPG' },
    { id: 7, title: 'Grain Mandi Project View Ferozepur', image: '/Mandi7.JPG' },
    { id: 8, title: 'Grain Mandi Project View Pathankot', image: '/Mandi8.JPG' }
  ];

  leadershipShortlist = [
    {
      id: 'cm',
      name: "Hon'ble Chief Minister",
      punjabiName: "ਮਾਨਯੋਗ ਮੁੱਖ ਮੰਤਰੀ",
      image: "/chief minister.jpg",
      role: "Sh. Bhagwant Singh Mann"
    },
    {
      id: 'fm',
      name: "Hon'ble Finance Minister",
      punjabiName: "ਮਾਨਯੋਗ ਵਿੱਤ ਮੰਤਰੀ",
      image: "/finance minister.jpg",
      role: "Sh. Harpal Singh Cheema"
    },
    {
      id: 'doc',
      name: "Director of Colonization",
      punjabiName: "\u0A21\u0A3E\u0A07\u0A30\u0A48\u0A15\u0A1F\u0A30 \u0A06\u0A2c\u0A3e\u0A26\u0A15\u0A3e\u0A30\u0A40",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
      role: "Smt. Amrit Singh, IAS"
    }
  ];

  isLeaderModalOpen = false;
  selectedLeaderId: string | null = null;
  selectedLeaderData: any = null;

  leadershipMessages: Record<string, any> = {
    cm: {
      id: 'cm',
      name: 'Sh. Bhagwant Singh Mann',
      title: "Hon'ble Chief Minister, Punjab",
      punjabiTitle: "ਮਾਨਯੋਗ ਮੁੱਖ ਮੰਤਰੀ, ਪੰਜਾਬ",
      image: "/chief minister.jpg",
      quote: "Our vision is to make Punjab a hub of digital governance and commercial prosperity.",
      punjabiQuote: "ਸਾਡਾ ਸੰਕਲਪ ਪੰਜਾਬ ਨੂੰ ਡਿਜੀਟਲ ਗਵਰਨੈਂਸ ਅਤੇ ਵਪਾਰਕ ਖੁਸ਼ਹਾਲੀ ਦਾ ਕੇਂਦਰ ਬਣਾਉਣਾ ਹੈ।",
      fullMessage: [
        "Punjab, the land of great heritage, courage, and resilience, has always stood as a symbol of progress and unity. ",
        "Our government is firmly committed to building a transparent, efficient, and citizen-centric administration that works for the welfare of every individual.",
        "We are continuously striving to strengthen infrastructure, improve public services, and ensure that every section of society benefits from development. ",
        "Special emphasis is being placed on digital transformation, ease of access to government services, and creating opportunities for the youth of Punjab.",
        "Our vision is to make Punjab a leading state in innovation, agriculture, education, and industry. With collective efforts, dedication, and public participation, we aim to bring positive change and ensure a brighter future for our coming generations. I extend my heartfelt gratitude to the people of Punjab for their trust and support. Together, we will continue to work towards prosperity, inclusivity, and sustainable development."
      ],
      punjabiFullMessage: [
        "ਪੰਜਾਬ, ਜੋ ਆਪਣੀ ਮਹਾਨ ਵਿਰਾਸਤ, ਹਿੰਮਤ ਅਤੇ ਸਹਿਨਸ਼ੀਲਤਾ ਲਈ ਜਾਣਿਆ ਜਾਂਦਾ ਹੈ, ਹਮੇਸ਼ਾਂ ਤਰੱਕੀ ਅਤੇ ਏਕਤਾ ਦਾ ਪ੍ਰਤੀਕ ਰਿਹਾ ਹੈ। ਸਾਡੀ ਸਰਕਾਰ ਹਰ ਇਕ ਵਿਅਕਤੀ ਦੀ ਭਲਾਈ ਲਈ ਪਾਰਦਰਸ਼ੀ, ਪ੍ਰਭਾਵਸ਼ਾਲੀ ਅਤੇ ਲੋਕ-ਕੇਂਦਰਿਤ ਪ੍ਰਸ਼ਾਸਨ ਬਣਾਉਣ ਲਈ ਪੂਰੀ ਤਰ੍ਹਾਂ ਵਚਨਬੱਧ ਹੈ।",
        "ਅਸੀਂ ਲਗਾਤਾਰ ਬੁਨਿਆਦੀ ਢਾਂਚੇ ਨੂੰ ਮਜ਼ਬੂਤ ਕਰਨ, ਸਰਕਾਰੀ ਸੇਵਾਵਾਂ ਵਿੱਚ ਸੁਧਾਰ ਕਰਨ @ਤੇ ਇਹ ਯਕੀਨੀ ਬਣਾਉਣ ਲਈ ਕੋਸ਼ਿਸ਼ ਕਰ ਰਹੇ ਹਾਂ ਕਿ ਸਮਾਜ ਦੇ ਹਰ ਵਰਗ ਨੂੰ ਵਿਕਾਸ ਦਾ ਲਾਭ ਮਿਲੇ। ਡਿਜ਼ਿਟਲ ਬਦਲਾਅ, ਸਰਕਾਰੀ ਸੇਵਾਵਾਂ ਤੱਕ ਆਸਾਨ ਪਹੁੰਚ ਅਤੇ ਪੰਜਾਬ ਦੇ ਨੌਜਵਾਨਾਂ ਲਈ ਮੌਕੇ ਪੈਦਾ ਕਰਨ ‘ਤੇ ਖਾਸ ਧਿਆਨ ਦਿੱਤਾ ਜਾ ਰਿਹਾ ਹੈ।",
        "ਸਾਡਾ ਵਿਜ਼ਨ ਪੰਜਾਬ ਨੂੰ ਨਵੀਨਤਾ, ਖੇਤੀਬਾੜੀ, ਸਿੱਖਿਆ ਅਤੇ ਉਦਯੋਗ ਦੇ ਖੇਤਰਾਂ ਵਿੱਚ ਅੱਗੇ ਲੈ ਜਾਣਾ ਹੈ। ਸਾਂਝੇ ਯਤਨਾਂ, ਸਮਰਪਣ ਅਤੇ ਲੋਕ ਭਾਗੀਦਾਰੀ ਨਾਲ ਅਸੀਂ ਸਕਾਰਾਤਮਕ ਬਦਲਾਅ ਲਿਆਉਣ ਅਤੇ ਆਉਣ ਵਾਲੀਆਂ ਪੀੜ੍ਹੀਆਂ ਲਈ ਚੰਗਾ ਭਵਿੱਖ ਯਕੀਨੀ ਬਣਾਉਣ ਦਾ ਲਕਸ਼ ਰੱਖਦੇ ਹਾਂ।",
        "ਮੈਂ ਪੰਜਾਬ ਦੇ ਲੋਕਾਂ ਦਾ ਉਨ੍ਹਾਂ ਦੇ ਭਰੋਸੇ ਅਤੇ ਸਹਿਯੋਗ ਲਈ ਦਿਲੋਂ ਧੰਨਵਾਦ ਕਰਦਾ ਹਾਂ। ਅਸੀਂ ਇਕੱਠੇ ਮਿਲ ਕੇ ਖੁਸ਼ਹਾਲੀ, ਸਮਾਵੇਸ਼ਤਾ ਅਤੇ ਟਿਕਾਊ ਵਿਕਾਸ ਵੱਲ ਅੱਗੇ ਵਧਦੇ ਰਹਾਂਗੇ।  "
      ]
    },
    fm: {
      id: 'fm',
      name: 'Sh. Harpal Singh Cheema',
      title: "Hon'ble Finance Minister, Punjab",
      punjabiTitle: "ਮਾਨਯੋਗ ਵਿੱਤ ਮੰਤਰੀ, ਪੰਜਾਬ",
      image: "/finance minister.jpg",
      quote: "Empowering the local economy through modern infrastructural development is our top priority.",
      punjabiQuote: "ਆਧੁਨਿਕ ਬੁਨਿਆਦੀ ਢਾਂਚੇ ਦੇ ਵਿਕਾਸ ਰਾਹੀਂ ਸਥਾਨਕ ਆਰਥਿਕਤਾ ਨੂੰ ਮਜ਼ਬੂਤ ਕਰਨਾ ਸਾਡੀ ਮੁੱਖ ਤਰਜੀਹ ਹੈ।",
      fullMessage: [
        "Punjab has always been a land of strength, resilience, and economic potential. As the Hon’ble Finance Minister, our commitment is to ensure sound financial management, transparency, and efficient utilization of resources for the overall development of the state.",
        "We are focused on strengthening the financial framework of Punjab by improving revenue systems, promoting fiscal discipline, and ensuring that public funds are used effectively for the welfare of the people. Special emphasis is being placed on supporting key sectors such as agriculture, industry, education, and healthcare.",
        "Our goal is to create a robust and sustainable economy that generates opportunities for growth, employment, and prosperity. Through strategic planning and responsible governance, we aim to build a financially strong and progressive Punjab.",
        "I express my sincere gratitude to the people of Punjab for their continued trust and support. Together, we will work towards inclusive growth, financial stability, and a brighter future for all. "
      ],
      punjabiFullMessage: [
        "ਪੰਜਾਬ ਦੀ ਆਰਥਿਕ ਮਜ਼ਬੂਤੀ ਮੁੱਖ ਤੌਰ 'ਤੇ ਮਜ਼ਬੂਤ ਅਨਾਜ ਮੰਡੀਆਂ ਅਤੇ ਯੋਜਨਾਬੱਧ ਵਪਾਰਕ ਖੇਤਰਾਂ 'ਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ। ਆਬਾਦਕਾਰੀ ਵਿਭਾਗ ਰਾਹੀਂ, ਅਸੀਂ ਉੱਚ ਪੱਧਰੀ ਮੰਡੀਆਂ, ਭੰਡਾਰਨ ਸਹੂਲਤਾਂ ਅਤੇ ਡਿਜੀਟਲ ਵਪਾਰਕ ਨੈੱਟਵਰਕਾਂ ਵਿੱਚ ਨਿਵੇਸ਼ ਕਰ ਰਹੇ ਹਾਂ।",
        "ਜ਼ਮੀਨ ਦੀ ਅਲਾਟਮੈਂਟ ਅਤੇ ਨਿਲਾਮੀ ਬੋਲੀਆਂ ਵਿੱਚ ਮੁਕੰਮਲ ਪਾਰਦਰਸ਼ਤਾ ਯਕੀਨੀ ਬਣਾਉਣਾ ਸਾਡਾ ਮੁੱਖ ਉਦੇਸ਼ ਹੈ। ਹਰ ਲੈਣ-ਦੇਣ ਅਤੇ ਬੋਲੀ ਨੂੰ ਡਿਜੀਟਲ ਰੂਪ ਵਿੱਚ ਟਰੈਕ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ, ਜਿਸ ਨਾਲ ਸਰਕਾਰੀ ਪ੍ਰਕਿਰਿਆਵਾਂ 'ਤੇ ਭਰੋਸਾ ਵਧ ਰਿਹਾ ਹੈ।",
        "ਅਸੀਂ ਵਪਾਰੀਆਂ ਅਤੇ ਨਾਗਰਿਕਾਂ ਦੇ ਸੁਝਾਵਾਂ ਦਾ ਸਵਾਗਤ ਕਰਦੇ ਹਾਂ ਕਿਉਂਕਿ ਅਸੀਂ ਪੰਜਾਬ ਵਿੱਚ ਵਪਾਰ ਕਰਨ ਦੀ ਪ੍ਰਕਿਰਿਆ ਨੂੰ ਹੋਰ ਸਰਲ ਬਣਾਉਣ ਲਈ ਯਤਨਸ਼ੀਲ ਹਾਂ।"
      ]
    },
    doc: {
      id: 'doc',
      name: 'Smt. Amrit Singh, IAS',
      title: "Director of Colonization, Punjab",
      punjabiTitle: "\u0A21\u0A3E\u0A07\u0A30\u0A48\u0A15\u0A1F\u0A30 \u0A06\u0A2c\u0A3e\u0A26\u0A15\u0A3e\u0A30\u0A40, \u0A2a\u0A70\u0A1c\u0A3e\u0A2c",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
      quote: "Welcome to the Digital Property and e-Auction Portal. We are dedicated to providing seamless, paperless citizen services.",
      punjabiQuote: "ਡਿਜੀਟਲ ਪ੍ਰਾਪਰਟੀ ਅਤੇ ਈ-ਨਿਲਾਮੀ ਪੋਰਟਲ 'ਤੇ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ। ਅਸੀਂ ਨਿਰਵਿਘਨ ਅਤੇ ਕਾਗਜ਼ ਰਹਿਤ ਨਾਗਰਿਕ ਸੇਵਾਵਾਂ ਪ੍ਰਦਾਨ ਕਰਨ ਲਈ ਵਚਨਬੱਧ ਹਾਂ।",
      fullMessage: [
        "As Director of Colonization, my primary mission is the modernization of our land administration systems. We have completely overhauled our allotment files, mutation registries, and auction workflows into secure digital models.",
        "Citizens can now check their property ledger cards, pay lease installments, verify mutation records, and participate in active e-Auctions directly from their homes or offices without visiting government desks. Our target is a fully transparent administration, faster delivery of NOCs, and automated land allotment procedures.",
        "We are continuously upgrading our portals to bring more convenience and ease of access. I encourage all citizen bid applicants to review online instructional videos and bid with confidence on our secure portal."
      ],
      punjabiFullMessage: [
        "ਡਾਇਰੈਕਟਰ ਆਬਾਦਕਾਰੀ ਵਜੋਂ, ਮੇਰਾ ਮੁੱਖ ਉਦੇਸ਼ ਜ਼ਮੀਨੀ ਪ੍ਰਸ਼ਾਸਨ ਪ੍ਰਣਾਲੀਆਂ ਦਾ ਆਧੁਨਿਕੀਕਰਨ ਕਰਨਾ ਹੈ। ਅਸੀਂ ਅਲਾਟਮੈਂਟ ਫਾਈਲਾਂ, ਮਿਊਟੇਸ਼ਨ ਰਜਿਸਟਰੀਆਂ ਅਤੇ ਨਿਲਾਮੀ ਪ੍ਰਕਿਰਿਆਵਾਂ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਡਿਜੀਟਲ ਮਾਡਲਾਂ ਵਿੱਚ ਤਬਦੀਲ ਕਰ ਦਿੱਤਾ ਹੈ।",
        "ਨਾਗਰਿਕ ਹੁਣ ਆਪਣੇ ਘਰਾਂ ਜਾਂ ਦਫ਼ਤਰਾਂ ਤੋਂ ਸਿੱਧੇ ਆਪਣੇ ਪ੍ਰਾਪਰਟੀ ਲੈਜਰ ਕਾਰਡਾਂ ਦੀ ਜਾਂਚ ਕਰ ਸਕਦੇ ਹਨ, ਲੀਜ਼ ਦੀਆਂ ਕਿਸ਼ਤਾਂ ਦਾ ਭੁਗਤਾਨ ਕਰ ਸਕਦੇ ਹਨ @ਤੇ ਈ-ਨਿਲਾਮੀ ਵਿੱਚ ਹਿੱਸਾ ਲੈ ਸਕਦੇ ਹਨ। ਸਾਡਾ ਟੀਚਾ ਪੂਰੀ ਤਰ੍ਹਾਂ ਪਾਰਦਰਸ਼ੀ ਪ੍ਰਸ਼ਾਸਨ ਅਤੇ ਸਰਲ ਪ੍ਰਕਿਰਿਆਵਾਂ ਹਨ।",
        "ਅਸੀਂ ਨਾਗਰਿਕਾਂ ਦੀ ਸਹੂਲਤ ਲਈ ਪੋਰਟਲ ਨੂੰ ਲਗਾਤਾਰ ਅਪਗ੍ਰੇਡ ਕਰ ਰਹੇ ਹਾਂ। ਮੈਂ ਸਾਰੇ ਬਿਨੈਕਾਰਾਂ ਨੂੰ ਭਰੋਸੇ ਨਾਲ ਸਾਡੇ ਸੁਰੱਖਿਅਤ ਪੋਰਟਲ 'ਤੇ ਬੋਲੀ ਲਗਾਉਣ ਲਈ ਸੱਦਾ ਦਿੰਦੀ ਹਾਂ।"
      ]
    }
  };

  openLeaderModal(id: string) {
    this.selectedLeaderId = id;
    this.selectedLeaderData = this.leadershipMessages[id];
    this.isLeaderModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeLeaderModal() {
    this.isLeaderModalOpen = false;
    this.selectedLeaderId = null;
    this.selectedLeaderData = null;
    document.body.style.overflow = '';
  }

  @ViewChild('galleryContainer') galleryContainer!: ElementRef<HTMLDivElement>;

  selectMessageTab(tab: string) {
    const element = document.getElementById('messages-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  scrollGallery(direction: number) {
    if (this.galleryContainer) {
      const container = this.galleryContainer.nativeElement;
      // Scroll by 3 cards (75% of container width)
      const scrollAmount = (container.clientWidth * 0.75) * direction;
      const targetLeft = container.scrollLeft + scrollAmount;
      
      this.animateScroll(container, targetLeft, 250); // Snappy 250ms animation duration
    }
  }

  private animateScroll(element: HTMLElement, target: number, duration: number) {
    const start = element.scrollLeft;
    const change = target - start;
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Snappy easeOutQuad easing
      const ease = progress * (2 - progress);
      element.scrollLeft = start + change * ease;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }
}
