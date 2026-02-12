
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';

const CareersManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Job Form State
  const [jobForm, setJobForm] = useState({
    title: '',
    category: '',
    location: 'Lahore',
    type: 'Full-time',
    description: '',
    status: 'open'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (jobsError) console.error("Jobs fetch error:", jobsError);
      if (jobsData) setJobs(jobsData);

      // Fetch Applications with job titles
      // Note: If 'jobs(title)' fails, the whole query might fail if not careful.
      const { data: appsData, error: appsError } = await supabase
        .from('job_applications')
        .select('*, jobs!inner(title)')
        .order('created_at', { ascending: false });
      
      if (appsError) {
        console.warn("Application join fetch failed, trying flat fetch...", appsError);
        // Fallback to fetching without join if join fails (e.g. missing foreign key)
        const { data: flatApps, error: flatError } = await supabase
          .from('job_applications')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (flatError) console.error("Flat application fetch failed:", flatError);
        if (flatApps) setApplications(flatApps);
      } else if (appsData) {
        setApplications(appsData);
      }
      
    } catch (err) {
      console.error("Unexpected error in fetchData:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await supabase.from('jobs').update(jobForm).eq('id', editId);
      } else {
        await supabase.from('jobs').insert([jobForm]);
      }
      await fetchData();
      setShowModal(false);
      resetForm();
    } catch (err: any) {
      alert("Error saving job: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setJobForm({ title: '', category: '', location: 'Lahore', type: 'Full-time', description: '', status: 'open' });
    setEditId(null);
  };

  const deleteJob = async (id: string) => {
    if (window.confirm('Delete this job posting? All related applications will be lost.')) {
      setLoading(true);
      await supabase.from('jobs').delete().eq('id', id);
      await fetchData();
    }
  };

  const updateAppStatus = async (id: string, status: string) => {
    setLoading(true);
    const { error } = await supabase.from('job_applications').update({ status }).eq('id', id);
    if (error) {
      alert("Failed to update status: " + error.message);
    } else {
      await fetchData();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 w-full sm:w-auto">
          <button 
            onClick={() => setActiveTab('jobs')}
            className={`flex-1 sm:flex-none px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'jobs' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'}`}
          >
            Manage Jobs
          </button>
          <button 
            onClick={() => setActiveTab('applications')}
            className={`flex-1 sm:flex-none px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'applications' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'}`}
          >
            Applications ({applications.length})
          </button>
        </div>
        
        {activeTab === 'jobs' && (
          <button 
            onClick={() => { resetForm(); setShowModal(true); }}
            className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
          >
            <i className="fas fa-plus"></i> Post New Job
          </button>
        )}
      </div>

      {activeTab === 'jobs' ? (
        <div className="grid gap-4">
          {jobs.map(job => (
            <div key={job.id} className="bg-white p-8 rounded-[2rem] border border-gray-100 flex flex-col sm:flex-row items-center justify-between shadow-sm hover:shadow-md transition-all gap-6">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl">
                  <i className="fas fa-briefcase"></i>
                </div>
                <div>
                  <h4 className="font-black text-blue-900 text-lg">{job.title}</h4>
                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                    <span className="bg-gray-100 px-2 py-0.5 rounded-lg">{job.category}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <span className={job.status === 'open' ? 'text-green-500' : 'text-red-500'}>{job.status}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 w-full sm:w-auto">
                <button 
                  onClick={() => { setJobForm(job); setEditId(job.id); setShowModal(true); }} 
                  className="flex-1 sm:flex-none px-4 py-3 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                >
                  <i className="fas fa-edit mr-2"></i> Edit
                </button>
                <button 
                  onClick={() => deleteJob(job.id)} 
                  className="flex-1 sm:flex-none px-4 py-3 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <i className="fas fa-trash mr-2"></i> Delete
                </button>
              </div>
            </div>
          ))}
          {jobs.length === 0 && !loading && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 text-gray-400 font-medium italic">
              No jobs posted yet. Click "Post New Job" to begin.
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] uppercase font-black tracking-widest text-gray-400 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-6">Applicant Info</th>
                  <th className="px-8 py-6">Target Role</th>
                  <th className="px-8 py-6">Applied Date</th>
                  <th className="px-8 py-6">CV / Resume</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {applications.map(app => (
                  <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <p className="font-bold text-blue-900">{app.full_name || 'Anonymous'}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{app.email || 'N/A'}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-bold text-gray-600 text-sm">{app.jobs?.title || 'Unknown Role'}</span>
                    </td>
                    <td className="px-8 py-6 text-xs text-gray-400 font-medium">
                      {new Date(app.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-6">
                      {app.cv_url ? (
                        <a 
                          href={app.cv_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold text-[10px] uppercase tracking-widest"
                        >
                          <i className="fas fa-file-download text-lg"></i> Download CV
                        </a>
                      ) : (
                        <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic">No CV Uploaded</span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <select 
                        disabled={loading}
                        value={app.status || 'pending'} 
                        onChange={(e) => updateAppStatus(app.id, e.target.value)}
                        className="text-[10px] font-black uppercase tracking-widest rounded-lg px-3 py-1.5 outline-none border bg-gray-50 focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => alert(`Full Application Letter:\n\n${app.cover_letter || 'No letter provided.'}`)} 
                        className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 px-4 py-2 rounded-xl transition-all"
                      >
                        View Letter
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {applications.length === 0 && !loading && (
            <div className="text-center py-20 text-gray-400 font-medium italic">
              No applications received yet.
            </div>
          )}
        </div>
      )}

      {/* Post/Edit Job Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-10 overflow-y-auto max-h-[90vh] animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-blue-900">{editId ? 'Edit Job Posting' : 'Post New Opening'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500"><i className="fas fa-times text-xl"></i></button>
            </div>
            
            <form onSubmit={handleJobSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Job Title</label>
                  <input required className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-600 transition-all" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} placeholder="e.g. Senior HVAC Technician" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Category</label>
                  <input required className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-600 transition-all" value={jobForm.category} onChange={e => setJobForm({...jobForm, category: e.target.value})} placeholder="e.g. Engineering" />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Location</label>
                  <select className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-600 transition-all" value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})}>
                    <option>Lahore</option><option>Islamabad</option><option>Karachi</option><option>Rawalpindi</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Employment Type</label>
                  <select className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-600 transition-all" value={jobForm.type} onChange={e => setJobForm({...jobForm, type: e.target.value})}>
                    <option>Full-time</option><option>Part-time</option><option>Contract</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Job Status</label>
                  <select className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold" value={jobForm.status} onChange={e => setJobForm({...jobForm, status: e.target.value})}>
                    <option value="open">OPEN (Visible to Users)</option>
                    <option value="closed">CLOSED (Hidden)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Description & Requirements</label>
                <textarea rows={6} className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-600 transition-all resize-none" value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} placeholder="Outline the responsibilities and required skills for this role..." />
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-500/20 transition-all hover:bg-blue-700 disabled:opacity-70"
                >
                  {loading ? <i className="fas fa-spinner fa-spin mr-3"></i> : <i className="fas fa-paper-plane mr-3"></i>}
                  {editId ? 'Update Posting' : 'Publish Job Opening'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareersManagement;
