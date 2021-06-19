import { gql } from '@apollo/client';

export const USER_QUERY = gql`
  query user(
    $email: String!
    $password: String!
  ) {
    user (
      email: $email
      password: $password
    ) {
      token
      email
      username
    }
  }
`;
