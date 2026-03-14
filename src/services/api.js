import axios from 'axios';

const API = axios.create({
  baseURL: 'https://boxfusionapi-production.up.railway.app/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// ინტერცეპტორი, რომელიც ყოველ რექვესტზე ამოწმებს ტოკენს
API.interceptors.request.use((config) => {
  // ჯერ ვამოწმებთ პირდაპირ 'token'-ს
  let token = localStorage.getItem('token');
  
  // თუ იქ არ არის, ვამოწმებთ 'user' ობიექტის შიგნით (როგორც AuthContext-ში ვინახავთ)
  if (!token) {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      token = parsedUser.token;
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;