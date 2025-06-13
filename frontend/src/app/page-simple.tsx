'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<string>('connecting...')
  const [apiData, setApiData] = useState<any>(null)

  useEffect(() => {
    // Test GraphQL backend connection
    const testBackend = async () => {
      try {
        const response = await fetch('http://localhost:3002/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query {
                dashboardStats {
                  totalUsers
                  totalPosts
                  totalProjects
                }
              }
            `
          })
        })
        
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
          Welcome to ZPlus Web - GraphQL Edition
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
              (GraphQL API)
            </span>
          </div>
          {apiData && (
            <div style={{ 
              backgroundColor: '#e8f5e8', 
              padding: '1rem', 
              borderRadius: '4px',
              marginTop: '1rem'
            }}>
              <strong>GraphQL Response:</strong>
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
              <strong>Backend:</strong> Golang with GraphQL
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Database:</strong> PostgreSQL with Ent ORM
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Cache:</strong> Redis
            </li>
          </ul>
        </div>

        <div style={{ 
          backgroundColor: '#fff3e0', 
          padding: '1.5rem', 
          borderRadius: '8px',
          marginTop: '2rem'
        }}>
          <h2 style={{ color: '#555', marginBottom: '1rem' }}>
            GraphQL Endpoints
          </h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>GraphQL API:</strong> 
              <code style={{ marginLeft: '0.5rem', padding: '2px 4px', backgroundColor: '#f5f5f5' }}>
                http://localhost:3002/graphql
              </code>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>GraphQL Playground:</strong> 
              <a 
                href="http://localhost:3002/playground" 
                target="_blank" 
                style={{ marginLeft: '0.5rem', color: '#1976d2' }}
              >
                http://localhost:3002/playground
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Health Check:</strong> 
              <a 
                href="http://localhost:3002/health" 
                target="_blank" 
                style={{ marginLeft: '0.5rem', color: '#1976d2' }}
              >
                http://localhost:3002/health
              </a>
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}
