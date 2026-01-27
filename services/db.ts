import { Booking, BookingStatus, MenuItem } from '../types';

// PROFESSIONAL SETUP:
// 1. Locally, this looks for VITE_API_URL in your .env file (e.g., http://localhost:5000/api)
// 2. In Production (Vercel), if VITE_API_URL is not set in dashboard, it defaults to '/api'
//    which automatically talks to the backend on the same domain.
const API_URL = (import.meta as any).env.VITE_API_URL || '/api';

export const BookingService = {
  // Get all bookings from MongoDB
  getAll: async (): Promise<Booking[]> => {
    try {
      const response = await fetch(`${API_URL}/bookings`);
      if (!response.ok) throw new Error('Failed to fetch bookings');
      return await response.json();
    } catch (e) {
      console.error("API Error:", e);
      return [];
    }
  },

  // Create a new booking in MongoDB
  create: async (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt'>): Promise<Booking> => {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    
    if (!response.ok) throw new Error('Failed to create booking');
    return await response.json();
  },

  // Update booking status in MongoDB
  updateStatus: async (id: string, status: BookingStatus): Promise<void> => {
    const response = await fetch(`${API_URL}/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) throw new Error('Failed to update booking status');
  }
};

export const MenuService = {
    // Get all menu items from MongoDB
    getAll: async (): Promise<MenuItem[]> => {
        try {
            const response = await fetch(`${API_URL}/menu`);
            if (!response.ok) throw new Error('Failed to fetch menu');
            return await response.json();
        } catch (e) {
            console.error("API Error:", e);
            return [];
        }
    },

    // Add new Item to MongoDB
    add: async (item: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
        const response = await fetch(`${API_URL}/menu`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        });

        if (!response.ok) throw new Error('Failed to add menu item');
        return await response.json();
    },

    // Update existing item in MongoDB
    update: async (updatedItem: MenuItem): Promise<void> => {
        const response = await fetch(`${API_URL}/menu/${updatedItem.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedItem),
        });

        if (!response.ok) throw new Error('Failed to update menu item');
    },

    // Delete item from MongoDB
    delete: async (id: string): Promise<void> => {
        const response = await fetch(`${API_URL}/menu/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete menu item');
    }
};