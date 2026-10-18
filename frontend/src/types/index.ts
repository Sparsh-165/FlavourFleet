export type MenuItemType = 'VEG' | 'NONVEG';

export interface MenuItemVariant {
  id?: number;
  dishVariantName: string;
  price: number;
  available: boolean;
  inventoryManaged: boolean;
  currentAvailableInventoryCount: number;
}

export interface MenuItemVariantFormData {
  dishVariantName: string;
  price: string | number;
  available: boolean;
  inventoryManaged: boolean;
  currentAvailableInventoryCount: string | number;
}

export interface MenuItem {
  id?: number;
  name: string;
  description: string;
  menuItemType: MenuItemType;
  label?: string | null;
  restaurantId?: number;
  menuItemVariants: MenuItemVariant[];
}

export interface MenuItemRequest {
  name: string;
  description: string;
  menuItemType: MenuItemType;
  restaurantId: number;
  label?: string | null;
  menuItemVariants: {
    dishVariantName: string;
    price: number;
    available: boolean;
    inventoryManaged: boolean;
    currentAvailableInventoryCount: number;
  }[];
}

export interface RestaurantSummary {
  id: number;
  name: string;
  phoneNumber: string;
  country: string;
  menuItemCount: number;
}

export interface Restaurant {
  id: number;
  name: string;
  phoneNumber: string;
  streetLine1: string;
  streetLine2?: string;
  country: string;
  pinCode: string;
  menuItems?: MenuItem[];
}

export interface RestaurantRequest {
  name: string;
  phoneNumber: string;
  streetLine1: string;
  streetLine2?: string;
  country: string;
  pinCode: string;
  latitude: number;
  longitude: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  streetLine1?: string;
  streetLine2?: string;
  country?: string;
  pinCode?: string;
  latitude?: number;
  longitude?: number;
  label?: string;
  defaultAddress?: boolean;
}

export interface LoginRequest {
  email: string;
  phoneNumber: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phoneNumber: string;
  streetLine1: string;
  streetLine2?: string;
  country: string;
  pinCode: string;
  latitude: number;
  longitude: number;
  label?: string;
  defaultAddress: boolean;
}
