import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { Service } from '../types';

const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const serviceId = searchParams.get('service');
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      if (!serviceId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.from('services').select('*').eq('id', serviceId).maybeSingle();
        if (data) {
          setService(data as Service);
        } else {
          setService({ id: serviceId, category_id: '', name: `Service ${serviceId}`, description: '', image_url: '', marked_price: 0, discount_price: 0, is_active: true });
        }
      } catch (err) {
        setService({ id: serviceId, category_id: '', name: `Service ${serviceId}`, description: '', image_url: '', marked_price: 0, discount_price: 0, is_active: true });
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [serviceId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to checkout with booking data in state
    navigate('/checkout', { state: { service, customer: { name, email, phone, preferredDate, notes, address } } });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-start justify-center">
      <div className="w-full max-w-2xl">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6" style={{textAlign: 'center'}}>Book Service</h2>

        {loading ? (
          <div className="py-8 text-center">Loading...</div>
        ) : (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{service ? service.name : 'Select a service'}</h3>
                <p className="text-sm text-gray-500">{service?.description}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Price</div>
                <div className="text-lg font-bold text-blue-600">PKR {service?.discount_price ?? '—'}</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full name</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" className="mt-1 block w-full rounded-xl border border-gray-200 bg-gray-50 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1 block w-full rounded-xl border border-gray-200 bg-gray-50 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="03xx-xxxxxxx" className="mt-1 block w-full rounded-xl border border-gray-200 bg-gray-50 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred date</label>
                <input type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} className="mt-1 block w-full rounded-xl border border-gray-200 bg-white p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add any helpful details (optional)" className="mt-1 block w-full rounded-xl border border-gray-200 bg-gray-50 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Complete Address</label>
                <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your complete address" className="mt-1 block w-full rounded-xl border border-gray-200 bg-gray-50 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button type="submit" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow">Proceed to Checkout</button>
                <button type="button" onClick={() => window.history.back()} className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-5 py-3 rounded-full">Back</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
