import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { UserPlus, Loader2, ArrowLeft } from 'lucide-react';

function Register() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/Auth/Register', { ...formData, role: "Customer" });
      navigate('/login');
    } catch (err) {
      setError('რეგისტრაცია ვერ მოხერხდა.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 py-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100"
        >
          <div className="text-center mb-6">
            <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
              <UserPlus className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-900">რეგისტრაცია</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="ელ-ფოსტა"
              className="w-full bg-gray-50 p-3.5 px-5 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="პაროლი"
              className="w-full bg-gray-50 p-3.5 px-5 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            {error && <p className="text-rose-500 text-xs font-bold text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-950 text-white p-3.5 rounded-xl font-black hover:bg-blue-600 transition-all disabled:bg-gray-300"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'დარეგისტრირება'}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-gray-50 pt-4">
            <Link to="/login" className="text-gray-400 font-bold hover:text-blue-600 flex items-center justify-center gap-2 text-sm transition-colors">
              <ArrowLeft size={16} /> უკან დაბრუნება
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default Register;