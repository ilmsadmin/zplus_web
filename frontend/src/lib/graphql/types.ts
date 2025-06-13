// GraphQL Schema Types

export interface User {
  id: string
  email: string
  username: string
  firstName?: string
  lastName?: string
  avatar?: string
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface AuthPayload {
  token: string
  user: User
  expiresAt: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  featuredImage?: string
  status: PostStatus
  author: User
  category?: BlogCategory
  tags: string[]
  viewCount: number
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  postCount: number
  createdAt: string
}

export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  content?: string
  thumbnail?: string
  images: string[]
  technologies: string[]
  demoUrl?: string
  sourceUrl?: string
  status: ProjectStatus
  featured: boolean
  author: User
  createdAt: string
  updatedAt: string
}

export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED'
}

export interface Wallet {
  id: string
  user: User
  balance: number
  points: number
  currency: string
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  wallet: Wallet
  type: TransactionType
  amount: number
  points?: number
  description: string
  reference?: string
  status: TransactionStatus
  createdAt: string
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  PURCHASE = 'PURCHASE',
  REFUND = 'REFUND',
  POINTS_EARNED = 'POINTS_EARNED',
  POINTS_SPENT = 'POINTS_SPENT'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export interface WordPressSite {
  id: string
  name: string
  url: string
  username: string
  status: WordPressStatus
  lastSync?: string
  createdAt: string
}

export enum WordPressStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ERROR = 'ERROR'
}

export interface FileUpload {
  id: string
  filename: string
  originalName: string
  mimetype: string
  size: number
  url: string
  category: string
  uploadedBy: User
  createdAt: string
}

export interface DashboardStats {
  totalUsers: number
  totalPosts: number
  totalProjects: number
  totalTransactions: number
  monthlyRevenue: number
  monthlySignups: number
  activeUsers: number
}

export interface RecentActivity {
  id: string
  type: ActivityType
  description: string
  user?: User
  metadata?: string
  createdAt: string
}

export enum ActivityType {
  USER_REGISTERED = 'USER_REGISTERED',
  POST_PUBLISHED = 'POST_PUBLISHED',
  PROJECT_CREATED = 'PROJECT_CREATED',
  PAYMENT_COMPLETED = 'PAYMENT_COMPLETED',
  LOGIN_ATTEMPT = 'LOGIN_ATTEMPT'
}

// Input Types
export interface RegisterInput {
  email: string
  username: string
  password: string
  firstName?: string
  lastName?: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface CreatePostInput {
  title: string
  content: string
  excerpt?: string
  categoryId?: string
  tags?: string[]
  status?: PostStatus
  featuredImage?: string
}

export interface UpdatePostInput {
  id: string
  title?: string
  content?: string
  excerpt?: string
  categoryId?: string
  tags?: string[]
  status?: PostStatus
  featuredImage?: string
}

export interface CreateProjectInput {
  title: string
  description: string
  content?: string
  thumbnail?: string
  images?: string[]
  technologies: string[]
  demoUrl?: string
  sourceUrl?: string
  featured?: boolean
}

export interface UpdateProjectInput {
  id: string
  title?: string
  description?: string
  content?: string
  thumbnail?: string
  images?: string[]
  technologies?: string[]
  demoUrl?: string
  sourceUrl?: string
  featured?: boolean
  status?: ProjectStatus
}

export interface CreateCategoryInput {
  name: string
  description?: string
}

export interface DepositInput {
  amount: number
  method: string
}

export interface WordPressSiteInput {
  name: string
  url: string
  username: string
  password: string
}

// Pagination Types
export interface PageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor?: string
  endCursor?: string
}

export interface Connection<T> {
  edges: Array<{
    node: T
    cursor: string
  }>
  pageInfo: PageInfo
  totalCount: number
}

export type PostConnection = Connection<BlogPost>
export type ProjectConnection = Connection<Project>
export type UserConnection = Connection<User>
