import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import './home.css'
import type { Metadata } from 'next'
import HeroVideo from '@/components/HeroVideo'
import { HomePageTracking } from '@/components/Analytics'

export const metadata: Metadata = {
  title: 'Phuket Nature Camp - Winter, Songkran & Summer Camps 2026 | Bamboo Valley',
  description: 'Science-backed outdoor camp in Phuket building immunity, confidence, and life skills through nature. Winter Jan-Mar, Songkran Apr 6-10, Summer Jun-Aug 2026. Ages 3-10. Organic meals, field trips, animal care, gardening, yoga.',
  keywords: 'phuket camp, nature camp phuket, winter camp phuket, easter camp phuket, songkran camp phuket, summer camp phuket, kids activities phuket, outdoor education phuket, bamboo valley phuket, phuket kids camp, waldorf phuket',
  openGraph: {
    title: 'Phuket Nature Camp - Nature Skills for Life',
    description: 'Outdoor camps with animal care, gardening, yoga, field trips. Ages 3-10. Licensed English teachers. Winter & Summer programs available.',
    images: [{
      url: 'https://phuketcamp.com/images/Confidence.jpeg',
      width: 1200,
      height: 630,
      alt: 'Children learning in nature at Bamboo Valley Phuket Camp',
    }],
    locale: 'en_US',
    type: 'website',
    url: 'https://phuketcamp.com',
    siteName: 'Bamboo Valley Phuket Nature Camps',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phuket Nature Camp - Nature Skills for Life',
    description: 'Science-backed outdoor program building immunity, confidence, and life skills',
    images: ['https://phuketcamp.com/images/Confidence.jpeg'],
    creator: '@bamboovalleyphuket',
    site: '@bamboovalleyphuket',
  },
  alternates: {
    canonical: 'https://phuketcamp.com'
  }
}

