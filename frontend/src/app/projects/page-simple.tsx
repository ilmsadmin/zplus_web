'use client'

import { useQuery, gql } from '@apollo/client'

// Simple GraphQL query for projects
const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      title
      slug
      description
      status
      featured
      createdAt
    }
  }
`

export default function ProjectsPage() {
  const { data, loading, error } = useQuery(GET_PROJECTS, {
    errorPolicy: 'all'
  })

  if (loading) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Projects</h1>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '2rem', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p>Loading projects via Apollo GraphQL...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Projects</h1>
        <div style={{ 
          backgroundColor: '#ffe8e8', 
          padding: '2rem', 
          borderRadius: '8px',
          color: '#d32f2f'
        }}>
          <h3>GraphQL Error:</h3>
          <pre style={{ fontSize: '0.9em' }}>{error.message}</pre>
          <p style={{ marginTop: '1rem' }}>
            This is expected if the backend doesn't have projects yet.
          </p>
        </div>
      </div>
    )
  }

  const projects = data?.projects || []

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ color: '#333', marginBottom: '2rem' }}>Projects</h1>
      
      <div style={{ 
        backgroundColor: '#e8f5e8', 
        padding: '1rem', 
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <strong>✅ Apollo GraphQL Query Successful!</strong>
        <br />
        <small>Found {projects.length} projects via GraphQL API</small>
      </div>

      {projects.length === 0 ? (
        <div style={{ 
          backgroundColor: '#fff3cd', 
          padding: '2rem', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3>No projects found</h3>
          <p>There are no projects yet.</p>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
            You can create some projects using the GraphQL Playground at{' '}
            <a href="http://localhost:3002/playground" target="_blank">
              http://localhost:3002/playground
            </a>
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem' 
        }}>
          {projects.map((project: any) => (
            <div 
              key={project.id}
              style={{ 
                backgroundColor: '#fff', 
                padding: '2rem', 
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                border: '1px solid #e9ecef'
              }}
            >
              <h2 style={{ color: '#333', marginBottom: '0.5rem' }}>
                {project.title}
              </h2>
              
              <div style={{ 
                color: '#666', 
                fontSize: '0.9rem',
                marginBottom: '1rem'
              }}>
                {new Date(project.createdAt).toLocaleDateString()}
                {project.featured && (
                  <span style={{ 
                    marginLeft: '0.5rem',
                    backgroundColor: '#ffc107',
                    color: '#212529',
                    padding: '0.125rem 0.375rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    ⭐ FEATURED
                  </span>
                )}
              </div>
              
              {project.description && (
                <p style={{ 
                  color: '#555', 
                  lineHeight: '1.6',
                  marginBottom: '1rem'
                }}>
                  {project.description}
                </p>
              )}
              
              <div style={{ 
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e9ecef',
                fontSize: '0.8rem',
                color: '#6c757d'
              }}>
                Status: <span style={{ 
                  color: project.status === 'COMPLETED' ? '#28a745' : 
                        project.status === 'ACTIVE' ? '#007bff' : '#6c757d'
                }}>
                  {project.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
