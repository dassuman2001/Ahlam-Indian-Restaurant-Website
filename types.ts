export type BookingStatus = 'pending' | 'confirmed' | 'declined';

export interface Booking {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: BookingStatus;
  createdAt: number;
}

export interface MenuItem {
  id: string; // Changed from number to string for UUID generation
  name: string;
  description: string;
  price: string;
  image: string;
  isVegan?: boolean;
  isChefSpecial?: boolean;
  category: 'chennai-starter' | 'south-indian-main';
}

export interface Review {
  id: number;
  text: string;
  author: string;
}