'use client'

export default function ServicesPage() {
  const services = [
    {
      title: 'Phát triển Web',
      description: 'Thiết kế và phát triển website chuyên nghiệp với công nghệ hiện đại',
      icon: 'fas fa-globe',
      features: ['Responsive Design', 'SEO Optimization', 'High Performance', 'Security'],
      color: '#667eea'
    },
    {
      title: 'Ứng dụng Mobile',
      description: 'Phát triển ứng dụng mobile đa nền tảng iOS và Android',
      icon: 'fas fa-mobile-alt',
      features: ['React Native', 'Flutter', 'Native iOS/Android', 'Cross-platform'],
      color: '#56ab2f'
    },
    {
      title: 'E-commerce',
      description: 'Giải pháp thương mại điện tử hoàn chỉnh cho doanh nghiệp',
      icon: 'fas fa-shopping-cart',
      features: ['Online Store', 'Payment Gateway', 'Inventory Management', 'Analytics'],
      color: '#f093fb'
    },
    {
      title: 'UI/UX Design',
      description: 'Thiết kế giao diện người dùng trực quan và thân thiện',
      icon: 'fas fa-paint-brush',
      features: ['User Research', 'Wireframing', 'Prototyping', 'Visual Design'],
      color: '#4facfe'
    },
    {
      title: 'Cloud Solutions',
      description: 'Triển khai và quản lý hạ tầng đám mây an toàn, mở rộng',
      icon: 'fas fa-cloud',
      features: ['AWS/Azure', 'DevOps', 'Scalability', 'Monitoring'],
      color: '#fa8c82'
    },
    {
      title: 'Tư vấn Công nghệ',
      description: 'Tư vấn chiến lược công nghệ và chuyển đổi số cho doanh nghiệp',
      icon: 'fas fa-lightbulb',
      features: ['Digital Strategy', 'Tech Consulting', 'Process Optimization', 'Training'],
      color: '#fdbb2d'
    }
  ]

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
              <a href="/services" style={{ color: '#f1c40f', textDecoration: 'none', fontWeight: '500' }}>Dịch vụ</a>
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
              Dịch vụ của chúng tôi
            </h1>
            <p style={{
              fontSize: '1.2rem',
              opacity: 0.9,
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Chúng tôi cung cấp các giải pháp công nghệ toàn diện để giúp doanh nghiệp của bạn phát triển mạnh mẽ trong kỷ nguyên số
            </p>
          </div>
        </header>

        {/* Services Grid */}
        <section style={{
          padding: '6rem 0',
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
              {services.map((service, index) => (
                <div key={index} style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '2.5rem',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  border: '1px solid #e9ecef'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)'
                }}>
                  <div style={{
                    width: '70px',
                    height: '70px',
                    background: `linear-gradient(135deg, ${service.color} 0%, ${service.color}88 100%)`,
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    color: 'white',
                    marginBottom: '1.5rem'
                  }}>
                    <i className={service.icon}></i>
                  </div>

                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#2c3e50',
                    marginBottom: '1rem'
                  }}>
                    {service.title}
                  </h3>

                  <p style={{
                    color: '#7f8c8d',
                    lineHeight: '1.6',
                    marginBottom: '1.5rem'
                  }}>
                    {service.description}
                  </p>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#2c3e50',
                      marginBottom: '1rem'
                    }}>
                      Tính năng chính:
                    </h4>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.5rem'
                    }}>
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          color: '#7f8c8d',
                          fontSize: '0.9rem'
                        }}>
                          <i className="fas fa-check" style={{ 
                            color: service.color,
                            fontSize: '0.8rem'
                          }}></i>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button style={{
                    background: `linear-gradient(135deg, ${service.color} 0%, ${service.color}88 100%)`,
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '25px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                  }}>
                    <i className="fas fa-arrow-right"></i>
                    Tìm hiểu thêm
                  </button>
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
              Sẵn sàng bắt đầu dự án?
            </h2>
            <p style={{
              fontSize: '1.2rem',
              opacity: 0.9,
              marginBottom: '2rem'
            }}>
              Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí
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
                <i className="fas fa-phone"></i>
                Liên hệ ngay
              </a>
              <a href="/projects" style={{
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
                <i className="fas fa-eye"></i>
                Xem dự án
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
              marginBottom: '2rem'
            }}>
              <a href="/" style={{ color: '#bdc3c7', textDecoration: 'none' }}>Trang chủ</a>
              <a href="/services" style={{ color: '#bdc3c7', textDecoration: 'none' }}>Dịch vụ</a>
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
