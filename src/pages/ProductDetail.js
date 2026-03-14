import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronLeft, ShieldCheck, Truck, Star, Check, Loader2 } from 'lucide-react';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [isAdded, setIsAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get(`/Product/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#fafafa]">
      <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
      <span className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">იტვირთება დეტალები...</span>
    </div>
  );

  if (!product) return (
    <div className="h-screen flex flex-col items-center justify-center gap-6">
      <h2 className="text-2xl font-black text-slate-400 uppercase italic">პროდუქტი ვერ მოიძებნა</h2>
      <button onClick={() => navigate('/products')} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl">კატალოგში დაბრუნება</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] pb-10">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black text-xs uppercase tracking-widest mb-10 transition-all">
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> უკან
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="aspect-square rounded-[2.5rem] md:rounded-[4rem] overflow-hidden bg-white shadow-3xl shadow-indigo-100/50 border-8 border-white">
              <img src={product.image?.[0] || 'https://via.placeholder.com/600'} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                {product.categoryName || product.category}
              </span>
              <div className="flex items-center gap-1 text-amber-400">
                <Star size={14} fill="currentColor" />
                <span className="text-slate-900 font-black text-xs">5.0</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6 leading-[0.9] italic uppercase">
              {product.name}
            </h1>

            <p className="text-slate-500 font-bold leading-relaxed mb-10 text-sm md:text-base max-w-xl">
              {product.info || "აღწერა მალე დაემატება..."}
            </p>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-100 border border-slate-50 mb-10">
                <div className="flex justify-between items-end mb-8">
                   <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">ღირებულება:</span>
                      <div className="text-5xl md:text-6xl font-black text-slate-950 flex items-start gap-1 tracking-tighter">
                        {product.price}<span className="text-2xl text-indigo-600 mt-2 font-medium">₾</span>
                      </div>
                   </div>
                   {product.count !== undefined && (
                     <div className={`px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-tighter ${product.count > 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                        {product.count > 0 ? `მარაგშია: ${product.count}` : 'ამოწურულია'}
                     </div>
                   )}
                </div>

                <button 
                  onClick={handleAddToCart}
                  disabled={product.count === 0}
                  className={`w-full py-6 rounded-[1.8rem] font-black text-lg md:text-xl transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-95 disabled:opacity-30 ${
                    isAdded ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-slate-950 text-white hover:bg-indigo-600 shadow-indigo-100'
                  }`}
                >
                  {isAdded ? <><Check size={24} strokeWidth={3} /> კალათაშია</> : <><ShoppingBag size={24} /> კალათაში დამატება</>}
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-slate-50">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><Truck size={20} /></div>
                  <span className="font-black text-slate-900 text-[11px] uppercase tracking-tighter leading-none">სწრაფი<br/>მიწოდება</span>
               </div>
               <div className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-slate-50">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><ShieldCheck size={20} /></div>
                  <span className="font-black text-slate-900 text-[11px] uppercase tracking-tighter leading-none">გარანტირებული<br/>ხარისხი</span>
               </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default ProductDetail;