/**
 * =====================================================
 * APP.JSX - ROUTING UTAMA APLIKASI
 * =====================================================
 * 
 * File ini adalah "peta jalan" aplikasi React.
 * Di sini kita mendefinisikan semua URL dan halaman yang sesuai.
 * 
 * KONSEP PENTING:
 * 
 * 1. LAZY LOADING
 *    - Halaman tidak dimuat sekaligus saat aplikasi dibuka
 *    - Halaman hanya dimuat saat user mengaksesnya
 *    - Ini membuat aplikasi lebih cepat dimuat pertama kali
 * 
 * 2. SUSPENSE
 *    - Komponen pembungkus untuk lazy loading
 *    - Menampilkan "fallback" (loading) saat halaman sedang dimuat
 * 
 * 3. ROUTE TYPES:
 *    - Public Routes: bisa diakses siapa saja (HomePage, HubungiKami)
 *    - Guest Routes: hanya untuk yang BELUM login (Login, Register)
 *    - Protected Routes: hanya untuk yang SUDAH login (Dashboard)
 * 
 * 4. LAYOUT PATTERN:
 *    - AdminLayout: layout khusus admin dengan sidebar
 *    - UserLayout: layout khusus nasabah dengan menu berbeda
 *    - Halaman dibungkus layout sesuai tipe user
 */

import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute, GuestRoute } from '@/components/organisms/ProtectedRoute'
import { AdminLayout, UserLayout } from '@/layouts'

/**
 * =====================================================
 * LAZY LOADING PAGES
 * =====================================================
 * 
 * lazy() = fungsi untuk import komponen secara "malas" (hanya saat dibutuhkan)
 * 
 * CARA KERJA:
 * const HomePage = lazy(() => import('@/pages/HomePage'))
 * 
 * Artinya:
 * - HomePage tidak langsung di-import saat app dimuat
 * - HomePage baru di-import saat user mengakses route "/"
 * - Ini disebut "code splitting" - memecah bundle menjadi bagian kecil
 * 
 * KEUNTUNGAN:
 * - Bundle awal lebih kecil → app lebih cepat dimuat
 * - Halaman yang jarang diakses tidak membebani user
 */

// Public & Auth Pages (bisa diakses tanpa login)
const HomePage = lazy(() => import('@/pages/HomePage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const AdminLoginPage = lazy(() => import('@/pages/AdminLoginPage'))
const AdminRegisterPage = lazy(() => import('@/pages/AdminRegisterPage'))
const HubungiKamiPage = lazy(() => import('@/pages/HubungiKamiPage'))

// Admin pages (hanya untuk Admin, Pimpinan, Staf)
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'))
const PengaduanPage = lazy(() => import('@/pages/admin/PengaduanPage'))
const LaporanPengaduanPage = lazy(() => import('@/pages/admin/LaporanPengaduanPage'))
const DetailPengaduanPage = lazy(() => import('@/pages/admin/DetailPengaduanPage'))
const ResponPage = lazy(() => import('@/pages/admin/ResponPage'))
const LaporanResponPage = lazy(() => import('@/pages/admin/LaporanResponPage'))
const KategoriPage = lazy(() => import('@/pages/admin/KategoriPage'))
const UserPage = lazy(() => import('@/pages/admin/UserPage'))

// User/Nasabah pages (hanya untuk Nasabah)
const ComplaintFormPage = lazy(() => import('@/pages/user/ComplaintFormPage'))
const ProgressPage = lazy(() => import('@/pages/user/ProgressPage'))
const ComplaintDetailPage = lazy(() => import('@/pages/user/ComplaintDetailPage'))
const ChangePasswordPage = lazy(() => import('@/pages/user/ChangePasswordPage'))

/**
 * PAGE LOADER COMPONENT
 * Komponen loading yang ditampilkan saat halaman sedang dimuat (lazy loading).
 * Memberi feedback visual ke user bahwa ada sesuatu yang sedang diproses.
 */
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner animasi berputar */}
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <p className="text-muted-foreground text-sm">Memuat...</p>
      </div>
    </div>
  )
}

/**
 * UNAUTHORIZED PAGE (403)
 * Ditampilkan saat user mencoba mengakses halaman yang tidak sesuai role-nya.
 * Contoh: Nasabah mencoba akses /dashboard yang hanya untuk Admin.
 */
function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-destructive mb-4">403 - Unauthorized</h1>
        <p className="text-muted-foreground">Anda tidak memiliki akses ke halaman ini</p>
      </div>
    </div>
  )
}

/**
 * NOT FOUND PAGE (404)
 * Ditampilkan saat user mengakses URL yang tidak ada.
 * Route "*" di bawah akan menangkap semua URL yang tidak cocok.
 */
function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-muted-foreground mb-4">404 - Not Found</h1>
        <p className="text-muted-foreground">Halaman tidak ditemukan</p>
      </div>
    </div>
  )
}

/**
 * =====================================================
 * MAIN APP COMPONENT
 * =====================================================
 * 
 * Komponen utama yang mendefinisikan semua routes.
 * Dibungkus dengan <Suspense> untuk handle lazy loading.
 */
