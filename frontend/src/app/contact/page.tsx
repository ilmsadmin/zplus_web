'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    service: 'Web Development'
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess('')

    try {
      // TODO: Implement actual contact form API call
      console.log('Contact form submission:', formData)
      
      // Mock success - replace with real API call
      setTimeout(() => {
        setLoading(false)
        setSuccess('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24 giờ.')
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          service: 'Web Development'
        })
      }, 1000)
    } catch (err) {
      setLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: 'fas fa-phone',
      title: 'Điện thoại',
      info: '+84 123 456 789',
      link: 'tel:+84123456789'
    },
    {
      icon: 'fas fa-envelope',
      title: 'Email',
      info: 'contact@zplus.com',
      link: 'mailto:contact@zplus.com'
    },
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Địa chỉ',
      info: '123 Nguyễn Huệ, Q1, TP.HCM',
      link: 'https://maps.google.com'
    },
    {
      icon: 'fas fa-clock',
      title: 'Giờ làm việc',
      info: 'T2-T6: 8:00 - 17:30',
      link: null
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
              <a href="/services" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Dịch vụ</a>
              <a href="/projects" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Dự án</a>
              <a href="/blog" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Blog</a>
              <a href="/contact" style={{ color: '#f1c40f', textDecoration: 'none', fontWeight: '500' }}>Liên hệ</a>
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
              Liên hệ với chúng tôi
            </h1>
            <p style={{
              fontSize: '1.2rem',
              opacity: 0.9,
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại thông tin để được tư vấn miễn phí
            </p>
          </div>
        </header>

        {/* Contact Section */}
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
              gridTemplateColumns: '1fr 1fr',
              gap: '4rem',
              alignItems: 'start'
            }}>
              {/* Contact Info */}
              <div>
                <h2 style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#2c3e50',
                  marginBottom: '2rem'
                }}>
                  Thông tin liên hệ
                </h2>
                <p style={{
                  color: '#7f8c8d',
                  lineHeight: '1.6',
                  marginBottom: '2rem'
                }}>
                  Chúng tôi cam kết mang đến những giải pháp công nghệ tốt nhất cho doanh nghiệp của bạn. 
                  Hãy liên hệ với chúng tôi qua các kênh sau:
                </p>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem'
                }}>
                  {contactInfo.map((item, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      background: 'white',
                      borderRadius: '10px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                    }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '18px'
                      }}>
                        <i className={item.icon}></i>
                      </div>
                      <div>
                        <h4 style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#2c3e50',
                          margin: '0 0 5px 0'
                        }}>
                          {item.title}
                        </h4>
                        {item.link ? (
                          <a href={item.link} style={{
                            color: '#667eea',
                            textDecoration: 'none'
                          }}>
                            {item.info}
                          </a>
                        ) : (
                          <span style={{ color: '#7f8c8d' }}>{item.info}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social Media */}
                <div style={{ marginTop: '2rem' }}>
                  <h4 style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#2c3e50',
                    marginBottom: '1rem'
                  }}>
                    Theo dõi chúng tôi
                  </h4>
                  <div style={{
                    display: 'flex',
                    gap: '1rem'
                  }}>
                    {['facebook', 'twitter', 'linkedin', 'instagram'].map(social => (
                      <a key={social} href={`#${social}`} style={{
                        width: '45px',
                        height: '45px',
                        background: '#34495e',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#667eea'
                        e.currentTarget.style.transform = 'translateY(-2px)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#34495e'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}>
                        <i className={`fab fa-${social}`}></i>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div style={{
                background: 'white',
                padding: '3rem',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#2c3e50',
                  marginBottom: '1.5rem'
                }}>
                  Gửi tin nhắn cho chúng tôi
                </h3>

                {success && (
                  <div style={{
                    background: '#efe',
                    color: '#3c3',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: '1px solid #cfc'
                  }}>
                    <i className="fas fa-check-circle"></i> {success}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#2c3e50',
                        fontWeight: '600'
                      }}>
                        Họ tên *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid #ecf0f1',
                          borderRadius: '8px',
                          fontSize: '16px',
                          transition: 'border-color 0.3s ease',
                          outline: 'none'
                        }}
                        placeholder="Nhập họ tên"
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#ecf0f1'}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#2c3e50',
                        fontWeight: '600'
                      }}>
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid #ecf0f1',
                          borderRadius: '8px',
                          fontSize: '16px',
                          transition: 'border-color 0.3s ease',
                          outline: 'none'
                        }}
                        placeholder="Nhập email"
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#ecf0f1'}
                      />
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#2c3e50',
                        fontWeight: '600'
                      }}>
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid #ecf0f1',
                          borderRadius: '8px',
                          fontSize: '16px',
                          transition: 'border-color 0.3s ease',
                          outline: 'none'
                        }}
                        placeholder="Nhập số điện thoại"
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#ecf0f1'}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#2c3e50',
                        fontWeight: '600'
                      }}>
                        Dịch vụ quan tâm
                      </label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid #ecf0f1',
                          borderRadius: '8px',
                          fontSize: '16px',
                          transition: 'border-color 0.3s ease',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#ecf0f1'}
                      >
                        <option value="Web Development">Phát triển Web</option>
                        <option value="Mobile App">Ứng dụng Mobile</option>
                        <option value="E-commerce">E-commerce</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                        <option value="Cloud Solutions">Cloud Solutions</option>
                        <option value="Consulting">Tư vấn</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#2c3e50',
                      fontWeight: '600'
                    }}>
                      Tiêu đề *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #ecf0f1',
                        borderRadius: '8px',
                        fontSize: '16px',
                        transition: 'border-color 0.3s ease',
                        outline: 'none'
                      }}
                      placeholder="Tiêu đề tin nhắn"
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#ecf0f1'}
                    />
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#2c3e50',
                      fontWeight: '600'
                    }}>
                      Nội dung *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #ecf0f1',
                        borderRadius: '8px',
                        fontSize: '16px',
                        transition: 'border-color 0.3s ease',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                      placeholder="Mô tả chi tiết yêu cầu của bạn..."
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#ecf0f1'}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      background: loading ? '#bdc3c7' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '15px',
                      borderRadius: '10px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                      }
                    }}
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i>
                        Gửi tin nhắn
                      </>
                    )}
                  </button>
                </form>
              </div>
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
