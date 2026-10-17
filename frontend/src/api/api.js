import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// User APIs
export const loginUser = (data) => API.post('/user/login', data);

export const registerUser = (data) => API.post('/user', data);

// Restaurant APIs
export const addRestaurant = (data) => API.post('/restaurant', data);

export const getRestaurant = (id) => API.get(`/restaurant/${id}`);

export const getAllRestaurants = () => API.get('/restaurant');

// Menu Item APIs
export const addMenuItem = (data) => API.post('/menuItem', data);

export const getMenuItem = (id) => API.get(`/menuItem/${id}`);

export const updateMenuItem = (id, data) => API.put(`/menuItem/${id}`, data);

export const deleteMenuItem = (id) => API.delete(`/menuItem/${id}`);

export default API;

