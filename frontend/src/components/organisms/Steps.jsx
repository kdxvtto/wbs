import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/lib/utils'

const steps = [
  {
    number: 1,
    title: 'Kelengkapan Pengaduan',
    description: 'Sebelum melaporkan, pastikan kelengkapan pengaduan anda apakah telah sesuai.',
  },
  {
    number: 2,
    title: 'Isi Formulir Pengaduan',
    description: 'Lanjutkan dengan mengisi formulir pengaduan yang telah disediakan dan lanjutkan dengan menekan tombol "Kirim Pengaduan".',
  },
  {
    number: 3,
    title: 'Dapatkan ID Formulir',
    description: 'Setelah mengirim pengaduan, Anda akan mendapatkan ID formulir yang dapat anda sebutkan kepada kami saat menghubungi diluar WBS.',
  },
  {
    number: 4,
    title: 'Pantau Pengaduan',
    description: 'Anda dapat memantau pengaduan yang pernah dikirim, membuat pengaduan baru secara pribadi melalui halaman khusus pelapor.',
  },
]

function StepCard({ step, index }) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <div 
      ref={ref}
      className={cn(
        "group flex gap-6 p-6 rounded-2xl hover:bg-secondary/30 transition-all duration-500",
        isVisible ? "opacity-100 translate-x-0" : index % 2 === 0 ? "opacity-0 -translate-x-10" : "opacity-0 translate-x-10"
      )}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="flex-shrink-0">
        <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-300">
          {step.number}
        </div>
      </div>
      <div>
        <h3 className="font-bold text-lg text-foreground mb-2">{step.title}</h3>
        <p className="text-muted-foreground leading-relaxed">
          {step.description}
        </p>
      </div>
    </div>
  )
}

export function Steps() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation()

  return (
    <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div 
          ref={titleRef}
          className={cn(
            "text-center mb-16 transition-all duration-700",
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Tata Cara Pengaduan melalui <span className="text-primary">Whistleblowing System</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
