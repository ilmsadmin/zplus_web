'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<string>('connecting...')
  const [apiData, setApiData] = useState<any>(null)

  useEffect(() => {
    // Test backend connection
    const testBackend = async () => {
      try {
        const response = await fetch('http://localhost:3000/health')
        if (response.ok) {
          const data = await response.json()
          setBackendStatus('connected')
          setApiData(data)
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
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: '#333', marginBottom: '2rem' }}>
          Welcome to ZPlus Web
        </h1>
        
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
              ✓ Running (Next.js)
            </span>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Backend:</strong> 
            <span style={{ 
              color: backendStatus === 'connected' ? 'green' : 'red',
              marginLeft: '0.5rem'
            }}>
              {backendStatus === 'connected' ? '✓ Connected' : '✗ Disconnected'} 
              (Fiber Golang)
            </span>
          </div>
          {apiData && (
            <div style={{ 
              backgroundColor: '#e8f5e8', 
              padding: '1rem', 
              borderRadius: '4px',
              marginTop: '1rem'
            }}>
              <strong>API Response:</strong>
              <pre style={{ margin: '0.5rem 0', fontSize: '0.9em' }}>
                {JSON.stringify(apiData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div style={{ 
          backgroundColor: '#f0f8ff', 
          padding: '1.5rem', 
          borderRadius: '8px'
        }}>
          <h2 style={{ color: '#555', marginBottom: '1rem' }}>
            Technology Stack
          </h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Frontend:</strong> Next.js, React, TypeScript
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Backend:</strong> Fiber (Golang)
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Database:</strong> PostgreSQL
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Cache:</strong> Redis
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}