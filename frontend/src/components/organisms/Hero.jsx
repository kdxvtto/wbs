/**
 * =====================================================
 * HERO SECTION - BAGIAN UTAMA HALAMAN HOME
 * =====================================================
 * 
 * Hero section adalah bagian pertama yang dilihat pengunjung.
 * Biasanya berisi:
 * - Headline utama (judul besar)
 * - Deskripsi singkat
 * - Call-to-Action (CTA) buttons
 * - Visual menarik (background, animasi)
 * 
 * KOMPONEN INI MENAMPILKAN:
 * - Definisi Whistleblowing System
 * - Tombol "Buat Laporan" → register
 * - Tombol "Pelajari Cara Melapor" → buka popup dialog
 * 
 * TEKNIK YANG DIGUNAKAN:
 * - Dialog/Modal untuk popup
 * - CSS animations untuk efek menarik
 * - Responsive design (sm, lg breakpoints)
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/atoms'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/organisms'
import { ArrowRight } from 'lucide-react'

/**
 * HERO COMPONENT
 * 
 * Tidak menerima props karena kontennya static.
 * Hanya mengelola state untuk dialog popup.
 */
export function Hero() {
  /**
   * STATE UNTUK DIALOG
   * 
   * dialogOpen: boolean yang mengontrol apakah popup terbuka
   * - true = popup tampil
   * - false = popup tersembunyi
   */
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    /**
     * FRAGMENT (<> </>)
     * 
     * Digunakan untuk membungkus multiple elements tanpa
     * menambah DOM node tambahan.
     * 
     * Kita butuh ini karena return harus 1 element,
     * tapi kita punya section DAN dialog.
     */
    <>
      {/* =====================================================
          MAIN HERO SECTION
          
          CSS CLASSES EXPLAINED:
          - min-h-screen: minimal setinggi viewport (100vh)
          - flex items-center justify-center: center konten
          - overflow-hidden: sembunyikan elemen yang keluar batas
          - pt-20: padding-top untuk navbar
      ===================================================== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        
        {/* =====================================================
            BACKGROUND GRADIENT
            
            Gradien halus dari primary/5 ke background ke secondary/20
            - from/via/to = arah gradient
            - /5, /20 = opacity (5%, 20%)
        ===================================================== */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/20" />
        
        {/* =====================================================
            DECORATIVE ELEMENTS
            
            Blob berwarna yang di-blur untuk efek "glassmorphism"
            - rounded-full: lingkaran
            - blur-3xl: blur sangat besar
            - animate-pulse: animasi berkedip
            - animationDelay: delay berbeda untuk variasi
        ===================================================== */}
        <div className="absolute top-32 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* =====================================================
            GRID PATTERN
            
            Pattern grid tipis untuk tekstur background
            Menggunakan CSS linear-gradient
        ===================================================== */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* =====================================================
            MAIN CONTENT
            
            z-10: pastikan konten di atas background decorations
            Container dengan max-width dan padding responsive
        ===================================================== */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            
            {/* SUBTITLE - Nama perusahaan */}
            <h3 className="text-primary font-semibold text-lg sm:text-xl mb-4 tracking-wide animate-fade-in-up">
              PT BPR BANK WONOGIRI (Perseroda)
            </h3>

            {/* =====================================================
                MAIN HEADING
                
                Responsive font sizes:
                - text-4xl (mobile)
                - sm:text-5xl (≥640px)
                - lg:text-6xl (≥1024px)
                
                GRADIENT TEXT:
                - text-transparent: buat teks transparan
                - bg-clip-text: clip background ke bentuk teks
                - bg-gradient-to-r: gradient horizontal
            ===================================================== */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-8 animate-fade-in-up animation-delay-100">
              Definisi{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                WHISTLEBLOWING SYSTEM
              </span>
            </h1>

            {/* DESCRIPTION */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up animation-delay-200">
              Mekanisme penyampaian pengaduan dugaan tindak pidana tertentu yang telah terjadi 
              atau akan terjadi yang melibatkan pegawai dan orang lain yang dilakukan dalam 
              organisasi tempatnya bekerja, dimana pelapor bukan merupakan bagian dari pelaku 
              kejahatan yang dilaporkannya.
            </p>

            {/* =====================================================
                CTA (CALL-TO-ACTION) BUTTONS
                
                Dua tombol:
                1. "Buat Laporan" → Link ke /register (primary button)
                2. "Pelajari Cara Melapor" → buka dialog (outline button)
                
                HOVER EFFECTS:
                - hover:-translate-y-1: naik 4px saat hover
                - group-hover:translate-x-1: arrow geser kanan
            ===================================================== */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-300">
              
              {/* Primary CTA - Link ke register */}
              <Link to="/register">
                <Button size="lg" className="group px-8 py-6 text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-1">
                  Buat Laporan
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              
              {/* Secondary CTA - Buka dialog */}
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-6 text-base hover:-translate-y-1 transition-all duration-300"
                onClick={() => setDialogOpen(true)}  // Buka dialog
              >
                Pelajari Cara Melapor
              </Button>
            </div>

          </div>
        </div>

        {/* =====================================================
            SCROLL INDICATOR
            
            Mouse icon yang bounce untuk indikasi "scroll down"
            Posisi absolute di bottom center
        ===================================================== */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full animate-scroll-down" />
          </div>
        </div>
      </section>

      {/* =====================================================
          CARA MELAPOR DIALOG (POPUP)
          
          Dialog dari Radix UI (via shadcn/ui)
          
          Props:
          - open: kontrol apakah dialog terbuka
          - onOpenChange: callback saat status berubah (close action)
          
          KEUNTUNGAN DIALOG vs PAGE:
          - User tidak meninggalkan halaman
          - Loading lebih cepat
          - Experience lebih smooth
      ===================================================== */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Cara Melapor</DialogTitle>
          </DialogHeader>
          
          {/* KONTEN CARA MELAPOR - Step by step */}
          <div className="mt-4 space-y-4 text-muted-foreground">
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
              
              {/* ALERT BOX - Peringatan penting */}
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
        </DialogContent>
      </Dialog>
    </>
  )
}
