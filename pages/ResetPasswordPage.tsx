import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabase';
import logo from '../assets/logo.png';

const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if there's a valid token in the URL
    const verifyToken = async () => {
      try {
        // Supabase handles the token in the URL automatically via hash
        // We just need to check if the session is set
        const { data } = await supabase.auth.getSession();
        if (data.session?.user?.email) {
          setTokenValid(true);
        } else {
          setError('Password reset link is invalid or has expired. Please request a new one.');
          setTokenValid(false);
        }
      } catch (err) {
        setError('Failed to verify reset link. Please try again.');
        setTokenValid(false);
      } finally {
        setCheckingToken(false);
      }
    };

    verifyToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setSuccess(true);
      setNewPassword('');
      setConfirmPassword('');

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingToken) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="fas fa-lock text-blue-600 animate-pulse text-xl"></i>
          </div>
        </div>
        <div className="text-center mt-6">
          <h2 className="text-sm font-black text-blue-900 uppercase tracking-[0.3em]">Verifying Link</h2>
          <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">Please wait...</p>
        </div>
      </div>
    );
  }

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
            <i className="fas fa-shield-alt text-blue-600 text-2xl"></i>
          </div>
          <h2 className="text-3xl font-extrabold text-blue-900">Create New Password</h2>
          <p className="text-gray-500 mt-2">Enter a strong password to secure your account</p>
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
                ✓ Password reset successfully!
              </p>
            </div>
            <p className="text-gray-600 text-sm mb-6">
              Your password has been updated. Redirecting to login page...
            </p>
            <div className="inline-block">
              <div className="w-8 h-8 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          </div>
        ) : !tokenValid ? (
          <div className="text-center">
            <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl">
              <p className="text-amber-700 text-sm font-medium">
                {error || 'Invalid or expired reset link'}
              </p>
            </div>
            <Link
              to="/forgot-password"
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 mb-4 inline-block"
            >
              Request New Reset Link
            </Link>
            <p className="text-gray-600 text-xs">
              Or{' '}
              <Link to="/login" className="text-blue-600 font-bold hover:underline">
                back to login
              </Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">At least 6 characters</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                required
                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-sm">
              <p className="text-blue-900 font-bold mb-2">Password Requirements:</p>
              <ul className="text-blue-700 text-xs space-y-1">
                <li className={newPassword.length >= 6 ? 'text-green-600 font-bold' : ''}>
                  <i className={`fas ${newPassword.length >= 6 ? 'fa-check-circle' : 'fa-circle'}`}></i> At least 6 characters
                </li>
                <li className={newPassword === confirmPassword && newPassword ? 'text-green-600 font-bold' : ''}>
                  <i className={`fas ${newPassword === confirmPassword && newPassword ? 'fa-check-circle' : 'fa-circle'}`}></i> Passwords match
                </li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading || !tokenValid}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Reset Password'}
            </button>
          </form>
        )}

        {!success && (
          <p className="mt-8 text-center text-gray-600">
            Remember your password?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Sign in here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
