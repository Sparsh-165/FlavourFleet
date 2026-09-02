import { UtensilsCrossed, Github, Heart } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-lg flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-display font-semibold text-white">
              Flavour Fleet
            </span>
          </div>

          {/* Center Text */}
          <p className="text-sm text-stone-400 flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-400 fill-red-400" /> for food lovers
          </p>

          {/* Copyright */}
          <p className="text-sm text-stone-500">
            © {new Date().getFullYear()} Flavour Fleet. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
