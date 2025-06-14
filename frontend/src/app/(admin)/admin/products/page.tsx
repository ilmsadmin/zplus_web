'use client'

import { useState, useEffect } from 'react'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  short_description: string
  featured_image: string
  gallery: string[]
  price: number
  sale_price: number
  sku: string
  stock_quantity: number
  manage_stock: boolean
  stock_status: string
  status: string
  is_digital: boolean
  featured: boolean
  sales_count: number
  created_at: string
  updated_at: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/v1/admin/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setProducts(data.data.products || [])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateProduct(formData: any) {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/v1/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowCreateForm(false)
        fetchProducts()
      }
    } catch (error) {
      console.error('Error creating product:', error)
    }
  }

  async function handleUpdateProduct(productId: string, formData: any) {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/v1/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setEditingProduct(null)
        fetchProducts()
      }
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  async function handleDeleteProduct(productId: string) {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/v1/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        fetchProducts()
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px', marginBottom: '10px' }}></i>
        <div>Loading products...</div>
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
            Product Management
          </h1>
          <p style={{
            color: '#7f8c8d',
            marginTop: '5px',
            margin: 0
          }}>
            Manage software products and digital assets
          </p>
        </div>
        <button 
          onClick={() => setShowCreateForm(true)}
          style={{
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
        >
          <i className="fas fa-plus"></i> Add Product
        </button>
      </div>

      {/* Create/Edit Form */}
      {(showCreateForm || editingProduct) && (
        <ProductForm 
          product={editingProduct}
          onSubmit={editingProduct ? 
            (data) => handleUpdateProduct(editingProduct.id, data) : 
            handleCreateProduct
          }
          onCancel={() => {
            setShowCreateForm(false)
            setEditingProduct(null)
          }}
        />
      )}

      {/* Products Table */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Product</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Price</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Stock</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Status</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Featured</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Sales</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {product.featured_image && (
                      <img 
                        src={product.featured_image} 
                        alt={product.name}
                        style={{ 
                          width: '50px', 
                          height: '50px', 
                          objectFit: 'cover', 
                          borderRadius: '6px' 
                        }}
                      />
                    )}
                    <div>
                      <div style={{ fontWeight: '500', marginBottom: '4px' }}>{product.name}</div>
                      <div style={{ color: '#7f8c8d', fontSize: '12px' }}>
                        SKU: {product.sku || 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '15px' }}>
                  <div>
                    <div style={{ fontWeight: '500' }}>
                      ${product.price.toFixed(2)}
                    </div>
                    {product.sale_price && product.sale_price < product.price && (
                      <div style={{ 
                        color: '#e74c3c', 
                        fontSize: '12px', 
                        textDecoration: 'line-through' 
                      }}>
                        ${product.sale_price.toFixed(2)}
                      </div>
                    )}
                  </div>
                </td>
                <td style={{ padding: '15px' }}>
                  {product.is_digital ? (
                    <span style={{
                      background: '#e1f5fe',
                      color: '#0277bd',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      Digital
                    </span>
                  ) : (
                    <div>
                      <div style={{ fontWeight: '500' }}>{product.stock_quantity}</div>
                      <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                        {product.stock_status}
                      </div>
                    </div>
                  )}
                </td>
                <td style={{ padding: '15px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    fontWeight: '600',
                    background: product.status === 'published' ? '#d4edda' : 
                               product.status === 'draft' ? '#fff3cd' : '#f8d7da',
                    color: product.status === 'published' ? '#155724' : 
                           product.status === 'draft' ? '#856404' : '#721c24'
                  }}>
                    {product.status}
                  </span>
                </td>
                <td style={{ padding: '15px' }}>
                  {product.featured ? (
                    <span style={{
                      background: '#ffeaa7',
                      color: '#d63031',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      <i className="fas fa-star"></i> Featured
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
                <td style={{ padding: '15px', color: '#7f8c8d' }}>
                  {product.sales_count || 0}
                </td>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => setEditingProduct(product)}
                      style={{
                        padding: '6px 12px',
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
                      style={{
                        padding: '6px 12px',
                        background: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#7f8c8d' }}>
            <i className="fas fa-box" style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}></i>
            <p>No products found. Add your first product to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ProductForm({ product, onSubmit, onCancel }: { 
  product?: Product | null, 
  onSubmit: (data: any) => void, 
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    short_description: product?.short_description || '',
    featured_image: product?.featured_image || '',
    gallery: product?.gallery?.join(', ') || '',
    price: product?.price || 0,
    sale_price: product?.sale_price || 0,
    sku: product?.sku || '',
    stock_quantity: product?.stock_quantity || 0,
    manage_stock: product?.manage_stock ?? true,
    stock_status: product?.stock_status || 'in_stock',
    status: product?.status || 'draft',
    is_digital: product?.is_digital || false,
    featured: product?.featured || false,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const submitData = {
      ...formData,
      gallery: formData.gallery.split(',').map(s => s.trim()).filter(s => s),
      price: parseFloat(formData.price.toString()),
      sale_price: formData.sale_price ? parseFloat(formData.sale_price.toString()) : null,
      stock_quantity: parseInt(formData.stock_quantity.toString())
    }
    onSubmit(submitData)
  }

  function handleNameChange(name: string) {
    setFormData(prev => ({
      ...prev,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }))
  }

  return (
    <div style={{
      background: 'white',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      marginBottom: '30px'
    }}>
      <h2 style={{ marginBottom: '30px', color: '#2c3e50' }}>
        {product ? 'Edit Product' : 'Add New Product'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            required
            rows={4}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Short Description</label>
          <textarea
            value={formData.short_description}
            onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
            rows={2}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Price ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Sale Price ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.sale_price}
              onChange={(e) => setFormData(prev => ({ ...prev, sale_price: parseFloat(e.target.value) || 0 }))}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>SKU</label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Stock Quantity</label>
            <input
              type="number"
              min="0"
              value={formData.stock_quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: parseInt(e.target.value) || 0 }))}
              disabled={formData.is_digital}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                opacity: formData.is_digital ? 0.5 : 1
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Stock Status</label>
            <select
              value={formData.stock_status}
              onChange={(e) => setFormData(prev => ({ ...prev, stock_status: e.target.value }))}
              disabled={formData.is_digital}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                opacity: formData.is_digital ? 0.5 : 1
              }}
            >
              <option value="in_stock">In Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="on_backorder">On Backorder</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Featured Image URL</label>
          <input
            type="url"
            value={formData.featured_image}
            onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.is_digital}
              onChange={(e) => setFormData(prev => ({ ...prev, is_digital: e.target.checked }))}
              style={{ marginRight: '8px' }}
            />
            <span style={{ fontWeight: '500' }}>Digital Product</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
              style={{ marginRight: '8px' }}
            />
            <span style={{ fontWeight: '500' }}>Featured Product</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.manage_stock}
              onChange={(e) => setFormData(prev => ({ ...prev, manage_stock: e.target.checked }))}
              disabled={formData.is_digital}
              style={{ marginRight: '8px' }}
            />
            <span style={{ fontWeight: '500', opacity: formData.is_digital ? 0.5 : 1 }}>Manage Stock</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="submit" 
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {product ? 'Update Product' : 'Add Product'}
          </button>
          <button 
            type="button" 
            onClick={onCancel}
            style={{
              padding: '12px 24px',
              background: '#f1f2f6',
              color: '#2c3e50',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}