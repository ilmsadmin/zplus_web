'use client'

import { useQuery } from '@apollo/client'
import { GET_PROJECTS } from '../../lib/graphql/queries'
import { ProjectConnection, ProjectStatus } from '../../lib/graphql/types'
import Link from 'next/link'
import { useState } from 'react'

export default function ProjectsPage() {
  const [showFeaturedOnly, setShowFeaturedOnly] = useState<boolean>(false)
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | ''>('')

  // Query for projects
  const { 
    data: projectsData, 
    loading: projectsLoading, 
    error: projectsError,
    refetch: refetchProjects
  } = useQuery<{ projects: ProjectConnection }>(GET_PROJECTS, {
    variables: {
      first: 12,
      featured: showFeaturedOnly || undefined,
      status: selectedStatus || undefined
    },
    errorPolicy: 'all'
  })

  const handleFilterChange = () => {
    refetchProjects({
      first: 12,
      featured: showFeaturedOnly || undefined,
      status: selectedStatus || undefined
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.ACTIVE:
        return '#ff9800'
      case ProjectStatus.COMPLETED:
        return '#4caf50'
      case ProjectStatus.ARCHIVED:
        return '#757575'
      default:
        return '#666'
    }
  }

  const getStatusLabel = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.ACTIVE:
        return 'In Development'
      case ProjectStatus.COMPLETED:
        return 'Completed'
      case ProjectStatus.ARCHIVED:
        return 'Archived'
      default:
        return status
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#333', marginBottom: '2rem' }}>Our Projects</h1>

      {/* Filter Section */}
      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={showFeaturedOnly}
              onChange={(e) => setShowFeaturedOnly(e.target.checked)}
            />
            Featured Projects Only
          </label>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as ProjectStatus | '')}
            style={{
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          >
            <option value="">All Status</option>
            <option value={ProjectStatus.ACTIVE}>In Development</option>
            <option value={ProjectStatus.COMPLETED}>Completed</option>
            <option value={ProjectStatus.ARCHIVED}>Archived</option>
          </select>

          <button
            onClick={handleFilterChange}
            style={{
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Loading State */}
      {projectsLoading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading projects...</p>
        </div>
      )}

      {/* Error State */}
      {projectsError && (
        <div style={{
          backgroundColor: '#ffe8e8',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          <strong>Error loading projects:</strong>
          <p>{projectsError.message}</p>
        </div>
      )}

      {/* Projects Grid */}
      {projectsData?.projects && (
        <div>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            Found {projectsData.projects.totalCount} project(s)
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: '2rem'
          }}>
            {projectsData.projects.edges.map(({ node: project }) => (
              <article
                key={project.id}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                {project.thumbnail && (
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    style={{
                      width: '100%',
                      height: '250px',
                      objectFit: 'cover'
                    }}
                  />
                )}
                
                <div style={{ padding: '1.5rem' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <h2 style={{
                      margin: 0,
                      fontSize: '1.25rem',
                      color: '#333'
                    }}>
                      <Link
                        href={`/projects/${project.slug}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        {project.title}
                      </Link>
                    </h2>
                    
                    {project.featured && (
                      <span style={{
                        backgroundColor: '#ff9800',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                  
                  <div style={{
                    marginBottom: '1rem',
                    fontSize: '0.9rem',
                    color: '#666',
                    display: 'flex',
                    gap: '1rem',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{
                      color: getStatusColor(project.status),
                      fontWeight: 'bold'
                    }}>
                      {getStatusLabel(project.status)}
                    </span>
                    <span>Updated {formatDate(project.updatedAt)}</span>
                  </div>
                  
                  <p style={{
                    margin: '0 0 1rem 0',
                    color: '#666',
                    lineHeight: '1.5'
                  }}>
                    {project.description}
                  </p>
                  
                  {/* Technologies */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}>
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          style={{
                            backgroundColor: '#e3f2fd',
                            color: '#1565c0',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '12px',
                            fontSize: '0.8rem'
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Links */}
                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginTop: '1rem'
                  }}>
                    <Link
                      href={`/projects/${project.slug}`}
                      style={{
                        color: '#1976d2',
                        textDecoration: 'none',
                        fontWeight: 'bold'
                      }}
                    >
                      View Details →
                    </Link>
                    
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#4caf50',
                          textDecoration: 'none'
                        }}
                      >
                        🚀 Live Demo
                      </a>
                    )}
                    
                    {project.sourceUrl && (
                      <a
                        href={project.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#666',
                          textDecoration: 'none'
                        }}
                      >
                        📂 Source Code
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {projectsData.projects.edges.length === 0 && !projectsLoading && (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px'
            }}>
              <p style={{ fontSize: '1.1rem', color: '#666' }}>
                No projects found. Try adjusting your filter criteria.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
