import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import { persistCache } from 'apollo-cache-persist'
import { RetryLink } from 'apollo-link-retry'
import { withClientState } from 'apollo-link-state'

export default () => {
  // GraphQL // GraphQL API endpoint
  const httpLink = new HttpLink({ uri: 'http://localhost:3000/graphql' })
  //auth token
  const token = localStorage.getItem('GC_AUTH_TOKEN')
  //set token
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        authorization: token ? `Bearer ${token}` : ''
      }
    }
  })

  const retryLink = new RetryLink({
    delay: {
      initial: 300,
      max: Infinity,
      jitter: true
    },
    attempts: {
      max: 5,
      retryIf: (error, _operation) => !!error
    }
  })

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message},
        Location: ${locations}, Path: ${path}`
        )
      )
    if (networkError) console.log(`[Network error]: ${networkError}`)
  })

  const cache = new InMemoryCache()

  const initialState = {
    todos: []
  }
  const stateLink = withClientState({
    cache,
    defaults: initialState,
    resolvers: {
      Mutation: {
        addTodo: (_, { text }, { cache }) => {
          const newTodo = {
            id: 1,
            text,
            completed: false,
            __typename: 'TodoItem'
          }
          const data = {
            todos: newTodo
          }
          cache.writeData({ data })
          return newTodo
        }
      }
    }
  })

  const link = ApolloLink.from([
    retryLink,
    authLink,
    errorLink,
    stateLink,
    httpLink
  ])

  return {
    link,
    cache,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network'
      },
      query: {
        fetchPolicy: 'cache-and-network'
      }
    }
  }
}
