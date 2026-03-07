import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar'; // ვიყენებთ საერთო ნავბარს

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    API.get('/Product')
      .then(res => {
        setProducts(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(() => {
        setError('შეცდომა მონაცემების მიღებისას');
        setLoading(false);
      });
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* აქ ვიძახებთ იმ ნავბარს, რომელიც წინა ეტაპზე ავაწყვეთ */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-8 py-12 flex-grow w-full">
        {/* საძიებო სექცია */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h2 className="text-3xl font-bold text-blue-900">ყველა პროდუქტი</h2>
          <input
            type="text"
            placeholder="🔍 მოძებნე პროდუქტი..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded-full px-6 py-2 w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Loading სტატუსი */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-800"></div>
          </div>
        )}

        {/* Error სტატუსი */}
        {error && (
          <div className="text-center p-6 bg-red-100 rounded-xl">
            <p className="text-red-600 text-xl mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600">
              სცადე თავიდან
            </button>
          </div>
        )}

        {/* პროდუქტების გრიდი */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col h-full"
              >
                {/* პროდუქტის ბმული მხოლოდ სურათზე და ტექსტზე */}
                <Link to={`/product/${product.id}`} className="block flex-shrink-0">
                  <div className="relative overflow-hidden h-52">
                    <img
                      src={product.image && product.image[0] ? product.image[0] : "https://via.placeholder.com/400x300?text=Gift"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.count <= 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">ამოიწურა</span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-5 flex flex-col flex-grow">
                  <span className="text-xs text-blue-700 font-medium bg-blue-50 px-2 py-1 rounded-full w-fit">
                    {product.categoryName || 'სხვა'}
                  </span>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-lg font-bold text-gray-800 mt-2 mb-1 line-clamp-1 hover:text-blue-800">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2 flex-grow">{product.info}</p>
                  
                  <div className="flex justify-between items-center mb-4 mt-auto">
                    <span className="text-2xl font-bold text-blue-800">{product.price} ₾</span>
                    <span className="text-xs text-gray-400">მარაგი: {product.count}</span>
                  </div>

                  <button
                    disabled={product.count <= 0}
                    onClick={() => addToCart(product)}
                    className={`w-full py-2.5 rounded-full font-semibold transition mt-auto ${
                      product.count > 0 ? 'bg-blue-800 hover:bg-blue-900 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {product.count > 0 ? '🛒 კალათაში დამატება' : 'ამოიწურა'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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

export default Products;