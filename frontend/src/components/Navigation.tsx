'use client'

import Link from 'next/link'
import { useAuth } from '../lib/auth/auth-context'

export default function Navigation() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav style={{
      backgroundColor: '#1976d2',
      padding: '1rem 2rem',
      marginBottom: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href="/" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            ZPlus Web
          </Link>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>
              Home
            </Link>
            <Link href="/blog" style={{ color: 'white', textDecoration: 'none' }}>
              Blog
            </Link>
            <Link href="/projects" style={{ color: 'white', textDecoration: 'none' }}>
              Projects
            </Link>
            {isAdmin && (
              <Link href="/admin" style={{ color: 'white', textDecoration: 'none' }}>
                Admin
              </Link>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <>
              <span style={{ color: 'white' }}>
                Welcome, {user?.firstName || user?.username}!
              </span>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '1px solid white',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={{
                color: 'white',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                border: '1px solid white',
                borderRadius: '4px'
              }}>
                Login
              </Link>
              <Link href="/register" style={{
                backgroundColor: 'white',
                color: '#1976d2',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                fontWeight: 'bold'
              }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
