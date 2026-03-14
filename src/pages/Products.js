import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, LayoutGrid, Check, Loader2, SearchX, Heart } from 'lucide-react';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const { addToCart } = useCart();
  const [addingId, setAddingId] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category')?.trim();
  const searchKeyword = searchParams.get('search')?.trim();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      API.get('/Product'),
      API.get('/Category')
    ])
    .then(([prodRes, catRes]) => {
      console.log("პროდუქტები ბაზიდან:", prodRes.data); // შეამოწმე Console-ში!
      console.log("კატეგორიები ბაზიდან:", catRes.data);
      
      setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
      setCategories(Array.isArray(catRes.data) ? catRes.data : []);
      setLoading(false);
    })
    .catch((err) => {
      console.error("ჩატვირთვის შეცდომა:", err);
      setLoading(false);
    });
  }, []);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addToCart(product);
    setAddingId(product.id);
    setTimeout(() => setAddingId(null), 1500);
  };

  // გაფილტვრის გაუმჯობესებული ლოგიკა
  const filteredProducts = products.filter(p => {
    // ზოგჯერ API-ს აქვს categoryName, ზოგჯერ უბრალოდ category
    const pCategory = p.categoryName || p.category || "";
    
    const matchesCategory = !selectedCategory || 
      pCategory.toLowerCase().trim() === selectedCategory.toLowerCase().trim();
    
    const matchesSearch = !searchKeyword || 
      p.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (p.info && p.info.toLowerCase().includes(searchKeyword.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24 md:pb-12 font-sans text-slate-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <span className="text-indigo-600 font-black tracking-[0.2em] uppercase text-[10px] mb-2 block ml-1">GAVAOCE / კატალოგი</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter capitalize leading-none italic">
               {searchKeyword ? `ძებნა: "${searchKeyword}"` : (selectedCategory || 'ყველა ნივთი')}
            </h2>
            <p className="text-slate-400 font-bold mt-3 ml-1 text-sm">ნაპოვნია {filteredProducts.length} პროდუქტი</p>
          </motion.div>

          {/* Categories Slider */}
          <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            <button 
              onClick={() => setSearchParams({})}
              className={`px-6 py-3.5 rounded-[1.5rem] text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 shadow-sm ${!selectedCategory ? 'bg-slate-900 text-white shadow-slate-200' : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'}`}
            >
              <LayoutGrid size={14} /> ყველა
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSearchParams({ category: cat.name })}
                className={`px-6 py-3.5 rounded-[1.5rem] text-xs font-black whitespace-nowrap transition-all shadow-sm ${selectedCategory === cat.name ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <Loader2 className="animate-spin text-indigo-600 w-10 h-10" strokeWidth={3} />
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">იტვირთება მონაცემები...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
            <SearchX size={64} className="text-slate-200 mb-4" strokeWidth={1.5} />
            <h3 className="text-xl font-black text-slate-400 tracking-tighter uppercase italic">ვერაფერი მოიძებნა</h3>
            <button onClick={() => setSearchParams({})} className="mt-6 text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline">ყველა ნივთის ნახვა</button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-10">
            <AnimatePresence mode='popLayout'>
              {filteredProducts.map((product, idx) => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="bg-white rounded-[2.2rem] md:rounded-[2.8rem] shadow-xl shadow-slate-200/40 border border-white overflow-hidden flex flex-col h-full group hover:-translate-y-2 transition-all duration-500"
                >
                  <Link to={`/product/${product.id}`} className="block aspect-[4/5] overflow-hidden relative bg-slate-50">
                    <img 
                      src={product.image?.[0] || 'https://via.placeholder.com/400x500'} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    />
                    <div className="absolute top-4 right-4">
                        <div className="p-3 bg-white/80 backdrop-blur-md rounded-2xl text-slate-300 hover:text-rose-500 shadow-sm transition-all">
                            <Heart size={16} />
                        </div>
                    </div>
                  </Link>

                  <div className="p-5 md:p-7 flex flex-col flex-grow">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-[15px] md:text-lg font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1 italic leading-tight">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-slate-400 text-[10px] md:text-xs font-bold mb-6 line-clamp-2 leading-relaxed">
                      {product.info || "GAVAOCE პრემიუმ ხარისხის საჩუქარი თქვენთვის."}
                    </p>
                    
                    <div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">ფასი</span>
                        <span className="text-xl md:text-2xl font-black text-slate-950">
                          {product.price}<span className="text-indigo-600 ml-0.5">₾</span>
                        </span>
                      </div>
                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`p-4 rounded-[1.2rem] md:rounded-[1.4rem] transition-all duration-500 shadow-lg active:scale-90 ${
                          addingId === product.id 
                            ? 'bg-emerald-500 text-white shadow-emerald-100' 
                            : 'bg-slate-950 text-white hover:bg-indigo-600'
                        }`}
                      >
                        {addingId === product.id ? <Check size={20} strokeWidth={3} /> : <ShoppingBag size={20} strokeWidth={2.5} />}
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