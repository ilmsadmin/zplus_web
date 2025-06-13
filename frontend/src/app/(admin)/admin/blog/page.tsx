'use client'

import { useState, useEffect } from 'react'

interface BlogPost {
  id: number
  title: string
  slug: string
  status: string
  is_featured: boolean
  view_count: number
  created_at: string
  updated_at: string
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    try {
      const response = await fetch('/api/v1/admin/blog/posts')
      if (response.ok) {
        const data = await response.json()
        setPosts(data.data.posts)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreatePost(formData: any) {
    try {
      const response = await fetch('/api/v1/admin/blog/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowCreateForm(false)
        fetchPosts() // Refresh the list
      }
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  async function handleDeletePost(postId: number) {
    if (!confirm('Are you sure you want to delete this post?')) {
      return
    }

    try {
      const response = await fetch(`/api/v1/admin/blog/posts/${postId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchPosts() // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  if (loading) {
    return <div className="loading">Loading blog posts...</div>
  }

  return (
    <div className="admin-blog">
      <div className="header">
        <h1>Blog Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateForm(true)}
        >
          Create New Post
        </button>
      </div>

      {showCreateForm && (
        <CreatePostForm 
          onSubmit={handleCreatePost}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <div className="posts-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Views</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id}>
                <td>
                  <div className="post-title">{post.title}</div>
                  <div className="post-slug">/{post.slug}</div>
                </td>
                <td>
                  <span className={`status-badge ${post.status}`}>
                    {post.status}
                  </span>
                </td>
                <td>
                  {post.is_featured ? (
                    <span className="featured-badge">Featured</span>
                  ) : (
                    '-'
                  )}
                </td>
                <td>{post.view_count}</td>
                <td>{new Date(post.created_at).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-sm btn-secondary">Edit</button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .admin-blog {
          max-width: 1200px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          margin-left: 8px;
        }
        .btn-primary {
          background: #3498db;
          color: white;
        }
        .btn-secondary {
          background: #95a5a6;
          color: white;
        }
        .btn-danger {
          background: #e74c3c;
          color: white;
        }
        .btn-sm {
          padding: 4px 8px;
          font-size: 12px;
        }
        .posts-table {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ecf0f1;
        }
        th {
          background: #f8f9fa;
          font-weight: 600;
        }
        .post-title {
          font-weight: 500;
          margin-bottom: 4px;
        }
        .post-slug {
          color: #7f8c8d;
          font-size: 12px;
        }
        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          text-transform: uppercase;
        }
        .status-badge.published {
          background: #d4edda;
          color: #155724;
        }
        .status-badge.draft {
          background: #fff3cd;
          color: #856404;
        }
        .status-badge.private {
          background: #f8d7da;
          color: #721c24;
        }
        .featured-badge {
          background: #e1f5fe;
          color: #0277bd;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
        }
        .loading {
          text-align: center;
          padding: 50px;
        }
      `}</style>
    </div>
  )
}

function CreatePostForm({ onSubmit, onCancel }: { onSubmit: (data: any) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    status: 'draft',
    is_featured: false,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(formData)
  }

  function handleTitleChange(title: string) {
    setFormData(prev => ({
      ...prev,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }))
  }

  return (
    <div className="create-form">
      <h2>Create New Blog Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            required
          />
        </div>
        <div className="form-group">
          <label>Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            rows={10}
            required
          />
        </div>
        <div className="form-group">
          <label>Excerpt</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
            rows={3}
          />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
            />
            Featured Post
          </label>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Create Post</button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </form>

      <style jsx>{`
        .create-form {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 30px;
        }
        .form-group {
          margin-bottom: 20px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
        }
        input, textarea, select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        textarea {
          resize: vertical;
        }
        .form-actions {
          display: flex;
          gap: 10px;
        }
      `}</style>
    </div>
  )
}