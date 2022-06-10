import { gql } from '@apollo/client';

export const GET_SELECTED_USER = gql`
  query getSelectedUser {
    selectedUser @client
  }
`;
