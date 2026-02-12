import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state || {}) as any;
  const { service, customer } = state;

  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleConfirm = async () => {
    setProcessing(true);
    try {
      // Try to persist booking to `bookings` table if available
      if (supabase) {
        const { error } = await supabase.from('bookings').insert([{ 
          service_id: service?.id || null, 
          customer_name: customer?.name || null, 
          customer_email: customer?.email || null, 
          customer_phone: customer?.phone || null, 
          preferred_date: customer?.preferredDate || null, 
          notes: customer?.notes || null,
          address: customer?.address || null,
          total_amount: service?.discount_price || null,
          status: 'pending' }]);
        if (error) {
          console.warn('Could not save booking:', error.message);
        }
      }

      // Step 1: Insert into bookings table
        const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert([{
          service_id: service.id,
          customer_name: customer.name,
          customer_email: customer.email,
          contact_number: customer.phone,
          scheduled_at: customer.preferredDate ? new Date(customer.preferredDate).toISOString() : new Date().toISOString(),
          notes: customer.notes,
          address: customer.address || '',
          total_amount: service.discount_price || 0,
          status: 'pending',
          created_at: new Date().toISOString() // optional
      }])
      .select()
      .single();

    if (bookingError) {
      console.error('Booking insert failed:', bookingError);
      setMessage('Failed to save booking. Please try again.');
      return;
    }

    // Step 2: Insert into booking_items table
    if (booking) {
      const { error: itemError } = await supabase
        .from('booking_items')
        .insert([{
          booking_id: booking.id,
          service_id: service.id,
          quantity: 1,
          price_at_booking: service.discount_price
        }]);

      if (itemError) {
        console.warn('Booking items insert failed:', itemError);
      }
    }

      setMessage('Booking confirmed! We will contact you shortly.');
      setTimeout(() => navigate('/'), 2500);
    } catch (err) {
      setMessage('An error occurred while confirming the booking.');
    } finally {
      setProcessing(false);
    }
  };

  if (!service || !customer) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-start justify-center">
        <div className="w-full max-w-2xl">
          <div className="bg-white p-6 rounded-2xl shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2">No booking data</h3>
            <p className="text-sm text-gray-500 mb-4">Please go back and select a service to book.</p>
            <div className="flex justify-center"><button onClick={() => navigate('/services')} className="bg-blue-600 text-white px-6 py-3 rounded-full">Browse Services</button></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-start justify-center">
      <div className="w-full max-w-2xl">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6" style={{textAlign: 'center'}}>Checkout</h2>
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-1">{service.name}</h3>
              <p className="text-sm text-gray-500">{service.description}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Price</div>
              <div className="text-lg font-bold text-blue-600">PKR {service.discount_price}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-xs text-gray-500">Customer</p>
              <p className="font-medium">{customer.name}</p>
              <p className="text-sm text-gray-500">{customer.email} · {customer.phone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Selected Date</p>
              <p className="font-medium">{customer.preferredDate || 'Anytime'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Address</p>
              <p className="font-medium">{customer.address || 'Not provided'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button disabled={processing} onClick={handleConfirm} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold">{processing ? 'Processing...' : 'Confirm Booking'}</button>
            <button onClick={() => navigate(-1)} className="bg-gray-100 hover:bg-gray-200 px-5 py-3 rounded-full">Back</button>
          </div>

          {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
