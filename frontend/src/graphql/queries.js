import { gql } from '@apollo/client';

export const USER_QUERY = gql`
  query user(
    $email: String!
  ) {
    user (
      username: $email
    ) {
      email
      username
    }
  }
`;
