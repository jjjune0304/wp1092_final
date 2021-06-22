import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context';
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

// Create an http link:
const httpLink = new HttpLink({
    uri: 'http://localhost:5000/'
})

// Create a WebSocket link:
const wsLink = new WebSocketLink({
    uri: `ws://localhost:5000/graphql`,
    options: { reconnect: true }
})

// new Appollo Client Object (with token?)
const newAppolloClient = (token="") => {

    const authLink = setContext((_, { headers }) => {

        if ( token=="" )
            token = localStorage.getItem('token');
        
        return {
            headers: {
                ...headers,
                authentication: token ? token : "",
            }
        }
    });

    // split links, depending on what kind of operation is being sent
    const link = split(
        // split based on operation type
        ({ query }) => {
            const definition = getMainDefinition(query)
            return (
              definition.kind === 'OperationDefinition' &&
              definition.operation === 'subscription'
            )
        },
        authLink.concat(wsLink),
        authLink.concat(httpLink)
    )

    const client = new ApolloClient({
        link,
        cache: new InMemoryCache().restore({})
    })

    return client;
}
export {ApolloProvider};
export default newAppolloClient;