import React, { useEffect, useState } from 'react';
import { BookingService, MenuService } from '../services/db';
import { Booking, MenuItem } from '../types';
import { Check, X, LogOut, RefreshCw, Mail, Utensils, BookOpen, Edit2, Trash2, Plus } from 'lucide-react';

// Toast Notification Component
const Toast = ({ message, type }: { message: string, type: 'success' | 'info' }) => (
  <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white max-w-sm z-50 animate-bounce ${type === 'success' ? 'bg-green-600' : 'bg-blue-600'}`}>
    <div className="flex items-center">
      <Mail className="mr-2" size={18} />
      <span className="text-sm font-medium">{message}</span>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
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
    if (activeTab === 'bookings') fetchBookings();
    if (activeTab === 'menu') fetchMenu();
  }, [activeTab]);

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
          if (currentMenuItem.id) {
              // Update
              await MenuService.update(currentMenuItem as MenuItem);
              showNotification("Item Updated Successfully", 'success');
          } else {
              // Create
              await MenuService.add(currentMenuItem as Omit<MenuItem, 'id'>);
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

  const showNotification = (msg: string, type: 'success' | 'info') => {
      setNotification({ msg, type });
      setTimeout(() => setNotification(null), 4000);
  };

  // --- Renderers ---

  const renderBookings = () => (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {loadingBookings ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-500">Loading bookings...</td></tr>
            ) : bookings.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-500">No bookings requests found.</td></tr>
            ) : (
                bookings.map((booking) => (
                <tr key={booking.id} className={booking.status === 'pending' ? 'bg-orange-50/50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{booking.fullName}</span>
                        <span className="text-xs text-gray-500">{booking.email}</span>
                        <span className="text-xs text-gray-500">{booking.phone}</span>
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.date}</div>
                    <div className="text-sm text-gray-500">{booking.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.guests}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                        booking.status === 'declined' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {booking.status === 'pending' ? (
                        <div className="flex justify-end space-x-2">
                        <button 
                            onClick={() => handleStatusChange(booking.id, 'confirmed', booking.fullName)}
                            className="flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                            <Check size={14} className="mr-1" /> Confirm
                        </button>
                        <button 
                            onClick={() => handleStatusChange(booking.id, 'declined', booking.fullName)}
                            className="flex items-center px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                            <X size={14} className="mr-1" /> Decline
                        </button>
                        </div>
                    ) : (
                        <span className="text-gray-400 text-xs italic">Processed</span>
                    )}
                    </td>
                </tr>
                ))
            )}
            </tbody>
        </table>
        </div>
    </div>
  );

  const renderMenu = () => (
      <div className="space-y-8">
          {/* Add/Edit Form Toggle */}
          <div className="flex justify-end">
              <button 
                onClick={() => {
                    setIsEditingMenu(!isEditingMenu);
                    setCurrentMenuItem({ name: '', description: '', price: '', image: '', category: 'chennai-starter', isVegan: false, isChefSpecial: false });
                }}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${isEditingMenu ? 'bg-gray-200 text-gray-800' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                  {isEditingMenu ? <X size={18} className="mr-2"/> : <Plus size={18} className="mr-2"/>}
                  {isEditingMenu ? 'Cancel' : 'Add New Item'}
              </button>
          </div>

          {/* Edit Form */}
          {isEditingMenu && (
              <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                  <h3 className="text-lg font-bold mb-4">{currentMenuItem.id ? 'Edit Item' : 'New Menu Item'}</h3>
                  <form onSubmit={handleMenuSubmit} className="grid grid-cols-1 gap-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                            placeholder="Dish Name" 
                            className="p-2 border rounded" 
                            value={currentMenuItem.name} 
                            onChange={e => setCurrentMenuItem({...currentMenuItem, name: e.target.value})} 
                            required 
                        />
                         <input 
                            placeholder="Price (e.g. £9.99)" 
                            className="p-2 border rounded" 
                            value={currentMenuItem.price} 
                            onChange={e => setCurrentMenuItem({...currentMenuItem, price: e.target.value})} 
                            required 
                        />
                      </div>
                      <textarea 
                            placeholder="Description" 
                            className="p-2 border rounded w-full" 
                            value={currentMenuItem.description} 
                            onChange={e => setCurrentMenuItem({...currentMenuItem, description: e.target.value})} 
                            required 
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                                placeholder="Image URL (Unsplash)" 
                                className="p-2 border rounded" 
                                value={currentMenuItem.image} 
                                onChange={e => setCurrentMenuItem({...currentMenuItem, image: e.target.value})} 
                                required 
                        />
                        <select 
                            className="p-2 border rounded"
                            value={currentMenuItem.category}
                            onChange={e => setCurrentMenuItem({...currentMenuItem, category: e.target.value as any})}
                        >
                            <option value="chennai-starter">Chennai Starter</option>
                            <option value="south-indian-main">South Indian Main</option>
                        </select>
                      </div>
                      <div className="flex space-x-6">
                          <label className="flex items-center space-x-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={currentMenuItem.isVegan} 
                                onChange={e => setCurrentMenuItem({...currentMenuItem, isVegan: e.target.checked})}
                              />
                              <span className="text-sm">Vegan</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={currentMenuItem.isChefSpecial} 
                                onChange={e => setCurrentMenuItem({...currentMenuItem, isChefSpecial: e.target.checked})}
                              />
                              <span className="text-sm">Chef's Special</span>
                          </label>
                      </div>
                      <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700 font-bold">
                          {currentMenuItem.id ? 'Update Item' : 'Save Item'}
                      </button>
                  </form>
              </div>
          )}

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menuItems.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-lg shadow border border-gray-100 flex gap-4">
                      <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md bg-gray-100" />
                      <div className="flex-1">
                          <div className="flex justify-between items-start">
                              <h4 className="font-bold text-gray-800">{item.name}</h4>
                              <span className="text-sm font-bold text-green-700">{item.price}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                          <div className="flex gap-2 mt-2">
                              {item.isVegan && <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded">Vegan</span>}
                              {item.isChefSpecial && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Special</span>}
                              <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{item.category}</span>
                          </div>
                          <div className="flex justify-end gap-2 mt-4">
                              <button onClick={() => handleEditItem(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                                  <Edit2 size={16} />
                              </button>
                              <button onClick={() => handleDeleteItem(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                                  <Trash2 size={16} />
                              </button>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {notification && <Toast message={notification.msg} type={notification.type} />}

      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-xs text-gray-500">Ahlam Restaurant Manager</p>
          </div>
          <div className="flex items-center space-x-4">
             <a href="#/" className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md">
                <LogOut size={16} className="mr-2" />
                Exit
             </a>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 mt-4">
            <nav className="flex space-x-8">
                <button
                    onClick={() => setActiveTab('bookings')}
                    className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                        activeTab === 'bookings' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    <BookOpen size={18} className="mr-2"/> Bookings
                </button>
                <button
                    onClick={() => setActiveTab('menu')}
                    className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                        activeTab === 'menu' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    <Utensils size={18} className="mr-2"/> Menu Management
                </button>
            </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
         {activeTab === 'bookings' ? renderBookings() : renderMenu()}
      </main>
    </div>
  );
};

export default AdminDashboard;