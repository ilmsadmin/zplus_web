'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // TODO: Implement actual login API call
      console.log('Login attempt:', formData)
      
      // Mock login success - replace with real API call
      setTimeout(() => {
        setLoading(false)
        router.push('/admin/dashboard')
      }, 1000)
    } catch (err) {
      setLoading(false)
      setError('Đăng nhập thất bại. Vui lòng thử lại.')
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
          maxWidth: '900px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          minHeight: '600px'
        }}>
          {/* Left Side - Login Form */}
          <div style={{
            padding: '60px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ marginBottom: '40px' }}>
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
                Chào mừng trở lại!
              </h1>
              <p style={{
                color: '#7f8c8d',
                fontSize: '16px',
                lineHeight: '1.5'
              }}>
                Đăng nhập để truy cập vào tài khoản của bạn
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

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#2c3e50',
                  fontWeight: '600'
                }}>
                  Email
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
                      padding: '16px 16px 16px 48px',
                      border: '2px solid #ecf0f1',
                      borderRadius: '12px',
                      fontSize: '16px',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    placeholder="Nhập email của bạn"
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea'
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#ecf0f1'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#2c3e50',
                  fontWeight: '600'
                }}>
                  Mật khẩu
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
                      padding: '16px 16px 16px 48px',
                      border: '2px solid #ecf0f1',
                      borderRadius: '12px',
                      fontSize: '16px',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    placeholder="Nhập mật khẩu"
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea'
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#ecf0f1'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px'
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#7f8c8d',
                  cursor: 'pointer'
                }}>
                  <input type="checkbox" style={{ marginRight: '4px' }} />
                  Ghi nhớ đăng nhập
                </label>
                <Link href="/forgot-password" style={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}>
                  Quên mật khẩu?
                </Link>
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
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt"></i>
                    Đăng nhập
                  </>
                )}
              </button>

              <div style={{
                textAlign: 'center',
                marginTop: '30px',
                color: '#7f8c8d'
              }}>
                Chưa có tài khoản?{' '}
                <Link href="/register" style={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}>
                  Đăng ký ngay
                </Link>
              </div>
            </form>
          </div>

          {/* Right Side - Illustration */}
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
                <i className="fas fa-rocket"></i>
              </div>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '700',
                marginBottom: '15px'
              }}>
                Bắt đầu hành trình
              </h2>
              <p style={{
                fontSize: '16px',
                opacity: 0.9,
                lineHeight: '1.6',
                maxWidth: '280px'
              }}>
                Truy cập vào hệ thống quản lý và các dịch vụ công nghệ hiện đại của ZPlus
              </p>
            </div>
            
            {/* Background decoration */}
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '200px',
              height: '200px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '-100px',
              left: '-100px',
              width: '300px',
              height: '300px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '50%'
            }}></div>
          </div>
        </div>
      </div>
    </>
  )
}
