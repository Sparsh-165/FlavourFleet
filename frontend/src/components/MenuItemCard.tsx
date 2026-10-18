import { useState } from 'react';
import { IndianRupee, CheckCircle2, XCircle, Pencil, Trash2, AlertTriangle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { deleteMenuItem } from '../api/api';
import VegBadge from './VegBadge';
import type { MenuItem } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
  restaurantId?: string | number;
  onDelete?: (id: number) => void;
}

function MenuItemCard({ item, index, restaurantId, onDelete }: MenuItemCardProps) {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleEdit = () => {
    // Store item data in sessionStorage for the edit form to pre-fill
    sessionStorage.setItem('editMenuItem', JSON.stringify(item));
    navigate(`/edit-menu-item/${restaurantId}/${item.id}`);
  };

  const handleDelete = async () => {
    if (!item.id) return;
    setDeleting(true);
    try {
      await deleteMenuItem(item.id);
      toast.success(`"${item.name}" deleted successfully`);
      setShowConfirm(false);
      if (onDelete) onDelete(item.id);
    } catch (err: any) {
      toast.error(err?.response?.data || 'Failed to delete menu item');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div
        className="slide-up bg-white rounded-2xl shadow-sm hover:shadow-xl border border-stone-100 hover:border-brand-200 transition-all duration-300 overflow-hidden group"
        style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'backwards' }}
      >
        {/* Header */}
        <div className="p-5 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <VegBadge type={item.menuItemType} />
                {item.label && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                    {item.label}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-stone-800 mt-2 group-hover:text-brand-600 transition-colors">
                {item.name}
              </h3>
              <p className="text-sm text-stone-500 mt-1 line-clamp-2">
                {item.description}
              </p>
            </div>

            {/* Action Buttons */}
            {item.id && (
              <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-all">
                <button
                  onClick={handleEdit}
                  className="p-2 text-stone-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all"
                  title="Edit this dish"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowConfirm(true)}
                  className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  title="Delete this dish"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Variants */}
        {item.menuItemVariants && item.menuItemVariants.length > 0 && (
          <div className="px-5 pb-5">
            <div className="border-t border-dashed border-stone-200 pt-3 mt-1">
              <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-2">
                Available Sizes
              </p>
              <div className="space-y-2">
                {item.menuItemVariants.map((variant, vIdx) => (
                  <div
                    key={vIdx}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm ${
                      variant.available
                        ? 'bg-stone-50 hover:bg-brand-50'
                        : 'bg-stone-100 opacity-60'
                    } transition-colors`}
                  >
                    <div className="flex items-center gap-2">
                      {variant.available ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-stone-400" />
                      )}
                      <span className={`font-medium ${variant.available ? 'text-stone-700' : 'text-stone-400 line-through'}`}>
                        {variant.dishVariantName}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5 font-semibold text-stone-800">
                      <IndianRupee className="w-3.5 h-3.5" />
                      {variant.price?.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !deleting && setShowConfirm(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-sm w-full p-6 fade-in">
            {/* Close button */}
            <button
              onClick={() => !deleting && setShowConfirm(false)}
              className="absolute top-4 right-4 p-1 text-stone-400 hover:text-stone-600 rounded-lg transition-colors"
              disabled={deleting}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon */}
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>

            {/* Content */}
            <h3 className="text-lg font-semibold text-stone-800 text-center mb-2">
              Delete Dish?
            </h3>
            <p className="text-sm text-stone-500 text-center mb-6">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-stone-700">"{item.name}"</span>?
              This action cannot be undone.
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
                className="flex-1 py-2.5 border-2 border-stone-200 text-stone-600 font-medium rounded-xl hover:bg-stone-50 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MenuItemCard;
