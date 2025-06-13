'use client'

export default function ProjectsPage() {
  // Mock data for projects
  const mockProjects = [
    {
      id: '1',
      title: 'E-commerce Platform',
      description: 'Nền tảng thương mại điện tử hiện đại với React và Node.js',
      status: 'COMPLETED',
      featured: true,
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
      demoUrl: 'https://demo.zplus.vn/ecommerce',
      thumbnail: '#667eea',
      createdAt: '2024-12-01'
    },
    {
      id: '2',
      title: 'Mobile Banking App',
      description: 'Ứng dụng ngân hàng di động với React Native',
      status: 'ACTIVE',
      featured: true,
      technologies: ['React Native', 'Firebase', 'Biometric Auth'],
      demoUrl: 'https://demo.zplus.vn/banking',
      thumbnail: '#56ab2f',
      createdAt: '2024-11-15'
    },
    {
      id: '3',
      title: 'CRM Management System',
      description: 'Hệ thống quản lý khách hàng cho doanh nghiệp vừa và nhỏ',
      status: 'COMPLETED',
      featured: false,
      technologies: ['Vue.js', 'Laravel', 'MySQL', 'Redis'],
      demoUrl: 'https://demo.zplus.vn/crm',
      thumbnail: '#f093fb',
      createdAt: '2024-10-20'
    },
    {
      id: '4',
      title: 'Analytics Dashboard',
      description: 'Bảng điều khiển phân tích dữ liệu real-time',
      status: 'ACTIVE',
      featured: false,
      technologies: ['Next.js', 'GraphQL', 'D3.js', 'MongoDB'],
      demoUrl: 'https://demo.zplus.vn/analytics',
      thumbnail: '#4facfe',
      createdAt: '2024-09-10'
    },
    {
      id: '5',
      title: 'Learning Management System',
      description: 'Hệ thống quản lý học tập trực tuyến',
      status: 'COMPLETED',
      featured: true,
      technologies: ['Angular', 'Spring Boot', 'WebRTC', 'AWS'],
      demoUrl: 'https://demo.zplus.vn/lms',
      thumbnail: '#845ec2',
      createdAt: '2024-08-05'
    },
    {
      id: '6',
      title: 'IoT Monitoring Platform',
      description: 'Nền tảng giám sát thiết bị IoT thông minh',
      status: 'ACTIVE',
      featured: false,
      technologies: ['React', 'Python', 'MQTT', 'InfluxDB'],
      demoUrl: 'https://demo.zplus.vn/iot',
      thumbnail: '#ff6b6b',
      createdAt: '2024-07-12'
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
      
      <div style={{ margin: 0, padding: 0, boxSizing: 'border-box' }}>
        {/* Header */}
        <header style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '2rem 0',
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
              marginBottom: '1rem',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              Dự án của chúng tôi
            </h1>
            <p style={{
              fontSize: '1.2rem',
              opacity: 0.9,
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Khám phá những dự án công nghệ mà chúng tôi đã thực hiện thành công
            </p>
          </div>
        </header>

        {/* Navigation */}
        <nav style={{
          background: 'white',
          padding: '1rem 0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <a href="/" style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#667eea',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <i className="fas fa-bolt"></i>
              ZPlus
            </a>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <a href="/" style={{ color: '#2c3e50', textDecoration: 'none', fontWeight: '500' }}>Trang chủ</a>
              <a href="/blog" style={{ color: '#2c3e50', textDecoration: 'none', fontWeight: '500' }}>Blog</a>
              <a href="/projects" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>Dự án</a>
              <a href="/admin/dashboard" style={{ color: '#2c3e50', textDecoration: 'none', fontWeight: '500' }}>Admin</a>
            </div>
          </div>
        </nav>

        {/* Filter Section */}
        <section style={{
          background: '#f8f9fa',
          padding: '2rem 0'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem'
          }}>
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              {['Tất cả', 'Nổi bật', 'Hoàn thành', 'Đang thực hiện'].map(filter => (
                <button key={filter} style={{
                  padding: '10px 20px',
                  background: filter === 'Tất cả' ? '#667eea' : 'white',
                  color: filter === 'Tất cả' ? 'white' : '#2c3e50',
                  border: `1px solid ${filter === 'Tất cả' ? '#667eea' : '#e0e6ed'}`,
                  borderRadius: '25px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (filter !== 'Tất cả') {
                    e.currentTarget.style.background = '#667eea'
                    e.currentTarget.style.color = 'white'
                  }
                }}
                onMouseLeave={(e) => {
                  if (filter !== 'Tất cả') {
                    e.currentTarget.style.background = 'white'
                    e.currentTarget.style.color = '#2c3e50'
                  }
                }}>
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section style={{
          padding: '4rem 0',
          background: 'white'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
              gap: '2rem'
            }}>
              {mockProjects.map(project => (
                <div key={project.id} style={{
                  background: 'white',
                  borderRadius: '15px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                }}>
                  {/* Project Thumbnail */}
                  <div style={{
                    height: '200px',
                    background: `linear-gradient(135deg, ${project.thumbnail} 0%, ${project.thumbnail}80 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '3rem',
                    position: 'relative'
                  }}>
                    <i className="fas fa-project-diagram"></i>
                    {project.featured && (
                      <div style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: '#f1c40f',
                        color: '#2c3e50',
                        padding: '5px 10px',
                        borderRadius: '15px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        ⭐ NỔI BẬT
                      </div>
                    )}
                  </div>

                  {/* Project Content */}
                  <div style={{ padding: '2rem' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '1rem'
                    }}>
                      <h3 style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: '#2c3e50',
                        margin: 0,
                        lineHeight: '1.3'
                      }}>
                        {project.title}
                      </h3>
                      <span style={{
                        padding: '4px 12px',
                        background: project.status === 'COMPLETED' ? '#e8f5e8' : '#fff3cd',
                        color: project.status === 'COMPLETED' ? '#27ae60' : '#f39c12',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        whiteSpace: 'nowrap'
                      }}>
                        {project.status === 'COMPLETED' ? 'Hoàn thành' : 'Đang thực hiện'}
                      </span>
                    </div>

                    <p style={{
                      color: '#7f8c8d',
                      lineHeight: '1.6',
                      marginBottom: '1.5rem'
                    }}>
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#2c3e50',
                        marginBottom: '0.5rem'
                      }}>
                        Công nghệ sử dụng:
                      </h4>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem'
                      }}>
                        {project.technologies.map(tech => (
                          <span key={tech} style={{
                            background: '#f8f9fa',
                            color: '#667eea',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            fontWeight: '500'
                          }}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Project Meta */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '1rem',
                      borderTop: '1px solid #f0f0f0'
                    }}>
                      <span style={{
                        color: '#7f8c8d',
                        fontSize: '0.9rem'
                      }}>
                        <i className="fas fa-calendar"></i> {new Date(project.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <a href={project.demoUrl} target="_blank" style={{
                          padding: '8px 16px',
                          background: project.thumbnail,
                          color: 'white',
                          borderRadius: '20px',
                          textDecoration: 'none',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)'
                        }}>
                          <i className="fas fa-external-link-alt"></i> Demo
                        </a>
                        <button style={{
                          padding: '8px 16px',
                          background: 'transparent',
                          color: project.thumbnail,
                          border: `1px solid ${project.thumbnail}`,
                          borderRadius: '20px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = project.thumbnail
                          e.currentTarget.style.color = 'white'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.color = project.thumbnail
                        }}>
                          <i className="fas fa-info-circle"></i> Chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
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
              Có ý tưởng dự án?
            </h2>
            <p style={{
              fontSize: '1.2rem',
              marginBottom: '2rem',
              opacity: 0.9
            }}>
              Hãy chia sẻ ý tưởng của bạn với chúng tôi. Chúng tôi sẽ giúp biến ý tưởng 
              thành hiện thực với công nghệ hiện đại nhất.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#contact" style={{
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
                <i className="fas fa-paper-plane"></i> Bắt đầu dự án
              </a>
              <a href="/" style={{
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
                <i className="fas fa-home"></i> Về trang chủ
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
