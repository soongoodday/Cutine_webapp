export interface UserProfile {
  nickname: string;
  hairLength: 'short' | 'medium' | 'long';
  cutCycleDays: number;
  notificationEnabled: boolean;
  notificationDays: number[];
  createdAt: string;
}

export interface CutRecord {
  id: string;
  date: string;
  memo?: string;
  salonName?: string;
  cost?: number;
  createdAt: string;
}

export interface Salon {
  id: string;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  distance?: number;
  rating?: number;
  imageUrl?: string;
  bookingUrl?: string;
  isPartner: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'essence' | 'wax' | 'shampoo' | 'dryer' | 'etc';
  imageUrl: string;
  price: number;
  affiliateUrl: string;
  hairTypes: ('short' | 'medium' | 'long')[];
  description: string;
}

export interface TipStep {
  emoji: string;
  text: string;
}

export interface Tip {
  id: string;
  title: string;
  subtitle: string;
  category: 'dry' | 'style' | 'care' | 'etc';
  icon: string;
  steps: TipStep[];
  doList?: string[];
  dontList?: string[];
}

export interface PartnerApplication {
  id?: string;
  salonName: string;
  ownerName: string;
  phone: string;
  address: string;
  bookingUrl?: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
}

export interface AdminMemo {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}
