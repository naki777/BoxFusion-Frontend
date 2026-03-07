import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cart, removeFromCart, clearCart, totalPrice } = useCart();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-8 py-3 flex justify-between items-center sticky top-0 z-10">
        <Link to="/" className="flex items-center gap-4 group">
          <img src="/logo.png" alt="გავაოცე" className="h-14 w-auto transition-transform duration-300 group-hover:scale-105" />
          <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-900 to-yellow-500 bg-clip-text text-transparent tracking-wide">
            გავაოცე
          </span>
        </Link>
        <div className="flex gap-8 items-center">
          <Link to="/" className="text-gray-600 hover:text-blue-800 font-medium transition">მთავარი</Link>
          <Link to="/products" className="text-gray-600 hover:text-blue-800 font-medium transition">პროდუქტები</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <h2 className="text-3xl font-bold text-blue-900 mb-8">🛒 კალათა</h2>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🛒</p>
            <p className="text-gray-400 text-2xl mb-6">კალათა ცარიელია</p>
            <Link to="/products" className="bg-blue-800 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-900 transition">
              პროდუქტების ნახვა
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 mb-8">
              {cart.map(item => (
                <div key={item.id} className="bg-white rounded-2xl shadow p-5 flex items-center gap-5">
                  {item.image && item.image[0] ? (
                    <img src={item.image[0]} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                  ) : (
                    <div className="w-20 h-20 bg-blue-50 rounded-xl flex items-center justify-center text-3xl">🎁</div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                    <p className="text-gray-500 text-sm">{item.categoryName}</p>
                    <p className="text-blue-800 font-bold">{item.price} ₾ × {item.quantity} = {item.price * item.quantity} ₾</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-600 transition text-2xl font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* სულ */}
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-gray-800">სულ:</span>
                <span className="text-3xl font-bold text-blue-800">{totalPrice} ₾</span>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={clearCart}
                  className="flex-1 py-3 border-2 border-red-400 text-red-400 rounded-full font-bold hover:bg-red-50 transition"
                >
                  კალათის გასუფთავება
                </button>
                <button className="flex-1 py-3 bg-blue-800 text-white rounded-full font-bold hover:bg-blue-900 transition">
                  შეკვეთის გაფორმება
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <footer className="bg-blue-900 text-white text-center py-10 mt-8">
        <img src="/logo.png" alt="გავაოცე" className="h-14 w-auto mx-auto mb-3" />
        <p className="text-xl font-bold text-yellow-400 mb-1">გავაოცე</p>
        <p className="text-blue-200 text-sm">© 2026 გავაოცე — ყველა უფლება დაცულია</p>
      </footer>
    </div>
  );
}

export default Cart;