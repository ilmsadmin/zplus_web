'use client'

import { useState, useEffect } from 'react'
import { useQuery, gql } from '@apollo/client'

// Simple GraphQL query for current user - matching the backend schema
const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      username
      role
    }
  }
`

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<string>('connecting...')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  // Use Apollo Client for GraphQL query
  const { data: apolloData, loading, error } = useQuery(GET_ME, {
    errorPolicy: 'all'
  })

  useEffect(() => {
    // Test health endpoint
    const testBackend = async () => {
      try {
        const response = await fetch('http://localhost:4001/health')
        if (response.ok) {
          setBackendStatus('connected')
        } else {
          setBackendStatus('disconnected')
        }
      } catch (error) {
        setBackendStatus('disconnected')
        console.error('Backend connection failed:', error)
      }
    }

    testBackend()
  }, [])

  return (
    <>
      <head>
        <link 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
          rel="stylesheet" 
        />
      </head>
      
      <div style={{ margin: 0, padding: 0, boxSizing: 'border-box' }}>
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
            <div style={{
              fontSize: '28px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <i className="fas fa-bolt"></i>
              ZPlus
            </div>

            <div style={{
              display: 'flex',
              listStyle: 'none',
              gap: '2rem',
              alignItems: 'center'
            }}>
              <a href="/" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Trang chủ</a>
              <a href="/services" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Dịch vụ</a>
              <a href="/products" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Sản phẩm</a>
              <a href="/projects" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Dự án</a>
              <a href="/blog" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Blog</a>
              <a href="/contact" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Liên hệ</a>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="/login" style={{
                padding: '10px 20px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '25px',
                color: 'white',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}>
                <i className="fas fa-sign-in-alt"></i> Đăng nhập
              </a>
              <a href="/register" style={{
                padding: '10px 20px',
                background: '#f1c40f',
                color: '#2c3e50',
                borderRadius: '25px',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}>
                <i className="fas fa-user-plus"></i> Đăng ký
              </a>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section id="home" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '150px 0 100px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem',
            position: 'relative',
            zIndex: 2
          }}>
            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: '700',
              marginBottom: '1.5rem',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              Giải pháp công nghệ <br />
              <span style={{ color: '#f1c40f' }}>tổng thể</span> cho doanh nghiệp
            </h1>
            <p style={{
              fontSize: '1.3rem',
              marginBottom: '2.5rem',
              opacity: 0.9,
              maxWidth: '600px',
              margin: '0 auto 2.5rem'
            }}>
              Chúng tôi cung cấp các giải pháp phần mềm hiện đại, website chuyên nghiệp 
              và ứng dụng di động để giúp doanh nghiệp của bạn phát triển trong kỷ nguyên số
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#services" style={{
                padding: '15px 30px',
                background: '#f1c40f',
                color: '#2c3e50',
                borderRadius: '30px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <i className="fas fa-rocket"></i> Khám phá dịch vụ
              </a>
              <a href="#contact" style={{
                padding: '15px 30px',
                border: '2px solid white',
                color: 'white',
                borderRadius: '30px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <i className="fas fa-phone"></i> Liên hệ ngay
              </a>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" style={{
          padding: '100px 0',
          background: '#f8f9fa'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#2c3e50',
                marginBottom: '1rem'
              }}>
                Dịch vụ của chúng tôi
              </h2>
              <p style={{
                fontSize: '1.1rem',
                color: '#7f8c8d',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Chúng tôi cung cấp đa dạng các dịch vụ công nghệ để đáp ứng mọi nhu cầu của doanh nghiệp
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '30px'
            }}>
              {[
                {
                  icon: 'fas fa-code',
                  title: 'Web Development',
                  description: 'Phát triển website hiện đại với Next.js, React và các công nghệ tiên tiến nhất',
                  color: '#667eea'
                },
                {
                  icon: 'fas fa-mobile-alt',
                  title: 'Mobile Apps',
                  description: 'Ứng dụng di động đa nền tảng với React Native và Flutter',
                  color: '#f093fb'
                },
                {
                  icon: 'fas fa-shopping-cart',
                  title: 'E-commerce',
                  description: 'Giải pháp thương mại điện tử hoàn chỉnh với tích hợp thanh toán',
                  color: '#56ab2f'
                },
                {
                  icon: 'fas fa-chart-line',
                  title: 'Consulting',
                  description: 'Tư vấn chiến lược công nghệ và chuyển đổi số cho doanh nghiệp',
                  color: '#4facfe'
                }
              ].map((service, index) => (
                <div key={index} style={{
                  background: 'white',
                  padding: '40px 30px',
                  borderRadius: '15px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: `linear-gradient(135deg, ${service.color} 0%, ${service.color}80 100%)`,
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 25px',
                    fontSize: '30px',
                    color: 'white'
                  }}>
                    <i className={service.icon}></i>
                  </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#2c3e50',
                    marginBottom: '15px'
                  }}>
                    {service.title}
                  </h3>
                  <p style={{
                    color: '#7f8c8d',
                    lineHeight: '1.6'
                  }}>
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* System Status Section */}
        <section style={{
          padding: '50px 0',
          background: 'white'
        }}>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '0 2rem'
          }}>
            <div style={{
              background: '#f8f9fa',
              padding: '30px',
              borderRadius: '15px',
              boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#2c3e50',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                Trạng thái hệ thống
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px'
              }}>
                <div style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#2c3e50',
                    marginBottom: '10px'
                  }}>
                    Backend API
                  </div>
                  <div style={{
                    color: backendStatus === 'connected' ? '#27ae60' : '#e74c3c',
                    fontWeight: '600',
                    fontSize: '1rem'
                  }}>
                    {backendStatus === 'connected' ? '✓ Online' : '✗ Offline'}
                  </div>
                </div>

                <div style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#2c3e50',
                    marginBottom: '10px'
                  }}>
                    GraphQL
                  </div>
                  <div style={{
                    color: loading ? '#f39c12' : error ? '#e74c3c' : apolloData ? '#27ae60' : '#7f8c8d',
                    fontWeight: '600',
                    fontSize: '1rem'
                  }}>
                    {loading ? '⏳ Loading' : 
                     error ? '✗ Error' : 
                     apolloData ? '✓ Connected' : '○ Idle'}
                  </div>
                </div>

                <div style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#2c3e50',
                    marginBottom: '10px'
                  }}>
                    Current User
                  </div>
                  <div style={{
                    color: '#667eea',
                    fontWeight: '600',
                    fontSize: '1rem'
                  }}>
                    {apolloData?.me?.username || 'Not logged in'}
                  </div>
                </div>
              </div>

              {apolloData && (
                <div style={{
                  background: '#e8f5e8',
                  padding: '20px',
                  borderRadius: '10px',
                  marginTop: '20px'
                }}>
                  <strong>✅ GraphQL Connection Successful!</strong>
                  <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem' }}>
                    Kết nối GraphQL hoạt động tốt. Đăng nhập dưới tên: <strong>{apolloData.me?.username}</strong> ({apolloData.me?.email})
                  </p>
                </div>
              )}

              {error && (
                <div style={{
                  background: '#ffe8e8',
                  padding: '20px',
                  borderRadius: '10px',
                  marginTop: '20px'
                }}>
                  <strong>❌ GraphQL Error:</strong>
                  <pre style={{ margin: '10px 0 0 0', fontSize: '0.8rem', color: '#d32f2f' }}>
                    {error.message}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          background: '#2c3e50',
          color: 'white',
          padding: '60px 0 30px'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '40px',
              marginBottom: '40px'
            }}>
              <div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <i className="fas fa-bolt"></i> ZPlus
                </h3>
                <p style={{
                  color: '#bdc3c7',
                  lineHeight: '1.6',
                  marginBottom: '20px'
                }}>
                  Chúng tôi cung cấp các giải pháp công nghệ tổng thể 
                  để giúp doanh nghiệp phát triển trong kỷ nguyên số.
                </p>
                <div style={{ display: 'flex', gap: '15px' }}>
                  {['facebook', 'twitter', 'linkedin', 'instagram'].map(social => (
                    <a key={social} href="#" style={{
                      width: '40px',
                      height: '40px',
                      background: '#34495e',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#667eea'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#34495e'
                    }}>
                      <i className={`fab fa-${social}`}></i>
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  marginBottom: '20px'
                }}>
                  Dịch vụ
                </h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {['Web Development', 'Mobile Apps', 'E-commerce', 'UI/UX Design', 'Consulting'].map(service => (
                    <li key={service} style={{ marginBottom: '10px' }}>
                      <a href="#" style={{
                        color: '#bdc3c7',
                        textDecoration: 'none',
                        transition: 'color 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#f1c40f'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#bdc3c7'
                      }}>
                        {service}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  marginBottom: '20px'
                }}>
                  Liên kết
                </h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {[
                    { name: 'Trang chủ', href: '/' },
                    { name: 'Blog', href: '/blog' },
                    { name: 'Dự án', href: '/projects' },
                    { name: 'Admin Panel', href: '/admin/dashboard' },
                    { name: 'GraphQL Playground', href: 'http://localhost:4001/playground' }
                  ].map(link => (
                    <li key={link.name} style={{ marginBottom: '10px' }}>
                      <a href={link.href} style={{
                        color: '#bdc3c7',
                        textDecoration: 'none',
                        transition: 'color 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#f1c40f'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#bdc3c7'
                      }}>
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  marginBottom: '20px'
                }}>
                  Liên hệ
                </h4>
                <div style={{ color: '#bdc3c7' }}>
                  <p style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fas fa-map-marker-alt"></i>
                    123 Đường ABC, Quận 1, TP.HCM
                  </p>
                  <p style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fas fa-phone"></i>
                    +84 123 456 789
                  </p>
                  <p style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fas fa-envelope"></i>
                    info@zplus.com
                  </p>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fas fa-clock"></i>
                    8:00 - 17:00, Thứ 2 - Thứ 6
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              borderTop: '1px solid #34495e',
              paddingTop: '30px',
              textAlign: 'center',
              color: '#bdc3c7'
            }}>
              <p>© 2025 ZPlus. Tất cả quyền được bảo lưu.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}