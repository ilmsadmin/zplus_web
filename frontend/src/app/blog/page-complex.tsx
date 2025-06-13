'use client'

import { useQuery } from '@apollo/client'
import { GET_POSTS, GET_CATEGORIES } from '../../lib/graphql/queries'
import { PostConnection, BlogCategory, PostStatus } from '../../lib/graphql/types'
import Link from 'next/link'
import { useState } from 'react'

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')

  // Query for posts
  const { 
    data: postsData, 
    loading: postsLoading, 
    error: postsError,
    refetch: refetchPosts
  } = useQuery<{ posts: PostConnection }>(GET_POSTS, {
    variables: {
      first: 10,
      status: PostStatus.PUBLISHED,
      categoryId: selectedCategory || undefined,
      search: searchTerm || undefined
    },
    errorPolicy: 'all'
  })

  // Query for categories
  const { 
    data: categoriesData, 
    loading: categoriesLoading 
  } = useQuery<{ categories: BlogCategory[] }>(GET_CATEGORIES, {
    errorPolicy: 'all'
  })

  const handleSearch = () => {
    refetchPosts({
      first: 10,
      status: PostStatus.PUBLISHED,
      categoryId: selectedCategory || undefined,
      search: searchTerm || undefined
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#333', marginBottom: '2rem' }}>Blog Posts</h1>

      {/* Search and Filter Section */}
      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              flex: '1',
              minWidth: '200px'
            }}
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          >
            <option value="">All Categories</option>
            {categoriesData?.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name} ({category.postCount})
              </option>
            ))}
          </select>

          <button
            onClick={handleSearch}
            style={{
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Search
          </button>
        </div>
      </div>

      {/* Loading State */}
      {postsLoading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading posts...</p>
        </div>
      )}

      {/* Error State */}
      {postsError && (
        <div style={{
          backgroundColor: '#ffe8e8',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          <strong>Error loading posts:</strong>
          <p>{postsError.message}</p>
        </div>
      )}

      {/* Posts Grid */}
      {postsData?.posts && (
        <div>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            Found {postsData.posts.totalCount} post(s)
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {postsData.posts.edges.map(({ node: post }) => (
              <article
                key={post.id}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                {post.featuredImage && (
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover'
                    }}
                  />
                )}
                
                <div style={{ padding: '1.5rem' }}>
                  <h2 style={{
                    margin: '0 0 0.5rem 0',
                    fontSize: '1.25rem',
                    color: '#333'
                  }}>
                    <Link
                      href={`/blog/${post.slug}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {post.title}
                    </Link>
                  </h2>
                  
                  <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
                    <span>By {post.author.firstName} {post.author.lastName || post.author.username}</span>
                    {post.publishedAt && (
                      <span> • {formatDate(post.publishedAt)}</span>
                    )}
                    {post.category && (
                      <span> • {post.category.name}</span>
                    )}
                  </div>
                  
                  {post.excerpt && (
                    <p style={{
                      margin: '0 0 1rem 0',
                      color: '#666',
                      lineHeight: '1.5'
                    }}>
                      {post.excerpt}
                    </p>
                  )}
                  
                  <div style={{ marginTop: '1rem' }}>
                    <Link
                      href={`/blog/${post.slug}`}
                      style={{
                        color: '#1976d2',
                        textDecoration: 'none',
                        fontWeight: 'bold'
                      }}
                    >
                      Read More →
                    </Link>
                    <span style={{
                      float: 'right',
                      fontSize: '0.9rem',
                      color: '#999'
                    }}>
                      {post.viewCount} views
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {postsData.posts.edges.length === 0 && !postsLoading && (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px'
            }}>
              <p style={{ fontSize: '1.1rem', color: '#666' }}>
                No posts found. Try adjusting your search criteria.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
