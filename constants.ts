import { MenuItem, Review } from './types';

export const RESTAURANT_DETAILS = {
  name: "Ahlam Indian Restaurant",
  tagline: "Experience the Authentic Taste of Chennai",
  address: "217 Streatham High Rd, London SW16 6EG, United Kingdom",
  phone: "+44 20 3011 3039",
  openingTime: "12:00", 
  closingTime: "24:00", // Midnight
  instagramUrl: "https://instagram.com",
  rating: 4.8,
};

export const REVIEWS: Review[] = [
  { id: 1, text: "The Chicken 65 takes me straight back to Chennai. Incredible flavors.", author: "Arjun K." },
  { id: 2, text: "Best Ghee Lamb Roast I've had in London. A true hidden gem in Streatham.", author: "Sarah W." },
  { id: 3, text: "Elegant atmosphere and the Biryani is to die for.", author: "Foodie London" },
];

export const MENU_ITEMS: MenuItem[] = [
  // Chennai Starters
  { 
    id: "1", 
    name: "Chicken 65", 
    description: "Deep-fried chicken marinated in ginger, garlic, and fiery curry leaves.", 
    price: "£8.99", 
    category: "chennai-starter",
    image: "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?q=80&w=800&auto=format&fit=crop"
  },
  { 
    id: "2", 
    name: "Ghee Lamb Roast", 
    description: "Tender lamb pieces slow-roasted in pure ghee with black pepper and spices.", 
    price: "£10.50", 
    category: "chennai-starter",
    isChefSpecial: true,
    image: "https://images.unsplash.com/photo-1606471191009-63994c53433b?q=80&w=800&auto=format&fit=crop"
  },
  
  // South Indian Mains
  { 
    id: "3", 
    name: "Masala Dosa", 
    description: "Crispy large rice crepe stuffed with spiced potato masala, served with sambar.", 
    price: "£7.50", 
    category: "south-indian-main",
    isVegan: true,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop"
  },
  { 
    id: "4", 
    name: "Chennai Chicken Biryani", 
    description: "Aromatic Seeraga Samba rice cooked traditionally with tender chicken and spices.", 
    price: "£9.99", 
    category: "south-indian-main",
    isChefSpecial: true,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop"
  },
  { 
    id: "5", 
    name: "Chettinad Chicken Curry", 
    description: "A spicy, aromatic curry made with roasted coconuts and a blend of Chettinad spices.", 
    price: "£9.50", 
    category: "south-indian-main",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800&auto=format&fit=crop"
  }
];