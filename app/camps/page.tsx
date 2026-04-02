import Link from 'next/link'
import type { Metadata } from 'next'
import { CampsPageTracking } from '@/components/Analytics'

export const metadata: Metadata = {
  title: 'Upcoming Camps - Phuket Nature Camp | Bamboo Valley',
  description: 'Register for our nature camps in Phuket: Songkran Camp Apr 2026, Summer Camp Jun-Aug 2026. Ages 3-10.',
  openGraph: {
    title: 'Upcoming Nature Camps in Phuket',
    description: 'Songkran & Summer camps for children ages 3-10. Organic meals, field trips, animal care, gardening, yoga.',
    url: 'https://phuketcamp.com/camps',
  }
}

export default function CampsPage() {
  return (
    <div style={{minHeight: '100vh', background: '#f8f9fa'}}>
      <CampsPageTracking />
      {/* Upcoming Camps */}
      <section data-track-section="camps-list" style={{padding: '40px 20px 60px', backgroundImage: 'url(/backgrounds/5F1B0766-367A-4892-8D9E-D9006FBB64EB.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', minHeight: '100vh'}}>
        <div style={{position: 'absolute', inset: 0, background: 'rgba(255, 255, 255, 0.85)'}}></div>
        <div style={{position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto'}}>
          {/* Large centered logo */}
          <div style={{display: 'flex', justifyContent: 'center', marginBottom: '30px'}}>
            <Link href="/">
              <img src="/Logo with text.png" alt="Bamboo Valley Phuket Nature Camps" style={{height: '200px'}} />
            </Link>
          </div>

          <h1 style={{fontSize: '2.5rem', fontWeight: 800, textAlign: 'center', color: '#333', marginBottom: '10px'}}>Upcoming Camps</h1>
          <p style={{textAlign: 'center', color: '#666', fontSize: '1.1rem', marginBottom: '40px'}}>Join us for nature-based learning adventures</p>

          <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
            {/* Songkran Camp */}
            <div data-camp="songkran-2026" style={{background: 'linear-gradient(135deg, #fff5e8 0%, #ffe8d0 100%)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap'}}>
              <div style={{fontSize: '3rem'}}>💦</div>
              <div style={{flex: 1, minWidth: '200px'}}>
                <h3 style={{color: '#e67e22', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 8px 0'}}>Easter/Songkran Nature Camp</h3>
                <div style={{color: '#e67e22', fontSize: '0.95rem', lineHeight: 1.6}}>
                  Apr 6-17, 2026<br/>
                  Ages 3-6: 13,000฿/week • Ages 6+: 15,000฿/week
                </div>
              </div>
              <Link href="/register?camp=songkran-2026" style={{background: '#7a9a3b', color: 'white', padding: '12px 28px', borderRadius: '25px', textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap'}}>Register</Link>
            </div>

            {/* Summer Camp */}
            <div data-camp="summer-2026" style={{background: 'linear-gradient(135deg, #e8fff0 0%, #d0ffe8 100%)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap'}}>
              <div style={{fontSize: '3rem'}}>☀️</div>
              <div style={{flex: 1, minWidth: '200px'}}>
                <h3 style={{color: '#27ae60', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 8px 0'}}>Summer Nature Camp</h3>
                <div style={{color: '#27ae60', fontSize: '0.95rem', lineHeight: 1.6}}>
                  Jun 29 - Aug 14, 2026<br/>
                  Ages 3-6: 13,000฿/week • Ages 6+: 15,000฿/week
                </div>
              </div>
              <Link href="/register?camp=summer-2026" style={{background: '#7a9a3b', color: 'white', padding: '12px 28px', borderRadius: '25px', textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap'}}>Register</Link>
            </div>

            {/* Toddler Class - Separator */}
            <div style={{textAlign: 'center', margin: '20px 0 10px', color: '#666', fontSize: '0.9rem'}}>
              ─── Weekly Classes ───
            </div>

            {/* Parent & Toddler Class */}
            <div data-camp="toddler-class" style={{background: 'linear-gradient(135deg, #f5e6ff 0%, #ead6ff 100%)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap'}}>
              <div style={{fontSize: '3rem'}}>👶</div>
              <div style={{flex: 1, minWidth: '200px'}}>
                <h3 style={{color: '#8b5cf6', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 8px 0'}}>Parent & Toddler Class</h3>
                <div style={{color: '#8b5cf6', fontSize: '0.95rem', lineHeight: 1.6}}>
                  Every Tuesday & Thursday, 10-11 AM<br/>
                  Ages 1-3 years (parent attends with child)<br/>
                  <span style={{fontSize: '0.85em', opacity: 0.8}}>500฿ per session • 5,000฿ for 10+2 bundle</span>
                </div>
              </div>
              <Link href="/register/toddler" style={{background: '#8b5cf6', color: 'white', padding: '12px 28px', borderRadius: '25px', textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap'}}>Register</Link>
            </div>
          </div>

          {/* Contact info */}
          <div style={{textAlign: 'center', marginTop: '50px', padding: '30px', background: 'rgba(255,255,255,0.9)', borderRadius: '16px'}}>
            <p style={{color: '#666', marginBottom: '15px'}}>Questions? Contact us:</p>
            <div style={{display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap'}}>
              <a href="https://wa.me/66989124218" style={{color: '#25D366', fontWeight: 600, textDecoration: 'none'}}>WhatsApp: +66 98 912 4218</a>
              <a href="mailto:info@bamboovalleyphuket.com" style={{color: '#7a9a3b', fontWeight: 600, textDecoration: 'none'}}>info@bamboovalleyphuket.com</a>
            </div>
          </div>

          {/* Back to home */}
          <div style={{textAlign: 'center', marginTop: '30px'}}>
            <Link href="/" style={{color: '#7a9a3b', textDecoration: 'none', fontWeight: 600}}>← Back to Home</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
