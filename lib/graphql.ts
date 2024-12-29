import { GraphQLClient } from 'graphql-request';

export const graphqlClient = new GraphQLClient(`${process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT}`, {
  headers: {},
});

export const setAuthToken = (token: string) => {
  graphqlClient.setHeader('Authorization', `Bearer ${token}`);
};