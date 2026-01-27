import React, { useState } from 'react';
import { BookingService } from '../services/db';
import { RESTAURANT_DETAILS } from '../constants';
import { Calendar, Clock, User, CheckCircle, Mail } from 'lucide-react';

const BookingForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    // Basic Time Validation (Opening - 12 AM)
    const [hour] = formData.time.split(':').map(Number);
    if (hour < 12) {
      alert("We open at 12:00 PM. Please choose a later time.");
      setStatus('idle');
      return;
    }

    try {
      await BookingService.create(formData);
      setStatus('success');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: 2
      });
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div id="book" className="py-24 bg-elegant-base text-white flex justify-center items-center">
        <div className="bg-elegant-card p-12 text-center max-w-lg mx-4 border border-gold-accent/20 shadow-2xl rounded-sm">
          <CheckCircle className="w-16 h-16 text-gold-accent mx-auto mb-6" />
          <h3 className="text-3xl font-serif mb-4">Request Received</h3>
          <p className="text-stone-400 font-light mb-8">
            Thank you. We have received your request. A confirmation email has been sent to your address.
          </p>
          <button 
            onClick={() => setStatus('idle')}
            className="px-8 py-3 bg-transparent border border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-elegant-base uppercase tracking-widest text-xs font-bold transition-all"
          >
            Make Another Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <section id="book" className="py-24 bg-elegant-base relative border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 shadow-2xl">
          
          {/* Info Side */}
          <div className="bg-elegant-card p-12 lg:p-16 flex flex-col justify-center border-l border-t border-r lg:border-r-0 lg:border-b border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <h3 className="text-3xl font-serif text-white mb-6">Reservations</h3>
            <p className="mb-10 text-stone-400 font-light leading-relaxed">
              Immerse yourself in the authentic flavors of Chennai. 
              Book your table for an unforgettable dining experience.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start">
                <Clock className="mt-1 mr-4 text-gold-accent" size={20} />
                <div>
                  <p className="text-white font-serif text-lg">Opening Hours</p>
                  <p className="text-sm text-stone-500 mt-1">Daily: 12:00 PM - 12:00 AM</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mt-1 mr-4 text-gold-accent">📍</div>
                <div>
                   <p className="text-white font-serif text-lg">Location</p>
                   <p className="text-sm text-stone-500 mt-1">{RESTAURANT_DETAILS.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-stone-100 p-12 lg:p-16">
            <h2 className="text-2xl font-serif font-bold text-charcoal-900 mb-8">Secure Your Table</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                   <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 block">Name</label>
                   <input 
                      type="text" 
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full bg-white border-b-2 border-stone-200 py-3 focus:border-gold-accent outline-none transition-colors text-charcoal-900 placeholder-stone-400"
                      placeholder="Your Name"
                    />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 block">Phone</label>
                  <input 
                      type="tel" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-white border-b-2 border-stone-200 py-3 focus:border-gold-accent outline-none transition-colors text-charcoal-900 placeholder-stone-400"
                      placeholder="+44..."
                    />
                </div>
              </div>

              <div>
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 block">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white border-b-2 border-stone-200 py-3 focus:border-gold-accent outline-none transition-colors text-charcoal-900 placeholder-stone-400"
                    placeholder="email@address.com"
                  />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 block">Date</label>
                  <input 
                      type="date" 
                      name="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full bg-white border-b-2 border-stone-200 py-3 focus:border-gold-accent outline-none text-charcoal-900"
                    />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 block">Time</label>
                  <input 
                      type="time" 
                      name="time"
                      required
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full bg-white border-b-2 border-stone-200 py-3 focus:border-gold-accent outline-none text-charcoal-900"
                    />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 block">Guests</label>
                  <select 
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    className="w-full bg-white border-b-2 border-stone-200 py-3 focus:border-gold-accent outline-none text-charcoal-900"
                  >
                    {[1,2,3,4,5,6,7,8,9,10, '10+'].map(num => (
                      <option key={num} value={num}>{num} Guests</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-6">
                <button 
                    type="submit" 
                    disabled={status === 'submitting'}
                    className="w-full py-4 bg-elegant-base text-gold-accent font-bold uppercase tracking-widest text-sm hover:bg-black transition-colors disabled:opacity-50"
                >
                    {status === 'submitting' ? 'Processing...' : 'Confirm Request'}
                </button>
                <p className="text-center text-xs text-stone-400 mt-4">
                    Powered by EmailJS (Simulated). You will receive a confirmation email shortly.
                </p>
              </div>

            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;