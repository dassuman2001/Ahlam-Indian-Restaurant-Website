import React, { useEffect, useState } from 'react';
import { BookingService, MenuService } from '../services/db';
import { Booking, MenuItem } from '../types';
import { Check, X, LogOut, RefreshCw, Mail, Utensils, BookOpen, Edit2, Trash2, Plus, Upload, Lock, User, Calendar, Clock, Image as ImageIcon, Phone } from 'lucide-react';

// Toast Notification Component
const Toast = ({ message, type }: { message: string, type: 'success' | 'info' }) => (
  <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white max-w-sm z-50 animate-bounce ${type === 'success' ? 'bg-green-800 border border-green-600' : 'bg-blue-800 border border-blue-600'}`}>
    <div className="flex items-center">
      <Mail className="mr-2" size={18} />
      <span className="text-sm font-medium">{message}</span>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'bookings' | 'menu'>('bookings');
  
  // Booking State
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  
  // Menu State
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const [currentMenuItem, setCurrentMenuItem] = useState<Partial<MenuItem>>({
      name: '', description: '', price: '', image: '', category: 'chennai-starter', isVegan: false, isChefSpecial: false
  });

  const [notification, setNotification] = useState<{msg: string, type: 'success'|'info'} | null>(null);

  // --- Auth Logic ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
        setIsAuthenticated(true);
        setLoginError('');
    } else {
        setLoginError('Invalid Access Key');
    }
  };

  const handleLogout = () => {
      setIsAuthenticated(false);
      setPassword('');
      // Navigate to home page
      window.location.href = '/'; 
  };

  // --- Data Fetching ---

  const fetchBookings = async () => {
    setLoadingBookings(true);
    const data = await BookingService.getAll();
    const sorted = data.sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    setBookings(sorted);
    setLoadingBookings(false);
  };

  const fetchMenu = async () => {
      setLoadingMenu(true);
      const data = await MenuService.getAll();
      setMenuItems(data);
      setLoadingMenu(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
        if (activeTab === 'bookings') fetchBookings();
        if (activeTab === 'menu') fetchMenu();
    }
  }, [activeTab, isAuthenticated]);

  // --- Booking Actions ---

  const handleStatusChange = async (id: string, newStatus: 'confirmed' | 'declined', customerName: string) => {
    try {
      await BookingService.updateStatus(id, newStatus);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
      const emailType = newStatus === 'confirmed' ? 'CONFIRMATION' : 'CANCELLATION';
      showNotification(`Email sent to ${customerName}: ${emailType}`, 'success');
    } catch (error) {
      alert("Error updating booking");
    }
  };

  // --- Menu Actions ---

  const handleMenuSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          // Robust Formatting: Ensure price always starts with £
          const rawPrice = currentMenuItem.price || '0';
          const formattedPrice = rawPrice.trim().startsWith('£') 
              ? rawPrice.trim() 
              : `£${rawPrice.trim()}`;
          
          const itemToSave = { ...currentMenuItem, price: formattedPrice };

          if (currentMenuItem.id) {
              // Update
              await MenuService.update(itemToSave as MenuItem);
              showNotification("Item Updated Successfully", 'success');
          } else {
              // Create
              await MenuService.add(itemToSave as Omit<MenuItem, 'id'>);
              showNotification("Item Added Successfully", 'success');
          }
          setIsEditingMenu(false);
          setCurrentMenuItem({ name: '', description: '', price: '', image: '', category: 'chennai-starter', isVegan: false, isChefSpecial: false });
          fetchMenu();
      } catch (e) {
          console.error(e);
          alert("Failed to save menu item");
      }
  };

  const handleEditItem = (item: MenuItem) => {
      setCurrentMenuItem(item);
      setIsEditingMenu(true);
  };

  const handleDeleteItem = async (id: string) => {
      if (!window.confirm("Are you sure you want to delete this item?")) return;
      try {
          await MenuService.delete(id);
          fetchMenu();
          showNotification("Item Deleted", 'info');
      } catch (e) {
          console.error(e);
      }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setCurrentMenuItem({ ...currentMenuItem, image: reader.result as string });
          };
          reader.readAsDataURL(file);
      }
  };

  const showNotification = (msg: string, type: 'success' | 'info') => {
      setNotification({ msg, type });
      setTimeout(() => setNotification(null), 4000);
  };

  // --- Login Screen Render ---
  if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-elegant-base flex items-center justify-center relative overflow-hidden">
            {/* Dark Radial Background Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-accent/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 w-full max-w-md px-6">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-serif font-bold text-gold-accent tracking-wider mb-2">AHLAM</h1>
                        <p className="text-xs uppercase tracking-[0.3em] text-stone-400">Management Portal</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">Access Key</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-stone-500" size={18} />
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-elegant-base/50 border border-white/10 rounded-md py-3 pl-10 pr-4 text-white focus:border-gold-accent focus:ring-0 outline-none transition-colors"
                                    placeholder="Enter password"
                                />
                            </div>
                            {loginError && <p className="text-red-400 text-xs mt-2 text-center">{loginError}</p>}
                        </div>

                        <button 
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-bold uppercase tracking-widest text-sm rounded-md shadow-lg hover:shadow-gold-accent/20 transition-all transform hover:-translate-y-0.5"
                        >
                            Login
                        </button>
                    </form>
                    
                    <div className="mt-8 text-center">
                        <a href="/" className="text-xs text-stone-500 hover:text-stone-300 transition-colors">← Return to Website</a>
                    </div>
                </div>
            </div>
        </div>
      );
  }

  // --- Dashboard Renderers ---

  const renderBookings = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loadingBookings ? (
             <div className="col-span-full text-center py-20 text-stone-500">Loading bookings...</div>
        ) : bookings.length === 0 ? (
             <div className="col-span-full text-center py-20 text-stone-500">No booking requests found.</div>
        ) : (
            bookings.map((booking) => (
                <div key={booking.id} className={`bg-elegant-card border border-white/5 rounded-lg p-6 shadow-lg transition-all hover:border-white/10 ${booking.status === 'pending' ? 'border-l-4 border-l-gold-500' : ''}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-white">{booking.fullName}</h3>
                            <div className="flex items-center text-stone-400 text-xs mt-1">
                                <Mail size={12} className="mr-1" /> {booking.email}
                            </div>
                            <div className="flex items-center text-stone-400 text-xs mt-1">
                                <Phone size={12} className="mr-1" /> {booking.phone}
                            </div>
                        </div>
                        <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm 
                            ${booking.status === 'confirmed' ? 'bg-green-900/50 text-green-400 border border-green-800' : 
                            booking.status === 'declined' ? 'bg-red-900/50 text-red-400 border border-red-800' : 
                            'bg-yellow-900/50 text-yellow-400 border border-yellow-800'}`}>
                            {booking.status}
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6 bg-elegant-base/50 p-3 rounded-md border border-white/5">
                        <div>
                            <p className="text-[10px] uppercase text-stone-500 font-bold">Date</p>
                            <div className="flex items-center text-stone-200 text-sm">
                                <Calendar size={14} className="mr-2 text-gold-accent" /> {booking.date}
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase text-stone-500 font-bold">Time</p>
                            <div className="flex items-center text-stone-200 text-sm">
                                <Clock size={14} className="mr-2 text-gold-accent" /> {booking.time}
                            </div>
                        </div>
                        <div className="col-span-2 border-t border-white/5 pt-2 mt-1">
                            <p className="text-[10px] uppercase text-stone-500 font-bold">Party Size</p>
                            <div className="flex items-center text-stone-200 text-sm">
                                <User size={14} className="mr-2 text-gold-accent" /> {booking.guests} Guests
                            </div>
                        </div>
                    </div>

                    {booking.status === 'pending' ? (
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => handleStatusChange(booking.id, 'confirmed', booking.fullName)}
                                className="flex justify-center items-center py-2 bg-green-700 hover:bg-green-600 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors"
                            >
                                <Check size={14} className="mr-1" /> Confirm
                            </button>
                            <button 
                                onClick={() => handleStatusChange(booking.id, 'declined', booking.fullName)}
                                className="flex justify-center items-center py-2 bg-red-800 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors"
                            >
                                <X size={14} className="mr-1" /> Decline
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-2 text-xs text-stone-500 italic border-t border-white/5">
                            Processed on {new Date().toLocaleDateString()}
                        </div>
                    )}
                </div>
            ))
        )}
    </div>
  );

  const renderMenu = () => (
      <div className="space-y-8">
          {/* Add/Edit Form Toggle */}
          <div className="flex justify-between items-center bg-elegant-card p-4 rounded-lg border border-white/5">
              <h3 className="text-white font-serif text-lg">Menu Items ({menuItems.length})</h3>
              <button 
                onClick={() => {
                    setIsEditingMenu(!isEditingMenu);
                    setCurrentMenuItem({ name: '', description: '', price: '', image: '', category: 'chennai-starter', isVegan: false, isChefSpecial: false });
                }}
                className={`flex items-center px-6 py-2 rounded-sm transition-colors text-xs font-bold uppercase tracking-widest ${
                    isEditingMenu 
                    ? 'bg-stone-700 text-white hover:bg-stone-600' 
                    : 'bg-gradient-to-r from-gold-500 to-gold-600 text-white hover:shadow-lg'
                }`}
              >
                  {isEditingMenu ? <X size={16} className="mr-2"/> : <Plus size={16} className="mr-2"/>}
                  {isEditingMenu ? 'Cancel' : 'Add New Item'}
              </button>
          </div>

          {/* Edit Form */}
          {isEditingMenu && (
              <div className="bg-elegant-card p-8 rounded-lg shadow-2xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold-accent/5 rounded-full blur-2xl"></div>
                  
                  <h3 className="text-xl font-serif text-gold-accent mb-6">{currentMenuItem.id ? 'Edit Dish' : 'Create New Dish'}</h3>
                  
                  <form onSubmit={handleMenuSubmit} className="grid grid-cols-1 gap-6 relative z-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 block">Dish Name</label>
                            <input 
                                placeholder="e.g. Chicken 65" 
                                className="w-full bg-elegant-base border border-white/10 rounded-sm px-4 py-3 text-white focus:border-gold-accent outline-none" 
                                value={currentMenuItem.name} 
                                onChange={e => setCurrentMenuItem({...currentMenuItem, name: e.target.value})} 
                                required 
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 block">Price</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-stone-400 font-serif font-bold">£</span>
                                <input 
                                    type="number"
                                    step="0.01"
                                    placeholder="9.99" 
                                    className="w-full bg-elegant-base border border-white/10 rounded-sm pl-8 pr-4 py-3 text-white focus:border-gold-accent outline-none font-medium" 
                                    value={currentMenuItem.price ? currentMenuItem.price.replace(/^£/, '') : ''} 
                                    onChange={e => setCurrentMenuItem({...currentMenuItem, price: e.target.value ? `£${e.target.value}` : ''})} 
                                    required 
                                />
                            </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 block">Description</label>
                        <textarea 
                                placeholder="Describe the ingredients and flavor profile..." 
                                className="w-full bg-elegant-base border border-white/10 rounded-sm px-4 py-3 text-white focus:border-gold-accent outline-none h-24" 
                                value={currentMenuItem.description} 
                                onChange={e => setCurrentMenuItem({...currentMenuItem, description: e.target.value})} 
                                required 
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 block">Image Source</label>
                            
                            {/* File Upload Option */}
                            <div className="flex items-center space-x-2 mb-2">
                                <label className="flex-1 cursor-pointer bg-elegant-base border border-white/10 hover:border-gold-accent text-stone-300 px-4 py-3 rounded-sm flex items-center justify-center transition-colors">
                                    <Upload size={16} className="mr-2" />
                                    <span className="text-sm">Upload from Device</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            </div>
                            
                            <p className="text-[10px] text-stone-500 text-center mb-2">- OR -</p>
                            
                            <input 
                                    placeholder="Paste Image URL..." 
                                    className="w-full bg-elegant-base border border-white/10 rounded-sm px-4 py-2 text-white text-sm focus:border-gold-accent outline-none" 
                                    value={currentMenuItem.image} 
                                    onChange={e => setCurrentMenuItem({...currentMenuItem, image: e.target.value})} 
                            />
                        </div>
                        
                        <div>
                            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 block">Category</label>
                            <select 
                                className="w-full bg-elegant-base border border-white/10 rounded-sm px-4 py-3 text-white focus:border-gold-accent outline-none"
                                value={currentMenuItem.category}
                                onChange={e => setCurrentMenuItem({...currentMenuItem, category: e.target.value as any})}
                            >
                                <option value="chennai-starter">Chennai Starter</option>
                                <option value="south-indian-main">South Indian Main</option>
                            </select>
                            
                            <div className="flex space-x-6 mt-6">
                                <label className="flex items-center space-x-2 cursor-pointer group">
                                    <div className={`w-5 h-5 border rounded-sm flex items-center justify-center ${currentMenuItem.isVegan ? 'bg-gold-accent border-gold-accent' : 'border-stone-500'}`}>
                                        {currentMenuItem.isVegan && <Check size={14} className="text-elegant-base" />}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={currentMenuItem.isVegan} onChange={e => setCurrentMenuItem({...currentMenuItem, isVegan: e.target.checked})} />
                                    <span className="text-sm text-stone-300 group-hover:text-white">Vegan</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer group">
                                     <div className={`w-5 h-5 border rounded-sm flex items-center justify-center ${currentMenuItem.isChefSpecial ? 'bg-gold-accent border-gold-accent' : 'border-stone-500'}`}>
                                        {currentMenuItem.isChefSpecial && <Check size={14} className="text-elegant-base" />}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={currentMenuItem.isChefSpecial} onChange={e => setCurrentMenuItem({...currentMenuItem, isChefSpecial: e.target.checked})} />
                                    <span className="text-sm text-stone-300 group-hover:text-white">Chef's Special</span>
                                </label>
                            </div>
                        </div>
                      </div>

                      {currentMenuItem.image && (
                          <div className="mt-4">
                              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Preview</p>
                              <img src={currentMenuItem.image} alt="Preview" className="h-32 w-32 object-cover rounded-md border border-white/20" />
                          </div>
                      )}

                      <div className="pt-4 border-t border-white/5">
                        <button type="submit" className="px-8 py-3 bg-green-700 hover:bg-green-600 text-white font-bold uppercase tracking-widest text-xs rounded-sm transition-colors shadow-lg">
                            {currentMenuItem.id ? 'Update Dish' : 'Add to Menu'}
                        </button>
                      </div>
                  </form>
              </div>
          )}

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menuItems.map(item => (
                  <div key={item.id} className="bg-elegant-card p-4 rounded-lg shadow-lg border border-white/5 flex gap-4 group hover:border-gold-accent/30 transition-all">
                      <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0 bg-elegant-base">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                              <h4 className="font-bold text-white truncate pr-2 font-serif tracking-wide">{item.name}</h4>
                              <span className="text-sm font-bold text-gold-accent whitespace-nowrap">
                                {item.price.startsWith('£') ? item.price : `£${item.price}`}
                              </span>
                          </div>
                          <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                          <div className="flex gap-2 mt-3">
                              {item.isVegan && <span className="text-[10px] bg-green-900/50 text-green-400 border border-green-800 px-2 py-0.5 rounded-sm">Vegan</span>}
                              {item.isChefSpecial && <span className="text-[10px] bg-yellow-900/50 text-yellow-400 border border-yellow-800 px-2 py-0.5 rounded-sm">Special</span>}
                              <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded-sm border border-stone-700">{item.category}</span>
                          </div>
                      </div>
                      <div className="flex flex-col gap-2 justify-center border-l border-white/5 pl-4 ml-2">
                            <button onClick={() => handleEditItem(item)} className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-full transition-colors">
                                <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDeleteItem(item.id)} className="p-2 text-red-400 hover:bg-red-900/30 rounded-full transition-colors">
                                <Trash2 size={16} />
                            </button>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-elegant-base text-stone-100 font-sans flex flex-col">
      {notification && <Toast message={notification.msg} type={notification.type} />}

      {/* Header */}
      <header className="bg-elegant-base/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold-accent/10 rounded-full flex items-center justify-center border border-gold-accent/20">
                <span className="font-serif font-bold text-gold-accent">A</span>
            </div>
            <div>
                <h1 className="text-xl font-bold text-white tracking-wide">Admin Panel</h1>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest">Logged in as Manager</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-400 bg-red-900/20 hover:bg-red-900/40 border border-red-900/30 rounded-sm transition-all"
          >
            <LogOut size={14} className="mr-2" />
            Logout
          </button>
        </div>
        
        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 mt-6">
            <nav className="flex space-x-8">
                <button
                    onClick={() => setActiveTab('bookings')}
                    className={`pb-3 px-2 border-b-2 text-sm font-bold uppercase tracking-widest flex items-center transition-colors ${
                        activeTab === 'bookings' 
                        ? 'border-gold-accent text-gold-accent' 
                        : 'border-transparent text-stone-500 hover:text-stone-300 hover:border-stone-700'
                    }`}
                >
                    <BookOpen size={16} className="mr-2 mb-0.5"/> Bookings
                </button>
                <button
                    onClick={() => setActiveTab('menu')}
                    className={`pb-3 px-2 border-b-2 text-sm font-bold uppercase tracking-widest flex items-center transition-colors ${
                        activeTab === 'menu' 
                        ? 'border-gold-accent text-gold-accent' 
                        : 'border-transparent text-stone-500 hover:text-stone-300 hover:border-stone-700'
                    }`}
                >
                    <Utensils size={16} className="mr-2 mb-0.5"/> Menu Management
                </button>
            </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-10 w-full">
         {activeTab === 'bookings' ? renderBookings() : renderMenu()}
      </main>
    </div>
  );
};

export default AdminDashboard;