import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Image as ImageIcon, Tag, Info, Plus, 
  Loader2, LayoutGrid, UploadCloud, X, ChevronDown 
} from 'lucide-react';

// Cloudinary კონფიგურაცია
const CLOUDINARY_UPLOAD_PRESET = 'gavaoce_preset'; 
const CLOUDINARY_CLOUD_NAME = 'dj4kd5tjf'; 
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  
  // ფაილის და ატვირთვის სტეიტები
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // პროდუქტის სტეიტი (დავამატეთ categoryId)
  const [product, setProduct] = useState({
    name: '',
    price: '',
    info: '',
    categoryId: '', // SQL-ისთვის საჭირო ID
    categoryName: ''
  });

  // კატეგორიების ჩატვირთვა სელექტისთვის
  useEffect(() => {
    API.get('/Category')
      .then(res => setCategories(res.data))
      .catch(err => console.error("კატეგორიების ჩატვირთვის შეცდომა:", err));
  }, []);

  // სურათის არჩევა და პრევიუ
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Cloudinary-ზე ატვირთვის ფუნქცია
  const uploadImageToCloudinary = async () => {
    if (!imageFile) return null;
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    setIsUploading(true);
    setUploadProgress(20);

    try {
      const res = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData });
      const data = await res.json();
      setUploadProgress(100);
      return data.secure_url;
    } catch (err) {
      console.error("Cloudinary Error:", err);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile || !product.categoryId) {
      alert("⚠️ გთხოვთ აირჩიოთ სურათი და კატეგორია.");
      return;
    }

    setLoading(true);

    try {
      // 1. სურათის ატვირთვა
      const imageUrl = await uploadImageToCloudinary();
      if (!imageUrl) {
        alert("სურათის ატვირთვა ვერ მოხერხდა.");
        setLoading(false);
        return;
      }

      // 2. პეილოადის მომზადება (ზუსტად ბექენდის მოთხოვნით)
      const selectedCat = categories.find(c => c.id.toString() === product.categoryId.toString());
      
      const payload = {
        name: String(product.name),
        price: Number(product.price),
        info: String(product.info),
        categoryId: Number(product.categoryId), // აუცილებლად რიცხვი
        categoryName: selectedCat ? selectedCat.name : "",
        image: [imageUrl] // მასივი
      };

      // 3. გაგზავნა ბექენდზე
      const response = await API.post('/Product', payload);
      
      if (response.status === 200 || response.status === 201) {
        alert('პროდუქტი წარმატებით დაემატა! 🎉');
        navigate('/products');
      }
    } catch (err) {
      console.error("Backend Error:", err.response?.data);
      alert(`ვერ მოხერხდა დამატება: ${JSON.stringify(err.response?.data || "Server Error")}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl shadow-indigo-100/50 border border-slate-50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[100px] -z-10 opacity-60" />

          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-100">
            <div className="p-4 bg-indigo-600 text-white rounded-3xl shadow-lg shadow-indigo-200">
              <Plus size={32} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">ახალი ნივთი</h2>
              <p className="text-slate-400 font-bold">გაუზიარე შენი პროდუქტი სხვებს</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-6">
                {/* პროდუქტის სახელი */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                    <Package size={14} /> დასახელება
                  </label>
                  <input required type="text" placeholder="მაგ: ხელნაკეთი სანათი"
                    className="w-full p-5 bg-slate-50 rounded-[1.5rem] outline-none border border-transparent focus:border-indigo-500 transition-all font-bold text-slate-700" 
                    onChange={e => setProduct({...product, name: e.target.value})} />
                </div>

                {/* ფასი */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                    <Tag size={14} /> ფასი (₾)
                  </label>
                  <input required type="number" step="0.01" placeholder="0.00"
                    className="w-full p-5 bg-slate-50 rounded-[1.5rem] outline-none border border-transparent focus:border-indigo-500 transition-all font-bold text-slate-700" 
                    onChange={e => setProduct({...product, price: e.target.value})} />
                </div>

                {/* კატეგორიის სელექტი */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                    <LayoutGrid size={14} /> კატეგორია
                  </label>
                  <div className="relative">
                    <select required 
                      className="w-full p-5 bg-slate-50 rounded-[1.5rem] outline-none border border-transparent focus:border-indigo-500 transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                      onChange={e => setProduct({...product, categoryId: e.target.value})} >
                      <option value="">აირჩიე კატეგორია</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                  </div>
                </div>

                {/* აღწერა */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                    <Info size={14} /> აღწერა
                  </label>
                  <textarea required placeholder="აღწერეთ დეტალურად..."
                    className="w-full p-5 bg-slate-50 rounded-[1.5rem] outline-none border border-transparent focus:border-indigo-500 transition-all font-bold text-slate-700 h-32 resize-none" 
                    onChange={e => setProduct({...product, info: e.target.value})} ></textarea>
                </div>
              </div>

              {/* სურათის ატვირთვის ზონა */}
              <div className="space-y-2 flex flex-col h-full">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                  <ImageIcon size={14} /> პროდუქტის ფოტო
                </label>
                
                <div className="flex-grow border-4 border-dashed border-slate-100 rounded-[2.5rem] relative hover:border-indigo-200 transition-colors bg-slate-50 group flex flex-col overflow-hidden">
                  {imagePreview ? (
                    <div className="relative p-2 h-full w-full">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-[2rem]" />
                      <button 
                        type="button"
                        onClick={() => { setImagePreview(null); setImageFile(null); setUploadProgress(0); }}
                        className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full text-rose-500 hover:bg-white shadow-lg transition-all"
                      >
                        <X size={20} />
                      </button>
                      
                      <AnimatePresence>
                        {isUploading && (
                          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
                            <Loader2 className="animate-spin mb-3" size={40} />
                            <span className="font-black text-sm tracking-widest uppercase">იტვირთება... {uploadProgress}%</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 cursor-pointer group-hover:bg-slate-100/50 transition-all">
                      <div className="p-6 bg-white rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                        <UploadCloud className="text-indigo-500" size={40} strokeWidth={1.5} />
                      </div>
                      <span className="font-black text-slate-800 text-lg">ფაილის არჩევა</span>
                      <span className="text-xs text-slate-400 font-bold mt-1">PNG, JPG ან WEBP (მაქს. 5MB)</span>
                    </div>
                  )}
                  <input required type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
            </div>

            {/* გაგზავნის ღილაკი */}
            <button 
              type="submit"
              disabled={loading || isUploading}
              className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black text-xl hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 disabled:opacity-70 disabled:grayscale"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  მიმდინარეობს შენახვა...
                </>
              ) : (
                "ნივთის დამატება"
              )}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}

export default AddProduct;