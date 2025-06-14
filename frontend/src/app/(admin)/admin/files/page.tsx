'use client'

import { useState, useEffect, useRef } from 'react'

interface UploadedFile {
  id: string
  filename: string
  original_name: string
  size: number
  mime_type: string
  category: string
  url: string
  created_at: string
}

export default function AdminFilesPage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const categories = [
    { value: 'all', label: 'All Files' },
    { value: 'images', label: 'Images' },
    { value: 'documents', label: 'Documents' },
    { value: 'videos', label: 'Videos' },
    { value: 'audio', label: 'Audio' },
    { value: 'archives', label: 'Archives' },
    { value: 'other', label: 'Other' }
  ]

  useEffect(() => {
    fetchFiles()
  }, [selectedCategory])

  async function fetchFiles() {
    try {
      const token = localStorage.getItem('admin_token')
      const params = selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''
      const response = await fetch(`/api/v1/admin/files${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setFiles(data.data.files || [])
      }
    } catch (error) {
      console.error('Error fetching files:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleFileUpload(fileList: FileList) {
    if (!fileList.length) return

    setUploading(true)
    const token = localStorage.getItem('admin_token')

    try {
      const uploadPromises = Array.from(fileList).map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('category', getCategoryFromFile(file))

        const response = await fetch('/api/v1/upload/file', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }

        return response.json()
      })

      await Promise.all(uploadPromises)
      fetchFiles() // Refresh the file list
    } catch (error) {
      console.error('Error uploading files:', error)
    } finally {
      setUploading(false)
    }
  }

  function getCategoryFromFile(file: File): string {
    const type = file.type.toLowerCase()
    if (type.startsWith('image/')) return 'images'
    if (type.startsWith('video/')) return 'videos'
    if (type.startsWith('audio/')) return 'audio'
    if (type.includes('pdf') || type.includes('document') || type.includes('text')) return 'documents'
    if (type.includes('zip') || type.includes('rar') || type.includes('archive')) return 'archives'
    return 'other'
  }

  async function handleDeleteFile(fileId: string) {
    if (!confirm('Are you sure you want to delete this file?')) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/v1/admin/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        fetchFiles()
        setSelectedFiles(prev => {
          const newSet = new Set(prev)
          newSet.delete(fileId)
          return newSet
        })
      }
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }

  async function handleDeleteSelected() {
    if (!selectedFiles.size || !confirm(`Delete ${selectedFiles.size} selected files?`)) return

    try {
      const token = localStorage.getItem('admin_token')
      const deletePromises = Array.from(selectedFiles).map(fileId =>
        fetch(`/api/v1/admin/files/${fileId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      )

      await Promise.all(deletePromises)
      fetchFiles()
      setSelectedFiles(new Set())
    } catch (error) {
      console.error('Error deleting selected files:', error)
    }
  }

  function handleFileSelect(fileId: string) {
    setSelectedFiles(prev => {
      const newSet = new Set(prev)
      if (newSet.has(fileId)) {
        newSet.delete(fileId)
      } else {
        newSet.add(fileId)
      }
      return newSet
    })
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  function getFileIcon(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'fas fa-image'
    if (mimeType.startsWith('video/')) return 'fas fa-video'
    if (mimeType.startsWith('audio/')) return 'fas fa-music'
    if (mimeType.includes('pdf')) return 'fas fa-file-pdf'
    if (mimeType.includes('document') || mimeType.includes('word')) return 'fas fa-file-word'
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'fas fa-file-excel'
    if (mimeType.includes('zip') || mimeType.includes('archive')) return 'fas fa-file-archive'
    return 'fas fa-file'
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px', marginBottom: '10px' }}></i>
        <div>Loading files...</div>
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
            File Manager
          </h1>
          <p style={{
            color: '#7f8c8d',
            marginTop: '5px',
            margin: 0
          }}>
            Upload, organize and manage your files
          </p>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={{
              padding: '12px 20px',
              background: uploading ? '#bdc3c7' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: uploading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {uploading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Uploading...
              </>
            ) : (
              <>
                <i className="fas fa-upload"></i> Upload Files
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          />
        </div>
      </div>

      {/* Controls */}
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
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '10px 15px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          {selectedFiles.size > 0 && (
            <>
              <span style={{ color: '#7f8c8d', fontSize: '14px' }}>
                {selectedFiles.size} selected
              </span>
              <button
                onClick={handleDeleteSelected}
                style={{
                  padding: '8px 16px',
                  background: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                <i className="fas fa-trash"></i> Delete Selected
              </button>
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              padding: '10px',
              background: viewMode === 'grid' ? '#667eea' : '#f1f2f6',
              color: viewMode === 'grid' ? 'white' : '#2c3e50',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            <i className="fas fa-th"></i>
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: '10px',
              background: viewMode === 'list' ? '#667eea' : '#f1f2f6',
              color: viewMode === 'list' ? 'white' : '#2c3e50',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            <i className="fas fa-list"></i>
          </button>
        </div>
      </div>

      {/* Files */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}>
        {viewMode === 'grid' ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '20px',
            padding: '30px'
          }}>
            {files.map(file => (
              <div
                key={file.id}
                style={{
                  border: selectedFiles.has(file.id) ? '2px solid #667eea' : '1px solid #f0f0f0',
                  borderRadius: '8px',
                  padding: '15px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => handleFileSelect(file.id)}
              >
                {file.mime_type.startsWith('image/') ? (
                  <img
                    src={file.url}
                    alt={file.original_name}
                    style={{
                      width: '100%',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      marginBottom: '10px'
                    }}
                  />
                ) : (
                  <div style={{
                    height: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#f8f9fa',
                    borderRadius: '4px',
                    marginBottom: '10px'
                  }}>
                    <i className={getFileIcon(file.mime_type)} style={{ 
                      fontSize: '48px', 
                      color: '#667eea' 
                    }}></i>
                  </div>
                )}
                <div style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '5px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {file.original_name}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#7f8c8d',
                  marginBottom: '10px'
                }}>
                  {formatFileSize(file.size)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      padding: '4px 8px',
                      background: '#27ae60',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  >
                    <i className="fas fa-download"></i>
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteFile(file.id)
                    }}
                    style={{
                      padding: '4px 8px',
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
              </div>
            ))}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50', width: '30px' }}>
                  <input
                    type="checkbox"
                    checked={selectedFiles.size === files.length && files.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFiles(new Set(files.map(f => f.id)))
                      } else {
                        setSelectedFiles(new Set())
                      }
                    }}
                  />
                </th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Name</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Type</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Size</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Uploaded</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map(file => (
                <tr key={file.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '15px' }}>
                    <input
                      type="checkbox"
                      checked={selectedFiles.has(file.id)}
                      onChange={() => handleFileSelect(file.id)}
                    />
                  </td>
                  <td style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <i className={getFileIcon(file.mime_type)} style={{ 
                        fontSize: '20px', 
                        color: '#667eea' 
                      }}></i>
                      <div>
                        <div style={{ fontWeight: '500' }}>{file.original_name}</div>
                        <div style={{ fontSize: '12px', color: '#7f8c8d' }}>{file.filename}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '15px', color: '#7f8c8d', fontSize: '14px' }}>
                    {file.mime_type}
                  </td>
                  <td style={{ padding: '15px', color: '#7f8c8d', fontSize: '14px' }}>
                    {formatFileSize(file.size)}
                  </td>
                  <td style={{ padding: '15px', color: '#7f8c8d', fontSize: '14px' }}>
                    {new Date(file.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '6px 12px',
                          background: '#27ae60',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}
                      >
                        <i className="fas fa-download"></i>
                      </a>
                      <button
                        onClick={() => handleDeleteFile(file.id)}
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
        )}

        {files.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#7f8c8d' }}>
            <i className="fas fa-folder-open" style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}></i>
            <p>No files found. Upload some files to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}