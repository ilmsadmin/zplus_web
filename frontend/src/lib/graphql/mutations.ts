import { gql } from '@apollo/client'

// Authentication mutations
export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        email
        username
        firstName
        lastName
        role
        isActive
        createdAt
      }
      expiresAt
    }
  }
`

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        username
        firstName
        lastName
        role
        isActive
        createdAt
      }
      expiresAt
    }
  }
`

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`

export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`

export const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $password: String!) {
    resetPassword(token: $token, password: $password)
  }
`

// Blog mutations
export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
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

export const UPDATE_POST = gql`
  mutation UpdatePost($input: UpdatePostInput!) {
    updatePost(input: $input) {
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

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`

export const PUBLISH_POST = gql`
  mutation PublishPost($id: ID!) {
    publishPost(id: $id) {
      id
      title
      slug
      status
      publishedAt
    }
  }
`

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
      name
      slug
      description
      postCount
      createdAt
    }
  }
`

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $input: CreateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
      name
      slug
      description
      postCount
      createdAt
    }
  }
`

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`

// Project mutations
export const CREATE_PROJECT = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
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

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($input: UpdateProjectInput!) {
    updateProject(input: $input) {
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

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id)
  }
`

// User mutations (Admin only)
export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $role: UserRole, $isActive: Boolean) {
    updateUser(id: $id, role: $role, isActive: $isActive) {
      id
      email
      username
      firstName
      lastName
      role
      isActive
      createdAt
      updatedAt
    }
  }
`

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`

// File upload mutation
export const UPLOAD_FILE = gql`
  mutation UploadFile($file: Upload!, $category: String!) {
    uploadFile(file: $file, category: $category) {
      id
      filename
      originalName
      mimetype
      size
      url
      category
      uploadedBy {
        id
        username
      }
      createdAt
    }
  }
`

export const DELETE_FILE = gql`
  mutation DeleteFile($id: ID!) {
    deleteFile(id: $id)
  }
`
