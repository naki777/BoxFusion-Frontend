import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';

function Cart() {
  const { cart, removeFromCart, clearCart, totalPrice } = useCart();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* საერთო ნავბარი - უკვე მოიცავს მობილურ მენიუს და ლოგოს */}
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12 flex-grow w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-8 flex items-center gap-2">
          <span>🛒</span> კალათა
        </h2>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <p className="text-6xl mb-4">🧺</p>
            <p className="text-gray-400 text-xl md:text-2xl mb-8 font-medium">კალათა ცარიელია</p>
            <Link 
              to="/products" 
              className="inline-block bg-blue-800 text-white px-10 py-4 rounded-full font-bold hover:bg-blue-900 transition shadow-lg hover:shadow-blue-200"
            >
              პროდუქტების ნახვა
            </Link>
          </div>
        ) : (
          <>
            {/* პროდუქტების სია */}
            <div className="flex flex-col gap-4 mb-8">
              {cart.map(item => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5 flex items-center gap-4 md:gap-6 group transition-hover"
                >
                  {/* პროდუქტის სურათი */}
                  <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 overflow-hidden rounded-xl">
                    {item.image && item.image[0] ? (
                      <img 
                        src={item.image[0]} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-50 flex items-center justify-center text-3xl">🎁</div>
                    )}
                  </div>

                  {/* ინფორმაცია */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-base md:text-lg truncate">{item.name}</h3>
                    <p className="text-gray-400 text-xs md:text-sm mb-1">{item.categoryName || 'საჩუქარი'}</p>
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                      <p className="text-blue-800 font-bold text-lg">{item.price * item.quantity} ₾</p>
                      <p className="text-gray-400 text-xs md:text-sm">
                        ({item.price} ₾ × {item.quantity})
                      </p>
                    </div>
                  </div>

                  {/* წაშლის ღილაკი */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition duration-200"
                    title="წაშლა"
                  >
                    <span className="text-2xl">✕</span>
                  </button>
                </div>
              ))}
            </div>

            {/* ჯამი და ღილაკები */}
            <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 md:p-8">
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
                <span className="text-lg md:text-xl font-bold text-gray-500">ჯამური ღირებულება:</span>
                <span className="text-3xl md:text-4xl font-black text-blue-900">{totalPrice} ₾</span>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={clearCart}
                  className="order-2 md:order-1 flex-1 py-4 border-2 border-red-100 text-red-500 rounded-2xl font-bold hover:bg-red-50 hover:border-red-200 transition duration-200"
                >
                  კალათის გასუფთავება
                </button>
                <button 
                  className="order-1 md:order-2 flex-1 py-4 bg-gradient-to-r from-blue-800 to-blue-900 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-[1.01] transition duration-200 shadow-blue-200"
                >
                  შეკვეთის გაფორმება
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white text-center py-10 mt-auto">
        <img 
          src="https://res.cloudinary.com/dj4kd5tjf/image/upload/v1772891360/LOGO_knvwgr.png" 
          alt="გავაოცე" 
          className="h-12 w-auto mx-auto mb-3" 
        />
        <p className="text-xl font-bold text-yellow-400 mb-1 tracking-wider">გავაოცე</p>
        <p className="text-blue-200 text-xs opacity-70">© 2026 გავაოცე — ყველა უფლება დაცულია</p>
      </footer>
    </div>
  );
}

export default Cart;