import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // 
import { CartProvider } from './context/CartContext'; //  context ფოლდერშია

// Components
import ScrollToTop from './components/ScrollToTop'; //  components

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Cart from './pages/Cart';
import AddProduct from './pages/AddProduct';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          {/* ScrollToTop დავამატე აქ, რომ ყოველ გადასვლაზე თავში ააგდოს */}
          <ScrollToTop /> 
          
          <Routes>
            {/* მთავარი გვერდი */}
            <Route path="/" element={<Home />} />
            
            {/* პროდუქტების კატალოგი */}
            <Route path="/products" element={<Products />} />
            
            {/* დეტალური გვერდი - ID პარამეტრით */}
            <Route path="/product/:id" element={<ProductDetail />} />
            
            {/* ავტორიზაცია */}
            <Route path="/login" element={<Login />} />
            
            {/* რეგისტრაცია */}
            <Route path="/register" element={<Register />} />

            {/* კალათა */}
            <Route path="/cart" element={<Cart />} />
            
            {/* პროდუქტის დამატება (Admin/User) */}
            <Route path="/add-product" element={<AddProduct />} />
            
            {/* 404 ან სხვა შემთხვევაში Default გვერდი */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;