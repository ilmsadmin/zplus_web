'use client'

import { useState, useEffect } from 'react'

interface Project {
  id: number
  name: string
  slug: string
  description: string
  short_description: string
  featured_image: string
  gallery_images: string[]
  technologies: string[]
  project_url: string
  github_url: string
  demo_url: string
  status: string
  start_date: string
  end_date: string
  is_featured: boolean
  created_at: string
  updated_at: string
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/v1/admin/projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setProjects(data.data.projects || [])
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateProject(formData: any) {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/v1/admin/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowCreateForm(false)
        fetchProjects()
      }
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  async function handleUpdateProject(projectId: number, formData: any) {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/v1/admin/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setEditingProject(null)
        fetchProjects()
      }
    } catch (error) {
      console.error('Error updating project:', error)
    }
  }

  async function handleDeleteProject(projectId: number) {
    if (!confirm('Are you sure you want to delete this project?')) {
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/v1/admin/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        fetchProjects()
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px', marginBottom: '10px' }}></i>
        <div>Loading projects...</div>
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
            Project Management
          </h1>
          <p style={{
            color: '#7f8c8d',
            marginTop: '5px',
            margin: 0
          }}>
            Manage all projects and showcase work
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
          <i className="fas fa-plus"></i> Create Project
        </button>
      </div>

      {/* Create/Edit Form */}
      {(showCreateForm || editingProject) && (
        <ProjectForm 
          project={editingProject}
          onSubmit={editingProject ? 
            (data) => handleUpdateProject(editingProject.id, data) : 
            handleCreateProject
          }
          onCancel={() => {
            setShowCreateForm(false)
            setEditingProject(null)
          }}
        />
      )}

      {/* Projects Table */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Project</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Status</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Featured</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Technologies</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Created</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <tr key={project.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '15px' }}>
                  <div style={{ fontWeight: '500', marginBottom: '4px' }}>{project.name}</div>
                  <div style={{ color: '#7f8c8d', fontSize: '12px' }}>/{project.slug}</div>
                </td>
                <td style={{ padding: '15px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    fontWeight: '600',
                    background: project.status === 'completed' ? '#d4edda' : 
                               project.status === 'in_progress' ? '#fff3cd' : '#f8d7da',
                    color: project.status === 'completed' ? '#155724' : 
                           project.status === 'in_progress' ? '#856404' : '#721c24'
                  }}>
                    {project.status}
                  </span>
                </td>
                <td style={{ padding: '15px' }}>
                  {project.is_featured ? (
                    <span style={{
                      background: '#e1f5fe',
                      color: '#0277bd',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      Featured
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {project.technologies?.slice(0, 3).map((tech, idx) => (
                      <span key={idx} style={{
                        background: '#f1f2f6',
                        color: '#2c3e50',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '11px'
                      }}>
                        {tech}
                      </span>
                    ))}
                    {project.technologies?.length > 3 && (
                      <span style={{ fontSize: '11px', color: '#7f8c8d' }}>
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td style={{ padding: '15px', color: '#7f8c8d', fontSize: '14px' }}>
                  {new Date(project.created_at).toLocaleDateString()}
                </td>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => setEditingProject(project)}
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
                      onClick={() => handleDeleteProject(project.id)}
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

        {projects.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#7f8c8d' }}>
            <i className="fas fa-project-diagram" style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}></i>
            <p>No projects found. Create your first project to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ProjectForm({ project, onSubmit, onCancel }: { 
  project?: Project | null, 
  onSubmit: (data: any) => void, 
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState({
    name: project?.name || '',
    slug: project?.slug || '',
    description: project?.description || '',
    short_description: project?.short_description || '',
    featured_image: project?.featured_image || '',
    gallery_images: project?.gallery_images?.join(', ') || '',
    technologies: project?.technologies?.join(', ') || '',
    project_url: project?.project_url || '',
    github_url: project?.github_url || '',
    demo_url: project?.demo_url || '',
    status: project?.status || 'planning',
    start_date: project?.start_date || '',
    end_date: project?.end_date || '',
    is_featured: project?.is_featured || false,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const submitData = {
      ...formData,
      gallery_images: formData.gallery_images.split(',').map(s => s.trim()).filter(s => s),
      technologies: formData.technologies.split(',').map(s => s.trim()).filter(s => s)
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
        {project ? 'Edit Project' : 'Create New Project'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Name</label>
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
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
              <option value="planning">Planning</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Technologies (comma separated)</label>
          <input
            type="text"
            value={formData.technologies}
            onChange={(e) => setFormData(prev => ({ ...prev, technologies: e.target.value }))}
            placeholder="React, Node.js, TypeScript"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Project URL</label>
            <input
              type="url"
              value={formData.project_url}
              onChange={(e) => setFormData(prev => ({ ...prev, project_url: e.target.value }))}
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
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>GitHub URL</label>
            <input
              type="url"
              value={formData.github_url}
              onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
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
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Demo URL</label>
            <input
              type="url"
              value={formData.demo_url}
              onChange={(e) => setFormData(prev => ({ ...prev, demo_url: e.target.value }))}
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

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
              style={{ marginRight: '8px' }}
            />
            <span style={{ fontWeight: '500' }}>Featured Project</span>
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
            {project ? 'Update Project' : 'Create Project'}
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