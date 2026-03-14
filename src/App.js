import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Products from './pages/Products';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import AddProduct from './pages/AddProduct'; // 
function App() {
  return (
    <BrowserRouter>
      <Routes>
    

<Route path="/cart" element={<Cart />} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/add-product" element={<AddProduct />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;