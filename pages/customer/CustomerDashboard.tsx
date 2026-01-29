
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../App';
import { supabase } from '../../supabase';

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      supabase.from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => { if (data) setBookings(data); });
    }
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Profile Card */}
        <div className="md:w-1/3">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-blue-900/5 border border-gray-100">
            <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center text-4xl font-black mx-auto mb-6">
              {user?.full_name[0]}
            </div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-blue-900">{user?.full_name}</h2>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>
            <div className="space-y-4 border-t border-gray-50 pt-8">
              <div className="flex items-center gap-3 text-gray-600">
                <i className="fas fa-phone-alt w-5"></i>
                <span className="text-sm font-medium">{user?.phone || 'No phone added'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <i className="fas fa-map-marker-alt w-5"></i>
                <span className="text-sm font-medium">Lahore, Pakistan</span>
              </div>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="md:w-2/3">
          <h3 className="text-2xl font-black text-blue-900 mb-8">My Booking History</h3>
          <div className="space-y-6">
            {bookings.length > 0 ? bookings.map(b => (
              <div key={b.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-black uppercase tracking-widest text-blue-600">Booking #{b.id.slice(0, 6)}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${b.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{b.status}</span>
                  </div>
                  <h4 className="font-bold text-gray-800">Maintenance Service at {b.address.split(',')[0]}</h4>
                  <p className="text-xs text-gray-400 mt-1">Scheduled: {new Date(b.scheduled_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-blue-900">PKR {b.total_amount}</p>
                  <button className="text-xs font-bold text-blue-600 hover:underline mt-2">View Invoice</button>
                </div>
              </div>
            )) : (
              <div className="bg-white py-20 rounded-[2.5rem] text-center border-2 border-dashed border-gray-200">
                <i className="fas fa-calendar-times text-5xl text-gray-200 mb-4"></i>
                <p className="text-gray-400 font-medium">You haven't booked any services yet.</p>
                <button className="mt-6 text-blue-600 font-bold hover:underline">Book your first service</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
