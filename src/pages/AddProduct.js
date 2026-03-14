import { useState, useEffect } from 'react'; // დავამატეთ useEffect
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';

function AddProduct() {
  const [categories, setCategories] = useState([]); // ბაზიდან წამოღებული კატეგორიები
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    count: '',
    info: '',
    categoryId: '', // თავიდან ცარიელია
    image: ['']
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  // 1. გვერდის ჩატვირთვისას წამოვიღოთ კატეგორიები ბაზიდან
  useEffect(() => {
    API.get('/Category') // დარწმუნდი სვაგერში რომ სახელი სწორია (მაგ. /Category ან /Categories)
      .then(res => {
        setCategories(res.data);
        if (res.data.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: res.data[0].id })); // პირველივე კატეგორია ავირჩიოთ ავტომატურად
        }
      })
      .catch(err => console.error("კატეგორიების წამოღება ვერ მოხერხდა:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // ვიპოვოთ არჩეული კატეგორიის ობიექტი, რომ სახელიც გავაგზავნოთ
      const selectedCat = categories.find(c => c.id === Number(formData.categoryId));

      const productData = {
        Name: formData.name,
        Info: formData.info,
        Price: Number(formData.price),
        Count: Number(formData.count),
        Image: formData.image,
        CategoryId: Number(formData.categoryId),
        CategoryName: selectedCat ? selectedCat.name : ""
      };

      await API.post('/Product', productData);
      setMessage({ type: 'success', text: '✅ პროდუქტი წარმატებით დაემატა!' });
      setTimeout(() => navigate('/products'), 2000);
    } catch (err) {
      setMessage({ type: 'error', text: '❌ დამატება ვერ მოხერხდა' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12 w-full">
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-gray-100">
          <h2 className="text-3xl font-black text-blue-900 text-center mb-10">პროდუქტის დამატება</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* სახელი */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">პროდუქტის სახელი</label>
                <input
                  required
                  type="text"
                  className="w-full px-5 py-3 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              {/* კატეგორიის Select ბაზიდან წამოღებული მონაცემებით */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">კატეგორია</label>
                <select
                  required
                  className="w-full px-5 py-3 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                >
                  {categories.length === 0 ? (
                    <option>იტვირთება...</option>
                  ) : (
                    categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* ფასი */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">ფასი (₾)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  className="w-full px-5 py-3 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>

              {/* რაოდენობა */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">მარაგი</label>
                <input
                  required
                  type="number"
                  className="w-full px-5 py-3 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={formData.count}
                  onChange={(e) => setFormData({...formData, count: e.target.value})}
                />
              </div>
            </div>

            {/* სურათის URL */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">სურათის URL</label>
              <input
                required
                type="text"
                className="w-full px-5 py-3 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={formData.image[0]}
                onChange={(e) => setFormData({...formData, image: [e.target.value]})}
              />
            </div>

            {/* აღწერა */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">აღწერა</label>
              <textarea
                required
                rows="4"
                className="w-full px-5 py-3 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={formData.info}
                onChange={(e) => setFormData({...formData, info: e.target.value})}
              ></textarea>
            </div>

            {message.text && (
              <div className={`p-4 rounded-2xl text-center font-bold ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {message.text}
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-800 to-blue-900 text-white py-5 rounded-2xl font-black text-xl hover:shadow-xl transition disabled:bg-gray-400"
            >
              {loading ? '⏳ მუშავდება...' : '🚀 პროდუქტის გამოქვეყნება'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;