import Link from 'next/link'
import './home.css'
import type { Metadata } from 'next'
import HeroVideo from '@/components/HeroVideo'
import StickyNav from '@/components/home/StickyNav'
import PhotoGallery from '@/components/home/PhotoGallery'
import ContactForm from '@/components/home/ContactForm'
import Timetable from '@/components/home/Timetable'
import { HomePageTracking } from '@/components/Analytics'

export const metadata: Metadata = {
  title: 'Phuket Nature Camp - Year-Round Camps 2026-2027 | Bamboo Valley',
  description: 'Science-backed outdoor camps in Phuket building immunity, confidence, and life skills through nature. Summer, October, Christmas, Winter and Easter programs across 2026-2027. Ages 3-13. Organic meals, field trips, animal care, gardening, yoga.',
  keywords: 'phuket camp, nature camp phuket, summer camp phuket, october camp phuket, christmas camp phuket, winter camp phuket, easter camp phuket, kids activities phuket, outdoor education phuket, bamboo valley phuket, phuket kids camp, waldorf phuket, holiday camp phuket, school break camp phuket',
  openGraph: {
    title: 'Phuket Nature Camp - Nature Skills for Life',
    description: 'Outdoor camps with animal care, gardening, yoga, field trips. Ages 3-13. Licensed native English teachers. Summer, October, Christmas, Winter and Easter programs.',
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

// Every answer below states only verified policy (from the registration terms,
// admin schedules, and program pages) — don't add claims that aren't sourced.
const FAQS = [
  {
    q: 'What are the camp hours?',
    a: 'Camp runs Monday to Friday. Drop-off is between 8:45 and 9:00 in the morning, and pick-up is at 3:00 in the afternoon.',
  },
  {
    q: 'What is included in the price?',
    a: 'Everything for the day: a healthy lunch, two snacks, and all craft materials. For Maxi campers, the two weekly excursions are included too, transportation and all.',
  },
  {
    q: 'Which group is right for my child?',
    a: 'Mini (ages 3 to 6) has gentle, play-based days with a story and rest time after lunch. Maxi (ages 7 to 13) is built around adventure, sport, and independence, with two excursions a week. Both groups run with 1 teacher per 6 children, in groups of up to 18.',
  },
  {
    q: 'Does my child need to speak English?',
    a: 'Camp is run in English by licensed native English-speaking teachers, and children join us at every language level. During registration we ask about your child’s English so the teachers know how to support them from day one.',
  },
  {
    q: 'What about allergies and dietary restrictions?',
    a: 'Please list any allergies, dietary restrictions, or medical conditions in the registration form — the team will know about them before your child’s first day.',
  },
  {
    q: 'What happens when it rains?',
    a: 'We stay flexible — activities and field trips may change due to weather, and the day’s rhythm carries on.',
  },
  {
    q: 'Does my child need insurance?',
    a: 'Yes — every camper needs valid international health insurance or travel medical insurance covering the camp period.',
  },
  {
    q: 'What is the cancellation policy?',
    a: 'Cancel at least one month before camp starts and the full payment is refunded. Less than one month before, half is refunded. Cancellations made less than 7 days before the camp starts, or during the camp, are not refundable.',
  },
]

const CAMPS = [
  { emoji: '☀️', name: 'Summer Nature Camp', dates: '29 June – 14 August 2026', slug: 'summer-2026' },
  { emoji: '🍂', name: 'October Nature Camp', dates: '12–16 October 2026', slug: 'october-2026' },
  { emoji: '🎄', name: 'Christmas Nature Camp', dates: '14–25 December 2026 · 2 weeks', slug: 'christmas-2026' },
  { emoji: '❄️', name: 'Winter Nature Camp', dates: '18 January – 5 March 2027 · 7 weeks', slug: 'winter-2027' },
  { emoji: '🐣', name: 'Easter Nature Camp', dates: '5–9 April 2027', slug: 'easter-2027' },
]

export default function Home() {
  return (
    <div className="bvhome">
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
                "name": "Summer Nature Camp - Mini Camp (Ages 3-6)",
                "price": "13000",
                "priceCurrency": "THB",
                "availability": "https://schema.org/InStock",
                "validFrom": "2026-06-29",
                "validThrough": "2026-08-14",
                "description": "7-week summer program with organic meals and nature activities"
              },
              {
                "@type": "Offer",
                "name": "Summer Nature Camp - Maxi Camp (Ages 7-13)",
                "price": "15000",
                "priceCurrency": "THB",
                "availability": "https://schema.org/InStock",
                "validFrom": "2026-06-29",
                "validThrough": "2026-08-14"
              },
              {
                "@type": "Offer",
                "name": "October Nature Camp - Mini Camp (Ages 3-6)",
                "price": "13000",
                "priceCurrency": "THB",
                "availability": "https://schema.org/InStock",
                "validFrom": "2026-10-12",
                "validThrough": "2026-10-16",
                "description": "One-week autumn nature camp"
              },
              {
                "@type": "Offer",
                "name": "October Nature Camp - Maxi Camp (Ages 7-13)",
                "price": "15000",
                "priceCurrency": "THB",
                "availability": "https://schema.org/InStock",
                "validFrom": "2026-10-12",
                "validThrough": "2026-10-16"
              },
              {
                "@type": "Offer",
                "name": "Christmas Nature Camp - Mini Camp (Ages 3-6)",
                "price": "13000",
                "priceCurrency": "THB",
                "availability": "https://schema.org/InStock",
                "validFrom": "2026-12-14",
                "validThrough": "2026-12-25",
                "description": "Two-week Christmas nature camp program"
              },
              {
                "@type": "Offer",
                "name": "Christmas Nature Camp - Maxi Camp (Ages 7-13)",
                "price": "15000",
                "priceCurrency": "THB",
                "availability": "https://schema.org/InStock",
                "validFrom": "2026-12-14",
                "validThrough": "2026-12-25"
              },
              {
                "@type": "Offer",
                "name": "Winter Nature Camp - Mini Camp (Ages 3-6)",
                "price": "13000",
                "priceCurrency": "THB",
                "availability": "https://schema.org/InStock",
                "validFrom": "2027-01-18",
                "validThrough": "2027-03-05",
                "description": "Seven-week winter nature camp program"
              },
              {
                "@type": "Offer",
                "name": "Winter Nature Camp - Maxi Camp (Ages 7-13)",
                "price": "15000",
                "priceCurrency": "THB",
                "availability": "https://schema.org/InStock",
                "validFrom": "2027-01-18",
                "validThrough": "2027-03-05"
              },
              {
                "@type": "Offer",
                "name": "Easter Nature Camp - Mini Camp (Ages 3-6)",
                "price": "13000",
                "priceCurrency": "THB",
                "availability": "https://schema.org/InStock",
                "validFrom": "2027-04-05",
                "validThrough": "2027-04-09",
                "description": "One-week Easter nature camp"
              },
              {
                "@type": "Offer",
                "name": "Easter Nature Camp - Maxi Camp (Ages 7-13)",
                "price": "15000",
                "priceCurrency": "THB",
                "availability": "https://schema.org/InStock",
                "validFrom": "2027-04-05",
                "validThrough": "2027-04-09"
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

      {/* FAQPage structured data (rendered from the same FAQS array as the visible section) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": FAQS.map((f) => ({
              "@type": "Question",
              "name": f.q,
              "acceptedAnswer": { "@type": "Answer", "text": f.a }
            }))
          })
        }}
      />

      <StickyNav />
      <HeroVideo />

      {/* ===== HERO ===== */}
      <section className="hero" id="top" data-track-section="hero">
        <div className="hero-scrim"></div>
        <img className="hero-logo" src="/Logo with text White.png" alt="Bamboo Valley" />
        <div className="hero-content">
          <h1 className="hero-title">Phuket Nature Camp</h1>
          <p className="hero-slogan">Where childhood becomes extraordinary.</p>
          <div className="chips">
            <span className="chip">Ages 3–13</span>
            <a className="chip" href="#camps">Register →</a>
          </div>
        </div>
      </section>

      {/* ===== INTRO ===== */}
      <section className="introsec" data-track-section="intro">
        <div className="iwrap">
          <div className="iphoto"></div>
          <h2 className="ih">A beautiful outdoor program that builds confidence, immunity, and life skills.</h2>
          <div className="ischedule">Monday–Friday <span className="idot"></span> 9 AM–3 PM</div>
          <ul className="iacts">
            <li>Animal care</li><li>Gardening</li><li>Baking</li><li>Arts & crafts</li><li>Stories & acting</li><li>Muay Thai</li><li>Yoga</li><li>Meditation</li><li>Music</li><li>Field trips</li>
          </ul>
        </div>
      </section>

      {/* ===== PARALLAX BREAKER (A children's paradise) ===== */}
      <section className="breaker" style={{ backgroundImage: "url('/images/redesign/amb-tortoise.jpg')" }}>
        <div className="bq">
          <p>“A children’s paradise.”</p>
        </div>
      </section>

      {/* ===== PHOTO GALLERY ===== */}
      <section className="gsec" data-track-section="gallery">
        <div className="head">
          <div className="eyebrow">Camp life</div>
          <hr className="eyebrow-rule" />
          <h2 className="ttl">A look around camp</h2>
        </div>
        <PhotoGallery />
      </section>

      {/* ===== PROGRAMS ===== */}
      <section className="programs" id="programs" data-track-section="programs">
        <div className="head">
          <div className="eyebrow">Programs</div>
          <hr className="eyebrow-rule" />
          <h2 className="ttl">We have two age groups</h2>
        </div>

        <div className="cards">
          <article className="scrap mini">
            <div className="photo"></div>
            <div className="body">
              <h3 className="age"><span className="nm">Mini</span> – Ages 3 to 6</h3>
              <div className="focus">Gentle, play-based days</div>
              <div className="factpills"><span>1 teacher to 6 children</span><span>Groups of 18</span></div>
              <ul className="acts"><li>Animal care</li><li>Gardening</li><li>Baking</li><li>Waldorf painting</li><li>Yoga & meditation</li><li>Stories & circle time</li></ul>
              <div className="foot">
                <div className="price"><b>13,000</b> THB <span>/ week</span></div>
                <div className="incl">Meals & materials<br />included</div>
              </div>
            </div>
          </article>

          <article className="scrap maxi">
            <div className="photo"></div>
            <div className="body">
              <h3 className="age"><span className="nm">Maxi</span> – Ages 7 to 13</h3>
              <div className="focus">Adventure, sport & independence</div>
              <div className="factpills"><span>1 teacher to 6 children</span><span>Groups of 18</span></div>
              <ul className="acts"><li>Animal care</li><li>Gardening</li><li>Muay Thai</li><li>Cooking & baking</li><li>Sports & games</li><li>Clay, beads & crafts</li></ul>
              <div className="plus">
                <div className="plushead">Plus, two excursions a week</div>
                <div className="lab"><span className="day">Tue</span> A new excursion each week</div>
                <div className="lab"><span className="day">Thu</span> Beach Day, every week</div>
              </div>
              <div className="foot">
                <div className="price"><b>15,000</b> THB <span>/ week</span></div>
                <div className="incl">Meals, materials &<br />field trips included</div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ===== PARALLAX BREAKER (barefoot mornings) ===== */}
      <section className="breaker" style={{ backgroundImage: "url('/images/redesign/amb-swings.jpg')" }}>
        <div className="bq">
          <p>“The mornings begin barefoot in the gardens.”</p>
          <div className="attr">A day at Bamboo Valley</div>
        </div>
      </section>

      {/* ===== DAILY ACTIVITIES ===== */}
      <section className="gsec" id="activities" data-track-section="activities">
        <div className="head">
          <div className="eyebrow">Every day</div>
          <hr className="eyebrow-rule" />
          <h2 className="ttl">Daily activities</h2>
        </div>
        <div className="gallery">
          <div className="gcard" style={{ backgroundImage: "url('/images/redesign/act-animalcare.jpg')" }}><div className="gcap">Animal care</div></div>
          <div className="gcard" style={{ backgroundImage: "url('/images/redesign/act-freeplay.jpg')" }}><div className="gcap">Free play</div></div>
          <div className="gcard" style={{ backgroundImage: "url('/images/redesign/act-gardening.jpg')" }}><div className="gcap">Gardening</div></div>
          <div className="gcard" style={{ backgroundImage: "url('/images/redesign/act-baking.jpg')" }}><div className="gcap">Baking</div></div>
          <div className="gcard" style={{ backgroundImage: "url('/images/redesign/act-yoga.jpg')" }}><div className="gcap">Yoga & mindfulness</div></div>
          <div className="gcard" style={{ backgroundImage: "url('/images/redesign/act-arts.jpg')" }}><div className="gcap">Arts & crafts</div></div>
        </div>
      </section>

      {/* ===== FIELD TRIPS (Maxi) ===== */}
      <section className="gsec alt" data-track-section="field-trips">
        <div className="head">
          <div className="eyebrow">Beyond the campus</div>
          <hr className="eyebrow-rule" />
          <h2 className="ttl">Field trips — Maxi camp</h2>
          <p className="gsub">Twice-weekly adventures for the older children</p>
        </div>
        <div className="daypills">
          <div className="daypill"><span className="emoji">🚌</span><div><b>Field Trips</b><span>Every Tuesday</span></div></div>
          <div className="daypill"><span className="emoji">🏖️</span><div><b>Beach Day</b><span>Every Thursday</span></div></div>
        </div>
        <div className="gallery">
          <div className="gcard" style={{ backgroundImage: "url('/images/redesign/ft-beach.jpg')" }}><div className="gcap">Beach Day</div></div>
          <div className="gcard" style={{ backgroundImage: "url('/images/redesign/ft-shell-lake.jpg')" }}><div className="gcap">Shell Lake</div></div>
          <div className="gcard" style={{ backgroundImage: "url('/images/redesign/ft-elephant.jpg')" }}><div className="gcap">Elephant sanctuary</div></div>
          <div className="gcard" style={{ backgroundImage: "url('/images/redesign/ft-pearl.jpg')" }}><div className="gcap">Pearl factory</div></div>
          <div className="gcard" style={{ backgroundImage: "url('/images/redesign/ft-muay-thai.jpg')" }}><div className="gcap">Muay Thai</div></div>
          <div className="gcard" style={{ backgroundImage: "url('/images/redesign/ft-rice-farm.jpg')" }}><div className="gcap">Rice farm</div></div>
        </div>
      </section>

      {/* ===== PARALLAX BREAKER (Everything childhood) ===== */}
      <section className="breaker" style={{ backgroundImage: "url('/images/redesign/amb-tipi.jpg')" }}>
        <div className="bq">
          <p>“Everything childhood was always meant to be.”</p>
        </div>
      </section>

      {/* ===== A DAY AT CAMP (timetable) ===== */}
      <section className="gsec alt" id="day" data-track-section="day-at-camp">
        <div className="head">
          <div className="eyebrow">Daily rhythm</div>
          <hr className="eyebrow-rule" />
          <h2 className="ttl">A day at camp</h2>
          <p className="gsub">A steady rhythm, a different focus each day</p>
        </div>
        <Timetable />
      </section>

      {/* ===== UPCOMING CAMPS ===== */}
      <div id="register" aria-hidden="true" />
      <section className="gsec" id="camps" data-track-section="upcoming-camps">
        <div className="head">
          <div className="eyebrow">Dates</div>
          <hr className="eyebrow-rule" />
          <h2 className="ttl">Upcoming camps</h2>
          <p className="gsub">Monday to Friday, 9 AM–3 PM · Mini 13,000 THB · Maxi 15,000 THB per week</p>
        </div>
        <div className="camplist">
          {CAMPS.map((camp) => (
            <div className="camprow" key={camp.slug}>
              <span className="em">{camp.emoji}</span>
              <div className="ci">
                <div className="cn">{camp.name}</div>
                <div className="cd">{camp.dates}</div>
              </div>
              <Link className="cbtn" href={`/register?camp=${camp.slug}`}>Register →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="gsec alt" id="faq" data-track-section="faq">
        <div className="head">
          <div className="eyebrow">Good to know</div>
          <hr className="eyebrow-rule" />
          <h2 className="ttl">Common questions</h2>
        </div>
        <div className="faqlist">
          {FAQS.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p className="fa">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ===== VISIT US / CONTACT ===== */}
      <section className="gsec" data-track-section="visit">
        <div className="head">
          <div className="eyebrow">Come and see</div>
          <hr className="eyebrow-rule" />
          <h2 className="ttl">Visit us</h2>
          <p className="gsub">Questions welcome — we answer in any language</p>
        </div>
        <div className="contactgrid">
          <div className="cinfo">
            <h3 className="subh">Get in touch</h3>
            <div className="cblock">
              <div className="lbl">Where we are</div>
              <p>3/74 Moo 4, Cherngtalay<br />Thalang, Phuket 83110</p>
              <a className="maplink" href="https://maps.app.goo.gl/BSgZ5mBeAZqQnZEN6" target="_blank" rel="noopener noreferrer">Open in Google Maps →</a>
            </div>
            <div className="cblock"><div className="lbl">WhatsApp</div><a href="https://wa.me/66989124218">+66 98 912 4218</a></div>
            <div className="cblock"><div className="lbl">Email</div><a href="mailto:info@bamboovalleyphuket.com">info@bamboovalleyphuket.com</a></div>
            <div className="cblock"><div className="lbl">WeChat</div><p>BambooValleyCamp</p></div>
            <div className="cblock"><div className="lbl">Follow us</div><a href="https://www.instagram.com/bamboovalleyphuket/" target="_blank" rel="noopener noreferrer">@bamboovalleyphuket</a></div>
          </div>
          <ContactForm />
        </div>
      </section>

      <section className="mapsec">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.8!2d98.3179683!3d8.0042192!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x305037d692c8e82b%3A0x9d66d629c16cb3c6!2sBamboo%20Valley%20Phuket!5e0!3m2!1sen!2sth!4v1702468800000!5m2!1sen!2sth"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          title="Bamboo Valley Phuket location"
        ></iframe>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="site-footer">
        <div className="foot-grid">
          <div className="foot-brand">
            <div className="fname">Phuket Nature Camp</div>
            <p>A beautiful outdoor program building confidence, immunity, and life skills through nature-based learning in Phuket.</p>
          </div>
          <div className="foot-col">
            <h4>Explore</h4>
            <ul>
              <li><a href="#programs">Programs</a></li>
              <li><a href="#activities">Daily activities</a></li>
              <li><a href="#camps">Upcoming camps</a></li>
              <li><Link href="/register">Register</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/code-of-conduct">Code of conduct</Link></li>
              <li><a href="https://bamboovalleyphuket.com" target="_blank" rel="noopener noreferrer">Main school website</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>Contact</h4>
            <ul>
              <li><a href="https://wa.me/66989124218">WhatsApp · +66 98 912 4218</a></li>
              <li><a href="mailto:info@bamboovalleyphuket.com">info@bamboovalleyphuket.com</a></li>
              <li>3/74 Moo 4, Cherngtalay, Phuket</li>
              <li><a href="https://www.instagram.com/bamboovalleyphuket/" target="_blank" rel="noopener noreferrer">@bamboovalleyphuket</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <p>© {new Date().getFullYear()} Bamboo Valley Phuket. All rights reserved.</p>
          <p className="tag">Built by parents, for parents</p>
        </div>
      </footer>
    </div>
  )
}
