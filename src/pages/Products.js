import { useState, useEffect } from 'react';
import API from '../services/api';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    API.get('/Product')
      .then(res => {
        console.log('API Response:', res.data); // DEBUG: ნახე console-ში რა ბრუნდება
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          setError('API-მ არასწორი ფორმატი დააბრუნა (არ არის სია).');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('API Error:', err);
        setError('შეცდომა API-დან მონაცემების მიღებისას. შეამოწმე კავშირი ან back-end.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 md:mb-10 text-center">
          ჩვენი პროდუქტები
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-48 md:h-64">
            <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-t-4 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="text-center p-6 bg-red-100 rounded-lg">
            <p className="text-red-600 text-lg md:text-xl mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 md:px-6 md:py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              სცადე თავიდან
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center p-6 bg-yellow-100 rounded-lg">
            <p className="text-yellow-600 text-lg md:text-xl mb-4">პროდუქტები ჯერ არ არის დამატებული</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 md:px-6 md:py-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
            >
              განახლება
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {products.map((product) => (
              <div
                key={product.id || Math.random()} // უნიკალური key
                className="bg-white rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name || 'პროდუქტი'}
                    className="w-full h-40 md:h-48 object-cover"
                    loading="lazy" // Lazy loading სურათებისთვის
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=სურათი+არ+მოიძებნა'; }} // Error placeholder
                  />
                ) : (
                  <div className="w-full h-40 md:h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm md:text-base">
                    სურათი არ არის ხელმისაწვდომი
                  </div>
                )}
                <div className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name || 'უსახელო'}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4 line-clamp-3">
                    {product.info || 'აღწერა არ არსებობს'}
                  </p>
                  <div className="flex justify-between items-center mb-3 md:mb-4">
                    <span className="text-lg md:text-2xl font-bold text-indigo-600">
                      {product.price ? `${product.price} ₾` : 'ფასი უცნობია'}
                    </span>
                    <span className="text-xs md:text-sm text-gray-500">
                      {product.count > 0 ? `მარაგი: ${product.count}` : 'ამოიწურა'}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 mb-3 md:mb-4">
                    კატეგორია: <span className="font-medium">{product.categoryName || 'უცნობი'}</span>
                  </p>
                  <button
                    className={`w-full py-2 md:py-3 text-white rounded-md transition ${
                      product.count > 0 ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    disabled={product.count <= 0}
                    onClick={() => console.log('დამატებულია კალათაში:', product.name)} // შეცვალე შენი ლოგიკით
                  >
                    {product.count > 0 ? 'კალათაში დამატება' : 'ამოიწურა'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;