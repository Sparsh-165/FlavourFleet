import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ArrowRight, Utensils, MapPin, Clock, Star, Phone, Globe, ChefHat, Loader2, Store } from 'lucide-react';
import { toast } from 'sonner';
import { getAllRestaurants } from '../api/api';

function Home() {
  const [searchId, setSearchId] = useState('');
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await getAllRestaurants();
        setRestaurants(res.data || []);
      } catch (err) {
        // Silently fail — the section just won't show
        setRestaurants([]);
      } finally {
        setLoadingRestaurants(false);
      }
    };
    fetchRestaurants();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const id = searchId.trim();
    if (!id || isNaN(id) || Number(id) <= 0) {
      toast.error('Please enter a valid restaurant ID');
      return;
    }
    navigate(`/restaurant/${id}`);
  };

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-200 rounded-full opacity-20 blur-3xl" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-amber-200 rounded-full opacity-20 blur-3xl" />
          <div className="absolute bottom-10 left-1/3 w-64 h-64 bg-orange-200 rounded-full opacity-15 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 text-brand-700 rounded-full text-sm font-medium mb-6">
              <Utensils className="w-4 h-4" />
              Restaurant Management Platform
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-stone-900 leading-tight">
              Manage Your{' '}
              <span className="gradient-text">Restaurant</span>{' '}
              with Ease
            </h1>

            <p className="mt-6 text-lg text-stone-500 max-w-2xl mx-auto leading-relaxed">
              Add restaurants, curate menus, manage dish variants & pricing — all in one
              beautiful dashboard. Built for food entrepreneurs.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mt-10 max-w-lg mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-400 to-orange-400 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity" />
                <div className="relative flex items-center bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
                  <Search className="w-5 h-5 text-stone-400 ml-5" />
                  <input
                    type="text"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder="Enter Restaurant ID to search..."
                    className="flex-1 px-4 py-4 text-stone-700 placeholder-stone-400 focus:outline-none text-base"
                  />
                  <button
                    type="submit"
                    className="m-2 px-6 py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all duration-200 shadow-lg shadow-brand-200 hover:shadow-brand-300 flex items-center gap-2"
                  >
                    Search
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>

            {/* Quick Action */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <span className="text-sm text-stone-400">or</span>
              <Link
                to="/add-restaurant"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-brand-300 text-brand-600 font-medium rounded-xl hover:bg-brand-50 transition-all duration-200"
              >
                Register a New Restaurant
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Browse Restaurants Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-display font-bold text-stone-800">Browse Restaurants</h2>
            <p className="text-sm text-stone-500 mt-1">
              {loadingRestaurants
                ? 'Loading...'
                : `${restaurants.length} ${restaurants.length === 1 ? 'restaurant' : 'restaurants'} registered`}
            </p>
          </div>
          <Link
            to="/add-restaurant"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all shadow-lg shadow-brand-200 hover:shadow-brand-300 text-sm"
          >
            <Store className="w-4 h-4" />
            Add New
          </Link>
        </div>

        {loadingRestaurants ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            <p className="text-stone-400 text-sm">Loading restaurants...</p>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Store className="w-10 h-10 text-stone-300" />
            </div>
            <h3 className="text-xl font-semibold text-stone-600 mb-2">No restaurants yet</h3>
            <p className="text-stone-400 mb-6">
              Get started by registering your first restaurant.
            </p>
            <Link
              to="/add-restaurant"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white font-medium rounded-xl hover:bg-brand-600 transition-colors"
            >
              <Store className="w-4 h-4" />
              Register Restaurant
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((r, idx) => (
              <Link
                key={r.id}
                to={`/restaurant/${r.id}`}
                className="slide-up bg-white rounded-2xl shadow-sm hover:shadow-xl border border-stone-100 hover:border-brand-200 transition-all duration-300 overflow-hidden group"
                style={{ animationDelay: `${idx * 80}ms`, animationFillMode: 'backwards' }}
              >
                {/* Card Top Accent */}
                <div className="h-2 bg-gradient-to-r from-brand-400 via-brand-500 to-orange-400 group-hover:from-brand-500 group-hover:to-orange-500 transition-all" />

                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-11 h-11 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center shadow-md shadow-brand-200 group-hover:scale-110 transition-transform">
                          <Utensils className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-stone-800 group-hover:text-brand-600 transition-colors">
                            {r.name}
                          </h3>
                          <p className="text-xs text-stone-400">ID: #{r.id}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mt-4">
                        {r.phoneNumber && (
                          <div className="flex items-center gap-2 text-sm text-stone-500">
                            <Phone className="w-3.5 h-3.5 text-stone-400" />
                            {r.phoneNumber}
                          </div>
                        )}
                        {r.country && (
                          <div className="flex items-center gap-2 text-sm text-stone-500">
                            <Globe className="w-3.5 h-3.5 text-stone-400" />
                            {r.country}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-5 pt-4 border-t border-dashed border-stone-200 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm text-stone-500">
                      <ChefHat className="w-4 h-4 text-brand-400" />
                      <span className="font-medium">{r.menuItemCount}</span>
                      <span>{r.menuItemCount === 1 ? 'dish' : 'dishes'}</span>
                    </div>
                    <span className="text-xs font-medium text-brand-500 group-hover:text-brand-600 flex items-center gap-1 transition-colors">
                      View Menu
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: MapPin,
              title: 'Location Aware',
              desc: 'Register restaurants with precise GPS coordinates and full address details.',
              color: 'from-blue-500 to-cyan-500',
              shadow: 'shadow-blue-200',
            },
            {
              icon: Utensils,
              title: 'Rich Menu Builder',
              desc: 'Create dishes with multiple variants, pricing, and VEG/NONVEG classification.',
              color: 'from-brand-500 to-orange-500',
              shadow: 'shadow-brand-200',
            },
            {
              icon: Clock,
              title: 'Inventory Tracking',
              desc: 'Track availability and inventory counts for every dish variant in real time.',
              color: 'from-emerald-500 to-teal-500',
              shadow: 'shadow-emerald-200',
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="slide-up bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-stone-100 hover:border-brand-200 transition-all duration-300 group"
              style={{ animationDelay: `${idx * 120}ms`, animationFillMode: 'backwards' }}
            >
              <div
                className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg ${feature.shadow} mb-4 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-stone-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
