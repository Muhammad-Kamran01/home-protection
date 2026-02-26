import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { Service } from '../types';

const ServiceDetailsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const serviceId = searchParams.get('id');

  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .single();

      if (data) {
        setService(data);
      } else {
        // Fallback dummy data
        const dummyServices: Service[] = [
          { id: '1', category_id: '1', name: 'AC Installation', description: 'Full unit installation with gas refilling and warranty. Our expert technicians will handle the complete installation process including electrical setup, safety checks, and gas filling to ensure optimal performance and longevity of your cooling system.', image_url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop', marked_price: 5000, discount_price: 3500, is_active: true, show_price: true },
          { id: '2', category_id: '1', name: 'AC Maintenance', description: 'Routine servicing and deep cleaning of AC filters and coils. Regular maintenance ensures your air conditioner runs efficiently throughout the year, prevents breakdowns, and extends its lifespan. Our team uses premium cleaning solutions and quality parts.', image_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop', marked_price: 7000, discount_price: 5000, is_active: true, show_price: true },
          { id: '3', category_id: '2', name: 'Home Wiring', description: 'Full electrical circuit checkup and safety inspection. We inspect all wiring in your home, identify potential hazards, and ensure everything meets current safety standards. Perfect for new homes or older properties needing modernization.', image_url: 'https://images.unsplash.com/photo-1558210857-393f8992d27c?q=80&w=2070&auto=format&fit=crop', marked_price: 10000, discount_price: 7000, is_active: true, show_price: true },
        ];
        const found = dummyServices.find(s => s.id === serviceId);
        setService(found || null);
      }
      setLoading(false);
    };

    fetchService();
  }, [serviceId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <i className="fas fa-exclamation-triangle text-6xl text-gray-300 mb-6"></i>
          <h1 className="text-3xl font-bold text-gray-700 mb-4">Service Not Found</h1>
          <p className="text-gray-500 mb-8">The service you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/services')}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/services')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            <i className="fas fa-arrow-left"></i> Back to Services
          </button>
        </div>
      </div>

      {/* Service Details */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Image Section */}
          <div className="relative h-96 overflow-hidden bg-gray-100">
            {service.image_url ? (
              <img 
                src={service.image_url} 
                alt={service.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                <i className="fas fa-image text-gray-300 text-8xl"></i>
              </div>
            )}
            {(service.show_price ?? true) && service.marked_price > service.discount_price && (
              <div className="absolute top-6 right-6 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-black">
                Save PKR {service.marked_price - service.discount_price}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-8">
            <h1 className="text-4xl font-black text-blue-900 mb-2">{service.name}</h1>
            
            {/* Price Section */}
            {(service.show_price ?? true) ? (
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-blue-600">PKR {service.discount_price}</span>
                  {service.marked_price > service.discount_price && (
                    <span className="text-lg text-gray-400 line-through">PKR {service.marked_price}</span>
                  )}
                </div>
                {service.marked_price > service.discount_price && (
                  <span className="bg-green-100 text-green-800 px-4 py-1 rounded-lg font-bold text-sm">
                    {Math.round(((service.marked_price - service.discount_price) / service.marked_price) * 100)}% OFF
                  </span>
                )}
              </div>
            ) : (
              <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-lg font-semibold text-blue-900">Pricing</p>
                <p className="text-blue-700 mt-2">Contact us for custom pricing and special offers</p>
              </div>
            )}

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="fas fa-info-circle text-blue-600"></i> Service Details
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">
                {service.description}
              </p>
            </div>

            {/* Features/Highlights */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="fas fa-star text-yellow-500"></i> What's Included
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <i className="fas fa-check text-green-600 mt-1 font-bold"></i>
                  <span className="text-gray-700">Professional expertise & quality service</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-check text-green-600 mt-1 font-bold"></i>
                  <span className="text-gray-700">Warranty on work performed</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-check text-green-600 mt-1 font-bold"></i>
                  <span className="text-gray-700">Trained and certified technicians</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-check text-green-600 mt-1 font-bold"></i>
                  <span className="text-gray-700">Customer satisfaction guarantee</span>
                </li>
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate(`/booking?service=${service.id}`)}
                className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
              >
                <i className="fas fa-calendar-check"></i> Book Now
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="flex-1 border-2 border-blue-600 text-blue-600 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
              >
                <i className="fas fa-phone"></i> Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
