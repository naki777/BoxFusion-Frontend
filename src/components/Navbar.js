import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, PlusCircle, LogOut, LogIn, ChevronDown, LayoutGrid, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

function Navbar() {
  const { cartItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    // კატეგორიების წამოღება API-დან
    API.get('/Category') 
      .then(res => setCategories(res.data))
      .catch(err => console.error("კატეგორიების ჩატვირთვის შეცდომა:", err));
  }, []);

  const handleSellClick = () => {
    if (!isAuthenticated) {
      alert("⚠️ პროდუქტის დასამატებლად გთხოვთ გაიაროთ ავტორიზაცია");
      navigate('/login');
    } else {
      navigate('/add-product');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full px-4 py-4 bg-[#fafafa]/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto bg-white/90 border border-white/40 shadow-xl shadow-indigo-100/20 rounded-[2.5rem] px-6 py-3 flex items-center justify-between">
        
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center group">
            <img src="https://res.cloudinary.com/dj4kd5tjf/image/upload/v1772891360/LOGO_knvwgr.png" alt="Gavaoce" className="h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-105" />
          </Link>

          {/* კატეგორიების Dropdown */}
          <div 
            className="relative hidden md:block"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button className="flex items-center gap-2 font-black text-sm text-slate-700 hover:text-indigo-600 transition-colors py-2">
              <LayoutGrid size={18} />
              კატეგორიები
              <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-100 shadow-2xl shadow-indigo-100 rounded-[2.2rem] p-3 overflow-hidden"
                >
                  <button
                    onClick={() => { navigate('/products'); setIsDropdownOpen(false); }}
                    className="w-full text-left px-5 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all mb-1"
                  >
                    ყველა პროდუქტი
                  </button>

                  <div className="h-[1px] bg-slate-50 my-2 mx-4" />

                  {categories.map((cat) => (
                    <button
                      key={cat.id} // ბექენდი აბრუნებს id-ს
                      onClick={() => {
                        navigate(`/products?category=${encodeURIComponent(cat.name)}`);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-5 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-all flex items-center justify-between group"
                    >
                      {cat.name}
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-indigo-500 transition-colors" />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* ძებნა */}
          <form onSubmit={handleSearchSubmit} className="relative hidden sm:block w-64 group">
            <input 
              type="text"
              placeholder="მოძებნე რამე..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-2.5 rounded-full bg-slate-50 border border-slate-100 focus:border-indigo-200 outline-none transition-all text-sm font-bold"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
          </form>

          {/* გაყიდვა */}
          <button 
            onClick={handleSellClick}
            className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl font-black text-sm hover:bg-indigo-600 transition shadow-lg"
          >
            <PlusCircle size={18} /> გაყიდვა
          </button>

          {/* კალათა */}
          <Link to="/cart" className="relative p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all">
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 border-2 border-white rounded-full text-[10px] text-white flex items-center justify-center font-black">
                {cartCount}
              </span>
            )}
          </Link>

          <div className="h-8 w-[1px] bg-slate-100 mx-2 hidden sm:block"></div>

          {/* პროფილი/შესვლა */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">პროფილი</span>
                <span className="text-sm font-bold text-slate-900">{user.email?.split('@')[0]}</span>
              </div>
              <button onClick={logout} className="p-3 text-rose-500 hover:bg-rose-50 rounded-2xl transition">
                <LogOut size={22} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 p-3 text-slate-500 hover:bg-slate-100 rounded-2xl transition font-bold text-sm">
              <LogIn size={22} /> <span className="hidden md:inline">შესვლა</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;