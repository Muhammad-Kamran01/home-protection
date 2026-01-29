
import React from 'react';

const CareersPage: React.FC = () => {
  const jobs = [
    { id: '1', title: 'AC Technician', category: 'Technician', location: 'Lahore', type: 'Part-time', description: 'AC installation involves mounting the indoor unit, running insulated refrigerant lines and a drain pipe to the outdoor condenser, connecting electrical wiring, creating a level pad for the outdoor...' },
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-blue-800 py-24 text-center text-white">
        <h1 className="text-5xl font-black mb-6">Join Our Fleet</h1>
        <p className="text-blue-100 max-w-2xl mx-auto px-4">Become a part of the fastest-growing maintenance network in Pakistan. We offer competitive pay, continuous training, and a supportive environment.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl font-bold text-blue-900">Current Openings ({jobs.length})</h2>
          <p className="text-sm text-gray-400">Showing all open positions in Lahore & Islamabad</p>
        </div>

        <div className="space-y-8">
          {jobs.map((job) => (
            <div key={job.id} className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row items-start md:items-center gap-8 group">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">{job.category}</span>
                  <span className="text-gray-400 text-xs flex items-center gap-1"><i className="fas fa-map-marker-alt"></i> {job.location}</span>
                </div>
                <h3 className="text-2xl font-black text-blue-900 mb-4 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-2xl">{job.description}</p>
              </div>
              <div className="flex flex-col items-center md:items-end gap-4 min-w-[150px]">
                <div className="text-center md:text-right">
                  <p className="text-[10px] text-gray-400 uppercase font-black mb-1">Type</p>
                  <p className="font-bold text-gray-900">{job.type}</p>
                </div>
                <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-12 mt-32 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl mx-auto flex items-center justify-center text-2xl">
              <i className="fas fa-chart-line"></i>
            </div>
            <h4 className="font-bold text-lg text-blue-900">Growth Path</h4>
            <p className="text-sm text-gray-500">Clear career progression from Junior Tech to Master Fleet Manager.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl mx-auto flex items-center justify-center text-2xl">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <h4 className="font-bold text-lg text-blue-900">Weekly Training</h4>
            <p className="text-sm text-gray-500">Skills workshops conducted by industry experts every Saturday.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl mx-auto flex items-center justify-center text-2xl">
              <i className="fas fa-heartbeat"></i>
            </div>
            <h4 className="font-bold text-lg text-blue-900">Health Benefits</h4>
            <p className="text-sm text-gray-500">Comprehensive medical coverage for you and your immediate family.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareersPage;
