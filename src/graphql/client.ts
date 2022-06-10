import { ApolloClient, InMemoryCache, makeVar } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';
import { getCurrentUser } from '../util';
import { User } from './interfaces';

export const authVar = makeVar(getCurrentUser());

const httpLink = new HttpLink({
  uri: 'https://locuskuren-mychat.herokuapp.com//gql',
});

const wsLink = new WebSocketLink({
  uri: `wss://locuskuren-mychat.herokuapp.com/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      Authorization: authVar()?.token ? `Bearer ${authVar()?.token}` : '',
    },
  },
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: authVar()?.token ? `Bearer ${authVar()?.token}` : '',
    },
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

export const selectedUserVar = makeVar<User | null>(null);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          auth: {
            read() {
              return authVar();
            },
          },
          selectedUser: {
            read() {
              return selectedUserVar();
            },
          },
        },
      },
    },
  }),
});
