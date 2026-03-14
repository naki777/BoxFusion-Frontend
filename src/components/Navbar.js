import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm px-4 md:px-8 py-3 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        {/* ლოგო */}
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src="https://res.cloudinary.com/dj4kd5tjf/image/upload/v1772891360/LOGO_knvwgr.png" 
            alt="გავაოცე" 
            className="h-10 md:h-14 w-auto transition-transform duration-300 group-hover:scale-105" 
          />
          <span className="text-xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-900 to-yellow-500 bg-clip-text text-transparent tracking-wide">
            გავაოცე
          </span>
        </Link>

        {/* Desktop მენიუ */}
        <div className="hidden md:flex gap-8 items-center">
          <Link to="/" className="text-gray-600 hover:text-blue-800 font-medium transition">მთავარი</Link>
          <Link to="/products" className="text-gray-600 hover:text-blue-800 font-medium transition">პროდუქტები</Link>
          
          {/* ჩამატებული: პროდუქტის დამატება (მხოლოდ ავტორიზებულზე) */}
          {isLoggedIn && (
            <Link 
              to="/add-product" 
              className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-xl font-bold text-sm hover:bg-yellow-500 transition shadow-sm border border-yellow-200"
            >
              + დამატება
            </Link>
          )}

          <Link to="/cart" className="relative text-gray-600 hover:text-blue-800 font-medium transition text-2xl">
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
            <button 
              onClick={handleLogout}
              className="bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 transition duration-300 shadow-md font-medium"
            >
              გამოსვლა
            </button>
          ) : (
            <Link 
              to="/login" 
              className="bg-gradient-to-r from-blue-800 to-blue-900 text-white px-5 py-2 rounded-full hover:scale-105 transition duration-300 shadow-md font-medium"
            >
              შესვლა
            </Link>
          )}
        </div>

        {/* Mobile ღილაკები */}
        <div className="flex md:hidden items-center gap-4">
          <Link to="/cart" className="relative text-gray-600 text-2xl">
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-blue-900 text-3xl font-bold">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown მენიუ */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 pt-4 pb-2 border-t border-gray-100 mt-3 animate-fadeIn">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-800 font-medium text-lg px-2">
            🏠 მთავარი
          </Link>
          <Link to="/products" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-800 font-medium text-lg px-2">
            🛍️ პროდუქტები
          </Link>
          
          {/* ჩამატებული მობილურისთვისაც */}
          {isLoggedIn && (
            <Link 
              to="/add-product" 
              onClick={() => setMenuOpen(false)} 
              className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-4 py-3 rounded-2xl font-bold text-center"
            >
              ✨ პროდუქტის დამატება
            </Link>
          )}

          <Link to="/cart" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-800 font-medium text-lg px-2">
            🛒 კალათა {totalItems > 0 && `(${totalItems})`}
          </Link>
          
          {isLoggedIn ? (
            <button 
              onClick={handleLogout}
              className="bg-red-500 text-white px-5 py-3 rounded-full font-bold text-center hover:bg-red-600 transition"
            >
              გამოსვლა
            </button>
          ) : (
            <Link 
              to="/login" 
              onClick={() => setMenuOpen(false)} 
              className="bg-blue-800 text-white px-5 py-3 rounded-full font-bold text-center hover:bg-blue-900 transition"
            >
              შესვლა
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;