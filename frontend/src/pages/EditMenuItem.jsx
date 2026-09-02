import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Utensils,
  ArrowLeft,
  PlusCircle,
  Trash2,
  Loader2,
  CheckCircle2,
  Package,
  FileText,
  Tag,
  Layers,
  Pencil,
} from 'lucide-react';
import { updateMenuItem, getMenuItem } from '../api/api';

const emptyVariant = {
  dishVariantName: '',
  price: '',
  available: true,
  inventoryManaged: false,
  currentAvailableInventoryCount: 0,
};

function EditMenuItem() {
  const { restaurantId, menuItemId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [form, setForm] = useState({
    name: '',
    description: '',
    menuItemType: 'VEG',
    label: '',
  });

  const [variants, setVariants] = useState([{ ...emptyVariant }]);

  // Pre-fill form: try sessionStorage first, then fall back to API
  useEffect(() => {
    const savedItem = sessionStorage.getItem('editMenuItem');
    if (savedItem) {
      try {
        const item = JSON.parse(savedItem);
        populateForm(item);
        sessionStorage.removeItem('editMenuItem');
        setFetching(false);
        return;
      } catch {
        // ignore parse errors, fall through to API
      }
    }

    // Fallback: fetch from API
    const fetchFromAPI = async () => {
      try {
        const res = await getMenuItem(menuItemId);
        if (res.data) {
          populateForm(res.data);
        } else {
          toast.error('Menu item not found');
          navigate(`/restaurant/${restaurantId}`);
        }
      } catch (err) {
        toast.error('Failed to load menu item details');
        navigate(`/restaurant/${restaurantId}`);
      } finally {
        setFetching(false);
      }
    };

    fetchFromAPI();
  }, [menuItemId, restaurantId, navigate]);

  const populateForm = (item) => {
    setForm({
      name: item.name || '',
      description: item.description || '',
      menuItemType: item.menuItemType || 'VEG',
      label: item.label || '',
    });
    if (item.menuItemVariants && item.menuItemVariants.length > 0) {
      setVariants(
        item.menuItemVariants.map((v) => ({
          dishVariantName: v.dishVariantName || '',
          price: v.price ?? '',
          available: v.available ?? true,
          inventoryManaged: v.inventoryManaged ?? false,
          currentAvailableInventoryCount: v.currentAvailableInventoryCount ?? 0,
        }))
      );
    }
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const addVariant = () => {
    setVariants([...variants, { ...emptyVariant }]);
  };

  const removeVariant = (index) => {
    if (variants.length === 1) {
      toast.error('At least one variant is required');
      return;
    }
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return toast.error('Dish name is required');
    if (!form.description.trim()) return toast.error('Description is required');
    if (form.description.trim().length > 1000) return toast.error('Description cannot exceed 1000 characters');
    if (form.label && form.label.trim().length > 50) return toast.error('Label cannot exceed 50 characters');

    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      if (!v.dishVariantName.trim()) return toast.error(`Variant ${i + 1}: Name is required`);
      if (!v.price || Number(v.price) <= 0) return toast.error(`Variant ${i + 1}: Price must be greater than 0`);
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      menuItemType: form.menuItemType,
      restaurantId: Number(restaurantId),
      label: form.label.trim() || null,
      menuItemVariants: variants.map((v) => ({
        dishVariantName: v.dishVariantName.trim(),
        price: Number(v.price),
        available: v.available,
        inventoryManaged: v.inventoryManaged,
        currentAvailableInventoryCount: v.inventoryManaged ? Number(v.currentAvailableInventoryCount) : 0,
      })),
    };

    setLoading(true);
    try {
      await updateMenuItem(menuItemId, payload);
      toast.success('Menu item updated successfully!', {
        icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      });
      navigate(`/restaurant/${restaurantId}`);
    } catch (err) {
      toast.error(err?.response?.data || 'Failed to update menu item');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all duration-200';

  // Show loading state while fetching menu item data
  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
        <p className="text-stone-500 font-medium">Loading menu item...</p>
      </div>
    );
  }

  return (
    <div className="fade-in max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Back */}
      <button
        onClick={() => navigate(`/restaurant/${restaurantId}`)}
        className="flex items-center gap-2 text-stone-500 hover:text-violet-600 transition-colors mb-6 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Restaurant
      </button>

      <div className="bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-500 to-purple-500 px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Pencil className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-white">Edit Menu Item</h1>
              <p className="text-violet-100 text-sm mt-0.5">
                Editing Item #{menuItemId} · Restaurant #{restaurantId}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Dish Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-stone-600 mb-2">
              <Utensils className="w-4 h-4 text-violet-500" />
              Dish Name <span className="text-red-400">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleFormChange}
              placeholder="e.g. Paneer Butter Masala"
              className={inputClass}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-stone-600 mb-2">
              <FileText className="w-4 h-4 text-violet-500" />
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleFormChange}
              placeholder="Describe the dish, ingredients, preparation style..."
              rows={3}
              maxLength={1000}
              className={`${inputClass} resize-none`}
              required
            />
            <p className="text-xs text-stone-400 mt-1 text-right">
              {form.description.length}/1000
            </p>
          </div>

          {/* Type + Label */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-stone-600 mb-2">
                <Layers className="w-4 h-4 text-violet-500" />
                Type <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, menuItemType: 'VEG' })}
                  className={`flex-1 py-3 rounded-xl border-2 font-medium text-sm transition-all duration-200 ${
                    form.menuItemType === 'VEG'
                      ? 'border-green-500 bg-green-50 text-green-700 shadow-sm'
                      : 'border-stone-200 text-stone-500 hover:border-stone-300'
                  }`}
                >
                  🟢 Veg
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, menuItemType: 'NONVEG' })}
                  className={`flex-1 py-3 rounded-xl border-2 font-medium text-sm transition-all duration-200 ${
                    form.menuItemType === 'NONVEG'
                      ? 'border-red-500 bg-red-50 text-red-700 shadow-sm'
                      : 'border-stone-200 text-stone-500 hover:border-stone-300'
                  }`}
                >
                  🔴 Non-Veg
                </button>
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-stone-600 mb-2">
                <Tag className="w-4 h-4 text-violet-500" />
                Label
              </label>
              <input
                name="label"
                value={form.label}
                onChange={handleFormChange}
                placeholder="e.g. Bestseller, New"
                maxLength={50}
                className={inputClass}
              />
            </div>
          </div>

          {/* Variants */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-2 text-sm font-medium text-stone-600">
                <Package className="w-4 h-4 text-violet-500" />
                Variants <span className="text-red-400">*</span>
                <span className="text-stone-400 font-normal">(at least one)</span>
              </label>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Add Variant
              </button>
            </div>

            <div className="space-y-4">
              {variants.map((variant, idx) => (
                <div
                  key={idx}
                  className="slide-up bg-stone-50 rounded-2xl p-5 border border-stone-200 relative group"
                  style={{ animationDelay: `${idx * 60}ms`, animationFillMode: 'backwards' }}
                >
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(idx)}
                      className="absolute top-3 right-3 p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
                    Variant {idx + 1}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      value={variant.dishVariantName}
                      onChange={(e) => handleVariantChange(idx, 'dishVariantName', e.target.value)}
                      placeholder="Variant name (e.g. Half, Full)"
                      className={inputClass}
                      required
                    />
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                      placeholder="Price (₹)"
                      min="0"
                      step="0.01"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={variant.available}
                        onChange={(e) => handleVariantChange(idx, 'available', e.target.checked)}
                        className="w-4 h-4 rounded border-stone-300 text-violet-500 focus:ring-violet-400"
                      />
                      <span className="text-sm text-stone-600">Available</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={variant.inventoryManaged}
                        onChange={(e) => handleVariantChange(idx, 'inventoryManaged', e.target.checked)}
                        className="w-4 h-4 rounded border-stone-300 text-violet-500 focus:ring-violet-400"
                      />
                      <span className="text-sm text-stone-600">Manage Inventory</span>
                    </label>

                    {variant.inventoryManaged && (
                      <input
                        type="number"
                        value={variant.currentAvailableInventoryCount}
                        onChange={(e) =>
                          handleVariantChange(idx, 'currentAvailableInventoryCount', e.target.value)
                        }
                        placeholder="Stock count"
                        min="0"
                        className="w-32 px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-200 hover:from-violet-600 hover:to-purple-600 hover:shadow-violet-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Update Menu Item
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditMenuItem;
