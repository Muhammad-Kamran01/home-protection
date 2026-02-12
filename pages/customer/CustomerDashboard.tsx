
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../App';
import { supabase } from '../../supabase';
import { Service, Booking, ServiceCategory } from '../../types';
import { Link } from 'react-router-dom';

const CustomerDashboard: React.FC = () => {
  const { user, refreshUser, signOut} = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'profile' | 'book'>('overview');
  const [bookings, setBookings] = useState<any[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    home_address: user?.home_address || '',
  });

  // Booking Form State
  const [bookingData, setBookingData] = useState({
    service_id: '',
    scheduled_at: '',
    address: '',
    contact_number: user?.phone || '',
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        full_name: user.full_name,
        phone: user.phone || '',
        home_address: user.home_address || '',
      });
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    const [bookingsRes, servicesRes, categoriesRes] = await Promise.all([
      supabase.from('bookings').select('*').eq('user_id', user?.id).order('created_at', { ascending: false }),
      supabase.from('services').select('*, category:service_categories(*)').eq('is_active', true),
      supabase.from('service_categories').select('*')
    ]);

    if (bookingsRes.data) setBookings(bookingsRes.data);
    if (servicesRes.data) setServices(servicesRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);
    setLoading(false);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profileForm.full_name,
        phone: profileForm.phone,
        home_address: profileForm.home_address,
      })
      .eq('id', user?.id);

    if (error) {
      alert('Error updating profile: ' + error.message);
    } else {
      await refreshUser();
      alert('Profile updated successfully!');
    }
    setLoading(false);
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingData.service_id || !bookingData.scheduled_at || !bookingData.address) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);
    const selectedService = services.find(s => s.id === bookingData.service_id);
    
    const { error } = await supabase.from('bookings').insert([{
      user_id: user?.id,
      status: 'pending',
      total_amount: selectedService?.discount_price || 0,
      scheduled_at: bookingData.scheduled_at,
      address: bookingData.address,
      contact_number: bookingData.contact_number
    }]);

    if (error) {
      alert('Booking failed: ' + error.message);
    } else {
      alert('Service booked successfully!');
      setBookingData({ ...bookingData, service_id: '', scheduled_at: '', address: '' });
      setActiveTab('bookings');
      fetchData();
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <div className="flex-1 bg-gray-50 flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden">
      {/* Dashboard Sidebar */}
      <aside className="w-full md:w-80 bg-white border-r border-gray-100 p-8 flex flex-col gap-8 h-screen overflow-y-auto">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-100">
            {user?.full_name[0]}
          </div>
          <div>
            <h2 className="font-black text-blue-900 leading-tight">Customer Portal</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Active Member</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {[
            { id: 'overview', name: 'Overview', icon: 'fa-th-large' },
            { id: 'bookings', name: 'My Bookings', icon: 'fa-calendar-check' },
            { id: 'book', name: 'Book Service', icon: 'fa-plus-circle' },
            { id: 'profile', name: 'Profile Settings', icon: 'fa-user-cog' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all font-bold text-sm ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                  : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <i className={`fas ${tab.icon} w-5`}></i>
              {tab.name}
            </button>
          ))}
          
          <div className="mt-4 pt-4 border-t border-gray-50">
            <button
              onClick={signOut}
              className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all font-bold text-sm text-red-500 hover:bg-red-50"
            >
              <i className="fas fa-sign-out-alt w-5"></i>
              Sign Out
            </button>
          </div>
        </nav>

        <div className="mt-auto bg-blue-900 p-6 rounded-3xl text-white relative overflow-hidden">
          <div className="relative z-10" style={{textAlign: 'center'}}>
            <h4 className="font-bold mb-1 text-sm">Need Help?</h4>
            <p className="text-[10px] text-blue-200 mb-4 leading-relaxed">Emergency support is available.</p>
            <Link to="/contact" className="inline-block bg-white text-blue-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Contact Us</Link>
          </div>
          <i className="fas fa-headset absolute -bottom-2 -right-2 text-white/10 text-6xl rotate-12"></i>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Dynamic Header */}
        <header className="bg-white px-10 py-6 shadow-sm border-b border-gray-100 flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-4xl font-black text-blue-900 mb-2">
              {activeTab === 'overview' && `Hello, ${user?.full_name.split(' ')[0]}!`}
              {activeTab === 'bookings' && 'Your Maintenance History'}
              {activeTab === 'book' && 'Schedule a Service'}
              {activeTab === 'profile' && 'Account Preferences'}
            </h1>
            <p className="text-gray-500 font-medium">
              {activeTab === 'overview' && 'Here is what is happening with your home maintenance.'}
              {activeTab === 'bookings' && 'Track and manage all your past and upcoming appointments.'}
              {activeTab === 'book' && 'Choose a professional service and pick a convenient time.'}
              {activeTab === 'profile' && 'Manage your personal details and contact information.'}
            </p>
          </div>
          <Link 
            to="/" 
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
          >
            <i className="fas fa-arrow-left text-blue-600"></i>
            Back to Home
          </Link>
        </header>
        
        <br></br>
        <br></br>
        {/* Tab Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-8 md:p-10">
          {activeTab === 'overview' && (
            <div className="space-y-10">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
                  <div className="bg-green-100 text-green-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-xl">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">Completed Orders</p>
                  <p className="text-3xl font-black text-blue-900">{bookings.filter(b => b.status === 'completed').length}</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
                  <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-xl">
                    <i className="fas fa-clock"></i>
                  </div>
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">Pending Orders</p>
                  <p className="text-3xl font-black text-blue-900">{bookings.filter(b => b.status === 'pending' || b.status === 'in_progress').length}</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
                  <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-xl">
                    <i className="fas fa-wallet"></i>
                  </div>
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">Total Spend Amount</p>
                  <p className="text-3xl font-black text-blue-900">PKR {bookings.reduce((acc, b) => acc + (b.total_amount || 0), 0)}</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-blue-900">Recent Bookings</h3>
                  <button onClick={() => setActiveTab('bookings')} className="text-blue-600 font-bold text-sm hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                  {bookings.slice(0, 3).map(b => (
                    <div key={b.id} className="flex items-center justify-between p-6 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm ${getStatusColor(b.status).split(' ')[1].replace('text-', 'bg-')}`}>
                          <i className={`fas ${b.status === 'completed' ? 'fa-check' : 'fa-tools'}`}></i>
                        </div>
                        <div>
                          <p className="font-bold text-blue-900">Service Request #{b.id.slice(0, 6)}</p>
                          <p className="text-xs text-gray-400">{new Date(b.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(b.status)}`}>
                        {b.status}
                      </span>
                    </div>
                  ))}
                  {bookings.length === 0 && <p className="text-center py-10 text-gray-400 font-medium">No recent activity to show.</p>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-6">
              {bookings.map(b => (
                <div key={b.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-2xl ${getStatusColor(b.status)}`}>
                      <i className="fas fa-file-invoice"></i>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-black text-blue-900 text-lg tracking-tight">Booking #{b.id.slice(0, 8)}</h4>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(b.status)}`}>
                          {b.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-1"><i className="fas fa-map-marker-alt text-blue-500 mr-2"></i> {b.address}</p>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Scheduled for: {new Date(b.scheduled_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 md:text-right">
                    <div>
                      <p className="text-2xl font-black text-blue-900">PKR {b.total_amount}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Amount Paid</p>
                    </div>
                    {b.status === 'pending' && (
                      <button 
                        onClick={async () => {
                          if(window.confirm('Are you sure you want to cancel this booking?')) {
                            await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', b.id);
                            fetchData();
                          }
                        }}
                        className="text-red-500 hover:text-red-700 p-3 rounded-xl hover:bg-red-50 transition-colors"
                      >
                        <i className="fas fa-times-circle text-xl"></i>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {bookings.length === 0 && (
                <div className="bg-white py-32 rounded-[3rem] text-center border-2 border-dashed border-gray-100">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200 text-3xl">
                    <i className="fas fa-calendar-times"></i>
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 mb-2">No Bookings Found</h3>
                  <p className="text-gray-400 mb-8 max-w-xs mx-auto">Start protecting your home by booking a professional maintenance service today.</p>
                  <button onClick={() => setActiveTab('book')} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black shadow-xl shadow-blue-100">Book Now</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-xl border border-gray-100">
                <form onSubmit={handleUpdateProfile} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Full Name</label>
                      <input 
                        type="text" 
                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50"
                        value={profileForm.full_name}
                        onChange={e => setProfileForm({...profileForm, full_name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Phone Number</label>
                      <input 
                        type="tel" 
                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50"
                        value={profileForm.phone}
                        onChange={e => setProfileForm({...profileForm, phone: e.target.value})}
                        placeholder="+92 3XX XXXXXXX"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Home Address</label>
                      <input 
                        type="text" 
                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50"
                        value={profileForm.home_address}
                        onChange={e => setProfileForm({...profileForm, home_address: e.target.value})}
                        placeholder="Enter your home address"
                      />
                  </div>
                  <div className="space-y-2 opacity-60">
                    <label className="text-sm font-bold text-gray-700">Email Address (Read-only)</label>
                    <input 
                      type="email" 
                      disabled
                      className="w-full px-6 py-4 rounded-2xl border border-gray-200 bg-gray-100 cursor-not-allowed"
                      value={user?.email || ''}
                    />
                  </div>
                  <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-50"
                    >
                      {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}
                      Save Account Changes
                    </button>
                  </div>
                </form>

                <div className="mt-12 pt-10 border-t border-gray-50 flex flex-col gap-6">
                  <h4 className="font-bold text-red-500">Danger Zone</h4>
                  <div className="flex items-center justify-between p-6 bg-red-50 rounded-2xl border border-red-100">
                    <div>
                      <p className="font-bold text-red-700">Privacy & Security</p>
                      <p className="text-xs text-red-600/60">Update your password or multi-factor authentication settings.</p>
                    </div>
                    <button className="text-red-700 font-bold text-sm hover:underline">Manage Security</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'book' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-xl border border-gray-100">
                <form onSubmit={handleCreateBooking} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Select Service Type</label>
                      <select 
                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50"
                        value={bookingData.service_id}
                        onChange={e => setBookingData({...bookingData, service_id: e.target.value})}
                        required
                      >
                        <option value="">Choose a service...</option>
                        {categories.map(cat => (
                          <optgroup key={cat.id} label={cat.name}>
                            {services.filter(s => s.category_id === cat.id).map(s => (
                              <option key={s.id} value={s.id}>{s.name} - PKR {s.discount_price}</option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Preferred Schedule</label>
                      <input 
                        type="datetime-local" 
                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50"
                        value={bookingData.scheduled_at}
                        onChange={e => setBookingData({...bookingData, scheduled_at: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Maintenance Address</label>
                    <textarea 
                      className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50"
                      rows={3}
                      placeholder="Street address, Apartment/House #, Sector..."
                      value={bookingData.address}
                      onChange={e => setBookingData({...bookingData, address: e.target.value})}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Site Contact Number</label>
                      <input 
                        type="tel" 
                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50"
                        placeholder="+92 3XX XXXXXXX"
                        value={bookingData.contact_number}
                        onChange={e => setBookingData({...bookingData, contact_number: e.target.value})}
                        required
                      />
                    </div>
                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-center gap-4">
                      <div className="text-blue-600 text-2xl"><i className="fas fa-shield-alt"></i></div>
                      <p className="text-xs text-blue-900 font-medium leading-relaxed">
                        Secure your home with our verified technicians. Payment will be collected after the service is completed to your satisfaction.
                      </p>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
                    >
                      {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-paper-plane mr-2"></i>}
                      Confirm Booking Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
