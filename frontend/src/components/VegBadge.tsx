import type { MenuItemType } from '../types';

interface VegBadgeProps {
  type: MenuItemType;
}

function VegBadge({ type }: VegBadgeProps) {
  const isVeg = type === 'VEG';

  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center ${
          isVeg ? 'border-green-600' : 'border-red-600'
        }`}
      >
        <div
          className={`w-2.5 h-2.5 rounded-full ${
            isVeg ? 'bg-green-600' : 'bg-red-600'
          }`}
        />
      </div>
      <span
        className={`text-xs font-semibold uppercase tracking-wide ${
          isVeg ? 'text-green-700' : 'text-red-700'
        }`}
      >
        {isVeg ? 'Veg' : 'Non-Veg'}
      </span>
    </div>
  );
}

export default VegBadge;
