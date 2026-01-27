import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MenuSection from '../components/MenuSection';
import BookingForm from '../components/BookingForm';
import Footer from '../components/Footer';
import { REVIEWS } from '../constants';
import { Quote } from 'lucide-react';

const Testimonials: React.FC = () => (
  <section className="py-24 bg-elegant-card border-t border-white/5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-serif text-white mb-4">Guest Experiences</h2>
        <div className="w-12 h-[1px] bg-gold-accent mx-auto"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {REVIEWS.map((review) => (
          <div key={review.id} className="bg-elegant-base p-10 border border-white/5 relative group hover:border-gold-accent/30 transition-colors shadow-lg">
            <Quote className="absolute top-6 left-6 text-charcoal-800 w-8 h-8 -z-0" />
            <p className="text-stone-300 font-serif italic mb-6 relative z-10 leading-relaxed">"{review.text}"</p>
            <div className="flex items-center">
                <div className="w-8 h-[1px] bg-gold-accent mr-3"></div>
                <p className="text-gold-accent text-xs uppercase tracking-widest">{review.author}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Home: React.FC = () => {
  return (
    <div className="bg-elegant-base min-h-screen">
      <Navbar />
      <Hero />
      <div className="bg-elegant-base py-20 border-b border-white/5 relative overflow-hidden">
        {/* Subtle radial gradient to break up the solid color */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/5 blur-3xl rounded-full -z-0"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
             <span className="text-gold-accent font-bold uppercase tracking-[0.2em] text-xs">Our Philosophy</span>
             <h2 className="mt-4 text-3xl md:text-4xl font-serif text-white leading-tight">Tradition meets Elegance</h2>
             <p className="mt-6 text-stone-300 font-light text-lg leading-relaxed">
               Located on Streatham High Road, Ahlam brings you the authentic, fiery, and soulful tastes of Chennai and South India.
               Every dish is crafted with fresh ingredients, traditional spices, and a passion for excellence.
             </p>
        </div>
      </div>
      <MenuSection />
      <BookingForm />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;