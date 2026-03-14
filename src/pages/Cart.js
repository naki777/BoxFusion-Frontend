import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import { Trash2, ShoppingBasket } from 'lucide-react';
import { motion } from 'framer-motion';

function Cart() {
  const { cartItems, removeFromCart } = useCart();
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-12">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-100">
            <ShoppingBasket className="text-white" size={32} />
          </div>
          <h2 className="text-4xl font-black text-slate-900">შენი კალათა</h2>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white py-20 rounded-[3rem] text-center shadow-sm border border-slate-100">
            <p className="text-xl text-slate-400 font-bold italic">კალათა ცარიელია...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {cartItems.map(item => (
              <motion.div layout key={item.id} className="bg-white p-4 pr-8 rounded-[2rem] flex items-center gap-6 shadow-sm border border-slate-50">
                <img src={item.image[0]} className="w-24 h-24 rounded-2xl object-cover shadow-md" />
                <div className="flex-1">
                  <h4 className="font-black text-slate-900 text-lg">{item.name}</h4>
                  <p className="text-indigo-600 font-bold">{item.price} ₾ x {item.quantity}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="p-3 text-slate-300 hover:text-rose-500 transition-colors">
                  <Trash2 size={20} />
                </button>
              </motion.div>
            ))}

            <div className="bg-slate-900 p-10 rounded-[3rem] mt-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-slate-200">
              <div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-1">ჯამური გადასახადი</p>
                <h3 className="text-5xl font-black tracking-tighter">{totalPrice.toFixed(2)} ₾</h3>
              </div>
              <button className="bg-indigo-600 hover:bg-white hover:text-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95">
                გადახდა
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;