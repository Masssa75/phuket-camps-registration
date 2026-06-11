import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

export interface BlogFaq {
  q: string
  a: string
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  updated?: string
  author: string
  featuredImage?: string
  heroVideo?: string
  heroPoster?: string
  tags: string[]
  camps: string[]
  language: string
  faq?: BlogFaq[]
}

const postsDirectory = path.join(process.cwd(), 'content/blog')

// Ensure directory exists
if (!fs.existsSync(postsDirectory)) {
  fs.mkdirSync(postsDirectory, { recursive: true })
}

export function getAllPosts(): BlogPost[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory)
    const posts = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, '')
        return getPostBySlug(slug)
      })
      .filter((post): post is BlogPost => post !== null)
      .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()))

    return posts
  } catch (error) {
    console.error('Error reading posts:', error)
    return []
  }
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)

    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title || '',
      excerpt: data.excerpt || '',
      content: marked(content) as string,
      date: data.date || new Date().toISOString(),
      updated: data.updated || undefined,
      author: data.author || 'Bamboo Valley Team',
      featuredImage: data.featuredImage || '',
      heroVideo: data.heroVideo || undefined,
      heroPoster: data.heroPoster || undefined,
      tags: data.tags || [],
      camps: data.camps || ['universal'],
      language: data.language || 'en',
      faq: data.faq || undefined,
    }
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error)
    return null
  }
}

export function getPostsByCamp(camp: string): BlogPost[] {
  const allPosts = getAllPosts()
  return allPosts.filter(post =>
    post.camps.includes(camp) || post.camps.includes('universal')
  )
}

export function getPostsByLanguage(language: string): BlogPost[] {
  const allPosts = getAllPosts()
  return allPosts.filter(post => post.language === language)
}
