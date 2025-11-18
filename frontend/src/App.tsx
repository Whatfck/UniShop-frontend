import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './views/Home';
import Search from './views/Search';
import { ProductDetail } from './views/ProductDetail';
import { Profile } from './views/Profile';
import Dashboard from './views/Dashboard';
import Favorites from './views/Favorites';
import MyProducts from './views/MyProducts';
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/my-products" element={<MyProducts />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/profile/:userId" element={<Profile />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
