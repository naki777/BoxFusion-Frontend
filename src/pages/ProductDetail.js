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
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#fafafa]">
      <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
      <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">იტვირთება დეტალები...</span>
    </div>
  );

  if (!product) return <div className="h-screen flex items-center justify-center font-bold">პროდუქტი ვერ მოიძებნა</div>;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold mb-8 transition-all">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> უკან დაბრუნება
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="aspect-square rounded-[3.5rem] overflow-hidden bg-white shadow-2xl shadow-indigo-100/50 border border-white p-4">
              <img src={product.image[0]} alt={product.name} className="w-full h-full object-cover rounded-[2.5rem]" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center">
            <div className="mb-6">
              <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                {product.categoryName}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-8 bg-white w-fit px-6 py-3 rounded-2xl shadow-sm border border-slate-50">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={18} className="fill-current"/>)}
              </div>
              <span className="text-slate-400 font-bold text-sm">5.0 (24 მიმოხილვა)</span>
            </div>

            <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-xl">
              {product.info}
            </p>

            <div className="flex items-end gap-6 mb-12">
              <div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1 ml-1">ღირებულება</span>
                <div className="text-6xl font-black text-slate-900">
                   {Number(product.price).toFixed(2)} <span className="text-indigo-600">₾</span>
                </div>
              </div>
              {product.count !== undefined && (
                <div className={`mb-2 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-tighter ${product.count > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {product.count > 0 ? `მარაგშია: ${product.count}` : 'ამოწურულია'}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleAddToCart}
                disabled={product.count === 0}
                className={`flex-1 py-6 rounded-[2rem] font-black text-xl transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 disabled:opacity-50 ${
                  isAdded ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-slate-950 text-white hover:bg-indigo-600 shadow-indigo-200'
                }`}
              >
                {isAdded ? <><Check size={24} /> კალათაშია</> : <><ShoppingBag size={24} /> კალათაში დამატება</>}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-12 border-t border-slate-100 pt-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Truck size={20} /></div>
                <div className="flex flex-col">
                  <span className="font-black text-slate-900 text-sm">სწრაფი მიწოდება</span>
                  <span className="text-slate-400 text-xs font-bold">მთელ საქართველოში</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><ShieldCheck size={20} /></div>
                <div className="flex flex-col">
                  <span className="font-black text-slate-900 text-sm">უსაფრთხოება</span>
                  <span className="text-slate-400 text-xs font-bold">100% ხარისხი</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default ProductDetail;