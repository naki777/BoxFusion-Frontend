import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import API from '../services/api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await API.post('/Auth/login', { email, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      login({ email, token });
      navigate('/products');
    } catch (err) {
      setError('არასწორი მეილი ან პაროლი');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 py-6"> {/* py-12-დან py-6-ზე */}
        <div className="max-w-md w-full bg-white rounded-[2rem] shadow-xl p-7 border border-gray-100">
          <div className="text-center mb-6"> {/* mb-10-დან mb-6-ზე */}
            <img 
              src="https://res.cloudinary.com/dj4kd5tjf/image/upload/v1772891360/LOGO_knvwgr.png" 
              alt="გავაოცე" 
              className="h-14 mx-auto mb-3" // h-20-დან h-14-ზე
            />
            <h2 className="text-2xl font-black text-blue-900">მოგესალმებით</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-4"> {/* space-y-6-დან space-y-4-ზე */}
            <input
              required
              type="email"
              placeholder="ელ-ფოსტა"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all"
            />
            <input
              required
              type="password"
              placeholder="პაროლი"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all"
            />

            {error && <p className="text-rose-500 text-xs font-bold text-center">{error}</p>}

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-slate-950 text-white py-3.5 rounded-xl font-black hover:bg-blue-600 transition duration-300"
            >
              {loading ? 'შესვლა...' : 'შესვლა'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-50 flex flex-col items-center gap-3">
            <p className="text-gray-400 text-xs font-bold">ჯერ არ გაქვს ანგარიში?</p>
            <Link 
              to="/register" 
              className="w-full py-2.5 border-2 border-blue-600 text-blue-600 font-bold rounded-full text-center hover:bg-blue-50 text-sm"
            >
              ახალი ანგარიშის შექმნა
            </Link>
          </div>
        </div>
      </div>
      <footer className="py-4 text-center text-gray-400 text-[10px] font-bold uppercase">
        © 2026 გავაოცე — ყველა უფლება დაცულია
      </footer>
    </div>
  );
}

export default Login;