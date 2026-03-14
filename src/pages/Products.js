import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom'; // დავამატეთ Link
import API from '../services/api';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, LayoutGrid, Check, Loader2, Search, AlertTriangle, ArrowRight } from 'lucide-react';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const { addToCart } = useCart();
  const [addingId, setAddingId] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category');
  const searchKeyword = searchParams.get('search');

  useEffect(() => {
    setLoading(true);
    API.get('/Product')
      .then(res => {
        setProducts(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(() => {
        setError('შეცდომა პროდუქტების ჩატვირთვისას');
        setLoading(false);
      });

    API.get('/Category')
      .then(res => setCategories(res.data))
      .catch(err => console.error("კატეგორიების ჩატვირთვის შეცდომა:", err));
  }, []);

  const handleAddToCart = (e, product) => {
    e.preventDefault(); // რომ არ გადავიდეს დეტალურ გვერდზე ღილაკზე დაჭერისას
    addToCart(product);
    setAddingId(product.id);
    setTimeout(() => setAddingId(null), 1500);
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = !selectedCategory || (p.categoryName === selectedCategory);
    const matchesSearch = !searchKeyword || p.name.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div>
            <span className="text-indigo-600 font-black tracking-widest uppercase text-xs mb-2 block ml-1">კატალოგი</span>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter capitalize">
               {searchKeyword ? `ძებნა: "${searchKeyword}"` : (selectedCategory || 'ყველა ნივთი')}
            </h2>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto custom-scrollbar">
            <button 
              onClick={() => setSearchParams({})}
              className={`px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${!selectedCategory ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-100'}`}
            >
              <LayoutGrid size={16} /> ყველა
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSearchParams({ category: cat.name })}
                className={`px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat.name ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-100'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <Loader2 className="animate-spin text-indigo-600 w-12 h-12" />
            <p className="text-slate-400 font-bold">იტვირთება კოლექცია...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
             <Search className="mx-auto text-slate-200 mb-4" size={64} />
             <h3 className="text-xl font-bold text-slate-800">არაფერი მოიძებნა</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence>
              {filteredProducts.map(product => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-50 overflow-hidden flex flex-col h-full group"
                >
                  <Link to={`/product/${product.id}`} className="block aspect-[4/5] overflow-hidden relative">
                    <img src={product.image[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <div className="bg-white p-3 rounded-full text-slate-900 translate-y-4 group-hover:translate-y-0 transition-transform">
                          <ArrowRight size={20} />
                       </div>
                    </div>
                  </Link>

                  <div className="p-6 flex flex-col flex-grow">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">{product.name}</h3>
                    </Link>
                    <p className="text-slate-500 text-xs mb-6 line-clamp-2">{product.info}</p>
                    
                    <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-black text-slate-900">{product.price} <span className="text-indigo-600 text-lg">₾</span></span>
                      </div>
                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`p-4 rounded-xl transition-all shadow-lg ${addingId === product.id ? 'bg-emerald-500 text-white' : 'bg-slate-950 text-white hover:bg-indigo-600'}`}
                      >
                        {addingId === product.id ? <Check size={20} /> : <ShoppingBag size={20} />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}

export default Products;