import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Phone,
  MapPin,
  Globe,
  ArrowLeft,
  PlusCircle,
  Utensils,
  Loader2,
  AlertCircle,
  SearchX,
} from 'lucide-react';
import { getRestaurant } from '../api/api';
import MenuItemCard from '../components/MenuItemCard';

function RestaurantView() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRestaurant = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getRestaurant(id);
      if (res.data) {
        setRestaurant(res.data);
      } else {
        setError('not_found');
      }
    } catch (err) {
      if (err?.response?.status === 404 || err?.response?.data === null) {
        setError('not_found');
      } else {
        setError('server_error');
        toast.error('Failed to load restaurant details');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRestaurant();
  }, [fetchRestaurant]);

  const handleMenuItemDeleted = (deletedItemId) => {
    // Optimistically remove the item from local state, then re-fetch for consistency
    setRestaurant((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        menuItems: prev.menuItems.filter((item) => item.id !== deletedItemId),
      };
    });
  };

  // Loading
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
        <p className="text-stone-500 font-medium">Loading restaurant...</p>
      </div>
    );
  }

  // Not found
  if (error === 'not_found') {
    return (
      <div className="fade-in flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center">
          <SearchX className="w-10 h-10 text-stone-400" />
        </div>
        <h2 className="text-2xl font-display font-bold text-stone-700">Restaurant Not Found</h2>
        <p className="text-stone-500 text-center max-w-md">
          No restaurant exists with ID <span className="font-semibold text-brand-600">#{id}</span>.
          It may not have been created yet.
        </p>
        <Link
          to="/"
          className="mt-4 flex items-center gap-2 px-6 py-3 bg-brand-500 text-white font-medium rounded-xl hover:bg-brand-600 transition-colors shadow-lg shadow-brand-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Home
        </Link>
      </div>
    );
  }

  // Server Error
  if (error === 'server_error') {
    return (
      <div className="fade-in flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-red-400" />
        </div>
        <h2 className="text-2xl font-display font-bold text-stone-700">Something Went Wrong</h2>
        <p className="text-stone-500">Could not connect to the server. Is the backend running?</p>
        <Link
          to="/"
          className="mt-4 flex items-center gap-2 px-6 py-3 bg-brand-500 text-white font-medium rounded-xl hover:bg-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Home
        </Link>
      </div>
    );
  }

  const menuItems = restaurant.menuItems || [];
  const vegCount = menuItems.filter((i) => i.menuItemType === 'VEG').length;
  const nonVegCount = menuItems.filter((i) => i.menuItemType === 'NONVEG').length;

  return (
    <div className="fade-in">
      {/* Restaurant Header */}
      <div className="bg-gradient-to-br from-brand-500 via-brand-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Utensils className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-display font-bold">{restaurant.name}</h1>
                  <p className="text-white/70 text-sm mt-1">Restaurant ID: #{restaurant.id}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-white/80">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4" />
                  {restaurant.phoneNumber}
                </span>
                {restaurant.streetLine1 && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {restaurant.streetLine1}
                  </span>
                )}
                {restaurant.country && (
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4" />
                    {restaurant.country} — {restaurant.pinCode}
                  </span>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl text-center">
                <p className="text-2xl font-bold">{menuItems.length}</p>
                <p className="text-xs text-white/70">Dishes</p>
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl text-center">
                <p className="text-2xl font-bold text-green-300">{vegCount}</p>
                <p className="text-xs text-white/70">Veg</p>
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl text-center">
                <p className="text-2xl font-bold text-red-300">{nonVegCount}</p>
                <p className="text-xs text-white/70">Non-Veg</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-display font-bold text-stone-800">Menu</h2>
            <p className="text-sm text-stone-500 mt-1">
              {menuItems.length} {menuItems.length === 1 ? 'item' : 'items'} available
            </p>
          </div>
          <Link
            to={`/add-menu-item/${restaurant.id}`}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all shadow-lg shadow-brand-200 hover:shadow-brand-300"
          >
            <PlusCircle className="w-4 h-4" />
            Add Dish
          </Link>
        </div>

        {menuItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils className="w-10 h-10 text-stone-300" />
            </div>
            <h3 className="text-xl font-semibold text-stone-600 mb-2">No dishes yet</h3>
            <p className="text-stone-400 mb-6">
              This restaurant hasn't added any menu items. Be the first!
            </p>
            <Link
              to={`/add-menu-item/${restaurant.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white font-medium rounded-xl hover:bg-brand-600 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Add First Dish
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, idx) => (
              <MenuItemCard
                key={item.id || idx}
                item={item}
                index={idx}
                restaurantId={restaurant.id}
                onDelete={handleMenuItemDeleted}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RestaurantView;
