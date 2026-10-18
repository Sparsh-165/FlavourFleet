import axios from 'axios';
import type {
  User,
  LoginRequest,
  RegisterRequest,
  Restaurant,
  RestaurantSummary,
  RestaurantRequest,
  MenuItem,
  MenuItemRequest,
} from '../types';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// User APIs
export const loginUser = (data: LoginRequest) => API.post<User>('/user/login', data);

export const registerUser = (data: RegisterRequest) => API.post<User>('/user', data);

// Restaurant APIs
export const addRestaurant = (data: RestaurantRequest) => API.post<Restaurant>('/restaurant', data);

export const getRestaurant = (id: string | number) => API.get<Restaurant>(`/restaurant/${id}`);

export const getAllRestaurants = () => API.get<RestaurantSummary[]>('/restaurant');

// Menu Item APIs
export const addMenuItem = (data: MenuItemRequest) => API.post<MenuItem>('/menuItem', data);

export const getMenuItem = (id: string | number) => API.get<MenuItem>(`/menuItem/${id}`);

export const updateMenuItem = (id: string | number, data: MenuItemRequest) =>
  API.put<MenuItem>(`/menuItem/${id}`, data);

export const deleteMenuItem = (id: string | number) => API.delete(`/menuItem/${id}`);

export default API;
