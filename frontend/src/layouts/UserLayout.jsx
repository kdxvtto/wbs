/**
 * =====================================================
 * USER LAYOUT - LAYOUT KHUSUS HALAMAN NASABAH/PELAPOR
 * =====================================================
 * 
 * Layout ini digunakan untuk halaman-halaman yang diakses
 * oleh user dengan role "Nasabah" (pelapor).
 * 
 * PERBEDAAN DENGAN ADMIN LAYOUT:
 * - Menu yang lebih sederhana (hanya 4 item)
 * - Ada "User Card" yang menampilkan info pelapor
 * - Desain yang lebih "friendly" untuk end-user
 * - Redirect ke /login saat logout (bukan /admin/login)
 * 
 * DIGUNAKAN DI:
 * - /my-reports (Formulir Pengaduan)
 * - /my-reports/progress (Progress Pengaduan)
 * - /my-reports/detail/:id (Detail Pengaduan)
 * - /my-reports/change-password (Ganti Password)
 */

import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FileText, ClipboardList, Lock, LogOut, Menu, X, User, Home } from 'lucide-react'
import { Button } from '@/components/atoms'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

/**
 * MENU ITEMS UNTUK NASABAH
 * 
 * Menu yang lebih sederhana dibanding admin:
 * - Beranda: kembali ke halaman utama
 * - Formulir Pengaduan: buat pengaduan baru
 * - Progress Pengaduan: lihat status pengaduan
 * - Ganti Password: ubah password akun
 */
const menuItems = [
  { name: 'Beranda', href: '/', icon: Home },
  { name: 'Formulir Pengaduan', href: '/my-reports', icon: FileText },
  { name: 'Progress Pengaduan', href: '/my-reports/progress', icon: ClipboardList },
  { name: 'Ganti Password', href: '/my-reports/change-password', icon: Lock },
]

/**
 * USER LAYOUT COMPONENT
 * 
 * @param {ReactNode} children - Halaman yang dibungkus layout ini
 */
export function UserLayout({ children }) {
  // Ambil data user dan fungsi logout dari AuthContext
  const { user, logout } = useAuth()
  
  // Hook untuk mendapatkan URL saat ini (untuk highlight menu aktif)
  const location = useLocation()
  
  // Hook untuk navigasi programatik
  const navigate = useNavigate()
  
  // State untuk toggle sidebar di mobile
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // State untuk loading indicator saat logout
  const [loggingOut, setLoggingOut] = useState(false)

  /**
   * Handle Logout
   * 
   * PENTING: Redirect ke /login (bukan /admin/login)
   * karena ini adalah layout untuk Nasabah
   */
  const handleLogout = async () => {
    setLoggingOut(true)
    await logout()
    // UserLayout is for Nasabah, so redirect to nasabah login
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* =====================================================
          MOBILE HEADER
          Hanya tampil di layar kecil (hidden di lg ke atas)
          Berisi hamburger menu dan judul
      ===================================================== */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-border h-16 flex items-center px-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
        >
          {/* Toggle icon: X saat terbuka, Menu saat tertutup */}
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <span className="ml-4 font-semibold text-foreground">WBS - Portal Pelapor</span>
      </div>

      {/* =====================================================
          SIDEBAR
          
          Berbeda dari AdminLayout:
          - Lebih lebar (w-72 vs w-64)
          - Ada User Card dengan info pelapor
          - Menu lebih sederhana tanpa submenu
      ===================================================== */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-border transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          
          {/* Logo Section */}
          <div className="p-6 border-b border-border">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
            </Link>
          </div>

          {/* =====================================================
              USER CARD
              Menampilkan informasi pengguna yang sedang login:
              - Avatar dengan icon user
              - Nama pengguna
              - NIK (Nomor Induk Kependudukan)
              
              Ini memberikan "personalisasi" ke user experience
          ===================================================== */}
          <div className="p-4">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4">
              {/* User Info Row */}
              <div className="flex items-center gap-3 mb-3">
                {/* Avatar Circle */}
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                {/* Name & Role */}
                <div className="flex-1 min-w-0">
                  {/* truncate = potong teks jika terlalu panjang */}
                  <p className="font-semibold text-foreground truncate">{user?.name || 'Nasabah'}</p>
                  <p className="text-xs text-muted-foreground">Pelapor</p>
                </div>
              </div>
              
              {/* NIK Card */}
              <div className="bg-white/80 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">NIK</p>
                {/* font-mono = monospace font, cocok untuk nomor */}
                <p className="font-mono text-sm text-foreground">{user?.nik || '-'}</p>
              </div>
            </div>
          </div>

          {/* =====================================================
              NAVIGATION MENU
              Lebih sederhana dari AdminLayout - tanpa submenu
          ===================================================== */}
          <nav className="flex-1 px-4 py-2">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                // Cek apakah menu ini aktif (URL cocok)
                const isActive = location.pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}  // Tutup sidebar di mobile
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary text-white shadow-lg shadow-primary/20"  // Style aktif
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"  // Style normal
                      )}
                    >
                      {/* Render icon sebagai komponen */}
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* =====================================================
              LOGOUT BUTTON
              Berbeda dari AdminLayout:
              - Full width button dengan teks
              - Warna destructive (merah) untuk kesadaran
          ===================================================== */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? (
                // Loading state dengan spinner
                <>
                  <div className="w-5 h-5 mr-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Keluar...
                </>
              ) : (
                // Normal state
                <>
                  <LogOut className="w-5 h-5 mr-3" />
                  Keluar
                </>
              )}
            </Button>
          </div>
        </div>
      </aside>

      {/* =====================================================
          MOBILE OVERLAY
          Backdrop gelap yang muncul saat sidebar terbuka di mobile
          Klik untuk menutup sidebar
      ===================================================== */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =====================================================
          MAIN CONTENT
          
          lg:ml-72 = margin-left 288px di desktop untuk sidebar
          pt-16 = padding-top untuk mobile header
          lg:pt-0 = tidak perlu padding di desktop
      ===================================================== */}
      <main className="lg:ml-72 min-h-screen pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          {/* children = halaman yang dibungkus layout ini */}
          {children}
        </div>
      </main>
    </div>
  )
}
