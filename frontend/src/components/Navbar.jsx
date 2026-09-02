import { Link, useLocation } from 'react-router-dom';
import { UtensilsCrossed, Home, PlusCircle } from 'lucide-react';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-card shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-200 group-hover:shadow-brand-300 transition-all duration-300 group-hover:scale-105">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold gradient-text hidden sm:block">
              Flavour Fleet
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive('/')
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-200'
                  : 'text-stone-600 hover:bg-brand-50 hover:text-brand-600'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link
              to="/add-restaurant"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive('/add-restaurant')
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-200'
                  : 'text-stone-600 hover:bg-brand-50 hover:text-brand-600'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Add Restaurant</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
