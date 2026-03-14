import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import { Trash2, ShoppingBasket, ArrowLeft, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

function Cart() {
  const { cartItems, removeFromCart } = useCart();
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-12">
        
        {/* სათაური */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-100">
              <ShoppingBasket className="text-white" size={32} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">შენი კალათა</h2>
          </div>
          <Link to="/products" className="text-slate-400 hover:text-indigo-600 font-bold flex items-center gap-2 transition-colors">
            <ArrowLeft size={18} /> მაღაზიაში დაბრუნება
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white py-20 rounded-[3rem] text-center shadow-sm border border-slate-100"
          >
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
               <ShoppingBasket className="text-slate-200" size={40} />
            </div>
            <p className="text-xl text-slate-400 font-bold italic mb-8">კალათა ცარიელია...</p>
            <Link to="/products" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all">
              დაათვალიერე ნივთები
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {cartItems.map(item => (
                <motion.div 
                  layout
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white p-4 pr-8 rounded-[2rem] flex items-center gap-6 shadow-sm border border-slate-50 group hover:shadow-md transition-shadow"
                >
                  {/* სურათი (alt დამატებულია Vercel-ისთვის) */}
                  <img 
                    src={item.image[0]} 
                    alt={item.name} 
                    className="w-24 h-24 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform" 
                  />
                  
                  <div className="flex-1">
                    <h4 className="font-black text-slate-900 text-lg">{item.name}</h4>
                    <p className="text-indigo-600 font-bold flex items-center gap-2">
                      {item.price} ₾ <span className="text-slate-300 text-sm">x</span> {item.quantity}
                    </p>
                  </div>

                  <div className="text-right mr-4 hidden sm:block">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">ჯამი</p>
                    <p className="font-black text-slate-900">{(item.price * item.quantity).toFixed(2)} ₾</p>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    className="p-3 bg-slate-50 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* შეჯამება */}
            <motion.div 
              layout
              className="bg-slate-900 p-10 rounded-[3rem] mt-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-indigo-100/50 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
                <CreditCard size={200} />
              </div>

              <div className="relative z-10">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-1">სულ გადასახდელი</p>
                <h3 className="text-5xl font-black tracking-tighter">
                  {totalPrice.toFixed(2)} <span className="text-indigo-400">₾</span>
                </h3>
              </div>

              <button className="relative z-10 bg-indigo-600 hover:bg-white hover:text-indigo-600 text-white px-12 py-5 rounded-[1.5rem] font-black text-xl transition-all shadow-xl active:scale-95 flex items-center gap-3">
                <CreditCard size={24} /> გადახდა
              </button>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Cart;