// src/api/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  "http://13.239.31.20:3000"; // <= 서버 API 주소 (fallback)

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

console.log('🔥 [API 연결 확인] baseURL:', BASE_URL);

// 요청 인터셉터: 토큰 자동 부착
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {}
  return config;
});

// 응답 인터셉터: 에러 통일 로깅
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log('[API ERROR]', err?.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default api;
