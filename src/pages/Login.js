import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import API from '../services/api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext'; // დავამატეთ კონტექსტი

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // კონტექსტის ფუნქცია
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ვუგზავნით email-ს და password-ს
      const response = await API.post('/Auth/login', { email, password });
      
      const token = response.data.token;
      localStorage.setItem('token', token);
      
      // აუცილებელია კონტექსტშიც ჩავწეროთ მონაცემები
      login({ 
        email: email, 
        token: token 
      });
      
      // გადავდივართ პროდუქტებზე
      navigate('/products');
      
    } catch (err) {
      console.error("Login Error:", err.response?.data);
      setError('არასწორი მეილი ან პაროლი');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden p-8 border border-gray-100">
          <div className="text-center mb-10">
            <img 
              src="https://res.cloudinary.com/dj4kd5tjf/image/upload/v1772891360/LOGO_knvwgr.png" 
              alt="გავაოცე" 
              className="h-20 mx-auto mb-4"
            />
            <h2 className="text-3xl font-extrabold text-blue-900">მოგესალმებით</h2>
            <p className="text-gray-500 mt-2">გთხოვთ, გაიაროთ ავტორიზაცია</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">ელ-ფოსტა</label>
              <input
                required
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition duration-200 bg-gray-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">პაროლი</label>
              <input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition duration-200 bg-gray-50 focus:bg-white"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl text-center font-medium animate-pulse">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-800 to-blue-900 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition duration-300 disabled:bg-gray-400 disabled:scale-100"
            >
              {loading ? 'მიმდინარეობს შესვლა...' : 'შესვლა'}
            </button>
          </form>

          <div className="mt-8 text-center border-t pt-6">
            <p className="text-gray-600">
              ჯერ არ გაქვს ანგარიში?{' '}
              <span className="text-blue-800 font-bold cursor-pointer hover:underline">
                მალე დაემატება
              </span>
            </p>
          </div>
        </div>
      </div>
      
      <footer className="py-6 text-center text-gray-400 text-sm">
        © 2026 გავაოცე — ყველა უფლება დაცულია
      </footer>
    </div>
  );
}

export default Login;