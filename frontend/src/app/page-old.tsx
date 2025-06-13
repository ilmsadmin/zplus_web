'use client'

import { useState, useEffect } from 'react'
import { useQuery, gql } from '@apollo/client'

// Simple GraphQL query for users
const GET_USERS = gql`
  query GetUsers {
    users {
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
  const { data: apolloData, loading, error } = useQuery(GET_USERS, {
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
            <a href="#home" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Trang chủ</a>
            <a href="#services" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Dịch vụ</a>
            <a href="#products" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Sản phẩm</a>
            <a href="/projects" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Dự án</a>
            <a href="/blog" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Blog</a>
            <a href="#contact" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Liên hệ</a>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="/admin/dashboard" style={{
              padding: '10px 20px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '25px',
              color: 'white',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}>
              <i className="fas fa-sign-in-alt"></i> Admin
            </a>
            <a href="http://localhost:4001/playground" target="_blank" style={{
              padding: '10px 20px',
              background: '#f1c40f',
              color: '#2c3e50',
              borderRadius: '25px',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}>
              <i className="fas fa-database"></i> GraphQL
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
        
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '1.5rem', 
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h2 style={{ color: '#555', marginBottom: '1rem' }}>
          System Status
        </h2>
        <div style={{ marginBottom: '1rem' }}>
          <strong>Frontend:</strong> 
          <span style={{ color: 'green', marginLeft: '0.5rem' }}>
            ✓ Running (Next.js + Apollo Client)
          </span>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <strong>Backend:</strong> 
          <span style={{ 
            color: backendStatus === 'connected' ? 'green' : 'red',
            marginLeft: '0.5rem'
          }}>
            {backendStatus === 'connected' ? '✓ Connected' : '✗ Disconnected'} 
            (GraphQL API)
          </span>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <strong>GraphQL Query:</strong> 
          <span style={{ 
            color: loading ? 'orange' : error ? 'red' : apolloData ? 'green' : 'gray',
            marginLeft: '0.5rem'
          }}>
            {loading ? '⏳ Loading...' : 
             error ? '✗ Error' : 
             apolloData ? '✓ Success' : '○ Idle'}
          </span>
        </div>
        
        {apolloData && (
          <div style={{ 
            backgroundColor: '#e8f5e8', 
            padding: '1rem', 
            borderRadius: '4px',
            marginTop: '1rem'
          }}>
            <strong>Apollo GraphQL Response:</strong>
            <p style={{ margin: '0.5rem 0', fontSize: '0.9em' }}>
              Found {apolloData.users?.length || 0} users in the system
            </p>
            <details style={{ marginTop: '0.5rem' }}>
              <summary style={{ cursor: 'pointer', fontSize: '0.9em' }}>Show raw data</summary>
              <pre style={{ margin: '0.5rem 0', fontSize: '0.8em', backgroundColor: '#f9f9f9', padding: '0.5rem' }}>
                {JSON.stringify(apolloData, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {error && (
          <div style={{ 
            backgroundColor: '#ffe8e8', 
            padding: '1rem', 
            borderRadius: '4px',
            marginTop: '1rem'
          }}>
            <strong>GraphQL Error:</strong>
            <pre style={{ margin: '0.5rem 0', fontSize: '0.8em', color: '#d32f2f' }}>
              {error.message}
            </pre>
          </div>
        )}
      </div>

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

      {/* Products Section */}
      <section id="products" style={{
        padding: '100px 0',
        background: 'white'
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
              Sản phẩm phần mềm
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#7f8c8d',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Các sản phẩm phần mềm chất lượng cao được thiết kế để tối ưu hóa hoạt động kinh doanh
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '40px'
          }}>
            {[
              {
                name: 'CRM Pro',
                price: '2,999,000',
                description: 'Hệ thống quản lý khách hàng chuyên nghiệp',
                features: ['Quản lý khách hàng', 'Theo dõi bán hàng', 'Báo cáo thống kê', 'Tích hợp email'],
                color: '#667eea'
              },
              {
                name: 'Inventory Manager',
                price: '1,999,000',
                description: 'Phần mềm quản lý kho hàng thông minh',
                features: ['Quản lý tồn kho', 'Nhập/xuất hàng', 'Cảnh báo hết hàng', 'Báo cáo doanh thu'],
                color: '#56ab2f'
              },
              {
                name: 'Analytics Dashboard',
                price: '3,999,000',
                description: 'Bảng điều khiển phân tích dữ liệu',
                features: ['Phân tích real-time', 'Biểu đồ tương tác', 'Machine Learning', 'API tích hợp'],
                color: '#f093fb'
              }
            ].map((product, index) => (
              <div key={index} style={{
                background: 'white',
                border: '1px solid #e0e6ed',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
              }}>
                <div style={{
                  background: `linear-gradient(135deg, ${product.color} 0%, ${product.color}80 100%)`,
                  padding: '30px',
                  textAlign: 'center',
                  color: 'white'
                }}>
                  <h3 style={{
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    marginBottom: '10px'
                  }}>
                    {product.name}
                  </h3>
                  <p style={{
                    opacity: 0.9,
                    marginBottom: '20px'
                  }}>
                    {product.description}
                  </p>
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: '700'
                  }}>
                    {product.price}₫
                  </div>
                </div>
                <div style={{ padding: '30px' }}>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    marginBottom: '30px'
                  }}>
                    {product.features.map((feature, fIndex) => (
                      <li key={fIndex} style={{
                        padding: '8px 0',
                        borderBottom: '1px solid #f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <i className="fas fa-check" style={{ color: '#27ae60' }}></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button style={{
                    width: '100%',
                    padding: '15px',
                    background: `linear-gradient(135deg, ${product.color} 0%, ${product.color}80 100%)`,
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}>
                    <i className="fas fa-shopping-cart"></i> Mua ngay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* System Status Section (Fixed position) */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'white',
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        border: '1px solid #e0e6ed',
        zIndex: 1000,
        maxWidth: '300px'
      }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#2c3e50' }}>
          System Status
        </h4>
        <div style={{ fontSize: '0.8rem' }}>
          <div style={{ marginBottom: '5px' }}>
            <strong>Backend:</strong> 
            <span style={{ 
              color: backendStatus === 'connected' ? 'green' : 'red',
              marginLeft: '5px'
            }}>
              {backendStatus === 'connected' ? '✓ Connected' : '✗ Disconnected'}
            </span>
          </div>
          <div style={{ marginBottom: '5px' }}>
            <strong>GraphQL:</strong> 
            <span style={{ 
              color: loading ? 'orange' : error ? 'red' : apolloData ? 'green' : 'gray',
              marginLeft: '5px'
            }}>
              {loading ? '⏳ Loading...' : 
               error ? '✗ Error' : 
               apolloData ? `✓ ${apolloData.users?.length || 0} users` : '○ Idle'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer id="contact" style={{
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
                Sản phẩm
              </h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {['CRM Pro', 'Inventory Manager', 'Analytics Dashboard', 'Support System'].map(product => (
                  <li key={product} style={{ marginBottom: '10px' }}>
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
                      {product}
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
  )
}