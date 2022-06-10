import { gql } from '@apollo/client';

export const GET_AUTH = gql`
  query getAuth {
    auth @client
  }
`;
