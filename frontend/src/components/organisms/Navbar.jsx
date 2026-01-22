import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, ChevronDown, FileText, Shield, AlertCircle, User, LogOut } from 'lucide-react'
import { Button } from '@/components/atoms'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

const navLinks = [
  { name: 'Beranda', href: '/' },
  { 
    name: 'Tentang WBS', 
    href: '#',
    dropdown: [
      { name: 'Cara Melapor', key: 'cara-melapor', icon: FileText },
      { name: 'Kerahasiaan Pelapor', key: 'kerahasiaan', icon: Shield },
      { name: 'Unsur Pengaduan', key: 'unsur', icon: AlertCircle },
    ]
  },
  { name: 'Hubungi Kami', href: '/hubungi-kami' },
]

const dialogContent = {
  'cara-melapor': {
    title: 'Cara Melapor',
    content: (
      <div className="space-y-4 text-muted-foreground">
        <div className="space-y-3">
          <p>
            <strong className="text-foreground">1.</strong> Klik tombol <strong className="text-primary">"LOGIN"</strong>, lalu isikan Email dan Kata Sandi (password) Anda.
          </p>
          <p>
            <strong className="text-foreground">2.</strong> Jika Anda belum terdaftar, klik tombol <strong className="text-primary">"Belum Memiliki Akun?"</strong> dan isikan data diri Anda lalu klik tombol <strong className="text-primary">"REGISTRASI"</strong>, kemudian buat Username dengan menggunakan email dan Kata Sandi (password) yang Anda ketahui sendiri, selanjutnya aktifkan akun anda melalui tautan yang kami kirimkan melalui email.
          </p>
          <p>
            <strong className="text-foreground">3.</strong> Login menggunakan Email dan Kata Sandi (password) yang telah anda buat sebelumnya.
          </p>
          <p>
            <strong className="text-foreground">4.</strong> Isi Formulir Pengaduan sesuai informasi yang anda ketahui.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4">
            <p className="text-yellow-800">
              <strong>Perhatian:</strong> Semua kotak isian yang diberi tanda <span className="text-red-600">(*)</span> wajib diisi, dan pastikan informasi yang diberikan sedapat mungkin memenuhi unsur <strong>4W + 1H</strong>.
            </p>
          </div>
          <p>
            <strong className="text-foreground">5.</strong> Jika anda memiliki bukti dalam bentuk file seperti foto atau dokumen lain, silahkan dilengkapi di halaman pengaduan.
          </p>
          <p>
            <strong className="text-foreground">6.</strong> Setelah selesai mengisi, silahkan klik tombol <strong className="text-primary">"Kirim Pengaduan"</strong> untuk melanjutkan atau klik tombol <strong>"Batal"</strong> untuk membatalkan proses pelaporan anda.
          </p>
          <p>
            <strong className="text-foreground">7.</strong> Pada menu <strong>Progres Pengaduan</strong> berisi tentang progres tindak lanjut pengaduan anda.
          </p>
        </div>
      </div>
    )
  },
  'kerahasiaan': {
    title: 'Kerahasiaan Pelapor',
    content: (
      <div className="space-y-4 text-muted-foreground">
        <p>
          <strong className="text-foreground">BANK WONOGIRI</strong> akan merahasiakan identitas pribadi Anda sebagai whistleblower karena PT. BPR BANK WONOGIRI (Perseroda) hanya fokus pada informasi yang Anda laporkan.
        </p>
        
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 my-4">
          <p className="text-foreground font-medium mb-3">Agar Kerahasiaan lebih terjaga, perhatikan hal-hal berikut ini:</p>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">1</span>
              </span>
              <span>Jika ingin identitas Anda tetap rahasia, <strong className="text-foreground">jangan memberitahukan/mengisikan data-data pribadi</strong>, seperti nama Anda, atau hubungan Anda dengan pelaku-pelaku.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">2</span>
              </span>
              <span><strong className="text-foreground">Jangan memberitahukan/mengisikan</strong> data-data/informasi yang memungkinkan bagi orang lain untuk melakukan pelacakan siapa Anda.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">3</span>
              </span>
              <span><strong className="text-foreground">Hindari orang lain mengetahui</strong> email, kata sandi (password) serta Nomor Registrasi Anda.</span>
            </li>
          </ul>
        </div>
      </div>
    )
  },
  'unsur': {
    title: 'Unsur Pengaduan',
    content: (
      <div className="space-y-4 text-muted-foreground">
        <p>
          Pengaduan Anda akan mudah ditindaklanjuti apabila memenuhi unsur sebagai berikut:
        </p>
        
        <div className="grid gap-3 mt-4">
          <div className="bg-gradient-to-r from-red-50 to-red-100/50 rounded-lg p-4 border border-red-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-xl font-bold text-primary">W</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">What</p>
                <p className="text-sm">Perbuatan berindikasi pelanggaran yang diketahui.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-lg p-4 border border-orange-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-xl font-bold text-orange-500">W</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">Where</p>
                <p className="text-sm">Dimana perbuatan tersebut dilakukan.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100/50 rounded-lg p-4 border border-yellow-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-xl font-bold text-yellow-600">W</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">When</p>
                <p className="text-sm">Kapan perbuatan tersebut dilakukan.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100/50 rounded-lg p-4 border border-green-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-xl font-bold text-green-600">W</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">Who</p>
                <p className="text-sm">Siapa saja yang terlibat dalam perbuatan tersebut.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-xl font-bold text-blue-600">H</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">How</p>
                <p className="text-sm">Bagaimana perbuatan tersebut dilakukan (modus, cara, dsb.).</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [activeDialog, setActiveDialog] = useState(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const openDialog = (key) => {
    setActiveDialog(key)
    setDropdownOpen(false)
    setMobileMenuOpen(false)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
    setUserMenuOpen(false)
    setMobileMenuOpen(false)
  }

  // Close dropdown when clicking outside using useEffect
  const navRef = useRef(null)
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setDropdownOpen(false)
        setUserMenuOpen(false)
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <>
      <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Logo - Left */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img 
                src="/logo.png" 
                alt="WBS Logo" 
                className="h-10 lg:h-14 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation + Auth - All on Right */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Nav Links */}
              {navLinks.map((link) => (
                <div key={link.name} className="relative">
                  {link.dropdown ? (
                    <div className="relative dropdown-container">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          setDropdownOpen(!dropdownOpen)
                        }}
                        className="flex items-center gap-1.5 px-5 py-2.5 text-base font-medium text-foreground/80 hover:text-foreground transition-colors rounded-lg hover:bg-accent"
                      >
                        {link.name}
                        <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", dropdownOpen && "rotate-180")} />
                      </button>
                      
                      {dropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-border py-2 animate-in fade-in zoom-in-95">
                          {link.dropdown.map((item) => (
                            <button
                              key={item.key}
                              onClick={() => openDialog(item.key)}
                              className="flex items-center gap-3 w-full px-5 py-3 text-base text-foreground/80 hover:text-foreground hover:bg-accent transition-colors text-left"
                            >
                              <item.icon className="w-4 h-4 text-primary" />
                              {item.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={link.href}
                      className="px-5 py-2.5 text-base font-medium text-foreground/80 hover:text-foreground transition-colors rounded-lg hover:bg-accent"
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}

              {/* Separator */}
              <div className="w-px h-8 bg-border mx-2" />

              {/* Auth Buttons */}
              {isAuthenticated ? (
                <div className="relative user-menu-container">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setUserMenuOpen(!userMenuOpen)
                    }}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-foreground">{user?.name}</span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform", userMenuOpen && "rotate-180")} />
                  </button>
                  
                  {userMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-border py-2 animate-in fade-in zoom-in-95">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="font-medium text-foreground">{user?.name}</p>
                        <p className="text-sm text-muted-foreground">{user?.email || user?.username}</p>
                      </div>
                      <Link
                        to={['Admin', 'Pimpinan', 'Staf'].includes(user?.role) ? '/dashboard' : '/my-reports'}
                        className="flex items-center gap-3 px-4 py-3 text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Keluar
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/register">
                    <Button variant="ghost" className="text-base px-5 py-2.5 h-auto">Daftar</Button>
                  </Link>
                  <Link to="/login">
                    <Button className="text-base px-6 py-2.5 h-auto shadow-lg shadow-primary/20">Masuk</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="lg:hidden p-3 rounded-xl text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-border shadow-lg animate-in slide-in-from-top">
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.dropdown ? (
                    <div>
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center justify-between w-full px-5 py-4 text-lg font-medium text-foreground/80 hover:text-foreground hover:bg-accent rounded-xl transition-colors"
                      >
                        {link.name}
                        <ChevronDown className={cn("w-5 h-5 transition-transform duration-200", dropdownOpen && "rotate-180")} />
                      </button>
                      {dropdownOpen && (
                        <div className="ml-4 mt-2 space-y-1 border-l-2 border-primary/20 pl-4">
                          {link.dropdown.map((item) => (
                            <button
                              key={item.key}
                              onClick={() => openDialog(item.key)}
                              className="flex items-center gap-3 w-full px-4 py-3 text-base text-foreground/70 hover:text-foreground hover:bg-accent rounded-lg transition-colors text-left"
                            >
                              <item.icon className="w-4 h-4 text-primary" />
                              {item.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={link.href}
                      className="block px-5 py-4 text-lg font-medium text-foreground/80 hover:text-foreground hover:bg-accent rounded-xl transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
              
              <div className="pt-6 mt-4 border-t border-border space-y-3">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 bg-muted/50 rounded-xl">
                      <p className="font-medium text-foreground">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">{user?.email || user?.username}</p>
                    </div>
                    <Link
                      to={['Admin', 'Pimpinan', 'Staf'].includes(user?.role) ? '/dashboard' : '/my-reports'}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block"
                    >
                      <Button variant="outline" className="w-full text-lg py-4 h-auto">Dashboard</Button>
                    </Link>
                    <Button
                      variant="destructive"
                      className="w-full text-lg py-4 h-auto"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Keluar
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block">
                      <Button variant="outline" className="w-full text-lg py-4 h-auto">Daftar</Button>
                    </Link>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block">
                      <Button className="w-full text-lg py-4 h-auto shadow-lg shadow-primary/20">Masuk</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Dialogs */}
      {Object.keys(dialogContent).map((key) => (
        <Dialog key={key} open={activeDialog === key} onOpenChange={() => setActiveDialog(null)}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">{dialogContent[key].title}</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {dialogContent[key].content}
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </>
  )
}
