
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Service, ServiceCategory } from '../../types';

const ServiceManagement: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    description: '',
    image_url: '',
    marked_price: 0,
    discount_price: 0,
    is_active: true,
    show_price: true
  });

  const fetchAll = async () => {
    setLoading(true);
    const { data: cats } = await supabase.from('service_categories').select('*');
    const { data: servs } = await supabase.from('services').select('*, category:service_categories(*)');
    if (cats) setCategories(cats);
    if (servs) setServices(servs);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Service name is required');
      return;
    }
    if (!formData.category_id) {
      setError('Category is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    if (formData.show_price && formData.discount_price <= 0) {
      setError('Discount price must be greater than 0 when "Show Price" is enabled');
      return;
    }
    if (formData.show_price && formData.marked_price <= 0) {
      setError('Marked price must be greater than 0 when "Show Price" is enabled');
      return;
    }

    setLoading(true);
    
    try {
      if (editId) {
        const { error: updateError } = await supabase.from('services').update(formData).eq('id', editId);
        if (updateError) {
          setError(`Update failed: ${updateError.message}`);
          setLoading(false);
          return;
        }
      } else {
        const { error: insertError } = await supabase.from('services').insert([formData]);
        if (insertError) {
          setError(`Insert failed: ${insertError.message}`);
          setLoading(false);
          return;
        }
      }

      await fetchAll();
      setShowModal(false);
      resetForm();
      setLoading(false);
    } catch (err) {
      setError(`An error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category_id: '',
      description: '',
      image_url: '',
      marked_price: 0,
      discount_price: 0,
      is_active: true,
      show_price: true
    });
    setEditId(null);
  };

  const handleEdit = (service: Service) => {
    setError(null);
    setFormData({
      name: service.name,
      category_id: service.category_id,
      description: service.description,
      image_url: service.image_url,
      marked_price: service.marked_price,
      discount_price: service.discount_price,
      is_active: service.is_active,
      show_price: service.show_price ?? true
    });
    setEditId(service.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        const { error } = await supabase.from('services').delete().eq('id', id);
        if (error) {
          alert(`Delete failed: ${error.message}`);
          return;
        }
        await fetchAll();
      } catch (err) {
        alert(`An error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-2xl text-blue-900">Manage Services</h3>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all"
        >
          <i className="fas fa-plus"></i> Add New Service
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black tracking-widest">
            <tr>
              <th className="px-8 py-4">Service</th>
              <th className="px-8 py-4">Category</th>
              <th className="px-8 py-4">Pricing</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {services.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl object-cover bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {s.image_url ? (
                        <img src={s.image_url} className="w-12 h-12 rounded-xl object-cover" />
                      ) : (
                        <i className="fas fa-image text-gray-300 text-lg"></i>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-blue-900">{s.name}</p>
                      <p className="text-xs text-gray-400 max-w-[200px] truncate">{s.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                    {s.category?.name || 'Uncategorized'}
                  </span>
                </td>
                <td className="px-8 py-6">
                  {s.show_price ?? true ? (
                    <>
                      <p className="text-sm font-bold text-gray-900">PKR {s.discount_price}</p>
                      <p className="text-[10px] text-gray-400 line-through">PKR {s.marked_price}</p>
                    </>
                  ) : (
                    <span className="text-xs text-gray-400 italic">Price Hidden</span>
                  )}
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {s.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(s)} className="p-2 text-gray-400 hover:text-blue-600"><i className="fas fa-edit"></i></button>
                    <button onClick={() => handleDelete(s.id)} className="p-2 text-gray-400 hover:text-red-500"><i className="fas fa-trash"></i></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-10">
              <h3 className="text-2xl font-black text-blue-900 mb-8">{editId ? 'Edit Service' : 'Add New Service'}</h3>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <i className="fas fa-exclamation-circle text-red-600 mt-1"></i>
                  <p className="text-red-700 font-semibold">{error}</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600">Service Name</label>
                    <input 
                      type="text" 
                      required 
                      className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600">Category</label>
                    <select 
                      required
                      className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={formData.category_id}
                      onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600">Image URL (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="https://images.unsplash.com/..." 
                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  />
                  <p className="text-[10px] text-gray-400">Supports external URLs or CDN links directly. Leave empty to add a default placeholder.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600">Description</label>
                  <textarea 
                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600">Marked Price (PKR)</label>
                    <input 
                      type="number" 
                      className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={formData.marked_price}
                      onChange={(e) => setFormData({...formData, marked_price: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600">Discounted Price (PKR)</label>
                    <input 
                      type="number" 
                      className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={formData.discount_price}
                      onChange={(e) => setFormData({...formData, discount_price: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <i className="fas fa-tag text-blue-600 text-lg"></i>
                    <div>
                      <p className="font-bold text-gray-900">Show Price</p>
                      <p className="text-xs text-gray-500">Prices required when enabled</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, show_price: !formData.show_price})}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      formData.show_price ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        formData.show_price ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center gap-4 py-4">
                  <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
                    {editId ? 'Update Service' : 'Create Service'}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="px-8 py-4 font-bold text-gray-400 hover:text-gray-600">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
