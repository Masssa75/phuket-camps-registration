import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Nature Education Blog | Bamboo Valley Phuket',
  description: 'Research-backed insights on outdoor learning, child development, and nature-based education from Bamboo Valley Phuket.',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Header */}
      <section style={{
        padding: '100px 20px 60px',
        background: 'linear-gradient(135deg, #BED7AF 0%, #DCEBE1 100%)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Link href="/" style={{
            color: '#7a9a3b',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 600,
            marginBottom: '20px',
            display: 'inline-block'
          }}>
            ← Back to Home
          </Link>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 800,
            color: '#2c3e2c',
            marginBottom: '20px'
          }}>
            Nature Education Blog
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#5a6a5a',
            lineHeight: 1.6
          }}>
            Research-backed insights on outdoor learning, child development, and nature-based education
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section style={{
        padding: '80px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '40px'
        }}>
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                background: '#fff',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                display: 'block'
              }}
            >
              {/* Featured Image */}
              {post.featuredImage && (
                <div style={{
                  height: '250px',
                  backgroundImage: `url(${post.featuredImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }} />
              )}

              {/* Content */}
              <div style={{ padding: '30px' }}>
                {/* Tags */}
                <div style={{ marginBottom: '15px' }}>
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        display: 'inline-block',
                        background: '#f0f7e8',
                        color: '#7a9a3b',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        marginRight: '8px'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#2c3e2c',
                  marginBottom: '15px',
                  lineHeight: 1.3
                }}>
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p style={{
                  fontSize: '1rem',
                  color: '#666',
                  lineHeight: 1.6,
                  marginBottom: '20px'
                }}>
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '15px',
                  borderTop: '1px solid #eee',
                  fontSize: '0.9rem',
                  color: '#999'
                }}>
                  <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <span style={{ color: '#7a9a3b', fontWeight: 600 }}>Read More →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