export default function Home() {
  return (
    <div>
      <HomePageTracking />
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ChildCare",
            "name": "Bamboo Valley Phuket Nature Camps",
            "description": "Science-backed outdoor camp program building immunity, confidence, and life skills through nature-based learning",
            "url": "https://phuketcamp.com",
            "telephone": "+66989124218",
            "email": "info@bamboovalleyphuket.com",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Phuket",
              "addressRegion": "Phuket",
              "addressCountry": "TH"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "7.8804",
              "longitude": "98.3923"
            },
            "priceRange": "฿฿",
            "offers": [
              {
                "@type": "Offer",
                "name": "Winter Nature Camp - Mini Camp (Ages 3-6)",
                "price": "11000",
                "priceCurrency": "THB",
                "availability": "https://schema.org/InStock",
                "validFrom": "2026-01-19",
                "validThrough": "2026-03-06"
              },
              {
                "@type": "Offer",
                "name": "Winter Nature Camp - Maxi Camp (Ages 6-10)",
                "price": "13000",
                "priceCurrency": "THB",
                "availability": "https://schema.org/InStock",
                "validFrom": "2026-01-19",
                "validThrough": "2026-03-06"
              },
              {
                "@type": "Offer",
                "name": "Easter/Songkran Nature Camp - Mini Camp (Ages 3-6)",
                "price": "11000",
                "priceCurrency": "THB",
                "availability": "https://schema.org/InStock",
                "validFrom": "2026-04-06",
                "validThrough": "2026-04-10",
                "description": "Full day camp 8AM-5PM during Songkran festival"
              },
              {
                "@type": "Offer",
                "name": "Easter/Songkran Nature Camp - Maxi Camp (Ages 6-10)",
                "price": "13000",
                "priceCurrency": "THB",
                "availability": "https://schema.org/InStock",
                "validFrom": "2026-04-06",
                "validThrough": "2026-04-10"
              },
              {
                "@type": "Offer",
                "name": "Summer Nature Camp - Mini Camp (Ages 3-6)",
                "price": "11000",
                "priceCurrency": "THB",
                "availability": "https://schema.org/InStock",
                "validFrom": "2026-06-29",
                "validThrough": "2026-08-14",
                "description": "7-week summer program with organic meals and nature activities"
              },
              {
                "@type": "Offer",
                "name": "Summer Nature Camp - Maxi Camp (Ages 6-10)",
                "price": "13000",
                "priceCurrency": "THB",
                "availability": "https://schema.org/InStock",
                "validFrom": "2026-06-29",
                "validThrough": "2026-08-14"
              }
            ],
            "image": "https://phuketcamp.com/images/Confidence.jpeg",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5.0",
              "reviewCount": "12"
            },
            "amenityFeature": [
              { "@type": "LocationFeatureSpecification", "name": "Organic meals included" },
              { "@type": "LocationFeatureSpecification", "name": "Licensed native English teachers" },
              { "@type": "LocationFeatureSpecification", "name": "Outdoor nature-based activities" },
              { "@type": "LocationFeatureSpecification", "name": "Animal care program" },
              { "@type": "LocationFeatureSpecification", "name": "Field trips and excursions" }
            ],
            "sameAs": [
              "https://www.instagram.com/bamboovalleyphuket/",
              "https://bamboovalleyphuket.com"
            ]
          })
        }}
      />

      {/* Hero Section with Video */}
      <section className="hero" data-track-section="hero">
        <HeroVideo />
        <img src="/Logo with text.png" alt="Bamboo Valley Phuket Nature Camps Logo" className="hero-logo" />
        <div className="hero-content">
          <div className="hero-header">Phuket Nature Camp</div>
          <h1>Nature Skills for Life</h1>
          <p className="hero-description">Science-backed outdoor program building immunity, confidence, and life skills:</p>
          <ul className="bullet-list">
            <li>Animal care</li>
            <li>Gardening</li>
            <li>Baking</li>
            <li>Yoga</li>
            <li>Music</li>
            <li>Meditation</li>
            <li>Arts & crafts</li>
          </ul>
          <a
            href="https://wa.me/66989124218?text=Hi!%20I%27m%20interested%20in%20the%20Phuket%20Nature%20Camp."
            className="cta-button"
            style={{display: 'inline-flex', alignItems: 'center', gap: '12px'}}
          >
            <MessageCircle size={24} />
            WhatsApp: +66 98 912 4218
          </a>
        </div>
      </section>

      {/* Upcoming Camps */}
      <section data-track-section="upcoming-camps" style={{padding: '80px 20px', backgroundImage: 'url(/backgrounds/5F1B0766-367A-4892-8D9E-D9006FBB64EB.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative'}}>
        <div style={{position: 'absolute', inset: 0, background: 'rgba(255, 255, 255, 0.85)'}}></div>
        <div style={{position: 'relative', zIndex: 1}}>
          <h2 className="section-title">Upcoming Camps</h2>
          <p className="section-subtitle">Join us for nature-based learning adventures</p>

          <div className="camp-list">
            <div className="cute-item" style={{background: 'linear-gradient(135deg, #e8f3ff 0%, #d8ebff 100%)'}}>
              <div className="cute-emoji">❄️</div>
              <div className="cute-content">
                <h3 style={{color: '#4a90d9'}}>Winter Nature Camp</h3>
                <div className="cute-meta" style={{color: '#4a90d9'}}>
                  Jan 19 - Mar 6, 2026<br/>
                  Ages 3-6: 11,000฿ / 13,000฿ • Ages 6+: 13,000฿ / 15,000฿<br/>
                  <span style={{fontSize: '0.85em', opacity: 0.8}}>Early bird pricing (first price) available until Nov 15</span>
                </div>
              </div>
              <Link href="/register?camp=winter-2026" className="cta-button" style={{display: 'inline-block'}}>Register</Link>
            </div>

            <div className="cute-item" style={{background: 'linear-gradient(135deg, #fff5e8 0%, #ffe8d0 100%)'}}>
              <div className="cute-emoji">💦</div>
              <div className="cute-content">
                <h3 style={{color: '#e67e22'}}>Easter/Songkran Nature Camp</h3>
                <div className="cute-meta" style={{color: '#e67e22'}}>
                  Apr 6-10, 2026<br/>
                  Ages 3-6: 11,000฿ / 13,000฿ • Ages 6+: 13,000฿ / 15,000฿<br/>
                  <span style={{fontSize: '0.85em', opacity: 0.8}}>Early bird pricing (first price) available until Mar 9</span>
                </div>
              </div>
              <Link href="/register?camp=songkran-2026" className="cta-button" style={{display: 'inline-block'}}>Register</Link>
            </div>

            <div className="cute-item" style={{background: 'linear-gradient(135deg, #e8fff0 0%, #d0ffe8 100%)'}}>
              <div className="cute-emoji">☀️</div>
              <div className="cute-content">
                <h3 style={{color: '#27ae60'}}>Summer Nature Camp</h3>
                <div className="cute-meta" style={{color: '#27ae60'}}>
                  Jun 29 - Aug 14, 2026<br/>
                  Ages 3-6: 11,000฿ / 13,000฿ • Ages 6+: 13,000฿ / 15,000฿<br/>
                  <span style={{fontSize: '0.85em', opacity: 0.8}}>Early bird pricing (first price) available until May 25</span>
                </div>
              </div>
              <Link href="/register?camp=summer-2026" className="cta-button" style={{display: 'inline-block'}}>Register</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Watch Them Grow Section */}
      <section data-track-section="watch-them-grow" style={{padding: '80px 20px', backgroundImage: 'url(/backgrounds/BF210057-87F6-4A30-8F69-5FE03B3203F4.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative'}}>
        <div style={{position: 'absolute', inset: 0, background: 'rgba(255, 255, 255, 0.85)'}}></div>
        <div style={{position: 'relative', zIndex: 1}}>
          <h2 className="section-title">Watch Them Grow</h2>
          <p style={{textAlign: 'center', maxWidth: '900px', margin: '0 auto 50px', fontSize: '1.1rem', color: '#666', lineHeight: 1.7}}>
            Our program integrates proven methods from the UK Scouts and Finnish nature research
          </p>
          <div style={{maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px'}}>
            <div style={{position: 'relative', height: '400px', backgroundImage: 'url(/images/Confidence.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '15px', overflow: 'hidden'}}>
              <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(122, 154, 59, 0.95), rgba(122, 154, 59, 0.7))', padding: '30px', color: 'white'}}>
                <h3 style={{fontSize: '1.8rem', marginBottom: '10px', fontWeight: 700}}>Confidence</h3>
                <p style={{fontSize: '1rem', lineHeight: 1.5}}>Trying new things, speaking up, taking on challenges</p>
              </div>
            </div>
            <div style={{position: 'relative', height: '400px', backgroundImage: 'url(/images/TeamWork.JPG)', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '15px', overflow: 'hidden'}}>
              <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(122, 154, 59, 0.95), rgba(122, 154, 59, 0.7))', padding: '30px', color: 'white'}}>
                <h3 style={{fontSize: '1.8rem', marginBottom: '10px', fontWeight: 700}}>Teamwork</h3>
                <p style={{fontSize: '1rem', lineHeight: 1.5}}>Helping friends, working together, sharing discoveries</p>
              </div>
            </div>
            <div style={{position: 'relative', height: '400px', backgroundImage: 'url(/images/IMG_0829.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '15px', overflow: 'hidden'}}>
              <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(122, 154, 59, 0.95), rgba(122, 154, 59, 0.7))', padding: '30px', color: 'white'}}>
                <h3 style={{fontSize: '1.8rem', marginBottom: '10px', fontWeight: 700}}>Strong Immunity</h3>
                <p style={{fontSize: '1rem', lineHeight: 1.5}}>Forest play builds immunity and reduces autoimmune disorders</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Choose Your Program */}
      <section id="programs" data-track-section="choose-program" style={{padding: '100px 20px', backgroundImage: 'url(/backgrounds/EBA7D34E-A638-4BB2-B685-E9A33A5AE49D.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative'}}>
        <div style={{position: 'absolute', inset: 0, background: 'rgba(255, 255, 255, 0.88)'}}></div>
        <div style={{position: 'relative', zIndex: 1}}>
          <h2 style={{fontSize: '3rem', fontWeight: 800, marginBottom: '20px', textAlign: 'center', color: '#333'}}>Choose Your Program</h2>
          <p style={{fontSize: '1.2rem', color: '#666', textAlign: 'center', marginBottom: '60px', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto'}}>Two exciting programs designed for different age groups</p>

          <div className="program-grid">
            {/* Mini Camp Card */}
            <div className="program-card" style={{backgroundImage: 'url(/images/IMG_1205.JPG)'}}>
              <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)'}}></div>
              <div className="program-card-content">
                <h3>Mini Camp</h3>
                <p className="age">Ages 3-6</p>
                <p className="description">On-site nature activities: animal care, gardening, baking, yoga, arts & crafts</p>
                <p className="schedule">Jan 19 - Mar 6, 2026 • 8AM-5PM</p>
                <p className="price">11,000฿/week</p>
                <a href="#register" className="cta-btn">Choose Mini Camp</a>
              </div>
            </div>

            {/* Maxi Camp Card */}
            <div className="program-card" style={{backgroundImage: 'url(/images/IMG_2047.jpeg)', border: '4px solid #7a9a3b'}}>
              <div style={{position: 'absolute', top: '20px', right: '20px', background: 'white', color: '#7a9a3b', padding: '10px 25px', borderRadius: '25px', fontWeight: 700, fontSize: '1rem', zIndex: 10}}>Early Bird</div>
              <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)'}}></div>
              <div className="program-card-content">
                <h3>Maxi Camp</h3>
                <p className="age">Ages 6-10</p>
                <p className="description">Field trips: beach days, elephant sanctuary, marine biology, Muay Thai</p>
                <p className="schedule">Jan 19 - Mar 6, 2026 • 8AM-5PM</p>
                <p className="price">13,000฿/week</p>
                <p className="price-note">Pay by Nov 30 • Regular: 15,000฿</p>
                <a href="#register" className="cta-btn">Choose Maxi Camp</a>
              </div>
            </div>
          </div>

          <p style={{fontSize: '1rem', color: '#999', textAlign: 'center', marginTop: '40px'}}>Both programs include: Organic meals • Licensed native English teachers • All materials</p>
        </div>
      </section>

      {/* Activities Section */}
      <section data-track-section="activities" style={{padding: '80px 20px', backgroundImage: 'url(/backgrounds/77D501D4-63AB-4537-B054-39C17D4AEF33.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative'}}>
        <div style={{position: 'absolute', inset: 0, background: 'rgba(255, 255, 255, 0.82)'}}></div>
        <div style={{position: 'relative', zIndex: 1}}>
          <h2 className="section-title">Daily Activities</h2>
          <div style={{maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px'}}>
            {[
              {img: 'Animal-Care-1.jpg', title: 'Animal Care'},
              {img: 'Outdoor-exploration.JPG', title: 'Nature Exploration'},
              {img: 'Gardening.jpeg', title: 'Gardening'},
              {img: 'Baking.jpeg', title: 'Baking'},
              {img: 'Yoga.JPG', title: 'Yoga & Mindfulness'},
              {img: 'AC50C643-81BD-4E68-BAE3-CBF9EFA67AE7.jpeg', title: 'Arts & Crafts'}
            ].map((activity, i) => (
              <div key={i} style={{position: 'relative', height: '350px', backgroundImage: `url(/images/${activity.img})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '15px', overflow: 'hidden'}}>
                <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(122, 154, 59, 0.95), rgba(122, 154, 59, 0.7))', padding: '25px', color: 'white'}}>
                  <h3 style={{fontSize: '1.5rem', fontWeight: 700}}>{activity.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Field Trips Section */}
      <section data-track-section="field-trips" style={{padding: '80px 20px', backgroundImage: 'url(/backgrounds/94FC350D-D518-4DF6-A2B3-3F74EAE7FD26.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative'}}>
        <div style={{position: 'absolute', inset: 0, background: 'rgba(255, 255, 255, 0.88)'}}></div>
        <div style={{position: 'relative', zIndex: 1}}>
          <h2 className="section-title">Field Trips - Maxi Camp</h2>
          <p style={{textAlign: 'center', fontSize: '1rem', color: '#666', marginBottom: '30px'}}>Twice weekly adventures</p>
          <div style={{display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '50px'}}>
            <div style={{background: 'white', border: '3px solid #7a9a3b', padding: '15px 30px', borderRadius: '30px', display: 'inline-flex', alignItems: 'center', gap: '10px'}}>
              <span style={{fontSize: '1.5rem'}}>🚌</span>
              <div>
                <div style={{fontWeight: 700, color: '#7a9a3b'}}>Field Trips</div>
                <div style={{fontSize: '0.9rem', color: '#666'}}>Every Tuesday</div>
              </div>
            </div>
            <div style={{background: 'white', border: '3px solid #7a9a3b', padding: '15px 30px', borderRadius: '30px', display: 'inline-flex', alignItems: 'center', gap: '10px'}}>
              <span style={{fontSize: '1.5rem'}}>🏖️</span>
              <div>
                <div style={{fontWeight: 700, color: '#7a9a3b'}}>Beach Day</div>
                <div style={{fontSize: '0.9rem', color: '#666'}}>Every Thursday</div>
              </div>
            </div>
          </div>
          <div style={{maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px'}}>
            {[
              {img: 'Beach-Day.jpeg', title: 'Beach Day'},
              {img: 'IMG_2047.jpeg', title: 'Shell Lake'},
              {img: 'Elephant.jpg', title: 'Elephant Sanctuary'},
              {img: 'Pearl.jpg', title: 'Pearl Factory'},
              {img: 'Muay-Thai.jpg', title: 'Muay Thai'},
              {img: 'Rice-Farm.JPG', title: 'Rice Farm'}
            ].map((trip, i) => (
              <div key={i} style={{position: 'relative', height: '350px', backgroundImage: `url(/images/${trip.img})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '15px', overflow: 'hidden'}}>
                <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(122, 154, 59, 0.95), rgba(122, 154, 59, 0.7))', padding: '25px', color: 'white'}}>
                  <h3 style={{fontSize: '1.5rem', fontWeight: 700}}>{trip.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section data-track-section="blog" style={{padding: '80px 20px', background: 'linear-gradient(135deg, #BED7AF 0%, #DCEBE1 100%)'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', textAlign: 'center'}}>
          <h2 style={{fontSize: '2.5rem', fontWeight: 800, marginBottom: '20px', color: '#2c3e2c'}}>Latest from Our Blog</h2>
          <p style={{fontSize: '1.1rem', color: '#5a6a5a', marginBottom: '50px'}}>Research-backed insights on nature education and childhood development</p>

          <div style={{background: 'white', borderRadius: '20px', overflow: 'hidden', textAlign: 'left', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', maxWidth: '800px', margin: '0 auto'}}>
            <div style={{padding: '40px'}}>
              <div style={{marginBottom: '15px'}}>
                <span style={{background: '#f0f7e8', color: '#7a9a3b', padding: '6px 14px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, marginRight: '8px'}}>
                  screen time
                </span>
                <span style={{background: '#f0f7e8', color: '#7a9a3b', padding: '6px 14px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600}}>
                  science
                </span>
              </div>
              <h3 style={{fontSize: '2rem', fontWeight: 700, color: '#2c3e2c', marginBottom: '20px', lineHeight: 1.3}}>
                Soil vs. Screen: 7 Childhood Wins You Can Actually Measure
              </h3>
              <p style={{fontSize: '1.1rem', color: '#666', lineHeight: 1.7, marginBottom: '30px'}}>
                The average 4-year-old spends 2h 19min on screens daily. Finnish forest-children spend the same time with dirt under their nails—and just outscored peers in immunity, sleep, and self-regulation...
              </p>
              <Link href="/blog/soil-vs-screen-christmas" style={{display: 'inline-block', padding: '15px 35px', background: '#7a9a3b', color: 'white', textDecoration: 'none', borderRadius: '50px', fontSize: '1.1rem', fontWeight: 700, transition: 'transform 0.2s'}}>
                Read Full Article →
              </Link>
            </div>
          </div>

          <Link href="/blog" style={{display: 'inline-block', marginTop: '40px', color: '#7a9a3b', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 600}}>
            View All Articles →
          </Link>
        </div>
      </section>

      {/* Register/Contact Section */}
      <section id="register" data-track-section="register-cta" style={{padding: '100px 20px', backgroundImage: 'url(/backgrounds/D64442BA-F797-41FF-87AD-A5E0DDBC289B.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', textAlign: 'center'}}>
        <div style={{position: 'absolute', inset: 0, background: 'rgba(255, 255, 255, 0.90)'}}></div>
        <div style={{position: 'relative', zIndex: 1}}>
          <h2 style={{fontSize: '3rem', fontWeight: 800, marginBottom: '30px', color: '#333'}}>Ready to Register?</h2>

          <div style={{display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '60px'}}>
            <a href="https://wa.me/66989124218?text=Hi!%20I%27m%20interested%20in%20the%20Phuket%20Nature%20Camp." style={{display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '20px 50px', background: '#25D366', color: 'white', textDecoration: 'none', borderRadius: '50px', fontSize: '1.3rem', fontWeight: 700, transition: 'all 0.3s', boxShadow: '0 6px 20px rgba(37, 211, 102, 0.4)'}}>
              <MessageCircle size={24} />
              WhatsApp: +66 98 912 4218
            </a>
            <a href="mailto:info@bamboovalleyphuket.com" style={{display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '20px 50px', background: 'white', color: '#7a9a3b', textDecoration: 'none', borderRadius: '50px', fontSize: '1.3rem', fontWeight: 700, border: '3px solid #7a9a3b', transition: 'all 0.3s'}}>
              info@bamboovalleyphuket.com
            </a>
          </div>

          <p style={{fontSize: '1.1rem', color: '#666', maxWidth: '700px', margin: '0 auto', lineHeight: 1.8}}>
            Have questions? We&apos;d love to hear from you! Reach out via WhatsApp or email, and we&apos;ll get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{background: '#2c3e2c', color: 'white', padding: '60px 20px 30px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '40px'}}>
            {/* About Column */}
            <div>
              <h3 style={{fontSize: '1.3rem', marginBottom: '15px', color: '#a8c545'}}>Bamboo Valley Phuket</h3>
              <p style={{fontSize: '0.95rem', lineHeight: 1.6, color: '#d0d0d0'}}>
                Science-backed outdoor programs building immunity, confidence, and life skills through nature-based learning.
              </p>
            </div>

            {/* Quick Links Column */}
            <div>
              <h3 style={{fontSize: '1.3rem', marginBottom: '15px', color: '#a8c545'}}>Quick Links</h3>
              <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                <li style={{marginBottom: '10px'}}>
                  <Link href="/register" style={{color: '#d0d0d0', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.3s'}}>
                    Register
                  </Link>
                </li>
                <li style={{marginBottom: '10px'}}>
                  <Link href="/code-of-conduct" style={{color: '#d0d0d0', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.3s'}}>
                    Code of Conduct
                  </Link>
                </li>
                <li style={{marginBottom: '10px'}}>
                  <a href="https://bamboovalleyphuket.com" target="_blank" rel="noopener noreferrer" style={{color: '#d0d0d0', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.3s'}}>
                    Main School Website
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h3 style={{fontSize: '1.3rem', marginBottom: '15px', color: '#a8c545'}}>Contact Us</h3>
              <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                <li style={{marginBottom: '10px', fontSize: '0.95rem', color: '#d0d0d0'}}>
                  📱 +66 98 912 4218
                </li>
                <li style={{marginBottom: '10px', fontSize: '0.95rem', color: '#d0d0d0'}}>
                  ✉️ info@bamboovalleyphuket.com
                </li>
                <li style={{marginBottom: '10px', fontSize: '0.95rem', color: '#d0d0d0'}}>
                  📍 Phuket, Thailand
                </li>
                <li style={{marginTop: '15px'}}>
                  <a href="https://www.instagram.com/bamboovalleyphuket/" target="_blank" rel="noopener noreferrer" style={{color: '#d0d0d0', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.3s'}}>
                    📸 @bamboovalleyphuket
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{borderTop: '1px solid #4a5a4a', paddingTop: '25px', textAlign: 'center'}}>
            <p style={{margin: 0, fontSize: '0.9rem', color: '#a0a0a0'}}>
              © {new Date().getFullYear()} Bamboo Valley Phuket. All rights reserved.
            </p>
            <p style={{margin: '8px 0 0', fontSize: '0.85rem', color: '#888'}}>
              Built by Parents, For Parents
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
