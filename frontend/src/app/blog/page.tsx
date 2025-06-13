'use client'

import { useQuery, gql } from '@apollo/client'

// Simple GraphQL query for posts - matching backend structure
const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      title
      slug
      content
      excerpt
      status
      viewCount
      createdAt
    }
  }
`

export default function BlogPage() {
  const { data, loading, error } = useQuery(GET_POSTS, {
    errorPolicy: 'all'
  })

  if (loading) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Blog Posts</h1>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '2rem', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p>Loading blog posts via Apollo GraphQL...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Blog Posts</h1>
        <div style={{ 
          backgroundColor: '#ffe8e8', 
          padding: '2rem', 
          borderRadius: '8px',
          color: '#d32f2f'
        }}>
          <h3>GraphQL Error:</h3>
          <pre style={{ fontSize: '0.9em' }}>{error.message}</pre>
          <p style={{ marginTop: '1rem' }}>
            This is expected if the backend doesn't have blog posts yet.
          </p>
        </div>
      </div>
    )
  }

  const posts = data?.posts || []

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ color: '#333', marginBottom: '2rem' }}>Blog Posts</h1>
      
      <div style={{ 
        backgroundColor: '#e8f5e8', 
        padding: '1rem', 
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <strong>✅ Apollo GraphQL Query Successful!</strong>
        <br />
        <small>Found {posts.length} blog posts via GraphQL API</small>
      </div>

      {posts.length === 0 ? (
        <div style={{ 
          backgroundColor: '#fff3cd', 
          padding: '2rem', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3>No blog posts found</h3>
          <p>There are no blog posts yet.</p>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
            You can create some posts using the GraphQL Playground at{' '}
            <a href="http://localhost:4001/playground" target="_blank">
              http://localhost:4001/playground
            </a>
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {posts.map((post: any) => (
            <article 
              key={post.id}
              style={{ 
                backgroundColor: '#fff', 
                padding: '2rem', 
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                border: '1px solid #e9ecef'
              }}
            >
              <h2 style={{ color: '#333', marginBottom: '0.5rem' }}>
                {post.title}
              </h2>
              
              <div style={{ 
                color: '#666', 
                fontSize: '0.9rem',
                marginBottom: '1rem'
              }}>
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
              
              {post.excerpt && (
                <p style={{ 
                  color: '#555', 
                  lineHeight: '1.6',
                  marginBottom: '1rem'
                }}>
                  {post.excerpt}
                </p>
              )}
              
              <div style={{ 
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e9ecef',
                fontSize: '0.8rem',
                color: '#6c757d'
              }}>
                Views: {post.viewCount || 0} • Status: {post.status}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}