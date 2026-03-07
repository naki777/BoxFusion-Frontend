import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    API.get(`/Product/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-800"></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">პროდუქტი არ მოიძებნა</h2>
      <Link to="/products" className="text-blue-800 font-bold hover:underline">დაბრუნდი მაღაზიაში</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-16 flex-grow w-full">
        {/* უკან დაბრუნების ღილაკი */}
        <Link to="/products" className="inline-flex items-center text-gray-500 hover:text-blue-800 mb-6 transition gap-2 group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> უკან დაბრუნება
        </Link>

        {/* მთავარი კონტეინერი: მობილურზე Column, კომპიუტერზე Row */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 bg-white p-4 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          
          {/* სურათის სექცია */}
          <div className="w-full lg:w-1/2">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 group">
              <img
                src={product.image && product.image[0] ? product.image[0] : "https://via.placeholder.com/600x600?text=Gift"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* პატარა სურათების გალერეა (თუ გაქვს მეტი სურათი) */}
            {product.image?.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {product.image.map((img, idx) => (
                  <img key={idx} src={img} className="w-full aspect-square object-cover rounded-lg border hover:border-blue-500 cursor-pointer" alt="გალერეა" />
                ))}
              </div>
            )}
          </div>

          {/* ინფორმაციის სექცია */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <div className="mb-6">
              <span className="text-sm font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-full">
                {product.categoryName || 'უნიკალური საჩუქარი'}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mt-4 leading-tight">
                {product.name}
              </h1>
            </div>

            <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-8 border-l-4 border-blue-100 pl-4">
              {product.info}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 p-6 bg-gray-50 rounded-2xl">
              <div>
                <p className="text-gray-400 text-sm mb-1 font-medium">ფასი:</p>
                <p className="text-4xl font-black text-blue-900">{product.price} ₾</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-gray-400 text-sm mb-1 font-medium">მარაგი:</p>
                <p className={`font-bold ${product.count > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {product.count > 0 ? `ხელმისაწვდომია: ${product.count}` : 'ამოიწურა'}
                </p>
              </div>
            </div>

            <button
              disabled={product.count <= 0}
              onClick={() => addToCart(product)}
              className={`w-full py-5 rounded-2xl font-bold text-xl shadow-lg transition duration-300 transform active:scale-95 ${
                product.count > 0
                  ? 'bg-gradient-to-r from-blue-800 to-blue-900 text-white hover:shadow-blue-200'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
              {product.count > 0 ? '🛒 კალათაში დამატება' : 'ნივთი ამოიწურა'}
            </button>
          </div>
        </div>
      </div>

      <footer className="bg-blue-900 text-white text-center py-10">
        <img 
          src="https://res.cloudinary.com/dj4kd5tjf/image/upload/v1772891360/LOGO_knvwgr.png" 
          alt="გავაოცე" 
          className="h-12 w-auto mx-auto mb-3" 
        />
        <p className="text-xl font-bold text-yellow-400 mb-1">გავაოცე</p>
        <p className="text-blue-200 text-sm opacity-70">© 2026 გავაოცე — ყველა უფლება დაცულია</p>
      </footer>
    </div>
  );
}

export default ProductDetails;