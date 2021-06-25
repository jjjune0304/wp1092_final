import { gql } from '@apollo/client';

export const LIKE_ANSWER_MUTATION = gql`
  mutation LikeAnswer(
    $aID: String!
  ) {
    likeAnswer(
      aID: $aID
    )
  }
`;

export const CREATE_ANSWER_MUTATION = gql`
  mutation CreateAnswer(
    $body: String!,
    $postID: String!
  ) {
    createAnswer(
      body: $body,
      postID: $postID
    ) {
      id
      body
      author {
        username
        avatar
      }
      comments {
        text
        author {
          username
          avatar
        }
      }
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment(
    $text: String!,
    $postID: String!,
    $postType: String!
  ) {
    createComment(
      text: $text,
      postID: $postID,
      postType: $postType
    ) {
      id
      text
      author {
        username
        avatar
      }
      createdAt 
      updatedAt
    }
  }
`;

export const CREATE_QUESTION_MUTATION = gql`
  mutation CreateQuestion(
      $title: String!,
      $body: String!,
      $reward: Int!
  ) {
    createQuestion(
        title: $title,
        body: $body,
        reward: $reward
    ){
      id
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
