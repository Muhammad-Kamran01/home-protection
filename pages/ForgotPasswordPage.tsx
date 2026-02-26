import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import logo from '../assets/logo.png';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!email) {
        throw new Error('Please enter your email address');
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/#/reset-password`,
      });

      if (error) throw error;

      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 pt-6 pb-12">
      <Link to="/" className="mb-8 flex items-center gap-0">
        <div className="p-2 rounded-lg text-white">
          <img src={logo} alt="Home Protection" className="w-10 h-10 object-contain rounded-md" />
        </div>
        <span className="text-2xl font-bold text-blue-900">Home Protection</span>
      </Link>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-key text-blue-600 text-2xl"></i>
          </div>
          <h2 className="text-3xl font-extrabold text-blue-900">Reset Password</h2>
          <p className="text-gray-500 mt-2">Enter your email and we'll send you a link to reset it</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {success ? (
          <div className="text-center">
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-xl">
              <p className="text-green-700 text-sm font-medium">
                ✓ Password reset link has been sent to your email!
              </p>
            </div>
            <p className="text-gray-600 text-sm mb-6">
              Check your inbox and follow the link to reset your password. The link expires in 1 hour.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 mb-4"
            >
              Back to Login
            </button>
            <p className="text-gray-600 text-xs">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={() => setSuccess(false)}
                className="text-blue-600 font-bold hover:underline"
              >
                try again
              </button>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="abc@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Send Reset Link'}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-gray-600">
          Remember your password?{' '}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
