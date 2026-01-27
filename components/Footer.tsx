import React from 'react';
import { Instagram, MapPin, Phone, Clock } from 'lucide-react';
import { RESTAURANT_DETAILS } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal-950 text-stone-300 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          
          {/* Brand */}
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-bold text-gold-accent tracking-wider">AHLAM</h2>
            <p className="text-sm font-light leading-relaxed max-w-xs mx-auto md:mx-0 text-stone-400">
              {RESTAURANT_DETAILS.tagline}. Authentic South Indian flavors served in an elegant atmosphere.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Visit Us</h3>
            <div className="flex items-start justify-center md:justify-start space-x-3">
               <MapPin size={18} className="text-gold-accent shrink-0 mt-0.5" />
               <span className="font-light">{RESTAURANT_DETAILS.address}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3 pt-2">
              <Phone size={18} className="text-gold-accent shrink-0" />
              <span className="text-white font-serif text-lg">{RESTAURANT_DETAILS.phone}</span>
            </div>
          </div>

          {/* Hours */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Opening Hours</h3>
            <ul className="space-y-4 text-sm font-light">
              <li className="flex justify-between max-w-[200px] mx-auto md:mx-0 border-b border-white/5 pb-2">
                <span>Mon - Sun</span>
                <span className="text-white">12:00 PM - 12:00 AM</span>
              </li>
            </ul>
            <div className="pt-6 flex justify-center md:justify-start space-x-6">
                 <a href={RESTAURANT_DETAILS.instagramUrl} className="text-stone-400 hover:text-gold-accent transition-colors">
                    <Instagram size={24} />
                 </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500">
          <p>&copy; {new Date().getFullYear()} Ahlam Restaurant. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-6">
            <span className="hover:text-stone-300 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-stone-300 transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;