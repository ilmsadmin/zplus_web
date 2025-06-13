import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client'

// HTTP link to GraphQL endpoint
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4001/graphql',
})

// Simple auth link that adds token from localStorage
const authLink = from([
  // We'll add proper authentication handling later
  httpLink,
])

// Apollo Client instance
export const apolloClient = new ApolloClient({
  link: authLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            // Enable pagination for posts
            keyArgs: ['status', 'categoryId', 'search'],
            merge(existing, incoming) {
              if (!existing) return incoming
              return {
                ...incoming,
                edges: [...(existing.edges || []), ...(incoming.edges || [])],
              }
            },
          },
          projects: {
            // Enable pagination for projects
            keyArgs: ['featured', 'status'],
            merge(existing, incoming) {
              if (!existing) return incoming
              return {
                ...incoming,
                edges: [...(existing.edges || []), ...(incoming.edges || [])],
              }
            },
          },
          users: {
            // Enable pagination for users
            keyArgs: ['role', 'search'],
            merge(existing, incoming) {
              if (!existing) return incoming
              return {
                ...incoming,
                edges: [...(existing.edges || []), ...(incoming.edges || [])],
              }
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
})
