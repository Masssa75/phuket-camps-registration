import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { GA_MEASUREMENT_ID } from '@/lib/gtag'
import { EngagementTracker, TrafficSourceCapture } from '@/components/Analytics'

export const metadata: Metadata = {
  title: 'Phuket Nature Camp - Bamboo Valley Phuket',
  description: 'Nature-based educational camps for children in Phuket, Thailand',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Search Console verification */}
        <meta name="google-site-verification" content="18NPOu83Yg8gnUpA9xEI2GwvSY5W9l4BkCWcJer0-ww" />

        {/* Preconnect to external resources for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        {/* Optimized font loading with display=swap to prevent render blocking */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Quicksand:wght@400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Fraunces:ital,opsz,wght@0,9..144,400..600;1,9..144,400..500&family=Jost:wght@300..600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Google Analytics */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
        <EngagementTracker />
        <TrafficSourceCapture />
        {children}
      </body>
    </html>
  )
}
