import React, { useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { RESTAURANT_DETAILS } from '../constants';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-elegant-base/95 backdrop-blur-md text-stone-100 border-b border-white/10 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex flex-col justify-center">
              <h1 className="font-serif text-3xl font-bold tracking-wider text-gold-accent">AHLAM</h1>
              <span className="text-[10px] text-stone-300 tracking-[0.3em] uppercase">Reserve & Dining</span>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 lg:gap-10">
            <a href="#home" className="text-xs lg:text-sm uppercase tracking-widest hover:text-gold-accent transition-colors font-medium">Home</a>
            <a href="#menu" className="text-xs lg:text-sm uppercase tracking-widest hover:text-gold-accent transition-colors font-medium">Menu</a>
            
            <div className="flex items-center gap-6">
                <a href="#book" className="px-6 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-white hover:from-white hover:to-white hover:text-elegant-base transition-all uppercase tracking-widest text-[11px] font-bold whitespace-nowrap shadow-md hover:shadow-gold-accent/20 rounded-sm">
                Book a Table
                </a>
                
                {/* High Visibility Phone Number */}
                <div className="flex items-center text-white whitespace-nowrap min-w-max bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:border-gold-accent/50 transition-colors cursor-default">
                    <Phone size={16} className="mr-2.5 text-gold-accent fill-gold-accent" />
                    <span className="text-sm font-sans font-bold tracking-wide">{RESTAURANT_DETAILS.phone}</span>
                </div>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-gold-accent p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-elegant-card border-t border-white/10 shadow-2xl">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <a href="#home" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-base font-medium hover:text-gold-accent border-b border-white/5">Home</a>
            <a href="#menu" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-base font-medium hover:text-gold-accent border-b border-white/5">Menu</a>
            <a href="#book" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-base font-medium text-gold-accent font-bold mt-2">Book Table</a>
            <div className="flex items-center px-3 py-3 text-white bg-white/5 rounded-md mt-4">
                <Phone size={18} className="mr-3 text-gold-accent fill-gold-accent" />
                <span className="text-base font-bold">{RESTAURANT_DETAILS.phone}</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;