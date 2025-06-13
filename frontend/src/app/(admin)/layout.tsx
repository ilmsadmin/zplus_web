import type { Metadata } from 'next'
import './admin.css'

export const metadata: Metadata = {
  title: 'Admin Panel - ZPlus Web',
  description: 'ZPlus Web Admin Panel',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="admin-layout">
          <nav className="admin-sidebar">
            <div className="admin-logo">
              <h2>ZPlus Admin</h2>
            </div>
            <ul className="admin-nav">
              <li><a href="/admin/dashboard">Dashboard</a></li>
              <li><a href="/admin/blog">Blog</a></li>
              <li><a href="/admin/projects">Projects</a></li>
              <li><a href="/admin/products">Products</a></li>
              <li><a href="/admin/customers">Customers</a></li>
              <li><a href="/admin/content">Content</a></li>
            </ul>
          </nav>
          <main className="admin-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}