import { gql } from '@apollo/client';

export const CREATE_QUESTION_MUTATION = gql`
  mutation CreateQuestion(
      $title: String!,
      $body: String!
  ) {
    createQuestion(
        title: $title,
        body: $body
    ){
      title
      body
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login( 
      $email: String!, 
      $password: String! 
  ) {
    login(
        email: $email,
        password: $password
    ) {
      token
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation Signup(
      $email: String! 
      $username: String! 
      $password: String! 
  ) {
    signup(
        email: $email
        username: $username
        password: $password 
    ) {
      email
      username
    }
  }
`;
