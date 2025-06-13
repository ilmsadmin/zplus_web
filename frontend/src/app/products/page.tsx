'use client'

import { useState } from 'react'

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả')

  const categories = ['Tất cả', 'Website', 'Mobile App', 'E-commerce', 'SaaS', 'Enterprise']

  const products = [
    {
      id: 1,
      name: 'ZPlus CMS',
      description: 'Hệ thống quản lý nội dung hiện đại và linh hoạt',
      category: 'Website',
      price: 'Từ 2,000,000₫',
      image: 'fas fa-edit',
      features: ['Responsive Design', 'SEO Friendly', 'Multi-language', 'Admin Panel'],
      status: 'Available',
      color: '#667eea'
    },
    {
      id: 2,
      name: 'ZPlus E-commerce',
      description: 'Giải pháp thương mại điện tử hoàn chỉnh',
      category: 'E-commerce',
      price: 'Từ 5,000,000₫',
      image: 'fas fa-shopping-cart',
      features: ['Payment Gateway', 'Inventory Management', 'Order Tracking', 'Analytics'],
      status: 'Available',
      color: '#56ab2f'
    },
    {
      id: 3,
      name: 'ZPlus Mobile SDK',
      description: 'Bộ công cụ phát triển ứng dụng mobile',
      category: 'Mobile App',
      price: 'Từ 3,000,000₫',
      image: 'fas fa-mobile-alt',
      features: ['Cross-platform', 'Push Notifications', 'Offline Support', 'Real-time'],
      status: 'Available',
      color: '#f093fb'
    },
    {
      id: 4,
      name: 'ZPlus Analytics',
      description: 'Nền tảng phân tích dữ liệu thông minh',
      category: 'SaaS',
      price: 'Từ 1,500,000₫/tháng',
      image: 'fas fa-chart-line',
      features: ['Real-time Dashboard', 'Custom Reports', 'Data Visualization', 'API Access'],
      status: 'Beta',
      color: '#4facfe'
    },
    {
      id: 5,
      name: 'ZPlus ERP',
      description: 'Hệ thống quản lý tài nguyên doanh nghiệp',
      category: 'Enterprise',
      price: 'Liên hệ',
      image: 'fas fa-building',
      features: ['HR Management', 'Financial Planning', 'Supply Chain', 'Reporting'],
      status: 'Coming Soon',
      color: '#fa8c82'
    },
    {
      id: 6,
      name: 'ZPlus Cloud',
      description: 'Giải pháp điện toán đám mây tối ưu',
      category: 'Enterprise',
      price: 'Từ 500,000₫/tháng',
      image: 'fas fa-cloud',
      features: ['Auto Scaling', 'Load Balancing', 'Backup & Recovery', '24/7 Support'],
      status: 'Available',
      color: '#fdbb2d'
    }
  ]

  const filteredProducts = selectedCategory === 'Tất cả' 
    ? products 
    : products.filter(product => product.category === selectedCategory)

  return (
    <>
      <head>
        <link 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
          rel="stylesheet" 
        />
      </head>
      <div style={{
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
      }}>
        {/* Header */}
        <header style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '2rem 0',
          position: 'relative'
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
              <a href="/services" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Dịch vụ</a>
              <a href="/products" style={{ color: '#f1c40f', textDecoration: 'none', fontWeight: '500' }}>Sản phẩm</a>
              <a href="/projects" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Dự án</a>
              <a href="/blog" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Blog</a>
              <a href="/contact" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Liên hệ</a>
            </div>
          </nav>

          <div style={{
            textAlign: 'center',
            maxWidth: '800px',
            margin: '60px auto 0',
            padding: '0 2rem'
          }}>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: '700',
              marginBottom: '1.5rem',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              Sản phẩm của chúng tôi
            </h1>
            <p style={{
              fontSize: '1.2rem',
              opacity: 0.9,
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Khám phá các sản phẩm công nghệ tiên tiến được phát triển bởi đội ngũ ZPlus
            </p>
          </div>
        </header>

        {/* Category Filter */}
        <section style={{
          background: 'white',
          padding: '2rem 0',
          borderBottom: '1px solid #e9ecef'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '25px',
                    background: selectedCategory === category 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                      : '#f8f9fa',
                    color: selectedCategory === category ? 'white' : '#2c3e50',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== category) {
                      e.currentTarget.style.background = '#e9ecef'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== category) {
                      e.currentTarget.style.background = '#f8f9fa'
                    }
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section style={{
          padding: '4rem 0',
          background: '#f8f9fa'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '2rem'
            }}>
              {filteredProducts.map(product => (
                <div key={product.id} style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '2rem',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  border: '1px solid #e9ecef',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)'
                }}>
                  {/* Status Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    padding: '4px 12px',
                    borderRadius: '15px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: product.status === 'Available' ? '#27ae60' : 
                              product.status === 'Beta' ? '#f39c12' : '#95a5a6',
                    color: 'white'
                  }}>
                    {product.status}
                  </div>

                  {/* Product Icon */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: `linear-gradient(135deg, ${product.color} 0%, ${product.color}88 100%)`,
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    color: 'white',
                    marginBottom: '1.5rem'
                  }}>
                    <i className={product.image}></i>
                  </div>

                  {/* Product Info */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      background: `${product.color}20`,
                      color: product.color,
                      borderRadius: '15px',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginBottom: '1rem'
                    }}>
                      {product.category}
                    </div>
                    
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: '#2c3e50',
                      marginBottom: '0.5rem'
                    }}>
                      {product.name}
                    </h3>

                    <p style={{
                      color: '#7f8c8d',
                      lineHeight: '1.6',
                      marginBottom: '1rem'
                    }}>
                      {product.description}
                    </p>

                    <div style={{
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      color: product.color,
                      marginBottom: '1.5rem'
                    }}>
                      {product.price}
                    </div>
                  </div>

                  {/* Features */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#2c3e50',
                      marginBottom: '1rem'
                    }}>
                      Tính năng nổi bật:
                    </h4>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.5rem'
                    }}>
                      {product.features.map((feature, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          color: '#7f8c8d',
                          fontSize: '0.9rem'
                        }}>
                          <i className="fas fa-check" style={{ 
                            color: product.color,
                            fontSize: '0.8rem'
                          }}></i>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{
                    display: 'flex',
                    gap: '1rem'
                  }}>
                    <button style={{
                      flex: 1,
                      background: `linear-gradient(135deg, ${product.color} 0%, ${product.color}88 100%)`,
                      color: 'white',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '10px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)'
                    }}>
                      <i className="fas fa-info-circle"></i>
                      Chi tiết
                    </button>
                    
                    <button style={{
                      background: 'transparent',
                      color: product.color,
                      border: `2px solid ${product.color}`,
                      padding: '12px 20px',
                      borderRadius: '10px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = product.color
                      e.currentTarget.style.color = 'white'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = product.color
                    }}>
                      <i className="fas fa-download"></i>
                      Demo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '4rem 0',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '0 2rem'
          }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '1rem'
            }}>
              Tìm không thấy sản phẩm phù hợp?
            </h2>
            <p style={{
              fontSize: '1.2rem',
              opacity: 0.9,
              marginBottom: '2rem'
            }}>
              Chúng tôi có thể phát triển giải pháp tùy chỉnh riêng cho doanh nghiệp của bạn
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <a href="/contact" style={{
                background: '#f1c40f',
                color: '#2c3e50',
                padding: '15px 30px',
                borderRadius: '25px',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(241, 196, 15, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}>
                <i className="fas fa-comments"></i>
                Tư vấn miễn phí
              </a>
              <a href="/services" style={{
                background: 'transparent',
                color: 'white',
                padding: '15px 30px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '25px',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.borderColor = 'white'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
              }}>
                <i className="fas fa-cogs"></i>
                Xem dịch vụ
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          background: '#2c3e50',
          color: '#bdc3c7',
          padding: '3rem 0 1rem',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              marginBottom: '2rem',
              flexWrap: 'wrap'
            }}>
              <a href="/" style={{ color: '#bdc3c7', textDecoration: 'none' }}>Trang chủ</a>
              <a href="/services" style={{ color: '#bdc3c7', textDecoration: 'none' }}>Dịch vụ</a>
              <a href="/products" style={{ color: '#bdc3c7', textDecoration: 'none' }}>Sản phẩm</a>
              <a href="/projects" style={{ color: '#bdc3c7', textDecoration: 'none' }}>Dự án</a>
              <a href="/contact" style={{ color: '#bdc3c7', textDecoration: 'none' }}>Liên hệ</a>
            </div>
            <p>&copy; 2024 ZPlus Web. Tất cả quyền được bảo lưu.</p>
          </div>
        </footer>
      </div>
    </>
  )
}
