import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { createUploadLink } from 'apollo-upload-client';

// Builds on createHttpLink, adds file uploading capability
const httpLink = createUploadLink({
  uri: `http://${process.env.REACT_APP_SERVER_HOST_URL}/graphql`,
});

// Middleware runs before every gql request (add headers to context)
const middlewareLink = setContext(() => ({
  headers: {
    'x-token': localStorage.getItem('token'),
    'x-refresh-token': localStorage.getItem('refreshToken'),
  },
}));

// Afterware runs after every gql request (refresh tokens automatically)
const afterwareLink = new ApolloLink((operation, forward) =>
  forward(operation).map((response) => {
    const { headers } = operation.getContext();

    if (headers) {
      const token = headers['x-token'];
      const refreshToken = headers['x-refresh-token'];

      if (token) {
        localStorage.setItem('token', token);
      }

      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    }

    return response;
  }));

// concatenate the links (http, middleware, afterware)
const httpLinkWithMiddleware = afterwareLink.concat(middlewareLink.concat(httpLink));

export const wsLink = new WebSocketLink({
  uri: `ws://${process.env.REACT_APP_SERVER_HOST_URL}/subscriptions`,
  options: {
    reconnect: true,
    lazy: true,
    connectionParams: () => ({
      token: localStorage.getItem('token'),
      refreshToken: localStorage.getItem('refreshToken'),
    }),
  },
});

/** Look at the query, then determine which link to use. (fork in the road)
 * If the operation is a subscription, use the configured wsLink
 * else, use the httpLinkWithMiddleWare
 */
const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLinkWithMiddleware,
);

export default new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
