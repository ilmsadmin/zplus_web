import { gql } from '@apollo/client'

// Health check query
export const HEALTH_CHECK = gql`
  query HealthCheck {
    dashboardStats {
      totalUsers
      totalPosts
      totalProjects
    }
  }
`

// User queries
export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      username
      firstName
      lastName
      role
      isActive
      createdAt
    }
  }
`

export const GET_USERS = gql`
  query GetUsers($first: Int, $after: String, $search: String) {
    users(first: $first, after: $after, search: $search) {
      edges {
        node {
          id
          email
          username
          firstName
          lastName
          role
          isActive
          createdAt
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`

// Blog queries
export const GET_POSTS = gql`
  query GetPosts($first: Int, $after: String, $status: PostStatus, $search: String) {
    posts(first: $first, after: $after, status: $status, search: $search) {
      edges {
        node {
          id
          title
          slug
          content
          excerpt
          featuredImage
          status
          author {
            id
            username
            firstName
            lastName
          }
          category {
            id
            name
            slug
          }
          tags
          viewCount
          publishedAt
          createdAt
          updatedAt
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`

export const GET_POST = gql`
  query GetPost($id: ID, $slug: String) {
    post(id: $id, slug: $slug) {
      id
      title
      slug
      content
      excerpt
      featuredImage
      status
      author {
        id
        username
        firstName
        lastName
      }
      category {
        id
        name
        slug
      }
      tags
      viewCount
      publishedAt
      createdAt
      updatedAt
    }
  }
`

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      slug
      description
      postCount
      createdAt
    }
  }
`

// Project queries
export const GET_PROJECTS = gql`
  query GetProjects($first: Int, $after: String, $featured: Boolean, $status: ProjectStatus) {
    projects(first: $first, after: $after, featured: $featured, status: $status) {
      edges {
        node {
          id
          title
          slug
          description
          content
          thumbnail
          images
          technologies
          demoUrl
          sourceUrl
          status
          featured
          author {
            id
            username
            firstName
            lastName
          }
          createdAt
          updatedAt
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`

export const GET_PROJECT = gql`
  query GetProject($id: ID, $slug: String) {
    project(id: $id, slug: $slug) {
      id
      title
      slug
      description
      content
      thumbnail
      images
      technologies
      demoUrl
      sourceUrl
      status
      featured
      author {
        id
        username
        firstName
        lastName
      }
      createdAt
      updatedAt
    }
  }
`

// Dashboard queries
export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalUsers
      totalPosts
      totalProjects
      totalTransactions
      monthlyRevenue
      monthlySignups
      activeUsers
    }
  }
`

export const GET_RECENT_ACTIVITY = gql`
  query GetRecentActivity($limit: Int) {
    recentActivity(limit: $limit) {
      id
      type
      description
      user {
        id
        username
        firstName
        lastName
      }
      metadata
      createdAt
    }
  }
`
