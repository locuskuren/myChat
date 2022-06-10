import { gql } from '@apollo/client';

export const UPDATE_PROFILE_PIC = gql`
  mutation updateImageUrl($imageUrl: String!) {
    updateImageUrl(imageUrl: $imageUrl)
  }
`;
