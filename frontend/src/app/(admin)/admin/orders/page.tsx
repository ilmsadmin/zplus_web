'use client'

import { useState, useEffect } from 'react'

interface OrderItem {
  id: string
  product_name: string
  quantity: number
  price: number
  total: number
}

interface Order {
  id: string
  order_number: string
  customer_email: string
  customer_name: string
  status: string
  payment_status: string
  total_amount: number
  items: OrderItem[]
  billing_address: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    country: string
  }
  created_at: string
  updated_at: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  async function fetchOrders() {
    try {
      const token = localStorage.getItem('admin_token')
      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : ''
      const response = await fetch(`/api/v1/admin/orders${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setOrders(data.data.orders || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateOrderStatus(orderId: string, status: string) {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/v1/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        fetchOrders()
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status })
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  async function updatePaymentStatus(orderId: string, paymentStatus: string) {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/v1/admin/orders/${orderId}/payment-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ payment_status: paymentStatus }),
      })

      if (response.ok) {
        fetchOrders()
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, payment_status: paymentStatus })
        }
      }
    } catch (error) {
      console.error('Error updating payment status:', error)
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'completed':
        return { bg: '#d4edda', color: '#155724' }
      case 'processing':
        return { bg: '#fff3cd', color: '#856404' }
      case 'pending':
        return { bg: '#cce5ff', color: '#004085' }
      case 'cancelled':
        return { bg: '#f8d7da', color: '#721c24' }
      default:
        return { bg: '#f1f2f6', color: '#2c3e50' }
    }
  }

  function getPaymentStatusColor(status: string) {
    switch (status) {
      case 'paid':
        return { bg: '#d4edda', color: '#155724' }
      case 'pending':
        return { bg: '#fff3cd', color: '#856404' }
      case 'failed':
        return { bg: '#f8d7da', color: '#721c24' }
      case 'refunded':
        return { bg: '#e2e3e5', color: '#383d41' }
      default:
        return { bg: '#f1f2f6', color: '#2c3e50' }
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px', marginBottom: '10px' }}></i>
        <div>Loading orders...</div>
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
            Order Management
          </h1>
          <p style={{
            color: '#7f8c8d',
            marginTop: '5px',
            margin: 0
          }}>
            Track and manage customer orders
          </p>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '10px 15px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedOrder ? '2fr 1fr' : '1fr', gap: '30px' }}>
        {/* Orders List */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Order</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Customer</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Status</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Payment</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Total</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const statusStyle = getStatusColor(order.status)
                const paymentStyle = getPaymentStatusColor(order.payment_status)
                
                return (
                  <tr 
                    key={order.id} 
                    style={{ 
                      borderBottom: '1px solid #f0f0f0',
                      cursor: 'pointer',
                      backgroundColor: selectedOrder?.id === order.id ? '#f8f9fa' : 'transparent'
                    }}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td style={{ padding: '15px' }}>
                      <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                        #{order.order_number}
                      </div>
                      <div style={{ color: '#7f8c8d', fontSize: '12px' }}>
                        {order.items?.length || 0} items
                      </div>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                        {order.customer_name}
                      </div>
                      <div style={{ color: '#7f8c8d', fontSize: '12px' }}>
                        {order.customer_email}
                      </div>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        fontWeight: '600',
                        background: statusStyle.bg,
                        color: statusStyle.color
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        fontWeight: '600',
                        background: paymentStyle.bg,
                        color: paymentStyle.color
                      }}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td style={{ padding: '15px', fontWeight: '500' }}>
                      ${order.total_amount.toFixed(2)}
                    </td>
                    <td style={{ padding: '15px', color: '#7f8c8d', fontSize: '14px' }}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {orders.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#7f8c8d' }}>
              <i className="fas fa-shopping-cart" style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}></i>
              <p>No orders found.</p>
            </div>
          )}
        </div>

        {/* Order Details */}
        {selectedOrder && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            padding: '25px'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: 0, color: '#2c3e50' }}>Order Details</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '20px',
                  color: '#7f8c8d',
                  cursor: 'pointer'
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '10px' }}>
                <strong>Order Number:</strong> #{selectedOrder.order_number}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Total:</strong> ${selectedOrder.total_amount.toFixed(2)}
              </div>
            </div>

            {/* Status Updates */}
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ marginBottom: '15px', color: '#2c3e50' }}>Order Status</h4>
              <select
                value={selectedOrder.status}
                onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  marginBottom: '10px'
                }}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <h4 style={{ marginBottom: '15px', color: '#2c3e50' }}>Payment Status</h4>
              <select
                value={selectedOrder.payment_status}
                onChange={(e) => updatePaymentStatus(selectedOrder.id, e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px'
                }}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            {/* Customer Info */}
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ marginBottom: '15px', color: '#2c3e50' }}>Customer Information</h4>
              <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                <div><strong>Name:</strong> {selectedOrder.billing_address?.name || selectedOrder.customer_name}</div>
                <div><strong>Email:</strong> {selectedOrder.billing_address?.email || selectedOrder.customer_email}</div>
                {selectedOrder.billing_address?.phone && (
                  <div><strong>Phone:</strong> {selectedOrder.billing_address.phone}</div>
                )}
                {selectedOrder.billing_address?.address && (
                  <div><strong>Address:</strong> {selectedOrder.billing_address.address}</div>
                )}
                {selectedOrder.billing_address?.city && (
                  <div><strong>City:</strong> {selectedOrder.billing_address.city}</div>
                )}
                {selectedOrder.billing_address?.country && (
                  <div><strong>Country:</strong> {selectedOrder.billing_address.country}</div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 style={{ marginBottom: '15px', color: '#2c3e50' }}>Order Items</h4>
              <div style={{ fontSize: '14px' }}>
                {selectedOrder.items?.map(item => (
                  <div 
                    key={item.id} 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      padding: '10px 0',
                      borderBottom: '1px solid #f0f0f0'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '500' }}>{item.product_name}</div>
                      <div style={{ color: '#7f8c8d', fontSize: '12px' }}>
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </div>
                    </div>
                    <div style={{ fontWeight: '500' }}>
                      ${item.total.toFixed(2)}
                    </div>
                  </div>
                ))}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  padding: '15px 0',
                  fontWeight: '600',
                  fontSize: '16px',
                  borderTop: '2px solid #2c3e50',
                  marginTop: '10px'
                }}>
                  <div>Total:</div>
                  <div>${selectedOrder.total_amount.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}