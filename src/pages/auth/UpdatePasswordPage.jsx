import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Leaf, CheckCircle, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const API_BASE = 'http://localhost:8080/api';

function PasswordField({ name, label, value, showValue, onToggle, onChange, error, placeholder, matchOk }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock size={15} className={error ? 'text-red-400' : 'text-gray-400'} />
        </div>
        <input
          name={name}
          type={showValue ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`block w-full pl-9 pr-10 py-2.5 text-sm border rounded-xl outline-none transition-all
            focus:ring-2 focus:ring-green-400 focus:border-transparent
            ${error
              ? 'border-red-300 bg-red-50 placeholder-red-300'
              : matchOk
                ? 'border-green-400 bg-green-50'
                : 'border-green-200 bg-green-50 placeholder-gray-400 hover:border-green-300'
            }`}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          {showValue ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {error
        ? <p className="mt-1 text-xs text-red-500">{error}</p>
        : matchOk && <p className="mt-1 text-xs text-green-600 font-medium">✓ Passwords match</p>
      }
    </div>
  );
}

export default function UpdatePasswordPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [show, setShow] = useState({ oldPassword: false, newPassword: false, confirmPassword: false });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const toggleShow = (field) => setShow(prev => ({ ...prev, [field]: !prev[field] }));

  const validate = () => {
    const errs = {};
    if (!formData.oldPassword) errs.oldPassword = 'Current password is required';
    if (!formData.newPassword) {
      errs.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      errs.newPassword = 'Password must be at least 6 characters';
    } else if (formData.newPassword === formData.oldPassword) {
      errs.newPassword = 'New password must differ from current password';
    }
    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE}/user/update-password`,
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDone(true);
      toast.success('Password updated successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update password.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const getStrength = () => {
    const pw = formData.newPassword;
    if (!pw) return null;
    if (pw.length >= 10 && /[A-Z]/.test(pw) && /\d/.test(pw))
      return { label: 'Strong', width: 'w-full', color: 'bg-green-500', textColor: 'text-green-600' };
    if (pw.length >= 6)
      return { label: 'Medium', width: 'w-3/5', color: 'bg-lime-400', textColor: 'text-lime-600' };
    return { label: 'Weak', width: 'w-1/4', color: 'bg-orange-400', textColor: 'text-orange-500' };
  };

  const strength = getStrength();

  if (done) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center p-4 relative overflow-hidden">
        <Toaster position="top-right" />
        <div className="absolute w-96 h-96 rounded-full bg-green-200 opacity-30 -top-24 -right-20 pointer-events-none" />
        <div className="absolute w-64 h-64 rounded-full bg-emerald-200 opacity-25 -bottom-16 -left-16 pointer-events-none" />
        <div className="w-full max-w-md relative z-10">
          <div className="bg-white rounded-2xl shadow-xl shadow-green-100 p-10 text-center">
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5 shadow-md shadow-green-100">
              <CheckCircle size={40} className="text-green-500" strokeWidth={1.8} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Updated!</h2>
            <p className="text-sm text-gray-500 mb-7">
              Your password has been changed. For security, please sign in again.
            </p>
            <button
              onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
              className="w-full py-2.5 bg-linear-to-r from-green-500 to-emerald-600 text-white text-sm font-bold rounded-xl
                hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                transition-all shadow-md shadow-green-200"
            >
              Sign In Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center p-4 relative overflow-hidden">
      <Toaster position="top-right" />

      <div className="absolute w-96 h-96 rounded-full bg-green-200 opacity-30 -top-24 -right-20 pointer-events-none" />
      <div className="absolute w-64 h-64 rounded-full bg-emerald-200 opacity-25 -bottom-16 -left-16 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-2xl shadow-xl shadow-green-100 p-8">

          {/* Brand */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-md shadow-green-300">
              <Leaf size={18} color="white" strokeWidth={2.2} />
            </div>
            <span className="text-base font-bold text-green-700 tracking-tight">GreenApp</span>
          </div>

          {/* Shield icon + heading */}
          <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center mb-4 shadow-sm shadow-green-100">
            <ShieldCheck size={24} className="text-green-600" strokeWidth={1.8} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">Update Password</h1>
          <p className="text-sm text-gray-500 mb-5">Keep your account secure with a strong password</p>

          {/* Tips banner */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-3.5 mb-5">
            <p className="text-xs font-bold text-green-700 mb-2">Password tips</p>
            <ul className="space-y-1">
              {[
                'At least 6 characters long',
                'Mix uppercase letters, numbers & symbols',
                'Avoid using your name or phone number',
              ].map((tip, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Current Password */}
          <PasswordField
            name="oldPassword"
            label="Current Password"
            value={formData.oldPassword}
            showValue={show.oldPassword}
            onToggle={() => toggleShow('oldPassword')}
            onChange={handleChange}
            error={errors.oldPassword}
            placeholder="Enter your current password"
          />

          {/* New Password */}
          <PasswordField
            name="newPassword"
            label="New Password"
            value={formData.newPassword}
            showValue={show.newPassword}
            onToggle={() => toggleShow('newPassword')}
            onChange={handleChange}
            error={errors.newPassword}
            placeholder="At least 6 characters"
          />

          {/* Strength meter (shown right after new password field) */}
          {strength && !errors.newPassword && (
            <div className="-mt-2 mb-4">
              <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-300 ${strength.width} ${strength.color}`} />
              </div>
              <p className={`text-xs mt-1 font-semibold ${strength.textColor}`}>{strength.label}</p>
            </div>
          )}

          {/* Confirm Password */}
          <PasswordField
            name="confirmPassword"
            label="Confirm New Password"
            value={formData.confirmPassword}
            showValue={show.confirmPassword}
            onToggle={() => toggleShow('confirmPassword')}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="Re-enter new password"
            matchOk={
              !errors.confirmPassword &&
              formData.confirmPassword.length > 0 &&
              formData.confirmPassword === formData.newPassword
            }
          />

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-2.5 mt-2 bg-linear-to-r from-green-500 to-emerald-600 text-white text-sm font-bold rounded-xl
              hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
              transition-all duration-200 shadow-md shadow-green-200 disabled:opacity-60 disabled:cursor-not-allowed mb-3"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Updating...
              </span>
            ) : 'Update Password'}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full py-2.5 text-sm font-semibold text-gray-500 border border-gray-200 rounded-xl
              hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}