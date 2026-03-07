import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, totalItems } = useCart();

  useEffect(() => {
    API.get(`/Product/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-800"></div>
    </div>
  );

  if (!product) return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <p className="text-2xl text-gray-400">პროდუქტი ვერ მოიძებნა</p>
      <Link to="/products" className="bg-blue-800 text-white px-6 py-2 rounded-full">
        უკან დაბრუნება
      </Link>
    </div>
  );

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
          <Link to="/cart" className="relative text-gray-600 hover:text-blue-800 font-medium transition text-2xl">
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <Link to="/login" className="bg-gradient-to-r from-blue-800 to-blue-900 text-white px-5 py-2 rounded-full hover:scale-105 transition duration-300 shadow-md">
            შესვლა
          </Link>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-8 py-4">
        <p className="text-gray-400 text-sm">
          <Link to="/" className="hover:text-blue-800">მთავარი</Link>
          {' → '}
          <Link to="/products" className="hover:text-blue-800">პროდუქტები</Link>
          {' → '}
          <span className="text-blue-800">{product.name}</span>
        </p>
      </div>

      {/* Product */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* სურათი */}
      
<div className="relative bg-blue-50" style={{height: '500px'}}>
  {product.image && product.image[0] ? (
    <img
      src={product.image[0]}
      alt={product.name}
      className="w-full h-full object-contain p-4"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center text-8xl">
      🎁
    </div>
  )}
  {product.count <= 0 && (
    <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
      <span className="text-white font-bold text-2xl">ამოიწურა</span>
    </div>
  )}
</div>

            {/* ინფო */}
            <div className="p-10 flex flex-col justify-between">
              <div>
                <span className="text-sm text-blue-700 font-medium bg-blue-50 px-3 py-1 rounded-full">
                  {product.categoryName || 'სხვა'}
                </span>
                <h1 className="text-4xl font-bold text-gray-800 mt-4 mb-4">
                  {product.name}
                </h1>
                <p className="text-gray-500 text-lg leading-relaxed mb-6">
                  {product.info}
                </p>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl font-bold text-blue-800">
                    {product.price} ₾
                  </span>
                  <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                    product.count > 0
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {product.count > 0 ? `მარაგშია (${product.count})` : 'ამოიწურა'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  disabled={product.count <= 0}
                  onClick={() => addToCart(product)}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition ${
                    product.count > 0
                      ? 'bg-blue-800 hover:bg-blue-900 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  🛒 კალათაში დამატება
                </button>
                <Link
                  to="/products"
                  className="w-full py-4 rounded-2xl font-bold text-lg text-center border-2 border-blue-800 text-blue-800 hover:bg-blue-50 transition"
                >
                  ← უკან დაბრუნება
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white text-center py-10 mt-8">
        <img src="/logo.png" alt="გავაოცე" className="h-14 w-auto mx-auto mb-3" />
        <p className="text-xl font-bold text-yellow-400 mb-1">გავაოცე</p>
        <p className="text-blue-200 text-sm">© 2026 გავაოცე — ყველა უფლება დაცულია</p>
      </footer>
    </div>
  );
}

export default ProductDetail;