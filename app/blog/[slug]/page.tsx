import Link from 'next/link'
import type { Metadata } from 'next'
import { getPostBySlug, getAllPosts } from '@/lib/blog'
import { notFound } from 'next/navigation'
import { MessageCircle, Facebook } from 'lucide-react'
import '../blog.css'

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found'
    }
  }

  return {
    title: `${post.title} | Bamboo Valley Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : [],
      type: 'article',
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : [],
    }
  }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const baseUrl = 'https://phuketcamp.com'
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage ? [`${baseUrl}${post.featuredImage}`] : undefined,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.updated || post.date).toISOString(),
    author: {
      '@type': 'Organization',
      name: post.author,
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Bamboo Valley Phuket',
      url: baseUrl,
      logo: { '@type': 'ImageObject', url: `${baseUrl}/og-image.jpg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${baseUrl}/blog/${post.slug}` },
  }
  const faqJsonLd = post.faq && post.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: post.featuredImage ? `url(${post.featuredImage})` : 'linear-gradient(135deg, #BED7AF 0%, #DCEBE1 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        {/* Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(44, 62, 44, 0.7)'
        }} />

        {/* Content */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '900px',
          padding: '60px 20px',
          textAlign: 'center',
          color: 'white'
        }}>
          <Link href="/blog" style={{
            color: '#BED7AF',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 600,
            marginBottom: '20px',
            display: 'inline-block'
          }}>
            ← Back to Blog
          </Link>

          {/* Tags */}
          <div style={{ marginBottom: '20px' }}>
            {post.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  display: 'inline-block',
                  background: 'rgba(190, 215, 175, 0.3)',
                  border: '1px solid #BED7AF',
                  color: '#BED7AF',
                  padding: '6px 16px',
                  borderRadius: '15px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginRight: '10px'
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 style={{
            fontSize: '3rem',
            fontWeight: 800,
            marginBottom: '20px',
            lineHeight: 1.2
          }}>
            {post.title}
          </h1>

          <p style={{
            fontSize: '1.3rem',
            opacity: 0.95,
            lineHeight: 1.6,
            marginBottom: '30px'
          }}>
            {post.excerpt}
          </p>

          <div style={{
            fontSize: '0.95rem',
            opacity: 0.9
          }}>
            {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            {' • '}
            {post.author}
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '80px 20px'
      }}>
        {/* Main Content */}
        <div
          style={{
            fontSize: '1.15rem',
            lineHeight: 1.8,
            color: '#333'
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
          className="blog-content"
        />

        {/* CTA Section */}
        <div style={{
          marginTop: '60px',
          padding: '40px',
          background: 'linear-gradient(135deg, #BED7AF 0%, #DCEBE1 100%)',
          borderRadius: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#2c3e2c',
            marginBottom: '20px'
          }}>
            Experience Nature Learning at Bamboo Valley
          </h3>
          <p style={{
            fontSize: '1.1rem',
            color: '#5a6a5a',
            marginBottom: '30px',
            lineHeight: 1.6
          }}>
            Join our Nature Camp for outdoor exploration, immunity-building play, and joyful learning.
          </p>
          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link
              href="/register"
              style={{
                display: 'inline-block',
                padding: '18px 40px',
                background: '#7a9a3b',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: 700,
                transition: 'transform 0.2s',
                boxShadow: '0 4px 15px rgba(122, 154, 59, 0.3)'
              }}
            >
              Register for Camp
            </Link>
            <a
              href="https://wa.me/66989124218?text=Hi!%20I%20read%20your%20blog%20and%20I%27m%20interested%20in%20the%20camp."
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '18px 40px',
                background: '#25D366',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: 700,
                transition: 'transform 0.2s',
                boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)'
              }}
            >
              <MessageCircle size={20} />
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* Share Section */}
        <div style={{
          marginTop: '60px',
          paddingTop: '40px',
          borderTop: '2px solid #eee',
          textAlign: 'center'
        }}>
          <h4 style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: '#2c3e2c',
            marginBottom: '20px'
          }}>
            Share This Article
          </h4>
          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center'
          }}>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://phuketcamp.com/blog/${post.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: '#1877f2',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '25px',
                fontSize: '1rem',
                fontWeight: 600
              }}
            >
              <Facebook size={20} />
              Facebook
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${post.title} - https://phuketcamp.com/blog/${post.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: '#25D366',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '25px',
                fontSize: '1rem',
                fontWeight: 600
              }}
            >
              <MessageCircle size={20} />
              WhatsApp
            </a>
          </div>
        </div>
      </article>
    </div>
  )
}
