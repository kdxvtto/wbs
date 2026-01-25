/**
 * =====================================================
 * ADMIN LAYOUT - LAYOUT KHUSUS HALAMAN ADMIN
 * =====================================================
 * 
 * Layout adalah "bingkai" yang membungkus halaman.
 * AdminLayout menyediakan:
 * - Sidebar dengan menu navigasi
 * - Header dengan info user
 * - Area konten untuk halaman
 * 
 * DIGUNAKAN DI:
 * - /dashboard
 * - /dashboard/pengaduan
 * - /dashboard/user
 * - dll (semua halaman admin)
 * 
 * KONSEP PENTING:
 * 1. children = halaman yang dibungkus (DashboardPage, UserPage, dll)
 * 2. Responsive: sidebar bisa collapse di mobile
 * 3. State management untuk toggle menu
 */

import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'
import { Button } from '@/components/atoms'
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  FolderOpen,
  Users,
  LogOut,
  Menu,
  X,
  ChevronDown,
  FileCheck,
  MessageSquareReply,
} from 'lucide-react'

/**
 * MENU ITEMS CONFIGURATION
 * 
 * Array yang mendefinisikan struktur menu di sidebar.
 * Bisa berupa:
 * 1. Menu biasa: { name, href, icon }
 * 2. Menu dengan submenu: { name, icon, children: [...] }
 * 
 * Pendekatan ini membuat menu mudah diubah tanpa edit JSX.
 */
const menuItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,  // Komponen icon dari lucide-react
  },
  {
    name: 'Pengaduan',
    icon: FileText,
    children: [  // Submenu - akan tampil saat parent di-expand
      { name: 'Daftar Pengaduan', href: '/dashboard/pengaduan' },
      { name: 'Laporan Pengaduan', href: '/dashboard/pengaduan/laporan' },
    ],
  },
  {
    name: 'Respon',
    icon: MessageSquare,
    children: [
      { name: 'Daftar Respon', href: '/dashboard/respon' },
      { name: 'Laporan Respon', href: '/dashboard/respon/laporan' },
    ],
  },
  {
    name: 'Kategori Pengaduan',
    href: '/dashboard/kategori',
    icon: FolderOpen,
  },
  {
    name: 'User',
    href: '/dashboard/user',
    icon: Users,
    allowedRoles: ['Admin'],
  },
]

/**
 * ADMIN LAYOUT COMPONENT
 * 
 * @param {ReactNode} children - Halaman yang dibungkus layout ini
 */
