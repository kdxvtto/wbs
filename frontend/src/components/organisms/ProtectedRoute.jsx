/**
 * =====================================================
 * PROTECTED ROUTE & GUEST ROUTE - KOMPONEN PELINDUNG HALAMAN
 * =====================================================
 * 
 * File ini berisi 2 komponen penting untuk ROUTE PROTECTION:
 * 
 * 1. ProtectedRoute - Melindungi halaman agar hanya bisa diakses user yang LOGIN
 *    Contoh: Dashboard hanya bisa diakses setelah login
 * 
 * 2. GuestRoute - Kebalikannya, hanya untuk user yang BELUM LOGIN
 *    Contoh: Halaman login tidak perlu diakses lagi jika sudah login
 * 
 * KONSEP PENTING:
 * - Kedua komponen ini membungkus halaman di App.jsx
 * - Mereka mengecek status autentikasi sebelum menampilkan halaman
 * - Jika tidak sesuai, user akan di-redirect ke halaman yang tepat
 */

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Skeleton } from '@/components/atoms'

/**
 * PROTECTED ROUTE COMPONENT
 * Melindungi halaman yang membutuhkan autentikasi.
 * 
 * CARA PAKAI DI App.jsx:
 * ```jsx
 * <Route path="/dashboard" element={
 *   <ProtectedRoute allowedRoles={['Admin', 'Pimpinan', 'Staf']}>
 *     <DashboardPage />
 *   </ProtectedRoute>
 * } />
 * ```
 * 
 * @param {ReactNode} children - Halaman yang dilindungi
 * @param {string[]} allowedRoles - Daftar role yang diizinkan (kosong = semua role)
 * 
 * ALUR KERJA:
 * 1. Cek loading → tampilkan skeleton
 * 2. Cek isAuthenticated → jika false, redirect ke login
 * 3. Cek role → jika tidak sesuai, redirect ke /unauthorized
 * 4. Jika semua OK → tampilkan halaman (children)
 */
export function ProtectedRoute({ children, allowedRoles = [] }) {
  // Ambil data dari AuthContext
  const { user, loading, isAuthenticated } = useAuth()
  
  // useLocation = hook untuk mendapatkan info URL saat ini
  // Berguna untuk menyimpan "dari mana user datang" saat redirect
  const location = useLocation()

  // TAHAP 1: Tampilkan loading skeleton saat mengecek autentikasi
  // Ini penting agar tidak ada "flash" halaman sebelum redirect
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-8 w-3/4" />
        </div>
      </div>
    )
  }

  // TAHAP 2: Cek apakah user sudah login
  if (!isAuthenticated) {
    /**
     * SMART REDIRECT BERDASARKAN ROLE
     * 
     * Jika user belum login dan mencoba akses halaman admin → redirect ke /hanomanbpr/login
     * Jika user belum login dan mencoba akses halaman nasabah → redirect ke /login
     * 
     * Cara kerja:
     * - Cek apakah allowedRoles mengandung role admin (Admin/Pimpinan/Staf)
     * - Jika ya, ini adalah route admin → redirect ke admin login
     * - Jika tidak, ini adalah route user biasa → redirect ke login biasa
     */
    const isAdminRoute = allowedRoles.some(role => ['Admin', 'Pimpinan', 'Staf'].includes(role))
    const loginPath = isAdminRoute ? '/hanomanbpr/login' : '/login'
    
    /**
     * Navigate component = cara declarative untuk redirect di React
     * - to: tujuan redirect
     * - state: data yang dibawa (from = halaman asal, untuk redirect kembali setelah login)
     * - replace: ganti history, bukan tambah (agar tombol back tidak kembali ke halaman ini)
     */
    return <Navigate to={loginPath} state={{ from: location }} replace />
  }

  // TAHAP 3: Cek apakah role user sesuai dengan yang diizinkan
  // Jika allowedRoles kosong [], semua role diizinkan
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Role tidak sesuai → redirect ke halaman unauthorized (403)
    return <Navigate to="/unauthorized" replace />
  }

  // TAHAP 4: Semua validasi lolos → tampilkan halaman
  return children
}

/**
 * GUEST ROUTE COMPONENT
 * Kebalikan dari ProtectedRoute - hanya untuk user yang BELUM login.
 * 
 * CARA PAKAI DI App.jsx:
 * ```jsx
 * <Route path="/login" element={
 *   <GuestRoute>
 *     <LoginPage />
 *   </GuestRoute>
 * } />
 * ```
 * 
 * KENAPA PERLU?
 * Agar user yang sudah login tidak perlu melihat halaman login lagi.
 * Mereka akan otomatis di-redirect ke dashboard.
 * 
 * @param {ReactNode} children - Halaman guest (login, register)
 */
export function GuestRoute({ children }) {
  const { loading, isAuthenticated, user } = useAuth()
  const location = useLocation()

  // Tampilkan loading skeleton saat mengecek
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  // Jika user SUDAH login, redirect mereka keluar dari halaman guest
  if (isAuthenticated) {
    /**
     * REDIRECT BERDASARKAN KONTEKS
     * 
     * 1. Jika ada "from" di state (user sebelumnya mencoba akses halaman tertentu)
     *    → redirect kembali ke halaman tersebut
     * 
     * 2. Jika tidak ada "from", redirect berdasarkan role:
     *    - Admin/Pimpinan/Staf → /dashboard
     *    - Nasabah → /my-reports
     */
    const from = location.state?.from?.pathname
    if (from) {
      return <Navigate to={from} replace />
    }
    
    // Default redirect based on role
    if (['Admin', 'Pimpinan', 'Staf'].includes(user?.role)) {
      return <Navigate to="/dashboard" replace />
    }
    return <Navigate to="/my-reports" replace />
  }

  // User belum login → tampilkan halaman guest (login/register)
  return children
}
