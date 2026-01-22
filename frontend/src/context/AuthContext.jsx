/**
 * =====================================================
 * AUTH CONTEXT - SISTEM AUTENTIKASI GLOBAL
 * =====================================================
 * 
 * File ini adalah "pusat kendali" autentikasi di aplikasi React.
 * Dengan Context API, data user bisa diakses dari komponen manapun
 * tanpa perlu passing props berulang kali (prop drilling).
 * 
 * KONSEP PENTING:
 * - Context = "Gudang data global" yang bisa diakses semua komponen
 * - Provider = Komponen yang "menyediakan" data ke child components
 * - useAuth() = Hook custom untuk mengakses data dari context
 * 
 * ALUR KERJA:
 * 1. App dimuat → cek apakah ada token di localStorage
 * 2. Jika ada token → ambil data user dari server (fetchUser)
 * 3. Jika login berhasil → simpan token & data user
 * 4. Jika logout → hapus token & reset data user
 */

import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/services/api'

// Membuat Context baru untuk autentikasi
// null = nilai default jika tidak ada Provider
const AuthContext = createContext(null)

/**
 * AUTH PROVIDER COMPONENT
 * Komponen ini membungkus seluruh aplikasi (di main.jsx)
 * untuk menyediakan data autentikasi ke semua child components.
 * 
 * @param {object} children - Komponen anak yang dibungkus
 */
export function AuthProvider({ children }) {
  // STATE MANAGEMENT
  // useState = hook untuk menyimpan data yang bisa berubah
  const [user, setUser] = useState(null)      // Data user yang sedang login (null = belum login)
  const [loading, setLoading] = useState(true) // Status loading saat cek autentikasi awal
  const navigate = useNavigate()               // Hook untuk navigasi programatik

  /**
   * useEffect dengan [] = HANYA DIJALANKAN SEKALI saat komponen pertama kali dimuat
   * Fungsi: Mengecek apakah user sudah login sebelumnya (persistent login)
   */
  useEffect(() => {
    // Cek apakah ada token tersimpan di browser
    const token = localStorage.getItem('token')
    if (token) {
      // Jika ada token, ambil data user dari server
      fetchUser()
    } else {
      // Jika tidak ada token, langsung selesai loading
      setLoading(false)
    }
  }, []) // [] = dependency array kosong, artinya hanya run sekali

  /**
   * FETCH USER - Mengambil data user dari server
   * Dipanggil saat:
   * 1. App pertama kali dimuat (jika ada token)
   * 2. Setelah login berhasil (opsional refresh data)
   */
  const fetchUser = async () => {
    try {
      // GET request ke /auth/profile dengan token di header (otomatis dari api.js)
      const response = await api.get('/auth/profile')
      setUser(response.data.data) // Simpan data user ke state
    } catch (error) {
      // Jika token invalid/expired, hapus dan reset state
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      // Finally SELALU dijalankan, baik sukses maupun error
      setLoading(false)
    }
  }

  /**
   * LOGIN - Proses login user
   * @param {object} credentials - { username/email, password }
   * @param {string} type - 'admin' atau 'user' (menentukan endpoint)
   * @returns {object} Response dari server
   */
  const login = async (credentials, type = 'admin') => {
    // Pilih endpoint berdasarkan tipe user
    const endpoint = type === 'admin' ? '/auth/login/admin' : '/auth/login/user'
    
    // POST request dengan credentials
    const response = await api.post(endpoint, credentials)
    
    // Destructuring: ambil token dan user dari response
    const { token, user: userData } = response.data.data
    
    // Simpan token ke localStorage (persistent storage di browser)
    localStorage.setItem('token', token)
    
    // Update state user
    setUser(userData)
    
    return response.data
  }

  /**
   * REGISTER - Proses registrasi user baru
   * @param {object} userData - Data registrasi { name, email, password, dll }
   * @param {string} type - 'admin' atau 'user'
   */
  const register = async (userData, type = 'admin') => {
    const endpoint = type === 'admin' ? '/auth/register/admin' : '/auth/register/user'
    const response = await api.post(endpoint, userData)
    return response.data
  }

  /**
   * LOGOUT - Proses logout user
   * 
   * CATATAN PENTING:
   * - Fungsi ini TIDAK melakukan navigate
   * - Navigasi ditangani oleh komponen yang memanggil (AdminLayout/UserLayout)
   * - Ini karena setiap layout punya tujuan redirect berbeda:
   *   - AdminLayout → /admin/login
   *   - UserLayout → /login
   */
  const logout = async () => {
    try {
      // Beritahu server untuk invalidate token (opsional, ada blacklist)
      await api.post('/auth/logout')
    } catch (error) {
      // Abaikan error, tetap logout secara lokal
    } finally {
      // Hapus token dari localStorage
      localStorage.removeItem('token')
      // Reset state user ke null (trigger re-render di seluruh app)
      setUser(null)
      // Navigation is handled by the calling component (AdminLayout or UserLayout)
    }
  }

  /**
   * VALUE OBJECT
   * Objek yang berisi semua data dan fungsi yang akan "disediakan"
   * ke semua child components melalui Context.
   * 
   * !!user = konversi user ke boolean (true jika ada, false jika null)
   */
  const value = {
    user,                      // Data user yang login
    loading,                   // Status loading
    isAuthenticated: !!user,   // Boolean: apakah user sudah login
    login,                     // Fungsi login
    register,                  // Fungsi register
    logout,                    // Fungsi logout
    fetchUser,                 // Fungsi refresh data user
  }

  // Provider membungkus children dan menyediakan value
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * CUSTOM HOOK: useAuth
 * Hook ini memudahkan akses ke AuthContext dari komponen manapun.
 * 
 * CARA PAKAI:
 * ```jsx
 * const { user, login, logout, isAuthenticated } = useAuth()
 * ```
 * 
 * @returns {object} Semua value dari AuthContext
 * @throws {Error} Jika dipanggil di luar AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext)
  
  // Error handling: pastikan hook dipakai di dalam AuthProvider
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}
