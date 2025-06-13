'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { LOGIN, LOGOUT, REGISTER } from '../graphql/mutations'
import { GET_ME } from '../graphql/queries'
import { User, LoginInput, RegisterInput, AuthPayload } from '../graphql/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (input: LoginInput) => Promise<AuthPayload | null>
  register: (input: RegisterInput) => Promise<AuthPayload | null>
  logout: () => Promise<void>
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

  // GraphQL mutations
  const [loginMutation] = useMutation(LOGIN)
  const [registerMutation] = useMutation(REGISTER)
  const [logoutMutation] = useMutation(LOGOUT)

  // Query to get current user
  const { data: meData, loading: meLoading, refetch: refetchMe } = useQuery(GET_ME, {
    skip: !getStoredToken(),
    errorPolicy: 'ignore'
  })

  // Check if we have a stored token and user data
  useEffect(() => {
    const token = getStoredToken()
    if (token && meData?.me) {
      setUser(meData.me)
    } else if (!token) {
      setUser(null)
    }
  }, [meData])

  function getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken')
    }
    return null
  }

  function storeToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token)
    }
  }

  function removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
    }
  }

  const login = async (input: LoginInput): Promise<AuthPayload | null> => {
    try {
      setError(null)
      const { data } = await loginMutation({
        variables: { input }
      })

      if (data?.login) {
        const authPayload = data.login
        storeToken(authPayload.token)
        setUser(authPayload.user)
        return authPayload
      }
      return null
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const register = async (input: RegisterInput): Promise<AuthPayload | null> => {
    try {
      setError(null)
      const { data } = await registerMutation({
        variables: { input }
      })

      if (data?.register) {
        const authPayload = data.register
        storeToken(authPayload.token)
        setUser(authPayload.user)
        return authPayload
      }
      return null
    } catch (err: any) {
      const errorMessage = err.message || 'Registration failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      setError(null)
      await logoutMutation()
    } catch (err: any) {
      console.error('Logout error:', err)
    } finally {
      // Always clear local state, even if server logout fails
      removeToken()
      setUser(null)
    }
  }

  const value: AuthContextType = {
    user,
    loading: meLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
