import type { Metadata } from 'next'
import { ApolloWrapper } from '../lib/apollo-wrapper'

export const metadata: Metadata = {
  title: 'ZPlus Web - Giải pháp công nghệ tổng thể',
  description: 'ZPlus Web - Cung cấp các giải pháp công nghệ tổng thể cho doanh nghiệp',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <head>
        <link 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
          rel="stylesheet" 
        />
      </head>
      <body style={{ 
        margin: 0, 
        padding: 0,
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        lineHeight: '1.6',
        color: '#333',
        overflowX: 'hidden'
      }}>
        <ApolloWrapper>
          {children}
        </ApolloWrapper>
      </body>
    </html>
  )
}