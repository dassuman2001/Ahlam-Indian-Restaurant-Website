import React from 'react';
import { Star } from 'lucide-react';
import { RESTAURANT_DETAILS } from '../constants';

const Hero: React.FC = () => {
  return (
    <div id="home" className="relative h-[90vh] min-h-[600px] flex items-center bg-elegant-base text-white overflow-hidden">
      {/* Background Image with Lighter Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop" 
          alt="Luxury Dining Background" 
          className="w-full h-full object-cover opacity-60" 
        />
        {/* Softened gradient to elegant base */}
        <div className="absolute inset-0 bg-gradient-to-t from-elegant-base via-elegant-base/50 to-transparent"></div>
        <div className="absolute inset-0 bg-elegant-base/20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        
        {/* Decorative Element */}
        <div className="w-[1px] h-20 bg-gradient-to-b from-transparent to-gold-accent mb-6"></div>

        <div className="flex items-center space-x-2 mb-8 border border-white/20 bg-elegant-base/60 backdrop-blur-md px-6 py-2 rounded-full shadow-lg">
          <div className="flex space-x-1">
             {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={12} className="fill-gold-accent text-gold-accent" />)}
          </div>
          <span className="text-xs uppercase tracking-widest text-stone-100 ml-3 border-l border-white/20 pl-3 font-bold">
            Streatham's Finest
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium tracking-tight mb-6 text-white leading-tight drop-shadow-lg">
          A Symphony of <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-accent via-gold-400 to-gold-600 italic">Spice & Soul</span>
        </h1>
        
        <p className="mt-4 max-w-xl text-lg md:text-xl text-stone-100 font-light leading-relaxed drop-shadow-md">
          Experience authentic South Indian cuisine in a setting of modern elegance. 
          {RESTAURANT_DETAILS.tagline}.
        </p>
        
        <div className="mt-12 flex flex-col md:flex-row gap-6">
          <a href="#book" className="px-10 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-bold text-sm tracking-widest uppercase hover:from-white hover:to-white hover:text-elegant-base transition-all duration-300 shadow-lg shadow-gold-accent/20 rounded-sm">
            Reserve a Table
          </a>
          <a href="#menu" className="px-10 py-4 border border-stone-300 text-stone-100 font-bold text-sm tracking-widest uppercase hover:border-gold-accent hover:text-gold-accent hover:bg-elegant-base/50 transition-all duration-300 rounded-sm">
            View Menu
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;