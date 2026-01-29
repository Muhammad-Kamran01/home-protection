
import React from 'react';
import { useAuth } from '../../App';

const StaffDashboard: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mini Sidebar */}
      <div className="w-20 bg-blue-950 flex flex-col items-center py-8 gap-8">
        <div className="bg-blue-600 p-3 rounded-2xl text-white"><i className="fas fa-tools"></i></div>
        <div className="text-white/40 hover:text-white transition-colors cursor-pointer"><i className="fas fa-calendar-alt text-xl"></i></div>
        <div className="text-white/40 hover:text-white transition-colors cursor-pointer"><i className="fas fa-check-double text-xl"></i></div>
        <div className="mt-auto text-red-400 cursor-pointer" onClick={signOut}><i className="fas fa-power-off text-xl"></i></div>
      </div>

      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black text-blue-900">Assigned Jobs</h1>
            <p className="text-gray-500">Hello {user?.full_name}, here is your schedule for today.</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold">A</div>
            <span className="font-bold text-blue-900">Active Duty</span>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {[1, 2].map(i => (
            <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">In Progress</span>
                <span className="text-gray-400 text-xs font-bold">Job ID: #FT-902{i}</span>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">AC Deep Cleaning</h3>
              <p className="text-gray-500 text-sm mb-6 flex items-center gap-2"><i className="fas fa-map-marker-alt"></i> Block 2, Gulberg III, Lahore</p>
              
              <div className="bg-blue-50 p-6 rounded-2xl mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-600"><i className="fas fa-user"></i></div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Customer</p>
                    <p className="font-bold text-blue-900">Mrs. Aisha Khan</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm">Call Now</button>
                  <button className="flex-1 bg-white border border-gray-200 text-blue-900 py-3 rounded-xl font-bold text-sm">Directions</button>
                </div>
              </div>

              <button className="w-full bg-green-500 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-green-600 transition-colors">
                Mark as Completed
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
