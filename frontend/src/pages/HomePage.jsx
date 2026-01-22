import { Navbar } from '@/components/organisms/Navbar'
import { Hero } from '@/components/organisms/Hero'
import { Features } from '@/components/organisms/Features'
import { Steps } from '@/components/organisms/Steps'
import { Contact } from '@/components/organisms/Contact'
import { Footer } from '@/components/organisms/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Steps />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
