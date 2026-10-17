import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AddRestaurant from './pages/AddRestaurant';
import RestaurantView from './pages/RestaurantView';
import AddMenuItem from './pages/AddMenuItem';
import EditMenuItem from './pages/EditMenuItem';
import Login from './pages/Login';

function App() {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('flavourfleet_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    sessionStorage.setItem('flavourfleet_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('flavourfleet_user');
  };

  // Show login page if not authenticated
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} onLogout={handleLogout} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-restaurant" element={<AddRestaurant />} />
          <Route path="/restaurant/:id" element={<RestaurantView />} />
          <Route path="/add-menu-item/:restaurantId" element={<AddMenuItem />} />
          <Route path="/edit-menu-item/:restaurantId/:menuItemId" element={<EditMenuItem />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
