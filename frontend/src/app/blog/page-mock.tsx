'use client'

import { useState, useEffect } from 'react'
import { useQuery, gql } from '@apollo/client'

// Mock blog posts data
const mockBlogPosts = [
  {
    id: 1,
    title: 'Xu hướng Web Development 2025',
    excerpt: 'Khám phá những công nghệ và framework mới nhất sẽ định hình tương lai của web development. Từ AI-powered tools đến edge computing...',
    content: 'Nội dung chi tiết về xu hướng web development...',
    author: 'Tech Team',
    date: '2025-06-10',
    category: 'Technology',
    tags: ['React', 'Next.js', 'AI', 'Web Dev'],
    image: '#667eea',
    readTime: '5 phút đọc'
  },
  {
    id: 2,
    title: 'GraphQL vs REST API: So sánh chi tiết',
    excerpt: 'Phân tích ưu nhược điểm của GraphQL và REST API để chọn lựa phù hợp cho dự án. Hiểu rõ khi nào nên sử dụng công nghệ nào...',
    content: 'Nội dung chi tiết về GraphQL vs REST...',
    author: 'Backend Team',
    date: '2025-06-08',
    category: 'Backend',
    tags: ['GraphQL', 'REST', 'API', 'Backend'],
    image: '#56ab2f',
    readTime: '7 phút đọc'
  },
  {
    id: 3,
    title: 'Tối ưu hóa Performance cho React App',
    excerpt: 'Các kỹ thuật và best practices để cải thiện hiệu suất ứng dụng React. Code splitting, lazy loading, và memory optimization...',
    content: 'Nội dung chi tiết về tối ưu React...',
    author: 'Frontend Team',
    date: '2025-06-05',
    category: 'Frontend',
    tags: ['React', 'Performance', 'Optimization'],
    image: '#f093fb',
    readTime: '6 phút đọc'
  },
  {
    id: 4,
    title: 'Microservices Architecture với Go',
    excerpt: 'Xây dựng hệ thống microservices mạnh mẽ với Go. Container, Docker, Kubernetes và monitoring trong production...',
    content: 'Nội dung chi tiết về microservices...',
    author: 'DevOps Team',
    date: '2025-06-03',
    category: 'DevOps',
    tags: ['Go', 'Microservices', 'Docker', 'Kubernetes'],
    image: '#4facfe',
    readTime: '8 phút đọc'
  },
  {
    id: 5,
    title: 'UI/UX Design Trends 2025',
    excerpt: 'Những xu hướng thiết kế giao diện và trải nghiệm người dùng mới nhất. Neumorphism, dark mode, và accessibility...',
    content: 'Nội dung chi tiết về UI/UX trends...',
    author: 'Design Team',
    date: '2025-06-01',
    category: 'Design',
    tags: ['UI/UX', 'Design', 'Trends', 'Accessibility'],
    image: '#e74c3c',
    readTime: '4 phút đọc'
  },
  {
    id: 6,
    title: 'Database Optimization và Scaling',
    excerpt: 'Chiến lược tối ưu hóa và mở rộng database. Indexing, query optimization, sharding và replication strategies...',
    content: 'Nội dung chi tiết về database optimization...',
    author: 'Database Team',
    date: '2025-05-28',
    category: 'Database',
    tags: ['Database', 'PostgreSQL', 'Optimization', 'Scaling'],
    image: '#9b59b6',
    readTime: '9 phút đọc'
  }
]

