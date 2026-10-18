import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Store,
  Phone,
  MapPin,
  Globe,
  Hash,
  Navigation,
  Loader2,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { addRestaurant } from '../api/api';

interface AddRestaurantFormState {
  name: string;
  phoneNumber: string;
  streetLine1: string;
  streetLine2: string;
  country: string;
  pinCode: string;
  latitude: string;
  longitude: string;
}

const initialForm: AddRestaurantFormState = {
  name: '',
  phoneNumber: '',
  streetLine1: '',
  streetLine2: '',
  country: '',
  pinCode: '',
  latitude: '',
  longitude: '',
};

function AddRestaurant() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<AddRestaurantFormState>(initialForm);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!form.name.trim()) return toast.error('Restaurant name is required');
    if (!form.phoneNumber.match(/^\d{10}$/)) return toast.error('Phone must be exactly 10 digits');
    if (!form.streetLine1.trim()) return toast.error('Street Line 1 is required');
    if (!form.country.trim()) return toast.error('Country is required');
    if (!form.pinCode.match(/^[1-9][0-9]{5}$/)) return toast.error('PIN code must be a valid 6-digit code');

    const lat = parseFloat(form.latitude);
    const lng = parseFloat(form.longitude);
    if (isNaN(lat) || lat < -90 || lat > 90) return toast.error('Latitude must be between -90 and 90');
    if (isNaN(lng) || lng < -180 || lng > 180) return toast.error('Longitude must be between -180 and 180');

    setLoading(true);
    try {
      await addRestaurant({
        ...form,
        latitude: lat,
        longitude: lng,
      });
      toast.success('Restaurant added successfully!', {
        icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      });
      setForm(initialForm);
    } catch (err: any) {
      toast.error(err?.response?.data || 'Failed to add restaurant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition-all duration-200';

  return (
    <div className="fade-in max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-stone-500 hover:text-brand-600 transition-colors mb-6 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </button>

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-white">Add Restaurant</h1>
              <p className="text-brand-100 text-sm mt-0.5">Register a new restaurant on the platform</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Restaurant Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-stone-600 mb-2">
              <Store className="w-4 h-4 text-brand-500" />
              Restaurant Name <span className="text-red-400">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. The Spice Garden"
              className={inputClass}
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-stone-600 mb-2">
              <Phone className="w-4 h-4 text-brand-500" />
              Phone Number <span className="text-red-400">*</span>
            </label>
            <input
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="10-digit phone number"
              maxLength={10}
              className={inputClass}
              required
            />
          </div>

          {/* Address */}
          <div className="space-y-4">
            <p className="flex items-center gap-2 text-sm font-medium text-stone-600">
              <MapPin className="w-4 h-4 text-brand-500" />
              Address Details
            </p>
            <input
              name="streetLine1"
              value={form.streetLine1}
              onChange={handleChange}
              placeholder="Street Line 1 *"
              className={inputClass}
              required
            />
            <input
              name="streetLine2"
              value={form.streetLine2}
              onChange={handleChange}
              placeholder="Street Line 2 (optional)"
              className={inputClass}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-stone-600 mb-2">
                  <Globe className="w-4 h-4 text-brand-500" />
                  Country <span className="text-red-400">*</span>
                </label>
                <input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="e.g. India"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-stone-600 mb-2">
                  <Hash className="w-4 h-4 text-brand-500" />
                  PIN Code <span className="text-red-400">*</span>
                </label>
                <input
                  name="pinCode"
                  value={form.pinCode}
                  onChange={handleChange}
                  placeholder="6-digit PIN"
                  maxLength={6}
                  className={inputClass}
                  required
                />
              </div>
            </div>
          </div>

          {/* Coordinates */}
          <div>
            <p className="flex items-center gap-2 text-sm font-medium text-stone-600 mb-3">
              <Navigation className="w-4 h-4 text-brand-500" />
              GPS Coordinates
            </p>
            <div className="grid grid-cols-2 gap-4">
              <input
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                placeholder="Latitude (-90 to 90) *"
                type="number"
                step="any"
                className={inputClass}
                required
              />
              <input
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                placeholder="Longitude (-180 to 180) *"
                type="number"
                step="any"
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold rounded-xl shadow-lg shadow-brand-200 hover:from-brand-600 hover:to-brand-700 hover:shadow-brand-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Add Restaurant
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddRestaurant;
