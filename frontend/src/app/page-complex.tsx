'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { GET_DASHBOARD_STATS } from '../lib/graphql/queries'
import { DashboardStats } from '../lib/graphql/types'

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<string>('connecting...')
  
  // Use GraphQL query for dashboard stats
  const { 
    data: statsData, 
    loading: statsLoading, 
    error: statsError 
  } = useQuery<{ dashboardStats: DashboardStats }>(GET_DASHBOARD_STATS, {
    errorPolicy: 'all'
  })

  useEffect(() => {
    // Test backend connection with health check
    const testBackend = async () => {
      try {
        const response = await fetch('http://localhost:3002/health')
        if (response.ok) {
          const data = await response.json()
          setBackendStatus('connected')
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
              ✓ Running (Next.js + GraphQL)
            </span>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Backend:</strong> 
            <span style={{ 
              color: backendStatus === 'connected' ? 'green' : 'red',
              marginLeft: '0.5rem'
            }}>
              {backendStatus === 'connected' ? '✓ Connected' : '✗ Disconnected'} 
              (GraphQL API - Fiber Golang)
            </span>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>GraphQL API:</strong> 
            <span style={{ 
              color: statsData && !statsError ? 'green' : statsError ? 'red' : 'orange',
              marginLeft: '0.5rem'
            }}>
              {statsLoading ? '⏳ Loading...' : 
               statsError ? '✗ Error' : 
               statsData ? '✓ Connected' : '○ Idle'}
            </span>
          </div>
          
          {statsData && (
            <div style={{ 
              backgroundColor: '#e8f5e8', 
              padding: '1rem', 
              borderRadius: '4px',
              marginTop: '1rem'
            }}>
              <strong>Live GraphQL Data:</strong>
              <div style={{ marginTop: '0.5rem', fontSize: '0.9em' }}>
                <div>👥 Total Users: {statsData.dashboardStats.totalUsers}</div>
                <div>📝 Total Posts: {statsData.dashboardStats.totalPosts}</div>
                <div>🚀 Total Projects: {statsData.dashboardStats.totalProjects}</div>
                <div>💰 Monthly Revenue: ${statsData.dashboardStats.monthlyRevenue}</div>
                <div>📈 Monthly Signups: {statsData.dashboardStats.monthlySignups}</div>
                <div>🔥 Active Users: {statsData.dashboardStats.activeUsers}</div>
              </div>
            </div>
          )}

          {statsError && (
            <div style={{ 
              backgroundColor: '#ffe8e8', 
              padding: '1rem', 
              borderRadius: '4px',
              marginTop: '1rem'
            }}>
              <strong>GraphQL Error:</strong>
              <pre style={{ margin: '0.5rem 0', fontSize: '0.8em', color: '#d32f2f' }}>
                {statsError.message}
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
              <strong>Frontend:</strong> Next.js 15, React 19, TypeScript, Apollo Client
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Backend:</strong> Fiber (Golang), GraphQL API
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Database:</strong> PostgreSQL, Ent ORM
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Cache:</strong> Redis
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>API:</strong> GraphQL with real-time subscriptions
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