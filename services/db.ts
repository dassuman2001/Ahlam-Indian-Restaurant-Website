import { Booking, BookingStatus, MenuItem } from '../types';
import { RESTAURANT_DETAILS, MENU_ITEMS } from '../constants';

const BOOKING_STORAGE_KEY = 'ahlam_bookings';
const MENU_STORAGE_KEY = 'ahlam_menu';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Simulated Email System ---
const sendEmail = async (to: string, subject: string, body: string) => {
  console.log(`%c[EMAIL SYSTEM] Sending to: ${to}`, 'color: #0ea5e9; font-weight: bold;');
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
  // In a real app, this would call an API endpoint like /api/send-email
};

export const BookingService = {
  // Get all bookings
  getAll: async (): Promise<Booking[]> => {
    await delay(500);
    try {
      const stored = localStorage.getItem(BOOKING_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn("LocalStorage access denied or error:", e);
      return [];
    }
  },

  // Create a new booking
  create: async (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt'>): Promise<Booking> => {
    await delay(800);
    const bookings = await BookingService.getAll();
    
    const newBooking: Booking = {
      ...bookingData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      createdAt: Date.now(),
    };

    bookings.push(newBooking);
    
    try {
        localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {
        console.error("Could not save to localStorage", e);
    }

    // 1. Admin Alert Logic
    await sendEmail(
      'admin@ahlamrestaurant.com',
      `New Booking Request from ${newBooking.fullName}`,
      `New Booking Request from ${newBooking.fullName} for ${newBooking.date} at ${newBooking.time}.`
    );

    return newBooking;
  },

  // Update booking status (Confirm/Decline)
  updateStatus: async (id: string, status: BookingStatus): Promise<void> => {
    await delay(600);
    const bookings = await BookingService.getAll();
    const index = bookings.findIndex(b => b.id === id);
    
    if (index === -1) throw new Error("Booking not found");

    const booking = bookings[index];
    booking.status = status;
    bookings[index] = booking;
    
    try {
        localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {
        console.error("Could not save update to localStorage", e);
    }

    // 2. Customer Response Logic (The Core Feature)
    if (status === 'confirmed') {
      await sendEmail(
        booking.email,
        'Booking Confirmed - Ahlam Indian Restaurant',
        `Your table at Ahlam Indian Restaurant is CONFIRMED for ${booking.date}. See you at ${RESTAURANT_DETAILS.address}!`
      );
    } else if (status === 'declined') {
      await sendEmail(
        booking.email,
        'Booking Update - Ahlam Indian Restaurant',
        `Sorry, we are fully booked for ${booking.date}. Please call us at ${RESTAURANT_DETAILS.phone} to reschedule.`
      );
    }
  }
};

export const MenuService = {
    // Get all menu items
    getAll: async (): Promise<MenuItem[]> => {
        await delay(300); // Simulate fetch
        try {
            const stored = localStorage.getItem(MENU_STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
            // First run: Seed with default data
            localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(MENU_ITEMS));
            return MENU_ITEMS;
        } catch (e) {
            console.error("Storage error", e);
            return MENU_ITEMS;
        }
    },

    // Add new Item
    add: async (item: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
        await delay(500);
        const items = await MenuService.getAll();
        const newItem: MenuItem = {
            ...item,
            id: Math.random().toString(36).substr(2, 9),
        };
        items.push(newItem);
        localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(items));
        return newItem;
    },

    // Update existing item
    update: async (updatedItem: MenuItem): Promise<void> => {
        await delay(500);
        const items = await MenuService.getAll();
        const index = items.findIndex(i => i.id === updatedItem.id);
        if (index === -1) throw new Error("Item not found");
        
        items[index] = updatedItem;
        localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(items));
    },

    // Delete item
    delete: async (id: string): Promise<void> => {
        await delay(500);
        const items = await MenuService.getAll();
        const filtered = items.filter(i => i.id !== id);
        localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(filtered));
    }
};