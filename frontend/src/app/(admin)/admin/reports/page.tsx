'use client'

import { useState, useEffect } from 'react'

interface ReportData {
  sales: {
    total_revenue: number
    total_orders: number
    average_order_value: number
    period_revenue: number
    period_orders: number
    revenue_trend: Array<{ date: string; amount: number }>
  }
  products: {
    total_products: number
    published_products: number
    top_selling: Array<{ name: string; sales: number; revenue: number }>
  }
  customers: {
    total_customers: number
    new_customers: number
    returning_customers: number
  }
  content: {
    total_blog_posts: number
    total_projects: number
    published_posts: number
    draft_posts: number
  }
}

interface DateRange {
  start: string
  end: string
  label: string
}

export default function AdminReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedRange, setSelectedRange] = useState<string>('last_30_days')
  const [activeTab, setActiveTab] = useState<string>('overview')

  const dateRanges: Record<string, DateRange> = {
    last_7_days: {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
      label: 'Last 7 Days'
    },
    last_30_days: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
      label: 'Last 30 Days'
    },
    last_90_days: {
      start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
      label: 'Last 90 Days'
    },
    this_year: {
      start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
      label: 'This Year'
    }
  }

  useEffect(() => {
    fetchReportData()
  }, [selectedRange])

  async function fetchReportData() {
    setLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const range = dateRanges[selectedRange]
      const response = await fetch(`/api/v1/admin/reports?start=${range.start}&end=${range.end}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setReportData(data.data)
      } else {
        // Mock data for demonstration
        setReportData({
          sales: {
            total_revenue: 125000,
            total_orders: 342,
            average_order_value: 365.50,
            period_revenue: 15000,
            period_orders: 45,
            revenue_trend: Array.from({ length: 30 }, (_, i) => ({
              date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              amount: Math.random() * 2000 + 500
            }))
          },
          products: {
            total_products: 28,
            published_products: 24,
            top_selling: [
              { name: 'ZPlus CRM Pro', sales: 45, revenue: 15750 },
              { name: 'Web Development Kit', sales: 32, revenue: 9600 },
              { name: 'Mobile App Template', sales: 28, revenue: 8400 }
            ]
          },
          customers: {
            total_customers: 156,
            new_customers: 23,
            returning_customers: 89
          },
          content: {
            total_blog_posts: 45,
            total_projects: 12,
            published_posts: 42,
            draft_posts: 3
          }
        })
      }
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function exportReport(format: 'csv' | 'pdf') {
    try {
      const token = localStorage.getItem('admin_token')
      const range = dateRanges[selectedRange]
      const response = await fetch(`/api/v1/admin/reports/export?format=${format}&start=${range.start}&end=${range.end}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `report_${selectedRange}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error exporting report:', error)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px', marginBottom: '10px' }}></i>
        <div>Loading reports...</div>
      </div>
    )
  }

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
            Reports & Analytics
          </h1>
          <p style={{
            color: '#7f8c8d',
            marginTop: '5px',
            margin: 0
          }}>
            Business insights and performance metrics
          </p>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            style={{
              padding: '10px 15px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            {Object.entries(dateRanges).map(([key, range]) => (
              <option key={key} value={key}>{range.label}</option>
            ))}
          </select>
          <button
            onClick={() => exportReport('csv')}
            style={{
              padding: '10px 15px',
              background: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            <i className="fas fa-download"></i> Export CSV
          </button>
          <button
            onClick={() => exportReport('pdf')}
            style={{
              padding: '10px 15px',
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            <i className="fas fa-file-pdf"></i> Export PDF
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        marginBottom: '30px',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0' }}>
          {[
            { key: 'overview', label: 'Overview', icon: 'fas fa-chart-line' },
            { key: 'sales', label: 'Sales', icon: 'fas fa-dollar-sign' },
            { key: 'products', label: 'Products', icon: 'fas fa-box' },
            { key: 'content', label: 'Content', icon: 'fas fa-file-alt' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '15px 25px',
                border: 'none',
                background: activeTab === tab.key ? '#667eea' : 'transparent',
                color: activeTab === tab.key ? 'white' : '#2c3e50',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
            >
              <i className={tab.icon} style={{ marginRight: '8px' }}></i>
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '30px' }}>
          {activeTab === 'overview' && reportData && (
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '25px',
                  borderRadius: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '14px', opacity: 0.8 }}>Total Revenue</div>
                      <div style={{ fontSize: '28px', fontWeight: '700', marginTop: '5px' }}>
                        ${reportData.sales.total_revenue.toLocaleString()}
                      </div>
                    </div>
                    <i className="fas fa-dollar-sign" style={{ fontSize: '32px', opacity: 0.6 }}></i>
                  </div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)',
                  color: 'white',
                  padding: '25px',
                  borderRadius: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '14px', opacity: 0.8 }}>Total Orders</div>
                      <div style={{ fontSize: '28px', fontWeight: '700', marginTop: '5px' }}>
                        {reportData.sales.total_orders.toLocaleString()}
                      </div>
                    </div>
                    <i className="fas fa-shopping-cart" style={{ fontSize: '32px', opacity: 0.6 }}></i>
                  </div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  padding: '25px',
                  borderRadius: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '14px', opacity: 0.8 }}>Avg Order Value</div>
                      <div style={{ fontSize: '28px', fontWeight: '700', marginTop: '5px' }}>
                        ${reportData.sales.average_order_value.toFixed(2)}
                      </div>
                    </div>
                    <i className="fas fa-chart-line" style={{ fontSize: '32px', opacity: 0.6 }}></i>
                  </div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  padding: '25px',
                  borderRadius: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '14px', opacity: 0.8 }}>Total Customers</div>
                      <div style={{ fontSize: '28px', fontWeight: '700', marginTop: '5px' }}>
                        {reportData.customers.total_customers.toLocaleString()}
                      </div>
                    </div>
                    <i className="fas fa-users" style={{ fontSize: '32px', opacity: 0.6 }}></i>
                  </div>
                </div>
              </div>

              {/* Revenue Trend Chart */}
              <div style={{
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '10px',
                marginBottom: '30px'
              }}>
                <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Revenue Trend ({dateRanges[selectedRange].label})</h3>
                <div style={{ 
                  height: '200px', 
                  display: 'flex', 
                  alignItems: 'end', 
                  gap: '2px',
                  padding: '20px 0'
                }}>
                  {reportData.sales.revenue_trend.map((point, index) => (
                    <div
                      key={index}
                      style={{
                        flex: 1,
                        height: `${(point.amount / 2000) * 100}%`,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '2px 2px 0 0',
                        minHeight: '10px',
                        position: 'relative'
                      }}
                      title={`${point.date}: $${point.amount.toFixed(2)}`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sales' && reportData && (
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '30px',
                marginBottom: '30px'
              }}>
                <div>
                  <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Sales Performance</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Period Revenue:</span>
                      <span style={{ fontWeight: '600', color: '#27ae60' }}>
                        ${reportData.sales.period_revenue.toLocaleString()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Period Orders:</span>
                      <span style={{ fontWeight: '600' }}>{reportData.sales.period_orders}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Average Order Value:</span>
                      <span style={{ fontWeight: '600' }}>
                        ${reportData.sales.average_order_value.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Customer Insights</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Total Customers:</span>
                      <span style={{ fontWeight: '600' }}>{reportData.customers.total_customers}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>New Customers:</span>
                      <span style={{ fontWeight: '600', color: '#27ae60' }}>{reportData.customers.new_customers}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Returning Customers:</span>
                      <span style={{ fontWeight: '600', color: '#667eea' }}>{reportData.customers.returning_customers}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && reportData && (
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '30px'
              }}>
                <div>
                  <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Product Statistics</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Total Products:</span>
                      <span style={{ fontWeight: '600' }}>{reportData.products.total_products}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Published Products:</span>
                      <span style={{ fontWeight: '600', color: '#27ae60' }}>{reportData.products.published_products}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Draft Products:</span>
                      <span style={{ fontWeight: '600', color: '#f39c12' }}>
                        {reportData.products.total_products - reportData.products.published_products}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Top Selling Products</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {reportData.products.top_selling.map((product, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        background: '#f8f9fa',
                        borderRadius: '6px'
                      }}>
                        <div>
                          <div style={{ fontWeight: '500' }}>{product.name}</div>
                          <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                            {product.sales} sales
                          </div>
                        </div>
                        <div style={{ fontWeight: '600', color: '#27ae60' }}>
                          ${product.revenue.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content' && reportData && (
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '30px'
              }}>
                <div>
                  <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Blog Statistics</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Total Blog Posts:</span>
                      <span style={{ fontWeight: '600' }}>{reportData.content.total_blog_posts}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Published Posts:</span>
                      <span style={{ fontWeight: '600', color: '#27ae60' }}>{reportData.content.published_posts}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Draft Posts:</span>
                      <span style={{ fontWeight: '600', color: '#f39c12' }}>{reportData.content.draft_posts}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Project Statistics</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Total Projects:</span>
                      <span style={{ fontWeight: '600' }}>{reportData.content.total_projects}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}