import React from 'react';
import { Link, useLocation } from 'react-router-dom';

type SuccessState = {
  bookingId?: string;
  scheduledAt?: string | null;
  serviceName?: string;
};

const formatDateTime = (value?: string | null): string => {
  if (!value) return 'Now';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Now';

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(parsed);
};

const BookingSuccessPage: React.FC = () => {
  const location = useLocation();
  const state = (location.state || {}) as SuccessState;

  const serviceName = state.serviceName || 'Service';
  const timeLabel = formatDateTime(state.scheduledAt);

  return (
    <div className="min-h-screen bg-[#f3f4f8] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-[2rem] bg-white shadow-xl border border-gray-100 p-6 sm:p-8 text-center relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-6 flex justify-center">
          <div className="relative h-28 w-72">
            <span className="absolute left-4 top-4 h-1.5 w-1.5 rounded-full bg-pink-500" />
            <span className="absolute left-14 top-12 h-1.5 w-1.5 rounded-full bg-yellow-400" />
            <span className="absolute left-24 top-2 h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span className="absolute left-36 top-14 h-1.5 w-1.5 rounded-full bg-green-500" />
            <span className="absolute left-52 top-6 h-1.5 w-1.5 rounded-full bg-red-400" />
            <span className="absolute left-64 top-16 h-1.5 w-1.5 rounded-full bg-cyan-500" />
            <span className="absolute left-8 top-20 h-1.5 w-1.5 rounded-full bg-indigo-500" />
            <span className="absolute left-44 top-24 h-1.5 w-1.5 rounded-full bg-orange-400" />
          </div>
        </div>

        <div className="mx-auto mt-6 mb-6 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center shadow-inner shadow-green-200">
          <div className="h-12 w-12 rounded-full bg-green-500 text-white flex items-center justify-center text-xl">
            <i className="fas fa-check"></i>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">Booking Successfully Confirmed!</h1>
        <p className="mt-3 text-sm sm:text-base text-gray-500">Your {serviceName} request has been received and is now in our queue.</p>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-left">
          <p className="text-xs uppercase tracking-wider font-bold text-gray-500">Scheduled Date</p>
          <p className="mt-1 text-base font-bold text-gray-900">{timeLabel}</p>
          {state.bookingId && (
            <p className="mt-2 text-xs text-gray-500">Booking ID: <span className="font-semibold text-gray-700">{state.bookingId}</span></p>
          )}
        </div>

        <div className="mt-6 space-y-3">
          <Link to="/dashboard" className="block w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 transition-colors">
            Go to Dashboard
          </Link>
          <Link to="/" className="block w-full rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
