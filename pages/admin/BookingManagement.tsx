
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Booking } from '../../types';

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('bookings')
      .select('*, profiles(full_name, phone)')
      .order('created_at', { ascending: false });
    if (data) setBookings(data);
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('bookings').update({ status }).eq('id', id);
    fetchBookings();
  };

  return (
    <div className="space-y-8">
      <h3 className="font-bold text-2xl text-blue-900">Live Bookings</h3>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] uppercase font-black tracking-widest text-gray-400">
            <tr>
              <th className="px-8 py-4">Customer</th>
              <th className="px-8 py-4">Service Details</th>
              <th className="px-8 py-4">Scheduled For</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {bookings.map(b => (
              <tr key={b.id} className="hover:bg-gray-50/50">
                <td className="px-8 py-6">
                  <p className="font-bold text-blue-900">{b.profiles?.full_name || 'Anonymous'}</p>
                  <p className="text-xs text-gray-400">{b.profiles?.phone}</p>
                </td>
                <td className="px-8 py-6">
                  <p className="text-sm text-gray-600">{b.address}</p>
                  <p className="text-xs font-bold text-blue-600">PKR {b.total_amount}</p>
                </td>
                <td className="px-8 py-6 text-sm text-gray-500">
                  {new Date(b.scheduled_at).toLocaleDateString()}
                </td>
                <td className="px-8 py-6">
                  <select 
                    value={b.status} 
                    onChange={(e) => updateStatus(b.id, e.target.value)}
                    className="text-xs font-bold bg-gray-50 border-none rounded-lg px-2 py-1 outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-8 py-6">
                  <button className="text-blue-600 font-bold text-xs hover:underline">Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingManagement;
