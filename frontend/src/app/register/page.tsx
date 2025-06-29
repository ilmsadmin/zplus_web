'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    acceptTerms: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      setLoading(false)
      return
    }

    if (!formData.acceptTerms) {
      setError('Bạn cần đồng ý với điều khoản sử dụng')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          full_name: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone || ''
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setLoading(false)
        setSuccess('Đăng ký thành công! Đang chuyển hướng...')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        setLoading(false)
        setError(data.message || 'Đăng ký thất bại. Vui lòng thử lại.')
      }
    } catch (err) {
      setLoading(false)
      setError('Đăng ký thất bại. Vui lòng thử lại.')
    }
  }

  return (
    <>
      <head>
        <link 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
          rel="stylesheet" 
        />
      </head>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '1000px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          minHeight: '700px'
        }}>
          {/* Left Side - Illustration */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              textAlign: 'center',
              zIndex: 2,
              position: 'relative'
            }}>
              <div style={{
                fontSize: '80px',
                marginBottom: '20px',
                opacity: 0.9
              }}>
                <i className="fas fa-user-plus"></i>
              </div>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '700',
                marginBottom: '15px'
              }}>
                Tham gia cùng chúng tôi
              </h2>
              <p style={{
                fontSize: '16px',
                opacity: 0.9,
                lineHeight: '1.6',
                maxWidth: '300px'
              }}>
                Tạo tài khoản để trải nghiệm đầy đủ các dịch vụ và tính năng của ZPlus
              </p>
              
              <div style={{
                marginTop: '40px',
                display: 'flex',
                justifyContent: 'center',
                gap: '20px'
              }}>
                {['fas fa-shield-alt', 'fas fa-lightning-bolt', 'fas fa-heart'].map((icon, index) => (
                  <div key={index} style={{
                    width: '50px',
                    height: '50px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    <i className={icon}></i>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Background decoration */}
            <div style={{
              position: 'absolute',
              top: '-50px',
              left: '-50px',
              width: '200px',
              height: '200px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '-100px',
              right: '-100px',
              width: '300px',
              height: '300px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '50%'
            }}></div>
          </div>

          {/* Right Side - Register Form */}
          <div style={{
            padding: '60px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            overflowY: 'auto'
          }}>
            <div style={{ marginBottom: '30px' }}>
              <Link href="/" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                color: '#667eea',
                textDecoration: 'none',
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '20px'
              }}>
                <i className="fas fa-bolt"></i>
                ZPlus
              </Link>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#2c3e50',
                marginBottom: '10px'
              }}>
                Tạo tài khoản mới
              </h1>
              <p style={{
                color: '#7f8c8d',
                fontSize: '16px',
                lineHeight: '1.5'
              }}>
                Điền thông tin bên dưới để tạo tài khoản
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              {error && (
                <div style={{
                  background: '#fee',
                  color: '#c33',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  border: '1px solid #fcc'
                }}>
                  <i className="fas fa-exclamation-circle"></i> {error}
                </div>
              )}

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

              {/* Name Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#2c3e50',
                    fontWeight: '600'
                  }}>
                    Họ *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #ecf0f1',
                      borderRadius: '8px',
                      fontSize: '16px',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    placeholder="Họ"
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#ecf0f1'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#2c3e50',
                    fontWeight: '600'
                  }}>
                    Tên *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #ecf0f1',
                      borderRadius: '8px',
                      fontSize: '16px',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    placeholder="Tên"
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#ecf0f1'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#2c3e50',
                  fontWeight: '600'
                }}>
                  Tên đăng nhập *
                </label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-user" style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#7f8c8d'
                  }}></i>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px 12px 48px',
                      border: '2px solid #ecf0f1',
                      borderRadius: '8px',
                      fontSize: '16px',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    placeholder="Tên đăng nhập"
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#ecf0f1'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#2c3e50',
                  fontWeight: '600'
                }}>
                  Email *
                </label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-envelope" style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#7f8c8d'
                  }}></i>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px 12px 48px',
                      border: '2px solid #ecf0f1',
                      borderRadius: '8px',
                      fontSize: '16px',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    placeholder="Email của bạn"
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#ecf0f1'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#2c3e50',
                  fontWeight: '600'
                }}>
                  Số điện thoại
                </label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-phone" style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#7f8c8d'
                  }}></i>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px 12px 48px',
                      border: '2px solid #ecf0f1',
                      borderRadius: '8px',
                      fontSize: '16px',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    placeholder="Số điện thoại"
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#ecf0f1'
                    }}
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#2c3e50',
                    fontWeight: '600'
                  }}>
                    Mật khẩu *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <i className="fas fa-lock" style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#7f8c8d'
                    }}></i>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px 12px 48px',
                        border: '2px solid #ecf0f1',
                        borderRadius: '8px',
                        fontSize: '16px',
                        transition: 'all 0.3s ease',
                        outline: 'none'
                      }}
                      placeholder="Mật khẩu"
                      onFocus={(e) => {
                        e.target.style.borderColor = '#667eea'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ecf0f1'
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#2c3e50',
                    fontWeight: '600'
                  }}>
                    Xác nhận mật khẩu *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <i className="fas fa-lock" style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#7f8c8d'
                    }}></i>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px 12px 48px',
                        border: '2px solid #ecf0f1',
                        borderRadius: '8px',
                        fontSize: '16px',
                        transition: 'all 0.3s ease',
                        outline: 'none'
                      }}
                      placeholder="Xác nhận mật khẩu"
                      onFocus={(e) => {
                        e.target.style.borderColor = '#667eea'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ecf0f1'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  color: '#7f8c8d',
                  cursor: 'pointer',
                  lineHeight: '1.5'
                }}>
                  <input 
                    type="checkbox" 
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    style={{ marginTop: '2px' }}
                    required
                  />
                  <span>
                    Tôi đồng ý với{' '}
                    <Link href="/terms" style={{ color: '#667eea', textDecoration: 'none' }}>
                      Điều khoản sử dụng
                    </Link>
                    {' '}và{' '}
                    <Link href="/privacy" style={{ color: '#667eea', textDecoration: 'none' }}>
                      Chính sách bảo mật
                    </Link>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: loading ? '#bdc3c7' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
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
                    Đang tạo tài khoản...
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus"></i>
                    Tạo tài khoản
                  </>
                )}
              </button>

              <div style={{
                textAlign: 'center',
                marginTop: '30px',
                color: '#7f8c8d'
              }}>
                Đã có tài khoản?{' '}
                <Link href="/login" style={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}>
                  Đăng nhập ngay
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
