import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import { Trash2, ShoppingBasket, ArrowLeft, CreditCard, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart(); // თუ updateQuantity არ გაქვს, ქვემოთა ფუნქციებს წაშლი
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-indigo-600 font-black tracking-[0.2em] uppercase text-[10px] mb-2 block ml-1">თქვენი არჩევანი</span>
            <div className="flex items-center gap-3">
               <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter italic uppercase">კალათა</h2>
               <span className="bg-slate-900 text-white text-xs font-black px-3 py-1 rounded-full">{cartItems.length}</span>
            </div>
          </div>
          <Link to="/products" className="group text-slate-400 hover:text-indigo-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> მაღაზიაში დაბრუნება
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white py-24 rounded-[3rem] text-center shadow-2xl shadow-slate-100 border border-white"
          >
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
               <ShoppingBasket className="text-slate-200" size={48} strokeWidth={1} />
            </div>
            <p className="text-xl text-slate-400 font-black italic mb-8 uppercase tracking-tighter">კალათა ცარიელია</p>
            <Link to="/products" className="inline-flex bg-slate-950 text-white px-10 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100">
              დაიწყე შოპინგი
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item, idx) => (
                  <motion.div 
                    layout
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white p-4 md:p-6 rounded-[2.5rem] flex flex-col sm:flex-row items-center gap-6 shadow-sm border border-white group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
                  >
                    {/* Product Image */}
                    <div className="relative w-full sm:w-32 aspect-square rounded-[2rem] overflow-hidden bg-slate-50 shadow-inner">
                      <img 
                        src={item.image?.[0]} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left">
                      <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1 block">{item.categoryName}</span>
                      <h4 className="font-black text-slate-900 text-lg md:text-xl leading-tight mb-2 italic uppercase">{item.name}</h4>
                      <div className="flex items-center justify-center sm:justify-start gap-4">
                        <span className="text-2xl font-black text-slate-950">{item.price}₾</span>
                        {/* Quantity Controls (Optional) */}
                        <div className="flex items-center bg-slate-50 rounded-xl px-2 py-1 border border-slate-100">
                           <button onClick={() => updateQuantity?.(item.id, (item.quantity || 1) - 1)} className="p-1 hover:text-indigo-600 transition-colors"><Minus size={14}/></button>
                           <span className="px-3 font-black text-xs">{item.quantity || 1}</span>
                           <button onClick={() => updateQuantity?.(item.id, (item.quantity || 1) + 1)} className="p-1 hover:text-indigo-600 transition-colors"><Plus size={14}/></button>
                        </div>
                      </div>
                    </div>

                    {/* Subtotal & Delete */}
                    <div className="flex sm:flex-col items-center justify-between w-full sm:w-auto gap-4 pt-4 sm:pt-0 border-t sm:border-0 border-slate-50">
                      <div className="text-right hidden sm:block">
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">ქვეჯამი</p>
                        <p className="font-black text-slate-900 text-lg italic">{(item.price * (item.quantity || 1)).toFixed(2)}₾</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="w-12 h-12 flex items-center justify-center bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl transition-all duration-300"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Checkout Summary Card */}
            <aside className="lg:sticky lg:top-24">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-slate-950 p-8 md:p-10 rounded-[3rem] text-white shadow-3xl shadow-indigo-200/50 relative overflow-hidden"
              >
                {/* Decorative Background Icon */}
                <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none rotate-12">
                  <CreditCard size={200} />
                </div>

                <div className="relative z-10 space-y-6">
                  <div className="border-b border-white/10 pb-6">
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4">შეჯამება</h3>
                    <div className="space-y-3">
                       <div className="flex justify-between text-slate-400 font-bold text-sm">
                          <span>პროდუქტები</span>
                          <span>{totalPrice.toFixed(2)} ₾</span>
                       </div>
                       <div className="flex justify-between text-slate-400 font-bold text-sm">
                          <span>მიწოდება</span>
                          <span className="text-emerald-400">უფასო</span>
                       </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-1">სულ გადასახდელი</p>
                    <div className="text-5xl font-black tracking-tighter italic">
                      {totalPrice.toFixed(2)}<span className="text-indigo-400 ml-1">₾</span>
                    </div>
                  </div>

                  <button className="w-full bg-indigo-600 hover:bg-white hover:text-indigo-600 text-white py-6 rounded-[2rem] font-black text-xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 group">
                    გადახდა <CreditCard size={24} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <p className="text-[9px] text-center text-slate-500 font-bold uppercase tracking-widest">
                    უსაფრთხო გადახდა გარანტირებულია
                  </p>
                </div>
              </motion.div>
            </aside>
            
          </div>
        )}
      </main>
    </div>
  );
}

export default Cart;