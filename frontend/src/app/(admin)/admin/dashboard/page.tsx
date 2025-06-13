'use client'

import { useState, useEffect } from 'react'

interface DashboardStats {
  users_count: number
  orders_count: number
  revenue: number
  products_count: number
  blog_posts_count: number
  projects_count: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    try {
      // Fetch dashboard stats
      const statsResponse = await fetch('/api/v1/admin/dashboard/stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.data)
      }

      // Fetch recent activity
      const activityResponse = await fetch('/api/v1/admin/dashboard/recent-activity')
      if (activityResponse.ok) {
        const activityData = await activityResponse.json()
        setRecentActivity(activityData.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      
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
        {recentActivity.length > 0 ? (
          <div className="activity-list">
            {recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-type">{activity.type}</div>
                <div className="activity-description">
                  {activity.description}
                </div>
                <div className="activity-user">{activity.user}</div>
                <div className="activity-time">
                  {new Date(activity.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No recent activity</p>
        )}
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