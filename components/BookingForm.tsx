import React, { useState } from 'react';
import { BookingService } from '../services/db';
import { RESTAURANT_DETAILS } from '../constants';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

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
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value, 10) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');
    
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
      setErrorMessage('Something went wrong. Please check your internet connection or call us directly.');
    }
  };

  if (status === 'success') {
    return (
      <div id="book" className="py-24 bg-elegant-base text-white flex justify-center items-center">
        <div className="bg-elegant-card p-12 text-center max-w-lg mx-4 border border-gold-accent/20 shadow-2xl rounded-sm">
          <CheckCircle className="w-16 h-16 text-gold-accent mx-auto mb-6" />
          <h3 className="text-3xl font-serif mb-4">Request Sent Successfully</h3>
          <p className="text-stone-300 font-light mb-8">
            Thank you, we have received your booking request.
            <br/><br/>
            You will be notified by email once your table is confirmed by our team.
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
          <div className="bg-elegant-card p-12 lg:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <h3 className="text-3xl font-serif text-white mb-6">Reservations</h3>
            <p className="mb-10 text-stone-300 font-light leading-relaxed">
              Immerse yourself in the authentic flavors of Chennai. 
              Book your table for an unforgettable dining experience.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start">
                <Clock className="mt-1 mr-4 text-gold-accent" size={20} />
                <div>
                  <p className="text-white font-serif text-lg">Opening Hours</p>
                  <p className="text-sm text-stone-400 mt-1">Daily: 12:00 PM - 12:00 AM</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mt-1 mr-4 text-gold-accent">📍</div>
                <div>
                   <p className="text-white font-serif text-lg">Location</p>
                   <p className="text-sm text-stone-400 mt-1">{RESTAURANT_DETAILS.address}</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mt-1 mr-4 text-gold-accent">📞</div>
                <div>
                   <p className="text-white font-serif text-lg">Contact</p>
                   <p className="text-sm text-stone-400 mt-1">{RESTAURANT_DETAILS.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-elegant-card/50 p-12 lg:p-16 border-t lg:border-t-0 lg:border-l border-white/5">
            <h2 className="text-2xl font-serif font-bold text-white mb-8">Secure Your Table</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                   <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 block">Name</label>
                   <input 
                      type="text" 
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full bg-elegant-base border-b border-white/10 rounded-sm px-4 py-3 focus:border-gold-accent focus:ring-0 outline-none transition-colors text-white placeholder-stone-500"
                      placeholder="Your Name"
                    />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 block">Phone</label>
                  <input 
                      type="tel" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-elegant-base border-b border-white/10 rounded-sm px-4 py-3 focus:border-gold-accent focus:ring-0 outline-none transition-colors text-white placeholder-stone-500"
                      placeholder="+44..."
                    />
                </div>
              </div>

              <div>
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 block">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-elegant-base border-b border-white/10 rounded-sm px-4 py-3 focus:border-gold-accent focus:ring-0 outline-none transition-colors text-white placeholder-stone-500"
                    placeholder="email@address.com"
                  />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 block">Date</label>
                  <input 
                      type="date" 
                      name="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full bg-elegant-base border-b border-white/10 rounded-sm px-4 py-3 focus:border-gold-accent focus:ring-0 outline-none text-white placeholder-stone-500"
                    />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 block">Time</label>
                  <input 
                      type="time" 
                      name="time"
                      required
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full bg-elegant-base border-b border-white/10 rounded-sm px-4 py-3 focus:border-gold-accent focus:ring-0 outline-none text-white placeholder-stone-500"
                    />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 block">Guests</label>
                  <select 
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    className="w-full bg-elegant-base border-b border-white/10 rounded-sm px-4 py-3 focus:border-gold-accent focus:ring-0 outline-none text-white placeholder-stone-500"
                  >
                    {[1,2,3,4,5,6,7,8,9,10, '10+'].map(num => (
                      <option key={num} value={typeof num === 'string' ? 10 : num}>{num} Guests</option>
                    ))}
                  </select>
                </div>
              </div>

              {status === 'error' && (
                <div className="bg-red-900/30 border border-red-800 p-4 rounded-sm flex items-start gap-3">
                   <AlertCircle className="text-red-400 shrink-0" size={18} />
                   <p className="text-red-200 text-sm">{errorMessage}</p>
                </div>
              )}

              <div className="pt-6">
                <button 
                    type="submit" 
                    disabled={status === 'submitting'}
                    className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-bold uppercase tracking-widest text-sm hover:from-white hover:to-white hover:text-elegant-base transition-all duration-300 disabled:opacity-50 rounded-sm shadow-lg"
                >
                    {status === 'submitting' ? 'Processing...' : 'Confirm Request'}
                </button>
                <p className="text-center text-xs text-stone-500 mt-4">
                   We will notify you via email when your booking is confirmed.
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