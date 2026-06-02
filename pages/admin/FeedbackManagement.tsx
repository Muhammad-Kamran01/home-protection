import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../supabase';

type ReviewRow = {
  id: string;
  service_id?: string;
  user_id?: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
  services?: { name?: string } | null;
};

const parseGuestReviewComment = (comment: string) => {
  const lines = comment.split('\n');
  const serviceLine = lines.find((line) => line.toLowerCase().startsWith('service:')) || '';
  const contactLine = lines.find((line) => line.toLowerCase().startsWith('contact:')) || '';
  const bodyStartIndex = lines.findIndex((line) => line.trim() === '');

  return {
    service: serviceLine.replace(/^service:\s*/i, '').trim(),
    contact: contactLine.replace(/^contact:\s*/i, '').trim(),
    body: bodyStartIndex >= 0 ? lines.slice(bodyStartIndex + 1).join('\n').trim() : comment.trim(),
  };
};

const starLabel = (rating: number) => {
  if (rating >= 5) return 'Exceptional';
  if (rating >= 4) return 'Great';
  if (rating >= 3) return 'Okay';
  if (rating >= 2) return 'Needs Work';
  return 'Poor';
};

const FeedbackManagement: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableError, setTableError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | '5' | '4' | '3' | 'below3'>('all');
  const [selectedReview, setSelectedReview] = useState<ReviewRow | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    setTableError(null);

    const { data, error } = await supabase
      .from('reviews')
      .select('*, services(name)')
      .order('created_at', { ascending: false });

    if (error) {
      setTableError(error.message);
      setReviews([]);
    } else {
      setReviews((data || []) as ReviewRow[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const metrics = useMemo(() => {
    const total = reviews.length;
    const average = total > 0 ? reviews.reduce((sum, item) => sum + (item.rating || 0), 0) / total : 0;
    const fiveStar = reviews.filter((item) => item.rating >= 5).length;
    const lowRatings = reviews.filter((item) => item.rating < 3).length;

    return { total, average, fiveStar, lowRatings };
  }, [reviews]);

  const visibleReviews = reviews.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'below3') return item.rating < 3;
    return String(item.rating) === filter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h3 className="text-3xl font-black text-blue-900 tracking-tight">Feedback Console</h3>
          <p className="mt-2 text-sm text-gray-500 max-w-2xl">
            Review customer sentiment after completed services and monitor what customers are saying about each service.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {(['all', '5', '4', '3', 'below3'] as const).map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest transition-all ${filter === item ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white text-gray-500 border border-gray-100 hover:border-blue-200 hover:text-blue-600'}`}
            >
              {item === 'all' ? 'All' : item === 'below3' ? 'Below 3' : `${item} Star${item === '1' ? '' : 's'}`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Reviews</p>
          <p className="mt-3 text-3xl font-black text-blue-900">{metrics.total}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Average Rating</p>
          <p className="mt-3 text-3xl font-black text-blue-900">{metrics.average ? metrics.average.toFixed(1) : '0.0'}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Five Star Ratings</p>
          <p className="mt-3 text-3xl font-black text-green-600">{metrics.fiveStar}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Low Ratings</p>
          <p className="mt-3 text-3xl font-black text-amber-600">{metrics.lowRatings}</p>
        </div>
      </div>

      {tableError && (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          Reviews table could not be loaded: {tableError}
        </div>
      )}

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-gray-50 text-[10px] uppercase tracking-[0.22em] text-gray-400 font-black">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Review</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {visibleReviews.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-6 py-5 align-top">
                    <p className="font-bold text-blue-900">{item.user_name}</p>
                    <p className="text-xs text-gray-400">{item.user_id ? 'Registered customer' : 'Guest review'}</p>
                  </td>
                  <td className="px-6 py-5 align-top">
                    {(() => {
                      const parsed = parseGuestReviewComment(item.comment);
                      return (
                        <>
                          <p className="font-bold text-gray-900">{item.services?.name || parsed.service || 'Unknown service'}</p>
                          {parsed.contact && <p className="text-xs text-gray-400">Contact: {parsed.contact}</p>}
                        </>
                      );
                    })()}
                    <p className="text-xs text-gray-400">Service ID: {item.service_id?.slice(0, 8) || '—'}</p>
                  </td>
                  <td className="px-6 py-5 align-top">
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-black text-blue-600">{item.rating}/5</p>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{starLabel(item.rating)}</span>
                    </div>
                    <div className="mt-2 flex gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <i key={index} className={`fas fa-star ${index < item.rating ? 'text-amber-400' : 'text-gray-200'}`}></i>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5 align-top max-w-[420px]">
                    <p className="text-sm leading-6 text-gray-500 line-clamp-3">{parseGuestReviewComment(item.comment).body}</p>
                  </td>
                  <td className="px-6 py-5 align-top text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-5 align-top text-right">
                    <button
                      onClick={() => setSelectedReview(item)}
                      className="rounded-xl bg-blue-600 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-700 transition-all"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && <div className="p-8 text-sm text-gray-400">Loading reviews...</div>}

        {!loading && visibleReviews.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            <i className="fas fa-comment-dots text-4xl opacity-20 mb-4"></i>
            <p className="font-medium">No reviews found for the selected filter.</p>
          </div>
        )}
      </div>

      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl rounded-[2rem] bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Review Details</p>
                <h4 className="mt-2 text-2xl font-black text-blue-900">{selectedReview.user_name}</h4>
                <p className="text-sm text-gray-500">{selectedReview.services?.name || 'Service review'}</p>
              </div>
              <button onClick={() => setSelectedReview(null)} className="rounded-full bg-gray-100 px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-500">
                Close
              </button>
            </div>

            <div className="mt-6 rounded-3xl border border-gray-100 bg-gray-50 p-5 space-y-3">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400">Customer Review</p>
              <div className="flex gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, index) => (
                  <i key={index} className={`fas fa-star ${index < selectedReview.rating ? 'text-amber-400' : 'text-gray-200'}`}></i>
                ))}
              </div>
              <p className="text-sm leading-6 text-gray-700">{parseGuestReviewComment(selectedReview.comment).body}</p>
              <p className="text-xs text-gray-400">Submitted: {new Date(selectedReview.created_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackManagement;