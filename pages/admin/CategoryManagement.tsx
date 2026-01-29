
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { ServiceCategory } from '../../types';

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', icon: '', description: '' });

  const fetchCategories = async () => {
    setLoading(true);
    const { data } = await supabase.from('service_categories').select('*');
    if (data) setCategories(data);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await supabase.from('service_categories').update(formData).eq('id', editId);
    } else {
      await supabase.from('service_categories').insert([formData]);
    }
    fetchCategories();
    setShowModal(false);
    setFormData({ name: '', icon: '', description: '' });
    setEditId(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-2xl text-blue-900">Manage Categories</h3>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
          <i className="fas fa-plus"></i> New Category
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <i className={`fas ${cat.icon}`}></i>
              </div>
              <div>
                <p className="font-bold text-blue-900">{cat.name}</p>
                <p className="text-xs text-gray-400">ID: {cat.id.slice(0, 8)}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setFormData({ name: cat.name, icon: cat.icon, description: cat.description }); setEditId(cat.id); setShowModal(true); }} className="text-gray-400 hover:text-blue-600">
                <i className="fas fa-edit"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[2rem] p-10">
            <h3 className="text-2xl font-black text-blue-900 mb-6">{editId ? 'Edit Category' : 'Add Category'}</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input required type="text" placeholder="Category Name" className="w-full px-5 py-3 rounded-xl border border-gray-200" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required type="text" placeholder="FontAwesome Icon (e.g. fa-tools)" className="w-full px-5 py-3 rounded-xl border border-gray-200" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} />
              <textarea placeholder="Description" className="w-full px-5 py-3 rounded-xl border border-gray-200" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold">Save Category</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