const categories = ['Tất cả', 'Technology', 'Frontend', 'Backend', 'DevOps', 'Design', 'Database']

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredPosts, setFilteredPosts] = useState(mockBlogPosts)

  useEffect(() => {
    let filtered = mockBlogPosts

    // Filter by category
    if (selectedCategory !== 'Tất cả') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredPosts(filtered)
  }, [selectedCategory, searchTerm])

  return (
    <div>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '1rem 0',
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 20px rgba(0,0,0,0.1)'
      }}>
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem'
        }}>
          <a href="/" style={{
            fontSize: '28px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'white',
            textDecoration: 'none'
          }}>
            <i className="fas fa-bolt"></i>
            ZPlus
          </a>

          <div style={{
            display: 'flex',
            listStyle: 'none',
            gap: '2rem',
            alignItems: 'center'
          }}>
            <a href="/" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Trang chủ</a>
            <a href="/blog" style={{ color: '#f1c40f', textDecoration: 'none', fontWeight: '500' }}>Blog</a>
            <a href="/projects" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Dự án</a>
            <a href="/admin/dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Admin</a>
          </div>
        </nav>
      </header>

      {/* Blog Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '120px 0 80px',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '700',
            marginBottom: '1rem'
          }}>
            <i className="fas fa-blog"></i> Blog & Tin tức
          </h1>
          <p style={{
            fontSize: '1.2rem',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Cập nhật những xu hướng công nghệ mới nhất, kinh nghiệm phát triển 
            và insights từ đội ngũ chuyên gia của ZPlus
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 2rem'
      }}>
        {/* Search and Filter */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          marginBottom: '40px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {/* Search Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              background: '#f8f9fa',
              padding: '15px 20px',
              borderRadius: '10px',
              border: '1px solid #e0e6ed'
            }}>
              <i className="fas fa-search" style={{ color: '#7f8c8d' }}></i>
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  fontSize: '16px',
                  outline: 'none',
                  color: '#2c3e50'
                }}
              />
            </div>

            {/* Category Filter */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: selectedCategory === category ? 
                      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa',
                    color: selectedCategory === category ? 'white' : '#2c3e50'
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '30px'
        }}>
          {filteredPosts.map(post => (
            <article key={post.id} style={{
              background: 'white',
              borderRadius: '15px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
            }}>
              {/* Post Image */}
              <div style={{
                height: '200px',
                background: `linear-gradient(135deg, ${post.image} 0%, ${post.image}80 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '3rem',
                position: 'relative'
              }}>
                <i className="fas fa-newspaper"></i>
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'rgba(255,255,255,0.2)',
                  padding: '5px 10px',
                  borderRadius: '15px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {post.category}
                </div>
              </div>

              {/* Post Content */}
              <div style={{ padding: '25px' }}>
                {/* Meta Info */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  marginBottom: '15px',
                  fontSize: '0.9rem',
                  color: '#7f8c8d'
                }}>
                  <span><i className="fas fa-calendar"></i> {new Date(post.date).toLocaleDateString('vi-VN')}</span>
                  <span><i className="fas fa-user"></i> {post.author}</span>
                  <span><i className="fas fa-clock"></i> {post.readTime}</span>
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  color: '#2c3e50',
                  marginBottom: '15px',
                  lineHeight: '1.3'
                }}>
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p style={{
                  color: '#7f8c8d',
                  lineHeight: '1.6',
                  marginBottom: '20px'
                }}>
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginBottom: '20px'
                }}>
                  {post.tags.map(tag => (
                    <span key={tag} style={{
                      background: '#f8f9fa',
                      color: '#667eea',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}>
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Read More */}
                <a href={`/blog/${post.id}`} style={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#764ba2'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#667eea'
                }}>
                  Đọc thêm <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'white',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <i className="fas fa-search" style={{
              fontSize: '4rem',
              color: '#bdc3c7',
              marginBottom: '20px'
            }}></i>
            <h3 style={{
              fontSize: '1.5rem',
              color: '#2c3e50',
              marginBottom: '10px'
            }}>
              Không tìm thấy bài viết
            </h3>
            <p style={{
              color: '#7f8c8d'
            }}>
              Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        background: '#2c3e50',
        color: 'white',
        padding: '40px 0 20px',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem'
        }}>
          <p style={{ margin: 0, color: '#bdc3c7' }}>
            © 2025 ZPlus. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </footer>
    </div>
  )
}
