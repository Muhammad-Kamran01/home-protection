
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../supabase';
import { Service, ServiceCategory } from '../types';

const ServicesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const activeCategoryId = searchParams.get('category') || 'all';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: catData } = await supabase.from('service_categories').select('*');
      const { data: servData } = await supabase.from('services').select('*').eq('is_active', true);

      if (catData) setCategories(catData);
      if (servData) setServices(servData);

      // Dummy data fallback
      if (!catData || catData.length === 0) {
        const dummyCats: ServiceCategory[] = [
          { id: '1', name: 'AC Services', icon: 'fa-snowflake', description: 'Expert cooling' },
          { id: '2', name: 'Carpentry', icon: 'fa-hammer', description: 'Woodwork' },
          { id: '3', name: 'Security', icon: 'fa-video', description: 'Safe homes' },
        ];
        setCategories(dummyCats);

        const dummyServs: Service[] = [
          { id: '1', category_id: '1', name: 'AC Installation', description: 'Full unit installation with gas refilling.', image_url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop', marked_price: 5000, discount_price: 3500, is_active: true },
          { id: '2', category_id: '1', name: 'AC Maintenance', description: 'Routine servicing and deep cleaning.', image_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop', marked_price: 7000, discount_price: 5000, is_active: true },
          { id: '3', category_id: '2', name: 'Home Wiring', description: 'Full electrical circuit checkup.', image_url: 'https://images.unsplash.com/photo-1558210857-393f8992d27c?q=80&w=2070&auto=format&fit=crop', marked_price: 10000, discount_price: 7000, is_active: true },
        ];
        setServices(dummyServs);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredServices = services.filter(s => {
    const matchesCat = activeCategoryId === 'all' || s.category_id === activeCategoryId;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-blue-800 py-20 text-center text-white">
        <h1 className="text-4xl font-black mb-4">Our Services</h1>
        <p className="text-blue-100 max-w-xl mx-auto">Quality maintenance solutions tailored for your needs.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4 space-y-8">
            {/* Search */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                <i className="fas fa-search text-blue-600"></i> Search
              </h3>
              <input 
                type="text" 
                placeholder="Find a service..." 
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Categories List */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                <i className="fas fa-th-list text-blue-600"></i> Categories
              </h3>
              <div className="space-y-2">
                <button 
                  onClick={() => setSearchParams({})}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeCategoryId === 'all' ? 'bg-blue-600 text-white font-bold' : 'hover:bg-gray-100'}`}
                >
                  All Services
                </button>
                {categories.map((cat) => (
                  <button 
                    key={cat.id}
                    onClick={() => setSearchParams({ category: cat.id })}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeCategoryId === cat.id ? 'bg-blue-600 text-white font-bold' : 'hover:bg-gray-100 text-gray-600'}`}
                  >
                    <span>{cat.name}</span>
                    <i className={`fas ${cat.icon} opacity-50`}></i>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Service Grid */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredServices.length > 0 ? filteredServices.map((service) => (
                  <div key={service.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                    <div className="relative h-48 overflow-hidden">
                      <img src={service.image_url} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      {service.marked_price > service.discount_price && (
                        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg">
                          Save PKR {service.marked_price - service.discount_price}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-blue-900 mb-2">{service.name}</h3>
                      <p className="text-gray-500 text-sm mb-6 line-clamp-2">{service.description}</p>
                      
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex flex-col">
                          <span className="text-2xl font-black text-blue-600">PKR {service.discount_price}</span>
                          {service.marked_price > service.discount_price && (
                            <span className="text-xs text-gray-400 line-through">PKR {service.marked_price}</span>
                          )}
                        </div>
                      </div>

                      <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100">
                        <i className="fas fa-calendar-check"></i> Book Now
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full text-center py-20 bg-white rounded-3xl">
                    <i className="fas fa-box-open text-6xl text-gray-200 mb-6"></i>
                    <p className="text-gray-500 font-medium">No services found matching your criteria.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
