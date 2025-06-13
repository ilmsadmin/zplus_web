'use client'

import { useState, useEffect } from 'react'
import { useQuery, gql } from '@apollo/client'

// GraphQL queries for admin data
const GET_ADMIN_STATS = gql`
  query GetAdminStats {
    users {
      id
      email
      username
      role
    }
  }
`

export default function AdminDashboard() {
  const [backendStatus, setBackendStatus] = useState<string>('connecting...')
  
  // Use Apollo Client for GraphQL query
  const { data: apolloData, loading, error } = useQuery(GET_ADMIN_STATS, {
    errorPolicy: 'all'
  })

  useEffect(() => {
    // Test health endpoint
    const testBackend = async () => {
      try {
        const response = await fetch('http://localhost:4001/health')
        if (response.ok) {
          setBackendStatus('connected')
        } else {
          setBackendStatus('disconnected')
        }
      } catch (error) {
        setBackendStatus('disconnected')
      }
    }

    testBackend()
  }, [])

  // Mock data for demonstration
  const mockStats = {
    totalUsers: apolloData?.users?.length || 0,
    totalProjects: 12,
    totalOrders: 45,
    totalRevenue: 125000000
  }

  // Map stats for display
  const stats = {
    users_count: mockStats.totalUsers,
    orders_count: mockStats.totalOrders,
    revenue: mockStats.totalRevenue,
    products_count: 28,
    blog_posts_count: 15,
    projects_count: mockStats.totalProjects
  }

  const recentActivities = [
    { type: 'user', message: 'Người dùng mới đăng ký: john@example.com', time: '2 phút trước', icon: 'fas fa-user-plus', color: '#667eea' },
    { type: 'project', message: 'Dự án "E-commerce Website" đã hoàn thành', time: '1 giờ trước', icon: 'fas fa-project-diagram', color: '#56ab2f' },
    { type: 'order', message: 'Đơn hàng mới #ORD-2025-001', time: '3 giờ trước', icon: 'fas fa-shopping-cart', color: '#f093fb' },
    { type: 'blog', message: 'Bài viết mới được xuất bản: "React Best Practices"', time: '5 giờ trước', icon: 'fas fa-blog', color: '#4facfe' }
  ]

  return (
    <div>
      {/* Page Header */}
      <div style={{
        background: 'white',
        padding: '20px 30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#2c3e50',
            margin: 0
          }}>
            Dashboard
          </h1>
          <p style={{
            color: '#7f8c8d',
            marginTop: '5px',
            margin: 0
          }}>
            Chào mừng trở lại! Đây là tổng quan hệ thống của bạn.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button style={{
            padding: '12px 20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}>
            <i className="fas fa-plus"></i> Thêm mới
          </button>
          <button style={{
            padding: '12px 20px',
            background: '#f1f2f6',
            color: '#2c3e50',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#ddd'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#f1f2f6'
          }}>
            <i className="fas fa-download"></i> Export
          </button>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {[
          {
            title: 'Tổng người dùng',
            value: mockStats.totalUsers.toLocaleString(),
            change: '+12%',
            icon: 'fas fa-users',
            color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            bgColor: '#667eea'
          },
          {
            title: 'Dự án hoạt động',
            value: mockStats.totalProjects.toLocaleString(),
            change: '+5%',
            icon: 'fas fa-project-diagram',
            color: 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)',
            bgColor: '#56ab2f'
          },
          {
            title: 'Đơn hàng tháng này',
            value: mockStats.totalOrders.toLocaleString(),
            change: '+18%',
            icon: 'fas fa-shopping-cart',
            color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            bgColor: '#f093fb'
          },
          {
            title: 'Doanh thu',
            value: (mockStats.totalRevenue / 1000000).toFixed(1) + 'M',
            change: '+25%',
            icon: 'fas fa-dollar-sign',
            color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            bgColor: '#4facfe'
          }
        ].map((card, index) => (
          <div key={index} style={{
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '15px'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: card.color,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: 'white'
              }}>
                <i className={card.icon}></i>
              </div>
              <div style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#27ae60',
                background: '#e8f5e8',
                padding: '4px 8px',
                borderRadius: '4px'
              }}>
                {card.change}
              </div>
            </div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#2c3e50',
              marginBottom: '5px'
            }}>
              {card.title}
            </h3>
            <div style={{
              fontSize: '28px',
              fontWeight: '700',
              color: card.bgColor
            }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>
      
      {/* Stats Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Users</h3>
            <div className="stat-number">{stats.users_count}</div>
          </div>
          <div className="stat-card">
            <h3>Orders</h3>
            <div className="stat-number">{stats.orders_count}</div>
          </div>
          <div className="stat-card">
            <h3>Revenue</h3>
            <div className="stat-number">${stats.revenue.toFixed(2)}</div>
          </div>
          <div className="stat-card">
            <h3>Products</h3>
            <div className="stat-number">{stats.products_count}</div>
          </div>
          <div className="stat-card">
            <h3>Blog Posts</h3>
            <div className="stat-number">{stats.blog_posts_count}</div>
          </div>
          <div className="stat-card">
            <h3>Projects</h3>
            <div className="stat-number">{stats.projects_count}</div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        {recentActivities.length > 0 ? (
          <div className="activity-list">
            {recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  <i className={activity.icon} style={{ color: activity.color }}></i>
                </div>
                <div className="activity-content">
                  <div className="activity-message">{activity.message}</div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No recent activity</p>
        )}
      </div>

      {/* Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '30px'
      }}>
        {/* Recent Activities */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '25px 30px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#2c3e50',
              margin: 0
            }}>
              Hoạt động gần đây
            </h3>
            <a href="#" style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              Xem tất cả
            </a>
          </div>
          <div style={{ padding: '20px 30px' }}>
            {recentActivities.map((activity, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '15px',
                marginBottom: index < recentActivities.length - 1 ? '20px' : '0',
                paddingBottom: index < recentActivities.length - 1 ? '20px' : '0',
                borderBottom: index < recentActivities.length - 1 ? '1px solid #f0f0f0' : 'none'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: activity.color,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '16px',
                  flexShrink: 0
                }}>
                  <i className={activity.icon}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    margin: '0 0 5px 0',
                    color: '#2c3e50',
                    fontWeight: '500',
                    lineHeight: '1.4'
                  }}>
                    {activity.message}
                  </p>
                  <p style={{
                    margin: 0,
                    color: '#7f8c8d',
                    fontSize: '13px'
                  }}>
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & System Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Quick Actions */}
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#2c3e50',
              marginBottom: '20px'
            }}>
              Hành động nhanh
            </h3>
            {[
              { text: 'Thêm bài viết mới', icon: 'fas fa-plus', href: '/admin/blog/new' },
              { text: 'Tạo dự án mới', icon: 'fas fa-project-diagram', href: '/admin/projects/new' },
              { text: 'Quản lý đơn hàng', icon: 'fas fa-shopping-cart', href: '/admin/orders' },
              { text: 'Xem báo cáo', icon: 'fas fa-chart-bar', href: '/admin/reports' }
            ].map((action, index) => (
              <a key={index} href={action.href} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 0',
                color: '#2c3e50',
                textDecoration: 'none',
                borderBottom: index < 3 ? '1px solid #f0f0f0' : 'none',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#667eea'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#2c3e50'
              }}>
                <i className={action.icon} style={{
                  width: '16px',
                  textAlign: 'center'
                }}></i>
                {action.text}
              </a>
            ))}
          </div>

          {/* System Status */}
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#2c3e50',
              marginBottom: '20px'
            }}>
              Trạng thái hệ thống
            </h3>
            <div style={{ marginBottom: '15px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{ fontWeight: '500', color: '#2c3e50' }}>Backend API</span>
                <span style={{
                  color: backendStatus === 'connected' ? '#27ae60' : '#e74c3c',
                  fontWeight: '600'
                }}>
                  {backendStatus === 'connected' ? '✓ Online' : '✗ Offline'}
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '6px',
                background: '#f0f0f0',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: backendStatus === 'connected' ? '100%' : '0%',
                  height: '100%',
                  background: backendStatus === 'connected' ? '#27ae60' : '#e74c3c',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{ fontWeight: '500', color: '#2c3e50' }}>GraphQL</span>
                <span style={{
                  color: loading ? '#f39c12' : error ? '#e74c3c' : apolloData ? '#27ae60' : '#7f8c8d',
                  fontWeight: '600'
                }}>
                  {loading ? '⏳ Loading' : 
                   error ? '✗ Error' : 
                   apolloData ? '✓ Connected' : '○ Idle'}
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '6px',
                background: '#f0f0f0',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: apolloData ? '100%' : error ? '30%' : loading ? '60%' : '0%',
                  height: '100%',
                  background: apolloData ? '#27ae60' : error ? '#e74c3c' : loading ? '#f39c12' : '#7f8c8d',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>

            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{ fontWeight: '500', color: '#2c3e50' }}>Database</span>
                <span style={{
                  color: '#27ae60',
                  fontWeight: '600'
                }}>
                  ✓ Online
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '6px',
                background: '#f0f0f0',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: '#27ae60',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          max-width: 1200px;
        }
        .loading {
          text-align: center;
          padding: 50px;
          font-size: 18px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 30px 0;
        }
        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          text-align: center;
        }
        .stat-card h3 {
          margin: 0 0 10px 0;
          color: #7f8c8d;
          font-size: 14px;
          text-transform: uppercase;
        }
        .stat-number {
          font-size: 32px;
          font-weight: bold;
          color: #2c3e50;
        }
        .recent-activity {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-top: 30px;
        }
        .recent-activity h2 {
          margin-top: 0;
          color: #2c3e50;
        }
        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .activity-item {
          display: grid;
          grid-template-columns: 80px 1fr 200px 150px;
          gap: 15px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 5px;
          align-items: center;
        }
        .activity-type {
          background: #3498db;
          color: white;
          padding: 5px 10px;
          border-radius: 15px;
          text-align: center;
          font-size: 12px;
          text-transform: uppercase;
        }
        .activity-description {
          font-weight: 500;
        }
        .activity-user {
          color: #7f8c8d;
          font-size: 14px;
        }
        .activity-time {
          color: #95a5a6;
          font-size: 12px;
        }
      `}</style>
    </div>
  )
}