function App() {
  return (
    /**
     * SUSPENSE
     * Komponen React untuk "menunggu" komponen lazy selesai dimuat.
     * fallback = apa yang ditampilkan selama loading
     */
    <Suspense fallback={<PageLoader />}>
      
      {/* Routes = container untuk semua Route */}
      <Routes>
        
        {/* =====================================================
            PUBLIC ROUTES
            Bisa diakses oleh siapa saja, login maupun tidak
        ===================================================== */}
        <Route path="/" element={<HomePage />} />
        <Route path="/hubungi-kami" element={<HubungiKamiPage />} />
        
        {/* =====================================================
            GUEST ROUTES - USER AUTH
            Hanya untuk user yang BELUM login
            Jika sudah login, akan di-redirect ke dashboard
        ===================================================== */}
        <Route path="/login" element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        } />
        <Route path="/register" element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        } />

        {/* Guest Routes - Admin Auth */}
        <Route path="/hanomanbpr/login" element={
          <GuestRoute>
            <AdminLoginPage />
          </GuestRoute>
        } />
        <Route path="/hanomanbpr/register" element={
          <GuestRoute>
            <AdminRegisterPage />
          </GuestRoute>
        } />
        
        {/* =====================================================
            PROTECTED ROUTES - ADMIN DASHBOARD
            Hanya untuk user dengan role: Admin, Pimpinan, Staf
            
            PERHATIKAN POLA:
            1. ProtectedRoute - cek autentikasi & role
            2. AdminLayout - layout dengan sidebar admin
            3. Page Component - halaman sebenarnya
            
            Ini seperti "lapisan":
            ProtectedRoute > AdminLayout > DashboardPage
        ===================================================== */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['Admin', 'Pimpinan', 'Staf']}>
            <AdminLayout>
              <DashboardPage />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/pengaduan" element={
          <ProtectedRoute allowedRoles={['Admin', 'Pimpinan', 'Staf']}>
            <AdminLayout>
              <PengaduanPage />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/pengaduan/laporan" element={
          <ProtectedRoute allowedRoles={['Admin', 'Pimpinan', 'Staf']}>
            <AdminLayout>
              <LaporanPengaduanPage />
            </AdminLayout>
          </ProtectedRoute>
        } />
        {/* 
          DYNAMIC ROUTE dengan parameter :id
          :id akan diambil dari URL, misal /dashboard/pengaduan/abc123
          Di komponen bisa diakses dengan useParams(): const { id } = useParams()
        */}
        <Route path="/dashboard/pengaduan/:id" element={
          <ProtectedRoute allowedRoles={['Admin', 'Pimpinan', 'Staf']}>
            <AdminLayout>
              <DetailPengaduanPage />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/respon" element={
          <ProtectedRoute allowedRoles={['Admin', 'Pimpinan', 'Staf']}>
            <AdminLayout>
              <ResponPage />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/respon/laporan" element={
          <ProtectedRoute allowedRoles={['Admin', 'Pimpinan', 'Staf']}>
            <AdminLayout>
              <LaporanResponPage />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/kategori" element={
          <ProtectedRoute allowedRoles={['Admin', 'Pimpinan', 'Staf']}>
            <AdminLayout>
              <KategoriPage />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/user" element={
          <ProtectedRoute allowedRoles={['Admin', 'Pimpinan', 'Staf']}>
            <AdminLayout>
              <UserPage />
            </AdminLayout>
          </ProtectedRoute>
        } />

        {/* =====================================================
            PROTECTED ROUTES - USER/NASABAH DASHBOARD
            Hanya untuk user dengan role: Nasabah
            Menggunakan UserLayout yang berbeda dari AdminLayout
        ===================================================== */}
        <Route path="/my-reports" element={
          <ProtectedRoute allowedRoles={['Nasabah']}>
            <UserLayout>
              <ComplaintFormPage />
            </UserLayout>
          </ProtectedRoute>
        } />
        <Route path="/my-reports/progress" element={
          <ProtectedRoute allowedRoles={['Nasabah']}>
            <UserLayout>
              <ProgressPage />
            </UserLayout>
          </ProtectedRoute>
        } />
        <Route path="/my-reports/detail/:id" element={
          <ProtectedRoute allowedRoles={['Nasabah']}>
            <UserLayout>
              <ComplaintDetailPage />
            </UserLayout>
          </ProtectedRoute>
        } />
        <Route path="/my-reports/change-password" element={
          <ProtectedRoute allowedRoles={['Nasabah']}>
            <UserLayout>
              <ChangePasswordPage />
            </UserLayout>
          </ProtectedRoute>
        } />
        
        {/* =====================================================
            ERROR PAGES
            Halaman untuk menangani kondisi error
        ===================================================== */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
        {/* 
          CATCH-ALL ROUTE (404)
          path="*" artinya cocok dengan URL APAPUN yang tidak cocok di atas
          Harus diletakkan PALING AKHIR
        */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

export default App
