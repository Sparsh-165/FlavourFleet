import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AddRestaurant from './pages/AddRestaurant';
import RestaurantView from './pages/RestaurantView';
import AddMenuItem from './pages/AddMenuItem';
import EditMenuItem from './pages/EditMenuItem';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
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
