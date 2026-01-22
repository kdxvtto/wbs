/**
 * =====================================================
 * API SERVICE - KONFIGURASI AXIOS UNTUK HTTP REQUESTS
 * =====================================================
 * 
 * File ini mengatur bagaimana frontend berkomunikasi dengan backend.
 * Menggunakan library AXIOS yang lebih powerful daripada fetch bawaan.
 * 
 * FITUR PENTING:
 * 1. Base URL otomatis - tidak perlu tulis URL lengkap setiap request
 * 2. Request Interceptor - otomatis tambahkan token ke setiap request
 * 3. Response Interceptor - otomatis handle error 401 (token expired)
 * 4. Token Refresh - otomatis perbarui token tanpa user perlu login ulang
 * 
 * CARA PAKAI:
 * ```jsx
 * import api from '@/services/api'
 * 
 * // GET request
 * const response = await api.get('/user')
 * 
 * // POST request
 * await api.post('/auth/login', { username, password })
 * 
 * // PUT request
 * await api.put('/user/123', { name: 'New Name' })
 * 
 * // DELETE request
 * await api.delete('/user/123')
 * ```
 */

import axios from "axios";

/**
 * API BASE URL
 * 
 * import.meta.env.VITE_API_URL = environment variable dari file .env
 * - Development: http://localhost:3000/api
 * - Production: https://api.yourdomain.com/api
 * 
 * Prefix VITE_ wajib untuk Vite agar bisa diakses di frontend
 */
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * AXIOS INSTANCE
 * 
 * Membuat instance axios dengan konfigurasi default.
 * Semua request yang menggunakan 'api' akan mewarisi config ini.
 */
const api = axios.create({
  baseURL: API_URL,           // URL dasar, jadi cukup tulis '/user' bukan 'http://localhost:3000/api/user'
  headers: {
    "Content-Type": "application/json",  // Default content type untuk JSON
  },
  withCredentials: true,      // PENTING: kirim cookies (untuk refresh token di httpOnly cookie)
});

/**
 * =====================================================
 * REQUEST INTERCEPTOR
 * =====================================================
 * 
 * Interceptor = "penyadap" yang dijalankan SEBELUM request dikirim.
 * 
 * FUNGSI:
 * Otomatis menambahkan JWT token ke header Authorization di SETIAP request.
 * Jadi tidak perlu manual tambahkan token di setiap api.get(), api.post(), dll.
 * 
 * ALUR:
 * 1. Ambil token dari localStorage
 * 2. Jika ada, tambahkan ke header sebagai "Bearer [token]"
 * 3. Kirim request
 */
api.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage (browser storage yang persistent)
    const token = localStorage.getItem("token");
    
    if (token) {
      // Format: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;  // Lanjutkan request
  },
  (error) => Promise.reject(error)  // Jika error, teruskan ke catch
);

/**
 * =====================================================
 * RESPONSE INTERCEPTOR
 * =====================================================
 * 
 * Interceptor yang dijalankan SETELAH menerima response dari server.
 * 
 * FUNGSI UTAMA:
 * Handle error 401 (Unauthorized) secara otomatis dengan TOKEN REFRESH.
 * 
 * KONSEP TOKEN REFRESH:
 * - Access Token (JWT) = token utama, expire dalam waktu singkat (15 menit - 1 jam)
 * - Refresh Token = token di cookie, expire lebih lama (7 hari)
 * 
 * Ketika Access Token expired:
 * 1. Server menolak dengan status 401
 * 2. Frontend otomatis request token baru menggunakan Refresh Token
 * 3. Jika berhasil, ulangi request yang gagal dengan token baru
 * 4. Jika gagal (refresh token juga expired), redirect ke login
 * 
 * Ini membuat user experience lebih baik karena tidak perlu login ulang
 * setiap access token expired.
 */
api.interceptors.response.use(
  // Fungsi pertama: untuk response SUKSES (status 2xx)
  (response) => response,  // Langsung return tanpa modifikasi
  
  // Fungsi kedua: untuk response ERROR
  async (error) => {
    // Simpan config request asli untuk diulangi nanti
    const originalRequest = error.config;
    
    /**
     * CEK KONDISI UNTUK TOKEN REFRESH:
     * 1. Status 401 (Unauthorized) - token invalid atau expired
     * 2. !originalRequest._retry - belum pernah dicoba refresh (hindari infinite loop)
     */
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Tandai bahwa request ini sudah dicoba refresh
      originalRequest._retry = true;
      
      try {
        // Request token baru ke endpoint refresh-token
        // Refresh token dikirim otomatis via cookie (withCredentials: true)
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {}, {
          withCredentials: true,
        });
        
        // Ambil access token baru dari response
        const { token } = response.data.data;
        
        // Simpan token baru ke localStorage
        localStorage.setItem("token", token);
        
        // Update header Authorization dengan token baru
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        // Ulangi request yang gagal tadi dengan token baru
        return api(originalRequest);
        
      } catch (refreshError) {
        // Refresh token juga expired atau invalid
        // Hapus token dan redirect ke halaman login
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    
    // Error lain (bukan 401) atau sudah dicoba refresh
    // Teruskan error ke catch block di tempat pemanggilan
    return Promise.reject(error);
  }
);

// Export sebagai default agar bisa diimport dengan nama apapun
// import api from '@/services/api'
// import http from '@/services/api'  // juga valid
export default api;
