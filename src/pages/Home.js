import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, Check, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

function Home() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    API.get('/Product')
      .then(res => setProducts(res.data.slice(0, 6)))
      .catch(() => {});
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddingId(product.id);
    setTimeout(() => setAddingId(null), 1500);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col relative overflow-hidden font-sans">
      
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden opacity-30">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-rose-100 rounded-full blur-[100px]" />
      </div>

      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-12 w-full relative">
        
        {/* HERO SECTION */}
        <section className="text-center py-20 md:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-100 text-indigo-600 text-xs font-black uppercase tracking-widest mb-8"
          >
            <Sparkles size={14} /> ახალი კოლექცია ხელმისაწვდომია
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-9xl font-black text-slate-950 tracking-tighter leading-[0.85] mb-8"
          >
            ნივთები <br /> <span className="text-indigo-600">ხასიათით.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            აღმოაჩინე და შეიძინე უნიკალური, ხელნაკეთი ნამუშევრები პირდაპირ ქართველი ხელოვანებისგან.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link 
              to="/products" 
              className="inline-flex items-center gap-3 bg-slate-950 text-white px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-100 group"
            >
              დაათვალიერე კატალოგი
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </section>

        {/* PRODUCTS GRID */}
        <div className="mb-20">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">რჩეული ნივთები</h2>
              <p className="text-slate-400 font-bold mt-2">საუკეთესო ნამუშევრები ჩვენი ოსტატებისგან</p>
            </div>
            <Link to="/products" className="text-indigo-600 font-black hover:underline hidden md:block">ყველას ნახვა</Link>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {products.map(product => (
              <motion.div 
                key={product.id} 
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 }
                }}
                whileHover={{ y: -10 }} 
                className="bg-white rounded-[2.5rem] p-5 shadow-xl shadow-slate-100 border border-slate-50 group relative"
              >
                <Link to={`/product/${product.id}`} className="block relative aspect-square rounded-[2rem] overflow-hidden mb-6">
                  <img 
                    src={product.image[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600">
                    ხელნაკეთი
                  </div>
                </Link>

                <div className="px-2">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-2xl font-black text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center justify-between mt-5 pt-5 border-t border-slate-50">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">ფასი</span>
                      <span className="text-3xl font-black text-slate-900">{product.price} <span className="text-indigo-600 text-xl">₾</span></span>
                    </div>

                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAddToCart(product)}
                      className={`p-5 rounded-2xl shadow-xl transition-all flex items-center gap-2 ${
                        addingId === product.id 
                        ? 'bg-emerald-500 text-white shadow-emerald-100' 
                        : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-indigo-100'
                      }`}
                    >
                      <AnimatePresence mode="wait">
                        {addingId === product.id ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="flex items-center gap-2"
                          >
                            <Check size={20} strokeWidth={3} />
                            <span className="text-xs font-black uppercase tracking-tighter">დაემატა</span>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="bag"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <ShoppingBag size={20} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-100 py-20 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <img 
            src="https://res.cloudinary.com/dj4kd5tjf/image/upload/v1772891360/LOGO_knvwgr.png" 
            alt="Gavaoce" 
            className="h-14 w-auto mx-auto mb-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" 
          />
          <p className="text-slate-400 font-bold text-sm tracking-widest uppercase mb-8">
            © 2026 GAVAOCE — შექმნილია საქართველოში
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;