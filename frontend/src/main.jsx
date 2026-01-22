/**
 * =====================================================
 * MAIN.JSX - ENTRY POINT APLIKASI REACT
 * =====================================================
 * 
 * File ini adalah "pintu masuk" pertama aplikasi React.
 * Di sini kita:
 * 1. Merender App ke DOM
 * 2. Membungkus App dengan berbagai Provider
 * 
 * URUTAN PROVIDER (dari luar ke dalam):
 * StrictMode → QueryClientProvider → BrowserRouter → AuthProvider → App
 * 
 * Urutan ini penting karena:
 * - Provider yang di luar bisa diakses oleh yang di dalam
 * - AuthProvider perlu BrowserRouter karena pakai useNavigate
 * - App perlu semua provider di atasnya
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/context/AuthContext'
import './index.css'
import App from './App.jsx'

/**
 * REACT QUERY CLIENT
 * 
 * React Query = library untuk mengelola server state (data dari API)
 * Fitur utama:
 * - Caching: data disimpan sementara, tidak perlu fetch ulang
 * - Background refetching: data diperbarui di background
 * - Retry: otomatis coba ulang jika gagal
 * 
 * KONFIGURASI:
 * - staleTime: berapa lama data dianggap "fresh" (tidak perlu fetch ulang)
 *   5 menit = jika user buka halaman yang sama dalam 5 menit, pakai cache
 * - retry: berapa kali coba ulang jika request gagal
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 menit dalam milliseconds
      retry: 1,                 // Coba ulang 1 kali jika gagal
    },
  },
})

/**
 * RENDER APLIKASI KE DOM
 * 
 * createRoot = cara baru React 18+ untuk render aplikasi
 * document.getElementById('root') = elemen div#root di index.html
 * 
 * PROVIDER WRAPPING:
 * Seperti "lapisan bawang", masing-masing menyediakan fitur:
 */
createRoot(document.getElementById('root')).render(
  /**
   * STRICT MODE
   * Fitur development untuk mendeteksi masalah potensial:
   * - Menjalankan efek 2 kali (untuk cek cleanup)
   * - Mendeteksi legacy API yang deprecated
   * - Hanya aktif di development, tidak di production
   */
  <StrictMode>
    
    {/**
     * QUERY CLIENT PROVIDER
     * Menyediakan React Query ke seluruh aplikasi.
     * Komponen manapun bisa pakai useQuery, useMutation, dll.
     */}
    <QueryClientProvider client={queryClient}>
      
      {/**
       * BROWSER ROUTER
       * Mengaktifkan routing berbasis URL di browser.
       * Tanpa ini, <Route> dan <Link> tidak akan bekerja.
       */}
      <BrowserRouter>
        
        {/**
         * AUTH PROVIDER
         * Menyediakan context autentikasi ke seluruh aplikasi.
         * Komponen manapun bisa pakai useAuth() untuk akses user, login, logout.
         * HARUS di dalam BrowserRouter karena pakai useNavigate.
         */}
        <AuthProvider>
          
          {/**
           * APP COMPONENT
           * Komponen utama yang berisi semua routing dan halaman.
           */}
          <App />
          
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
