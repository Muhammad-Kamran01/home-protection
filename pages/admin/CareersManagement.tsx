
import React from 'react';

const CareersManagement: React.FC = () => {
  return (
    <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
      <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-8">
        <i className="fas fa-id-card"></i>
      </div>
      <h3 className="text-2xl font-black text-blue-900 mb-4">Job Portal Management</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-10">This module is currently being optimized to support resume uploads and background verification tracking.</p>
      
      <div className="flex justify-center gap-4">
        <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-100">Add Open Position</button>
        <button className="bg-gray-100 text-gray-600 px-8 py-3 rounded-xl font-bold">View Applications (0)</button>
      </div>
    </div>
  );
};

export default CareersManagement;
