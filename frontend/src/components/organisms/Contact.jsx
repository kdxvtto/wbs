import { useState } from 'react'
import { Button, Input, Label } from '@/components/atoms'
import { Card, CardContent } from '@/components/molecules'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/lib/utils'
import { Phone, Send } from 'lucide-react'

export function Contact() {
  const { ref: leftRef, isVisible: leftVisible } = useScrollAnimation()
  const { ref: rightRef, isVisible: rightVisible } = useScrollAnimation()
  
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    message: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    alert('Pesan berhasil dikirim!')
    setFormData({ name: '', surname: '', email: '', message: '' })
  }

  return (
    <section className="relative py-16 lg:py-24 bg-gradient-to-br from-red-50/80 via-rose-50/50 to-red-50/60 overflow-hidden">
      {/* Wave Top */}
      <div className="absolute -top-1 left-0 right-0 overflow-hidden">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 lg:h-20" preserveAspectRatio="none">
          <path d="M0 80V40C240 70 480 20 720 40C960 60 1200 30 1440 50V80H0Z" fill="#fee2e2"/>
        </svg>
      </div>

      {/* Wave Bottom */}
      <div className="absolute -bottom-1 left-0 right-0 overflow-hidden">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 lg:h-20" preserveAspectRatio="none">
          <path d="M0 0V40C240 10 480 60 720 40C960 20 1200 50 1440 30V0H0Z" fill="#fee2e2"/>
        </svg>
      </div>

      {/* Decorative blurs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-red-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-rose-200/20 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side - Info */}
          <div 
            ref={leftRef}
            className={cn(
              "transition-all duration-700",
              leftVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            )}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              <span className="text-primary">Whistleblowing</span> System
            </h2>
            
            <p className="text-muted-foreground leading-relaxed mb-6">
              WBS BANK WONOGIRI adalah aplikasi yang disediakan oleh PT. BPR BANK WONOGIRI (Perseroda) untuk melaporkan suatu perbuatan berindikasi pelanggaran yang terjadi di lingkungan BANK WONOGIRI.
            </p>
            
            <p className="text-muted-foreground leading-relaxed mb-6">
              Anda tidak perlu khawatir terungkapnya identitas diri anda karena Kami akan{' '}
              <span className="font-semibold text-foreground">MERAHASIAKAN IDENTITAS DIRI ANDA</span>{' '}
              sebagai whistleblower. BANK WONOGIRI menghargai informasi yang Anda laporkan. Fokus kami kepada materi informasi yang Anda Laporkan.
            </p>

            <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">For any enquiry, Call Us:</p>
                <p className="font-bold text-xl text-foreground">(0273) 324044</p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div 
            ref={rightRef}
            className={cn(
              "transition-all duration-700",
              rightVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            )}
          >
            <Card className="shadow-xl border-0 bg-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6">Hubungi Kami</h3>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Nama depan"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="surname">Surname</Label>
                      <Input
                        id="surname"
                        name="surname"
                        placeholder="Nama belakang"
                        value={formData.surname}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Tulis pesan Anda..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    />
                  </div>

                  <Button type="submit" className="w-full py-6 text-base group">
                    Send Message
                    <Send className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </section>
  )
}
