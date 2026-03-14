import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  Gift, Sparkles, Gem, Heart, 
  LayoutGrid, PlusCircle, Crown, ShoppingCart, 
  Check, Shirt, Rocket, Flower2, Cake, ArrowRight
} from 'lucide-react';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/Product')
      .then(res => {
        // მხოლოდ პირველი 10 პროდუქტი გამოვაჩინოთ მთავარზე
        setProducts(Array.isArray(res.data) ? res.data.slice(0, 10) : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSellClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/add-product');
    }
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault(); 
    addToCart(product);
    setAddingId(product.id);
    setTimeout(() => setAddingId(null), 1500);
  };

// კატეგორიები ზუსტად იმ სახელებით, რაც შენს API-შია (URL-ებში რაც ჩანს)
  const categories = [
    { 
      name: 'საჩუქარი ქალისთვის', 
      icon: <Gem size={26}/>, 
      color: 'from-rose-400 to-rose-600', 
      shadow: 'shadow-rose-100' 
    },
    { 
      name: 'საჩუქრები კაცისთვის', 
      icon: <Shirt size={26}/>, 
      color: 'from-slate-700 to-slate-900', 
      shadow: 'shadow-slate-200' 
    },
    { 
      name: 'საჩუქარი ბავშვისთვის ბიჭი', 
      icon: <Rocket size={26}/>, 
      color: 'from-blue-400 to-indigo-600', 
      shadow: 'shadow-blue-100' 
    },
    { 
      name: 'საჩუქარი ბავშვისთვის გოგო', 
      icon: <Flower2 size={26}/>, 
      color: 'from-pink-300 to-fuchsia-500', 
      shadow: 'shadow-pink-100' 
    },
    { 
      name: 'დაბადების დღის საჩუქარი', 
      icon: <Cake size={26}/>, 
      color: 'from-amber-400 to-orange-500', 
      shadow: 'shadow-amber-100' 
    },
  ];
  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24 md:pb-10 font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Hero Section / Banner Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="col-span-2 bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-8 rounded-[3rem] flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-indigo-200 min-h-[220px]"
          >
             <div className="relative z-10">
                <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 inline-block">პრემიუმ კოლექცია</span>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight">სასაჩუქრე<br/>ბოქსები</h2>
             </div>
             <Link to="/products?category" className="relative z-10 flex items-center gap-2 font-bold text-sm bg-white text-indigo-600 w-fit px-6 py-3 rounded-2xl hover:gap-4 transition-all">
                ნახვა <ArrowRight size={18} />
             </Link>
             <Gift className="absolute -right-6 -bottom-6 opacity-20 rotate-12" size={180} />
          </motion.div>

          <div className="col-span-1 bg-white border border-slate-100 p-6 rounded-[3rem] flex flex-col justify-between shadow-xl shadow-slate-100/50">
             <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                <Sparkles size={24} />
             </div>
             <span className="font-black text-slate-800 text-sm uppercase tracking-tighter leading-tight italic">ხელნაკეთი<br/>ნივთები</span>
          </div>

          <div onClick={() => navigate('/products')} className="col-span-1 bg-slate-900 text-white p-6 rounded-[3rem] flex flex-col justify-between shadow-xl shadow-slate-300 cursor-pointer hover:bg-indigo-600 transition-colors group">
             <LayoutGrid className="text-indigo-400 group-hover:text-white transition-colors" size={28} />
             <span className="font-black text-sm uppercase tracking-tighter italic">ყველა<br/>ნივთი</span>
          </div>
        </div>

        {/* Categories Circle Slider */}
        <div className="flex gap-6 overflow-x-auto pb-10 no-scrollbar mb-6">
            {categories.map((cat, index) => (
              <Link 
                key={index} 
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="flex flex-col items-center gap-4 min-w-[100px] group"
              >
                  <div className={`w-20 h-20 rounded-[2.2rem] bg-gradient-to-br ${cat.color} text-white flex items-center justify-center shadow-xl ${cat.shadow} group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500`}>
                      {cat.icon}
                  </div>
                  <span className="text-[11px] font-black text-slate-500 text-center uppercase tracking-tighter">
                    {cat.name}
                  </span>
              </Link>
            ))}
        </div>

        {/* Featured Header */}
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-xl shadow-indigo-100">
                    <Crown size={22} fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">გამორჩეული</h3>
                  <div className="w-12 h-1 bg-indigo-600 rounded-full mt-1" />
                </div>
            </div>
            <Link to="/products" className="text-indigo-600 font-black text-sm hover:underline tracking-tight">ყველას ნახვა</Link>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-20 italic font-bold text-slate-400">იტვირთება...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
            <AnimatePresence>
              {products.map(product => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[2.8rem] overflow-hidden shadow-sm border border-slate-50 flex flex-col group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                >
                  <Link to={`/product/${product.id}`} className="aspect-square overflow-hidden relative bg-slate-50">
                    <img 
                      src={product.image?.[0] || 'https://via.placeholder.com/400'} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                    />
                    <button 
                      onClick={(e) => { e.preventDefault(); /* Like logic here */ }}
                      className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-md rounded-2xl text-slate-400 hover:text-rose-500 shadow-sm transition-all active:scale-90"
                    >
                        <Heart size={18} />
                    </button>
                  </Link>

                  <div className="p-6 flex flex-col flex-grow">
                    <h4 className="text-[15px] font-black text-slate-800 line-clamp-1 mb-4 leading-tight group-hover:text-indigo-600 transition-colors">
                      {product.name}
                    </h4>
                    
                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">ფასი</span>
                            <span className="text-xl font-black text-slate-900">{product.price}₾</span>
                        </div>
                        
                        <button 
                          onClick={(e) => handleAddToCart(e, product)}
                          className={`p-4 rounded-2xl transition-all duration-500 shadow-lg ${
                            addingId === product.id 
                              ? 'bg-emerald-500 text-white shadow-emerald-100' 
                              : 'bg-slate-950 text-white hover:bg-indigo-600 shadow-indigo-50'
                          }`}
                        >
                            {addingId === product.id ? (
                              <Check size={20} strokeWidth={3} className="animate-in zoom-in" />
                            ) : (
                              <ShoppingCart size={20} />
                            )}
                        </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation - Matches Global Style */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-white px-8 py-4 flex justify-between items-center md:hidden z-50 rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
        <Link to="/" className="flex flex-col items-center gap-1 text-indigo-600">
            <div className="p-1"><LayoutGrid size={24} /></div>
            <span className="text-[9px] font-black uppercase tracking-tighter">მთავარი</span>
        </Link>
        
        <div 
          onClick={handleSellClick} 
          className="bg-slate-900 p-4 rounded-2xl text-white shadow-2xl shadow-slate-400 -mt-14 border-4 border-white active:scale-90 transition-transform"
        >
            <PlusCircle size={24} />
        </div>

        <Link to="/cart" className="flex flex-col items-center gap-1 text-slate-400 relative">
            <div className="p-1"><ShoppingCart size={24} /></div>
            <span className="text-[9px] font-black uppercase tracking-tighter">კალათა</span>
        </Link>
      </div>
    </div>
  );
}

export default Home;