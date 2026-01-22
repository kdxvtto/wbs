import { Link } from 'react-router-dom'
import { Shield, FileText, User, RefreshCw, ArrowRight } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: Shield,
    title: 'Identitas Dirahasiakan',
    description: 'Tidak perlu khawatir data identitas pelapor aman dan terlindungi.',
  },
  {
    icon: FileText,
    title: 'Unsur Pengaduan',
    description: 'Pengaduan Anda akan mudah ditindaklanjuti apabila memenuhi unsur What, Where, When, Who, How.',
    link: { text: 'Baca Disini', href: '/cara-melapor' },
  },
  {
    icon: User,
    title: 'Akun Pelapor',
    description: 'Whistleblower dapat melakukan login pada aplikasi WBS sesuai dengan user & password yang telah dibuat.',
  },
  {
    icon: RefreshCw,
    title: 'Realtime Update',
    description: 'Anda dapat memantau laporan secara realtime melalui akun masing-masing pelapor.',
  },
]

function FeatureCard({ feature, index }) {
  const { ref, isVisible } = useScrollAnimation()
  const Icon = feature.icon

  return (
    <div 
      ref={ref}
      className={cn(
        "group p-8 bg-white rounded-2xl border border-border shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-500 hover:-translate-y-2",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <h3 className="font-bold text-xl text-foreground mb-3">{feature.title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {feature.description}
      </p>
      {feature.link && (
        <Link to={feature.link.href} className="inline-flex items-center text-primary font-medium hover:underline group/link mt-3">
          {feature.link.text}
          <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-1" />
        </Link>
      )}
    </div>
  )
}

export function Features() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation()

  return (
    <section className="relative py-24 lg:py-32 bg-gradient-to-br from-red-50/80 via-rose-50/50 to-red-50/60 overflow-hidden">
      {/* Wave Top - soft red */}
      <div className="absolute -top-1 left-0 right-0 overflow-hidden">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 lg:h-20" preserveAspectRatio="none">
          <path d="M0 80V40C240 70 480 20 720 40C960 60 1200 30 1440 50V80H0Z" fill="#fee2e2"/>
        </svg>
      </div>

      {/* Wave Bottom - soft red */}
      <div className="absolute -bottom-1 left-0 right-0 overflow-hidden">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 lg:h-20" preserveAspectRatio="none">
          <path d="M0 0V40C240 10 480 60 720 40C960 20 1200 50 1440 30V0H0Z" fill="#fee2e2"/>
        </svg>
      </div>

      {/* Decorative blurs */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-red-200/20 rounded-full blur-3xl -translate-x-1/2" />
      <div className="absolute bottom-20 right-0 w-80 h-80 bg-rose-200/30 rounded-full blur-3xl translate-x-1/2" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div 
          ref={titleRef}
          className={cn(
            "text-center mb-16 transition-all duration-700",
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Mengapa Menggunakan <span className="text-primary">WBS?</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sistem kami dirancang untuk memberikan kemudahan dan keamanan dalam melaporkan dugaan pelanggaran
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
