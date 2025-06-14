'use client'

import type { Metadata } from 'next'
import './admin.css'
import AuthGuard from '../../components/admin/AuthGuard'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  async function handleLogout() {
    try {
      const token = localStorage.getItem('admin_token')
      if (token) {
        await fetch('/api/v1/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      }
      localStorage.removeItem('admin_token')
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout error:', error)
      localStorage.removeItem('admin_token')
      window.location.href = '/login'
    }
  }
  return (
    <AuthGuard>
      <div style={{
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        background: '#f5f6fa',
        color: '#2c3e50',
        lineHeight: '1.6'
      }}>
        <div style={{
          display: 'flex',
          minHeight: '100vh'
        }}>
          {/* Sidebar */}
          <nav style={{
            width: '260px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            position: 'fixed',
            height: '100vh',
            overflowY: 'auto',
            boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              padding: '30px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              textAlign: 'center'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}>
                <i className="fas fa-bolt"></i>
                ZPlus Admin
              </h2>
              <p style={{
                fontSize: '14px',
                opacity: 0.8
              }}>
                Management Panel
              </p>
            </div>

            <div style={{ padding: '20px 0' }}>
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  fontWeight: '600',
                  letterSpacing: '1px',
                  padding: '0 20px',
                  marginBottom: '15px'
                }}>
                  DASHBOARD
                </h3>
                <a href="/admin/dashboard" style={{
                  display: 'block',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '12px 20px',
                  transition: 'all 0.3s ease',
                  borderLeft: '3px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.borderLeftColor = '#fff'
                  e.currentTarget.style.paddingLeft = '25px'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderLeftColor = 'transparent'
                  e.currentTarget.style.paddingLeft = '20px'
                }}>
                  <i className="fas fa-tachometer-alt" style={{ width: '20px', marginRight: '12px', textAlign: 'center' }}></i>
                  Analytics
                </a>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <h3 style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  fontWeight: '600',
                  letterSpacing: '1px',
                  padding: '0 20px',
                  marginBottom: '15px'
                }}>
                  CONTENT
                </h3>
                {[
                  { href: '/admin/blog', icon: 'fas fa-blog', text: 'Blog Posts' },
                  { href: '/admin/projects', icon: 'fas fa-project-diagram', text: 'Projects' },
                  { href: '/admin/reports', icon: 'fas fa-chart-bar', text: 'Reports' }
                ].map((item, index) => (
                  <a key={index} href={item.href} style={{
                    display: 'block',
                    color: 'white',
                    textDecoration: 'none',
                    padding: '12px 20px',
                    transition: 'all 0.3s ease',
                    borderLeft: '3px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.borderLeftColor = '#fff'
                    e.currentTarget.style.paddingLeft = '25px'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderLeftColor = 'transparent'
                    e.currentTarget.style.paddingLeft = '20px'
                  }}>
                    <i className={item.icon} style={{ width: '20px', marginRight: '12px', textAlign: 'center' }}></i>
                    {item.text}
                  </a>
                ))}
              </div>

              <div style={{ marginBottom: '30px' }}>
                <h3 style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  fontWeight: '600',
                  letterSpacing: '1px',
                  padding: '0 20px',
                  marginBottom: '15px'
                }}>
                  COMMERCE
                </h3>
                {[
                  { href: '/admin/products', icon: 'fas fa-box', text: 'Products' },
                  { href: '/admin/orders', icon: 'fas fa-shopping-cart', text: 'Orders' },
                  { href: '/admin/files', icon: 'fas fa-folder', text: 'File Manager' }
                ].map((item, index) => (
                  <a key={index} href={item.href} style={{
                    display: 'block',
                    color: 'white',
                    textDecoration: 'none',
                    padding: '12px 20px',
                    transition: 'all 0.3s ease',
                    borderLeft: '3px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.borderLeftColor = '#fff'
                    e.currentTarget.style.paddingLeft = '25px'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderLeftColor = 'transparent'
                    e.currentTarget.style.paddingLeft = '20px'
                  }}>
                    <i className={item.icon} style={{ width: '20px', marginRight: '12px', textAlign: 'center' }}></i>
                    {item.text}
                  </a>
                ))}
              </div>

              <div style={{ marginBottom: '30px' }}>
                <h3 style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  fontWeight: '600',
                  letterSpacing: '1px',
                  padding: '0 20px',
                  marginBottom: '15px'
                }}>
                  SYSTEM
                </h3>
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'block',
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    textDecoration: 'none',
                    padding: '12px 20px',
                    transition: 'all 0.3s ease',
                    borderLeft: '3px solid transparent',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.borderLeftColor = '#fff'
                    e.currentTarget.style.paddingLeft = '25px'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderLeftColor = 'transparent'
                    e.currentTarget.style.paddingLeft = '20px'
                  }}
                >
                  <i className="fas fa-sign-out-alt" style={{ width: '20px', marginRight: '12px', textAlign: 'center' }}></i>
                  Logout
                </button>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main style={{
            flex: 1,
            marginLeft: '260px',
            padding: '30px',
            background: '#f8f9fa'
          }}>
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}