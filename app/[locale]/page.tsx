import Link from 'next/link'
import '../home.css'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import HeroVideo from '@/components/HeroVideo'
import StickyNav from '@/components/home/StickyNav'
import PhotoGallery from '@/components/home/PhotoGallery'
import Timetable from '@/components/home/Timetable'
import ContactForm from '@/components/home/ContactForm'
import { HomePageTracking } from '@/components/Analytics'
import PrefetchCamps from '@/components/PrefetchCamps'
import { getUpcomingCamps, formatCampDates, priceFrom } from '@/lib/camps'

// Camp names, dates and prices come from the camps table at build time; revalidate so a
// price edit goes live within 5 minutes instead of waiting for the next deploy. Matches
// the CDN cache /api/camps already sets.
export const revalidate = 300


const BASE_URL = 'https://phuketcamp.com'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  const canonical = locale === 'en' ? BASE_URL : `${BASE_URL}/zh`
  return {
    title: t('title'),
    description: t('description'),
    keywords: 'phuket camp, nature camp phuket, summer camp phuket, october camp phuket, christmas camp phuket, winter camp phuket, easter camp phuket, kids activities phuket, outdoor education phuket, bamboo valley phuket, phuket kids camp, waldorf phuket, holiday camp phuket, school break camp phuket',
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      images: [{
        url: `${BASE_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'The Bamboo Valley palm-grove campus — Phuket Nature Camp',
      }],
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
      url: canonical,
      siteName: 'Bamboo Valley Phuket Nature Camps',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('ogTitle'),
      description: t('ogDescription'),
      images: [`${BASE_URL}/images/og-image.jpg`],
      creator: '@bamboovalleyphuket',
      site: '@bamboovalleyphuket',
    },
    alternates: {
      canonical,
      languages: {
        en: BASE_URL,
        zh: `${BASE_URL}/zh`,
        'x-default': BASE_URL,
      },
    },
  }
}

const ACTIVITY_IMAGES = [
  '/images/redesign/act-animalcare.jpg',
  '/images/redesign/act-freeplay.jpg',
  '/images/redesign/act-gardening.jpg',
  '/images/redesign/act-baking.jpg',
  '/images/redesign/act-yoga.jpg',
  '/images/redesign/act-arts.jpg',
]

const GROW_IMAGES = [
  '/images/redesign/grow-confidence.jpg',
  '/images/redesign/grow-teamwork.jpg',
  '/images/redesign/grow-immunity.jpg',
]

const FIELDTRIP_IMAGES = [
  '/images/redesign/ft-beach.jpg',
  '/images/redesign/ft-shell-lake.jpg',
  '/images/redesign/ft-elephant.jpg',
  '/images/redesign/ft-pearl.jpg',
  '/images/redesign/ft-muay-thai.jpg',
  '/images/redesign/ft-rice-farm.jpg',
]

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations()
  const camps = await getUpcomingCamps()

  const introPills = t.raw('intro.pills') as string[]
  const miniActs = t.raw('programs.mini.acts') as string[]
  const maxiActs = t.raw('programs.maxi.acts') as string[]
  const miniPills = t.raw('programs.mini.pills') as string[]
  const maxiPills = t.raw('programs.maxi.pills') as string[]
  const activityItems = t.raw('activities.items') as string[]
  const fieldtripItems = t.raw('fieldtrips.items') as string[]
  const faqs = t.raw('faq.items') as { q: string; a: string }[]

  return (
    <div className="bvhome">
      <HomePageTracking />
      <PrefetchCamps />
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
            "offers": camps.flatMap(c => c.programs.map(pr => ({
              "@type": "Offer",
              "name": `${c.name} - ${pr.id === 'mini' ? 'Mini' : 'Maxi'} Camp (Ages ${pr.ageRange})`,
              "price": String(pr.regular),
              "priceCurrency": "THB",
              "availability": "https://schema.org/InStock",
              "validFrom": c.start,
              "validThrough": c.end,
            }))),
            "image": "https://phuketcamp.com/images/og-image.jpg",
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
      {/* FAQPage structured data (rendered from the same FAQ items as the visible section) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map((f) => ({
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
          <h1 className="hero-title">{t('hero.title')}</h1>
          <p className="hero-slogan">{t('hero.slogan')}</p>
          <div className="chips">
            <span className="chip">{t('hero.ages')}</span>
            <a className="chip" href="#camps">{t('hero.register')} →</a>
            <a className="chip" href={`https://wa.me/66989124218?text=${encodeURIComponent(t('hero.waText'))}`} target="_blank" rel="noopener noreferrer">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ===== UPCOMING CAMPS (moved directly below hero so registration is above the fold) ===== */}
      <div id="register" aria-hidden="true" />
      <section className="gsec" id="camps" data-track-section="upcoming-camps">
        <div className="head">
          <div className="eyebrow">{t('camps.eyebrow')}</div>
          <hr className="eyebrow-rule" />
          <h2 className="ttl">{t('camps.title')}</h2>
          <p className="gsub">{t('camps.sub')}</p>
        </div>
        <div className="camplist">
          {camps.map((camp) => (
            <div className="camprow" key={camp.slug}>
              <span className="em">{camp.emoji}</span>
              <div className="ci">
                <div className="cn">{t(`camps.names.${camp.type}`)}</div>
                <div className="cd">
                  {formatCampDates(camp, locale)}{camp.weeks > 1 ? ` ${t('camps.weeks', { count: camp.weeks })}` : ''}
                  <br />
                  {t('camps.price', { list: camp.programs.map(pr => `${t(`programs.${pr.id}.name`)} ${pr.regular.toLocaleString()}`).join(' · ') })}
                </div>
              </div>
              <Link className="cbtn" href={`/register?camp=${camp.slug}`}>{t('camps.register')} →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* ===== INTRO ===== */}
      <section className="introsec" data-track-section="intro">
        <div className="iwrap">
          <div className="iphoto"></div>
          <h2 className="ih">{t('intro.heading')}</h2>
          <div className="ischedule">{t('intro.schedule')} <span className="idot"></span> {t('intro.hours')}</div>
          <ul className="iacts">
            {introPills.map((pill) => <li key={pill}>{pill}</li>)}
          </ul>
        </div>
      </section>

      {/* ===== PARALLAX BREAKER (A children's paradise) ===== */}
      <section className="breaker" style={{ backgroundImage: "url('/images/redesign/amb-tortoise.jpg')" }}>
        <div className="bq">
          <p>{t('quotes.paradise')}</p>
        </div>
      </section>

      {/* ===== PHOTO GALLERY ===== */}
      <section className="gsec" data-track-section="gallery">
        <div className="head">
          <div className="eyebrow">{t('gallery.eyebrow')}</div>
          <hr className="eyebrow-rule" />
          <h2 className="ttl">{t('gallery.title')}</h2>
        </div>
        <PhotoGallery alt={t('gallery.alt')} />
      </section>

      {/* ===== PROGRAMS ===== */}
      <section className="programs" id="programs" data-track-section="programs">
        <div className="head">
          <div className="eyebrow">{t('programs.eyebrow')}</div>
          <hr className="eyebrow-rule" />
          <h2 className="ttl">{t('programs.title')}</h2>
        </div>

        <div className="cards">
          <article className="scrap mini">
            <div className="photo"></div>
            <div className="body">
              <h3 className="age"><span className="nm">{t('programs.mini.name')}</span> – {t('programs.mini.ages')}</h3>
              <div className="focus">{t('programs.mini.focus')}</div>
              <div className="factpills">{miniPills.map((p) => <span key={p}>{p}</span>)}</div>
              <ul className="acts">{miniActs.map((a) => <li key={a}>{a}</li>)}</ul>
              <div className="foot">
                <div className="price">{t('programs.from')} <b>{priceFrom(camps, 'mini').toLocaleString()}</b> {t('programs.mini.currency')} <span>{t('programs.mini.perWeek')}</span></div>
                <div className="incl">{t('programs.mini.incl')}</div>
              </div>
            </div>
          </article>

          <article className="scrap maxi">
            <div className="photo"></div>
            <div className="body">
              <h3 className="age"><span className="nm">{t('programs.maxi.name')}</span> – {t('programs.maxi.ages')}</h3>
              <div className="focus">{t('programs.maxi.focus')}</div>
              <div className="factpills">{maxiPills.map((p) => <span key={p}>{p}</span>)}</div>
              <ul className="acts">{maxiActs.map((a) => <li key={a}>{a}</li>)}</ul>
              <div className="plus">
                <div className="plushead">{t('programs.maxi.plusHead')}</div>
                <div className="lab"><span className="day">{t('programs.maxi.tue')}</span> {t('programs.maxi.plusTue')}</div>
                <div className="lab"><span className="day">{t('programs.maxi.thu')}</span> {t('programs.maxi.plusThu')}</div>
              </div>
              <div className="foot">
                <div className="price">{t('programs.from')} <b>{priceFrom(camps, 'maxi').toLocaleString()}</b> {t('programs.maxi.currency')} <span>{t('programs.maxi.perWeek')}</span></div>
                <div className="incl">{t('programs.maxi.incl')}</div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ===== PARALLAX BREAKER (barefoot mornings) ===== */}
      <section className="breaker" style={{ backgroundImage: "url('/images/redesign/amb-swings.jpg')" }}>
        <div className="bq">
          <p>{t('quotes.barefoot')}</p>
          <div className="attr">{t('quotes.barefootAttr')}</div>
        </div>
      </section>

      {/* ===== DAILY ACTIVITIES ===== */}
      <section className="gsec" id="activities" data-track-section="activities">
        <div className="head">
          <div className="eyebrow">{t('activities.eyebrow')}</div>
          <hr className="eyebrow-rule" />
          <h2 className="ttl">{t('activities.title')}</h2>
        </div>
        <div className="gallery">
          {activityItems.map((item, i) => (
            <div className="gcard" key={item} style={{ backgroundImage: `url('${ACTIVITY_IMAGES[i]}')` }}>
              <div className="gcap">{item}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FIELD TRIPS (Maxi) ===== */}
      <section className="gsec alt" data-track-section="field-trips">
        <div className="head">
          <div className="eyebrow">{t('fieldtrips.eyebrow')}</div>
          <hr className="eyebrow-rule" />
          <h2 className="ttl">{t('fieldtrips.title')}</h2>
          <p className="gsub">{t('fieldtrips.sub')}</p>
        </div>
        <div className="daypills">
          <div className="daypill"><span className="emoji">🚌</span><div><b>{t('fieldtrips.pillTrips')}</b><span>{t('fieldtrips.pillTripsWhen')}</span></div></div>
          <div className="daypill"><span className="emoji">🏖️</span><div><b>{t('fieldtrips.pillBeach')}</b><span>{t('fieldtrips.pillBeachWhen')}</span></div></div>
        </div>
        <div className="gallery">
          {fieldtripItems.map((item, i) => (
            <div className="gcard" key={item} style={{ backgroundImage: `url('${FIELDTRIP_IMAGES[i]}')` }}>
              <div className="gcap">{item}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== WATCH THEM GROW (outcomes) ===== */}
      <section className="gsec" data-track-section="watch-them-grow">
        <div className="head">
          <div className="eyebrow">{t('grow.eyebrow')}</div>
          <hr className="eyebrow-rule" />
          <h2 className="ttl">{t('grow.title')}</h2>
          <p className="gsub">{t('grow.sub')}</p>
        </div>
        <div className="gallery">
          {(t.raw('grow.items') as { t: string; d: string }[]).map((item, i) => (
            <div className="gcard" key={item.t} style={{ backgroundImage: `url('${GROW_IMAGES[i]}')` }}>
              <div className="gcap">{item.t}<span className="gcsub">{item.d}</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PARALLAX BREAKER (Everything childhood) ===== */}
      <section className="breaker" style={{ backgroundImage: "url('/images/redesign/amb-tipi.jpg')" }}>
        <div className="bq">
          <p>{t('quotes.everything')}</p>
        </div>
      </section>

      {/* ===== A DAY AT CAMP (timetable) ===== */}
      <section className="gsec alt" id="day" data-track-section="day-at-camp">
        <div className="head">
          <div className="eyebrow">{t('day.eyebrow')}</div>
          <hr className="eyebrow-rule" />
          <h2 className="ttl">{t('day.title')}</h2>
          <p className="gsub">{t('day.sub')}</p>
        </div>
        <Timetable />
      </section>

      {/* ===== FAQ ===== */}
      <section className="gsec alt" id="faq" data-track-section="faq">
        <div className="head">
          <div className="eyebrow">{t('faq.eyebrow')}</div>
          <hr className="eyebrow-rule" />
          <h2 className="ttl">{t('faq.title')}</h2>
        </div>
        <div className="faqlist">
          {faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p className="fa">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ===== VISIT US / CONTACT ===== */}
      <section className="gsec" id="visit" data-track-section="visit">
        <div className="head">
          <div className="eyebrow">{t('visit.eyebrow')}</div>
          <hr className="eyebrow-rule" />
          <h2 className="ttl">{t('visit.title')}</h2>
          <p className="gsub">{t('visit.sub')}</p>
        </div>
        <div className="contactgrid">
          <div className="cinfo">
            <h3 className="subh">{t('visit.getInTouch')}</h3>
            <div className="cblock">
              <div className="lbl">{t('visit.where')}</div>
              <p>{t('visit.addr1')}<br />{t('visit.addr2')}</p>
              <a className="maplink" href="https://maps.app.goo.gl/BSgZ5mBeAZqQnZEN6" target="_blank" rel="noopener noreferrer">{t('visit.mapLink')} →</a>
            </div>
            <div className="cblock"><div className="lbl">{t('visit.whatsapp')}</div><a href="https://wa.me/66989124218">+66 98 912 4218</a></div>
            <div className="cblock"><div className="lbl">{t('visit.email')}</div><a href="mailto:info@bamboovalleyphuket.com">info@bamboovalleyphuket.com</a></div>
            <div className="cblock"><div className="lbl">{t('visit.wechat')}</div><p>BambooValleyCamp</p></div>
            <div className="cblock"><div className="lbl">{t('visit.follow')}</div><a href="https://www.instagram.com/bamboovalleyphuket/" target="_blank" rel="noopener noreferrer">@bamboovalleyphuket</a></div>
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
            <div className="fname">{t('nav.brand')}</div>
            <p>{t('footer.blurb')}</p>
          </div>
          <div className="foot-col">
            <h4>{t('footer.explore')}</h4>
            <ul>
              <li><a href="#programs">{t('footer.programs')}</a></li>
              <li><a href="#activities">{t('footer.activities')}</a></li>
              <li><a href="#camps">{t('footer.camps')}</a></li>
              <li><Link href="/register">{t('footer.register')}</Link></li>
              <li><Link href="/blog">{t('footer.blog')}</Link></li>
              <li><Link href="/code-of-conduct">{t('footer.conduct')}</Link></li>
              <li><a href="https://bamboovalleyphuket.com" target="_blank" rel="noopener noreferrer">{t('footer.school')}</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>{t('footer.contact')}</h4>
            <ul>
              <li><a href="https://wa.me/66989124218">{t('visit.whatsapp')} · +66 98 912 4218</a></li>
              <li><a href="mailto:info@bamboovalleyphuket.com">info@bamboovalleyphuket.com</a></li>
              <li>3/75 Moo 4, Cherngtalay, Phuket</li>
              <li><a href="https://www.instagram.com/bamboovalleyphuket/" target="_blank" rel="noopener noreferrer">@bamboovalleyphuket</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <p>© {new Date().getFullYear()} Bamboo Valley Phuket. {t('footer.rights')}</p>
          <p className="tag">{t('footer.tag')}</p>
        </div>
      </footer>
    </div>
  )
}
