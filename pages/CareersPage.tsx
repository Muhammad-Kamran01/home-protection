
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../App';

const CareersPage: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Application Form State
  const [applyForm, setApplyForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    cover_letter: ''
  });

  const fetchJobs = async () => {
    setLoading(true);
    const { data } = await supabase.from('jobs').select('*').eq('status', 'open').order('created_at', { ascending: false });
    if (data) setJobs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Sync form with user profile when user logs in or modal opens
  useEffect(() => {
    if (showApplyModal && user) {
      setApplyForm({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        cover_letter: ''
      });
    }
  }, [showApplyModal, user]);

  const handleCloseModal = () => {
    setShowApplyModal(false);
    setIsSubmitted(false);
    setSelectedJob(null);
    setSelectedFile(null);
    setApplyForm({
      full_name: user?.full_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      cover_letter: ''
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Limit to 5MB and specific types
      if (file.size > 5 * 1024 * 1024) {
        alert('File size too large. Please select a file under 5MB.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    
    setSubmitting(true);
    let cv_url = null;
    
    try {
      // 1. Upload CV if selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `applications/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('cvs')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('cvs')
          .getPublicUrl(filePath);
        
        cv_url = urlData.publicUrl;
      }

      // 2. Create Application Record
      const applicationData = {
        job_id: selectedJob.id,
        user_id: user?.id || null,
        full_name: applyForm.full_name,
        email: applyForm.email,
        phone: applyForm.phone,
        cover_letter: applyForm.cover_letter,
        cv_url: cv_url
      };

      const { error } = await supabase
        .from('job_applications')
        .insert([applicationData]);

      if (error) throw error;

      // Successful submission
      setIsSubmitted(true);
      
      // Auto-close modal after delay
      setTimeout(() => {
        handleCloseModal();
      }, 3500);

    } catch (error: any) {
      console.error('Submission error:', error);
      alert('Failed to submit application: ' + (error.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-blue-800 py-24 text-center text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-5xl font-black mb-6">Join Our Fleet</h1>
          <p className="text-blue-100 max-w-2xl mx-auto px-4">Become a part of the fastest-growing maintenance network in Pakistan. We offer competitive pay, continuous training, and a supportive environment.</p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-700/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl font-bold text-blue-900">Current Openings ({jobs.length})</h2>
          <p className="text-sm text-gray-400">Showing all open positions across Pakistan</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><i className="fas fa-spinner fa-spin text-4xl text-blue-600"></i></div>
        ) : (
          <div className="space-y-8">
            {jobs.map((job) => (
              <div key={job.id} className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row items-start md:items-center gap-8 group relative overflow-hidden">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">{job.category}</span>
                    <span className="text-gray-400 text-xs flex items-center gap-1"><i className="fas fa-map-marker-alt"></i> {job.location}</span>
                  </div>
                  <h3 className="text-2xl font-black text-blue-900 mb-4 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-2xl line-clamp-3">{job.description}</p>
                </div>
                <div className="flex flex-col items-center md:items-end gap-4 min-w-[150px]">
                  <div className="text-center md:text-right">
                    <p className="text-[10px] text-gray-400 uppercase font-black mb-1">Type</p>
                    <p className="font-bold text-gray-900">{job.type}</p>
                  </div>
                  <button 
                    onClick={() => { setSelectedJob(job); setShowApplyModal(true); setIsSubmitted(false); }}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 whitespace-nowrap"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
            {jobs.length === 0 && (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <i className="fas fa-search text-6xl text-gray-200 mb-4"></i>
                <p className="text-gray-500 font-bold">No active positions at the moment. Check back later!</p>
              </div>
            )}
          </div>
        )}

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-12 mt-32 text-center border-t border-gray-100 pt-20">
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

      {/* Apply Modal */}
      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-10 overflow-y-auto max-h-[90vh] animate-in zoom-in duration-300">
            {isSubmitted ? (
              <div className="text-center py-16 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 shadow-inner">
                  <i className="fas fa-check"></i>
                </div>
                <h3 className="text-3xl font-black text-blue-900 mb-4">Application Received!</h3>
                <p className="text-gray-500 mb-10 max-w-sm mx-auto font-medium">
                  Thank you for applying for the <b>{selectedJob.title}</b> position. Our recruitment team will review your profile and reach out shortly.
                </p>
                <button 
                  onClick={handleCloseModal}
                  className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 block">Application for</span>
                    <h3 className="text-3xl font-black text-blue-900">{selectedJob.title}</h3>
                  </div>
                  <button onClick={handleCloseModal} className="text-gray-400 hover:text-red-500 text-xl"><i className="fas fa-times"></i></button>
                </div>

                <form onSubmit={handleApply} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">Full Name</label>
                      <input 
                        required 
                        className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none bg-gray-50" 
                        value={applyForm.full_name} 
                        onChange={e => setApplyForm({...applyForm, full_name: e.target.value})} 
                        placeholder="e.g. Ali Ahmed"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">Phone Number</label>
                      <input 
                        required 
                        type="tel" 
                        className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none bg-gray-50" 
                        value={applyForm.phone} 
                        onChange={e => setApplyForm({...applyForm, phone: e.target.value})} 
                        placeholder="e.g. +92 300 1234567"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Email Address</label>
                    <input 
                      required 
                      type="email" 
                      className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none bg-gray-50" 
                      value={applyForm.email} 
                      onChange={e => setApplyForm({...applyForm, email: e.target.value})} 
                      placeholder="e.g. ali@example.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Cover Letter / Why should we hire you?</label>
                    <textarea 
                      required 
                      rows={4} 
                      className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none bg-gray-50" 
                      value={applyForm.cover_letter} 
                      onChange={e => setApplyForm({...applyForm, cover_letter: e.target.value})} 
                      placeholder="Briefly describe your experience and skills..."
                    />
                  </div>

                  {/* CV Upload Section */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Upload CV (PDF, DOCX)</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${selectedFile ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-blue-400'}`}
                    >
                      <i className={`fas ${selectedFile ? 'fa-file-pdf text-blue-600' : 'fa-cloud-upload-alt text-gray-400'} text-2xl`}></i>
                      <p className="text-xs font-bold text-gray-600">
                        {selectedFile ? selectedFile.name : 'Click to select CV file'}
                      </p>
                      <p className="text-[10px] text-gray-400">PDF, DOC, DOCX up to 5MB</p>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-xl flex items-center gap-4 text-xs text-blue-700 border border-blue-100">
                    <i className="fas fa-info-circle text-lg"></i>
                    <p>By clicking submit, you confirm that the provided information is accurate and you consent to our background verification process.</p>
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 transition-all hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <i className="fas fa-spinner fa-spin"></i> Submitting...
                      </span>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CareersPage;