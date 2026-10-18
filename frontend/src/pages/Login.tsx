import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed,
  Mail,
  Phone,
  User as UserIcon,
  MapPin,
  Globe,
  Hash,
  Navigation,
  Tag,
  ArrowRight,
  Loader2,
  LogIn,
  UserPlus,
  Sparkles,
  Code2,
} from 'lucide-react';
import { toast } from 'sonner';
import { loginUser, registerUser } from '../api/api';
import type { User } from '../types';

interface LoginProps {
  onLogin: (userData: User) => void;
}

interface LoginFormState {
  email: string;
  phoneNumber: string;
}

interface RegisterFormState {
  name: string;
  email: string;
  phoneNumber: string;
  streetLine1: string;
  streetLine2: string;
  country: string;
  pinCode: string;
  latitude: string;
  longitude: string;
  label: string;
  defaultAddress: boolean;
}

function Login({ onLogin }: LoginProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Login form
  const [loginForm, setLoginForm] = useState<LoginFormState>({ email: '', phoneNumber: '' });

  // Register form with sensible defaults
  const [registerForm, setRegisterForm] = useState<RegisterFormState>({
    name: '',
    email: '',
    phoneNumber: '',
    streetLine1: '',
    streetLine2: '',
    country: 'India',
    pinCode: '',
    latitude: '12.9716',
    longitude: '77.5946',
    label: 'Home',
    defaultAddress: true,
  });

  // Quick helper to fill sample login credentials
  const fillDemoLogin = () => {
    setLoginForm({
      email: 'alex@flavourfleet.com',
      phoneNumber: '9876543210',
    });
    toast.info('Demo credentials filled!');
  };

  // Quick helper to fill dev login credentials
  const fillDevLogin = () => {
    setLoginForm({
      email: 'dev@flavourfleet.com',
      phoneNumber: '1234567890',
    });
    toast.info('Dev account credentials filled!');
  };

  // Quick helper to fill sample registration details
  const fillDemoRegister = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setRegisterForm({
      name: `User ${randomSuffix}`,
      email: `user${randomSuffix}@flavourfleet.com`,
      phoneNumber: `98${randomSuffix}1234`.slice(0, 10),
      streetLine1: '456 Foodie Boulevard',
      streetLine2: 'Suite 101',
      country: 'India',
      pinCode: '560001',
      latitude: '12.9716',
      longitude: '77.5946',
      label: 'Home',
      defaultAddress: true,
    });
    toast.info('Sample user details filled!');
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const email = loginForm.email.trim();
    const phoneNumber = loginForm.phoneNumber.trim();

    if (!email || !phoneNumber) {
      toast.error('Please enter both email and phone number');
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({ email, phoneNumber });
      if (res.data && res.data.name) {
        toast.success(`Welcome back, ${res.data.name}!`);
        onLogin(res.data);
        navigate('/');
      } else {
        toast.error('Invalid credentials. Please verify your details.');
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error('No account found with this email and phone number. Please register first.');
      } else {
        toast.error(err.response?.data?.message || 'Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!registerForm.name.trim()) { toast.error('Name is required'); return; }
    if (!registerForm.email.trim()) { toast.error('Email is required'); return; }
    if (!/^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/.test(registerForm.email)) { toast.error('Invalid email format'); return; }
    if (!registerForm.phoneNumber.trim()) { toast.error('Phone number is required'); return; }
    if (!/^\d{10}$/.test(registerForm.phoneNumber)) { toast.error('Phone number must be exactly 10 digits'); return; }
    if (!registerForm.streetLine1.trim()) { toast.error('Street address is required'); return; }
    if (!registerForm.country.trim()) { toast.error('Country is required'); return; }
    if (!registerForm.pinCode.trim()) { toast.error('Pin code is required'); return; }
    if (!/^\d{6}$/.test(registerForm.pinCode)) { toast.error('Pin code must be 6 digits (e.g. 560001)'); return; }
    if (!registerForm.latitude || !registerForm.longitude) { toast.error('Latitude and Longitude are required'); return; }

    setLoading(true);
    try {
      const payload = {
        ...registerForm,
        latitude: parseFloat(registerForm.latitude),
        longitude: parseFloat(registerForm.longitude),
      };
      const res = await registerUser(payload);
      if (res.data && res.data.name) {
        toast.success(`Account created! Welcome, ${res.data.name}!`);
        onLogin(res.data);
        navigate('/');
      } else {
        toast.error('Registration failed. Please check your details.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.response?.data?.msg || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-10 px-4" style={{ background: '#FFFBF5' }}>
      {/* Background Glows */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-80 h-80 bg-brand-200 rounded-full opacity-25 blur-3xl" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-amber-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-orange-200 rounded-full opacity-15 blur-3xl" />
      </div>

      <div className="w-full max-w-md mx-auto fade-in">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-400 to-brand-600 rounded-2xl shadow-xl shadow-brand-200 mb-3 hover:scale-105 transition-transform duration-300">
            <UtensilsCrossed className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold gradient-text">Flavour Fleet</h1>
          <p className="text-stone-500 text-sm mt-1">Restaurant Management Platform</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-brand-100/50 border border-stone-100 overflow-hidden">
          {/* Segmented Pill Tab Switcher */}
          <div className="p-2 m-4 bg-stone-100/80 rounded-2xl flex gap-1 border border-stone-200/50">
            <button
              type="button"
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                !isRegister
                  ? 'bg-white text-brand-600 shadow-md shadow-stone-200/80'
                  : 'text-stone-500 hover:text-stone-800 hover:bg-stone-200/50'
              }`}
              id="login-tab"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                isRegister
                  ? 'bg-white text-brand-600 shadow-md shadow-stone-200/80'
                  : 'text-stone-500 hover:text-stone-800 hover:bg-stone-200/50'
              }`}
              id="register-tab"
            >
              <UserPlus className="w-4 h-4" />
              Register
            </button>
          </div>

          <div className="p-6 pt-2 sm:p-8 sm:pt-2">
            {!isRegister ? (
              /* -------- LOGIN FORM -------- */
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      id="login-email"
                      type="email"
                      required
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-sm bg-stone-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      id="login-phone"
                      type="tel"
                      required
                      value={loginForm.phoneNumber}
                      onChange={(e) => setLoginForm({ ...loginForm, phoneNumber: e.target.value })}
                      placeholder="10-digit phone number"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-sm bg-stone-50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Quick Auto-Fill Buttons */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={fillDemoLogin}
                    className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Auto-fill Demo (alex@flavourfleet.com / 9876543210)
                  </button>

                  <button
                    type="button"
                    onClick={fillDevLogin}
                    className="w-full py-2 px-3 bg-violet-50 hover:bg-violet-100 text-violet-800 border border-violet-200 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Code2 className="w-3.5 h-3.5 text-violet-600" />
                    Auto-fill Dev (dev@flavourfleet.com / 1234567890)
                  </button>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  id="login-submit"
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 active:scale-[0.99] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-brand-200 hover:shadow-brand-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Switch to Register link */}
                <p className="text-center text-sm text-stone-500 pt-2">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsRegister(true)}
                    className="text-brand-600 font-semibold hover:text-brand-700 hover:underline transition-colors cursor-pointer"
                  >
                    Register here
                  </button>
                </p>
              </form>
            ) : (
              /* -------- REGISTER FORM -------- */
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Demo Helper */}
                <div className="flex items-center justify-between pb-1">
                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Account Details</p>
                  <button
                    type="button"
                    onClick={fillDemoRegister}
                    className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    Fill Sample Info
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      id="register-name"
                      type="text"
                      required
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-sm bg-stone-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        id="register-email"
                        type="email"
                        required
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        placeholder="jane@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-sm bg-stone-50 focus:bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        id="register-phone"
                        type="tel"
                        required
                        value={registerForm.phoneNumber}
                        onChange={(e) => setRegisterForm({ ...registerForm, phoneNumber: e.target.value })}
                        placeholder="10 digits"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-sm bg-stone-50 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Address Section */}
                <div className="border-t border-dashed border-stone-200 pt-3">
                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Delivery Address</p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Street Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                          id="register-street1"
                          type="text"
                          required
                          value={registerForm.streetLine1}
                          onChange={(e) => setRegisterForm({ ...registerForm, streetLine1: e.target.value })}
                          placeholder="123 Food Street"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-sm bg-stone-50 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Country</label>
                        <div className="relative">
                          <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                          <input
                            id="register-country"
                            type="text"
                            required
                            value={registerForm.country}
                            onChange={(e) => setRegisterForm({ ...registerForm, country: e.target.value })}
                            placeholder="India"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-sm bg-stone-50 focus:bg-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Pin Code</label>
                        <div className="relative">
                          <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                          <input
                            id="register-pincode"
                            type="text"
                            required
                            value={registerForm.pinCode}
                            onChange={(e) => setRegisterForm({ ...registerForm, pinCode: e.target.value })}
                            placeholder="6 digits"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-sm bg-stone-50 focus:bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Latitude</label>
                        <div className="relative">
                          <Navigation className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                          <input
                            id="register-lat"
                            type="number"
                            step="any"
                            required
                            value={registerForm.latitude}
                            onChange={(e) => setRegisterForm({ ...registerForm, latitude: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-sm bg-stone-50 focus:bg-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Longitude</label>
                        <div className="relative">
                          <Navigation className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 rotate-90" />
                          <input
                            id="register-lon"
                            type="number"
                            step="any"
                            required
                            value={registerForm.longitude}
                            onChange={(e) => setRegisterForm({ ...registerForm, longitude: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-sm bg-stone-50 focus:bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">Label</label>
                        <div className="relative">
                          <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                          <select
                            id="register-label"
                            value={registerForm.label}
                            onChange={(e) => setRegisterForm({ ...registerForm, label: e.target.value })}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-sm bg-stone-50 focus:bg-white appearance-none cursor-pointer"
                          >
                            <option value="Home">Home</option>
                            <option value="Work">Work</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex items-end pb-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            id="register-default-address"
                            type="checkbox"
                            checked={registerForm.defaultAddress}
                            onChange={(e) => setRegisterForm({ ...registerForm, defaultAddress: e.target.checked })}
                            className="w-4 h-4 rounded border-stone-300 text-brand-500 focus:ring-brand-400 cursor-pointer"
                          />
                          <span className="text-sm text-stone-600">Default address</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Register Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  id="register-submit"
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 active:scale-[0.99] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-brand-200 hover:shadow-brand-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Register & Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Switch to Sign In link */}
                <p className="text-center text-sm text-stone-500 pt-1">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsRegister(false)}
                    className="text-brand-600 font-semibold hover:text-brand-700 hover:underline transition-colors cursor-pointer"
                  >
                    Sign in
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-stone-400 mt-6">
          © {new Date().getFullYear()} Flavour Fleet. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Login;
