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
          setService({ id: serviceId, category_id: '', name: `Service ${serviceId}`, description: '', image_url: '', marked_price: 0, discount_price: 0, is_active: true, show_price: true });
        }
      } catch (err) {
        setService({ id: serviceId, category_id: '', name: `Service ${serviceId}`, description: '', image_url: '', marked_price: 0, discount_price: 0, is_active: true, show_price: true });
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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Book Service</h2>

        {loading ? (
          <div className="py-8 text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form - Left Side */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Details</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full name</label>
                  <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" className="mt-1 block w-full rounded-xl border border-gray-200 bg-gray-50 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <div className="flex items-center gap-4 pt-4">
                  <button type="submit" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow">Proceed to Checkout</button>
                  <button type="button" onClick={() => window.history.back()} className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-5 py-3 rounded-full">Back</button>
                </div>
              </form>
            </div>

            {/* Service Details - Right Side */}
            <div className="bg-white p-6 rounded-2xl shadow-md h-fit">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Service Details</h3>
              <div className="space-y-4">
                {service?.image_url && (
                  <div className="mb-4">
                    <img src={service.image_url} alt={service.name} className="w-full h-48 object-cover rounded-xl" />
                  </div>
                )}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{service ? service.name : 'Select a service'}</h4>
                  <p className="text-sm text-gray-600 mt-2">{service?.description}</p>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">Marked Price:</span>
                    <span className="text-gray-600 line-through">PKR {service?.marked_price ?? '—'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Discount Price:</span>
                    {(service?.show_price ?? true) ? (
                      <span className="text-2xl font-bold text-blue-600">PKR {service?.discount_price ?? '—'}</span>
                    ) : (
                      <span className="text-sm text-gray-600 italic">Contact for pricing</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
