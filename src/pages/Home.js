import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';

function Home() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    // მონაცემების წამოღება Railway-დან
    API.get('/Product').then(res => setProducts(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Hero სექცია */}
      <div className="bg-blue-900 py-24 text-center px-4">
        <h2 className="text-5xl font-bold text-white mb-4">აღმოაჩინე უნიკალური ნივთები</h2>
        <p className="text-blue-200 text-xl mb-8">ქართული ხელნაკეთი და ორიგინალური პროდუქტები</p>
        <Link to="/products" className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-full text-lg font-bold hover:bg-yellow-300 transition">
          დაათვალიერე
        </Link>
      </div>

      {/* პროდუქტების სექცია */}
      <div className="max-w-6xl mx-auto px-8 py-16 flex-grow">
        <h3 className="text-2xl font-bold text-blue-900 mb-8">პოპულარული პროდუქტები</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <Link
              to={`/product/${p.id}`}
              key={p.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col h-full"
            >
              {/* სურათი */}
              <div className="relative overflow-hidden h-52 flex-shrink-0">
                <img
                  src={p.image && p.image[0] ? p.image[0] : "https://via.placeholder.com/400x300?text=Gift"}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {p.count <= 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">ამოიწურა</span>
                  </div>
                )}
              </div>

              {/* ინფორმაცია */}
              <div className="p-4 flex flex-col flex-grow">
                <span className="text-xs text-blue-700 font-medium bg-blue-50 px-2 py-1 rounded-full w-fit">
                  {p.categoryName || 'ხელნაკეთი'}
                </span>
                <h4 className="font-bold text-gray-800 mt-2 mb-1 line-clamp-1">{p.name}</h4>
                <p className="text-gray-500 text-sm mb-3 line-clamp-2 flex-grow">{p.info}</p>
                
                <div className="flex justify-between items-center mb-3 mt-auto">
                  <span className="text-xl font-bold text-blue-800">{p.price} ₾</span>
                  <span className="text-xs text-gray-400">მარაგი: {p.count}</span>
                </div>

                <button
                  disabled={p.count <= 0}
                  onClick={e => { e.preventDefault(); addToCart(p); }}
                  className={`w-full py-2 rounded-full font-semibold transition ${
                    p.count > 0
                      ? 'bg-blue-800 hover:bg-blue-900 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {p.count > 0 ? '🛒 კალათაში დამატება' : 'ამოიწურა'}
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white text-center py-10">
        <img 
          src="https://res.cloudinary.com/dj4kd5tjf/image/upload/v1772891360/LOGO_knvwgr.png" 
          alt="გავაოცე" 
          className="h-14 w-auto mx-auto mb-3" 
        />
        <p className="text-xl font-bold text-yellow-400 mb-1">გავაოცე</p>
        <p className="text-blue-200 text-sm">© 2026 გავაოცე — ყველა უფლება დაცულია</p>
      </footer>
    </div>
  );
}

export default Home;