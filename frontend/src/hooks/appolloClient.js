import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context';
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'


// new Appollo Client Object (with token?)
const newAppolloClient = (token="") => {

    const abc="aa";
    // Create a WebSocket link:
    const wsLink = new WebSocketLink({
        // uri: `wss://13.213.47.0/graphql`,
        // uri: `ws://13.213.47.0:8020`,
        uri: `ws://epistemologyplus.com:8020`,
        options: { 
            reconnect: true,
            connectionParams: {
                authorization: token
            }
        }
    })
    
    // Create an http link:
    const httpLink = new HttpLink({
        uri: 'https://epistemologyplus.com/api'
    })

    // auth http link
    const authLink = setContext((_, { headers }) => {

        if ( token==="" )
            token = localStorage.getItem('token');
        
        return {
            headers: {
                ...headers,
                authorization: token ? token : "",
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
export { ApolloProvider };
export default newAppolloClient;