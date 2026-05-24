import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/ui/GlassCard';
import FlatButton from '../components/ui/FlatButton';
import { Briefcase, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1 = request email, 2 = verify OTP & reset
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'STUDENT' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (forgotStep === 1) {
        // Request OTP
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: forgotEmail })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Something went wrong');
        setError('If an account exists, an OTP has been sent. Check your email.');
        setForgotStep(2);
      } else {
        // Submit OTP & New Password
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: forgotEmail, otp, newPassword })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Something went wrong');
        setError('Password reset successful! Please login.');
        setIsForgotPassword(false);
        setForgotStep(1);
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const res = await fetch(`${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      if (isLogin) {
        login(data);
        navigate('/dashboard');
      } else {
        setIsLogin(true);
        setError('Registration successful! Please login.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#020617] relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <GlassCard className="p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6] flex items-center justify-center mb-4">
              <Briefcase size={24} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {isForgotPassword ? 'Reset Password' : (isLogin ? 'Welcome Back' : 'Create Account')}
            </h2>
            <p className="text-slate-400">
              {isForgotPassword ? 'Follow the steps to recover your account' : (isLogin ? 'Sign in to access your dashboard' : 'Join CareerConnect today')}
            </p>
          </div>

          {error && (
            <div className={`p-3 mb-6 rounded-lg text-sm text-center border ${error.includes('successful') ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
              {error}
            </div>
          )}

          {isForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              {forgotStep === 1 ? (
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    required
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#0ea5e9] transition-colors"
                  />
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="6-Digit OTP" 
                      required
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#0ea5e9] transition-colors tracking-[0.2em]"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="New Password" 
                      required
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-10 py-3 text-white focus:outline-none focus:border-[#0ea5e9] transition-colors"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </>
              )}
              
              <FlatButton 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-none rounded-lg py-3 font-semibold shadow-lg shadow-blue-500/25 mt-6 disabled:opacity-50"
              >
                {loading ? 'Processing...' : (forgotStep === 1 ? 'Send Reset OTP' : 'Confirm Password Reset')}
              </FlatButton>
              <div className="text-center mt-4">
                <button 
                  type="button"
                  onClick={() => { setIsForgotPassword(false); setError(''); setForgotStep(1); }}
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Back to Login
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#0ea5e9] transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select 
                      value={formData.role}
                      onChange={e => setFormData({...formData, role: e.target.value})}
                      className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#0ea5e9] transition-colors appearance-none"
                    >
                      <option value="STUDENT" className="bg-[#020617]">Student</option>
                      <option value="INTERVIEWER" className="bg-[#020617]">Interviewer</option>
                      <option value="ADMIN" className="bg-[#020617]">Admin</option>
                    </select>
                  </div>
                </>
              )}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#0ea5e9] transition-colors"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-10 py-3 text-white focus:outline-none focus:border-[#0ea5e9] transition-colors"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {isLogin && (
                <div className="flex justify-end">
                  <button 
                    type="button"
                    onClick={() => { setIsForgotPassword(true); setError(''); }}
                    className="text-xs text-[#0ea5e9] hover:text-blue-400 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <FlatButton 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-none rounded-lg py-3 font-semibold shadow-lg shadow-blue-500/25 mt-6 disabled:opacity-50"
              >
                {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
              </FlatButton>
            </form>
          )}

          {!isForgotPassword && (
            <div className="mt-6 text-center text-sm text-slate-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => { 
                  setIsLogin(!isLogin); 
                  setError(''); 
                  setFormData({ name: '', email: '', password: '', role: 'STUDENT' }); 
                }}
                className="text-[#0ea5e9] hover:text-blue-400 font-medium transition-colors"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default Auth;
