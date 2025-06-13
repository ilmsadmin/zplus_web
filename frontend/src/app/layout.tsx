import type { Metadata } from 'next'
import { ApolloWrapper } from '../lib/apollo-wrapper'

export const metadata: Metadata = {
  title: 'ZPlus Web',
  description: 'ZPlus Web Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif' }}>
        <ApolloWrapper>
          <div style={{ padding: '20px' }}>
            <nav style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '1rem', 
              marginBottom: '2rem',
              borderRadius: '8px'
            }}>
              <h1 style={{ margin: 0, color: '#333' }}>ZPlus Web</h1>
              <div style={{ marginTop: '0.5rem' }}>
                <a href="/" style={{ marginRight: '1rem', color: '#007bff' }}>Home</a>
                <a href="/blog" style={{ marginRight: '1rem', color: '#007bff' }}>Blog</a>
                <a href="/projects" style={{ marginRight: '1rem', color: '#007bff' }}>Projects</a>
                <a href="http://localhost:4001/playground" target="_blank" style={{ color: '#28a745' }}>
                  GraphQL Playground
                </a>
              </div>
            </nav>
            {children}
          </div>
        </ApolloWrapper>
      </body>
    </html>
  )
}