export default function AdminLayout({ children }) {
  // =====================================================
  // STATE MANAGEMENT
  // =====================================================
  
  /**
   * sidebarOpen: Status sidebar di mobile (true = terbuka)
   * Di desktop, sidebar selalu terlihat
   */
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  /**
   * expandedMenus: Array nama menu yang sedang di-expand
   * Default: ['Pengaduan', 'Respon'] = kedua submenu terbuka
   * 
   * Ini memungkinkan MULTIPLE menu terbuka bersamaan
   */
  const [expandedMenus, setExpandedMenus] = useState(['Pengaduan', 'Respon'])
  
  /**
   * loggingOut: Status proses logout (untuk loading state)
   */
  const [loggingOut, setLoggingOut] = useState(false)
  
  // =====================================================
  // HOOKS
  // =====================================================
  
  /**
   * useLocation: Mendapatkan info URL saat ini
   * Digunakan untuk highlight menu yang aktif
   */
  const location = useLocation()
  
  /**
   * useNavigate: Untuk navigasi programatik
   * Digunakan untuk redirect setelah logout
   */
  const navigate = useNavigate()
  
  /**
   * useAuth: Context untuk autentikasi
   * Mengambil data user dan fungsi logout
   */
  const { user, logout } = useAuth()

  // =====================================================
  // HANDLER FUNCTIONS
  // =====================================================

  /**
   * Toggle submenu expand/collapse
   * 
   * CARA KERJA:
   * - Jika menu sudah ada di array → hapus (collapse)
   * - Jika menu belum ada → tambahkan (expand)
   * 
   * @param {string} menuName - Nama menu yang di-toggle
   */
  const toggleMenu = (menuName) => {
    setExpandedMenus(prev => 
      prev.includes(menuName) 
        ? prev.filter(m => m !== menuName)  // Hapus dari array
        : [...prev, menuName]               // Tambah ke array
    )
  }

  /**
   * Handle Logout
   * 
   * PENTING: Redirect ke /hanomanbpr/login (bukan /login)
   * karena ini adalah layout untuk Admin/Pimpinan/Staf
   */
  const handleLogout = async () => {
    setLoggingOut(true)        // Set loading state
    await logout()             // Panggil fungsi logout dari context
    navigate('/hanomanbpr/login')    // Redirect ke admin login
  }

  /**
   * Helper function untuk cek apakah menu aktif
   * @param {string} href - URL menu
   * @returns {boolean} true jika URL saat ini sama dengan href
   */
  const isActive = (href) => location.pathname === href
  
  /**
   * Helper function untuk cek apakah parent menu aktif
   * @param {array} children - Array submenu
   * @returns {boolean} true jika salah satu child aktif
   */
  const isParentActive = (children) => children?.some(child => location.pathname === child.href)

  // =====================================================
  // JSX RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* =====================================================
          MOBILE BACKDROP
          Overlay gelap yang muncul saat sidebar terbuka di mobile
          Klik untuk menutup sidebar
      ===================================================== */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =====================================================
          SIDEBAR
          
          RESPONSIVE BEHAVIOR:
          - Mobile (< lg): tersembunyi, muncul saat sidebarOpen = true
          - Desktop (>= lg): selalu terlihat (lg:translate-x-0)
          
          CSS EXPLANATION:
          - fixed: posisi tetap, tidak ikut scroll
          - z-50: di atas semua elemen
          - transform transition: animasi smooth saat buka/tutup
      ===================================================== */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-border transform transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="h-10" />
          </Link>
          {/* Tombol close untuk mobile */}
          <button 
            className="lg:hidden p-2 hover:bg-accent rounded-lg"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* =====================================================
            NAVIGATION MENU
            
            Mapping menuItems untuk render setiap menu.
            Ada 2 tipe:
            1. Menu dengan children (submenu) → render dengan toggle
            2. Menu biasa → render sebagai link langsung
        ===================================================== */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          {menuItems.map((item) => {
            // Check allowedRoles
            if (item.allowedRoles && !item.allowedRoles.includes(user?.role)) {
              return null
            }
            
            return (
              <div key={item.name}>
              {item.children ? (
                // MENU DENGAN SUBMENU
                <>
                  {/* Parent menu button */}
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isParentActive(item.children)
                        ? "bg-primary/10 text-primary"  // Highlight jika child aktif
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </div>
                    {/* Arrow icon - rotasi 180° saat expanded */}
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform",
                      expandedMenus.includes(item.name) && "rotate-180"
                    )} />
                  </button>
                  
                  {/* Submenu - hanya tampil jika expanded */}
                  {expandedMenus.includes(item.name) && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          onClick={() => setSidebarOpen(false)}  // Tutup sidebar di mobile
                          className={cn(
                            "block px-3 py-2 rounded-lg text-sm transition-colors",
                            isActive(child.href)
                              ? "bg-primary text-white"
                              : "text-muted-foreground hover:bg-accent hover:text-foreground"
                          )}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                // MENU TANPA SUBMENU - langsung link
                <Link
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )}
              </div>
            )
          })}
        </nav>

        {/* =====================================================
            USER INFO & LOGOUT
            Posisi absolute di bottom sidebar
        ===================================================== */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Avatar - menampilkan huruf pertama nama */}
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="text-sm">
                <p className="font-medium text-foreground truncate max-w-[120px]">{user?.name || 'Admin'}</p>
                <p className="text-xs text-muted-foreground">{user?.role || 'Admin'}</p>
              </div>
            </div>
            
            {/* Logout Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout} 
              disabled={loggingOut}
              className="text-muted-foreground hover:text-destructive"
            >
              {loggingOut ? (
                // Loading spinner saat logout
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT AREA
          
          lg:pl-64 = padding-left 256px di desktop untuk
          memberi ruang sidebar
      ===================================================== */}
      <div className="lg:pl-64">
        
        {/* TOP HEADER */}
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          {/* Hamburger menu untuk mobile */}
          <button 
            className="lg:hidden p-2 hover:bg-accent rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex-1 lg:flex-none" />
          
          {/* Welcome message */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Selamat datang, <span className="font-medium text-foreground">{user?.name || 'Admin'}</span>
            </span>
          </div>
        </header>

        {/* PAGE CONTENT - Di sini children (halaman) dirender */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
