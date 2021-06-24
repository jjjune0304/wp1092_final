import { gql } from '@apollo/client';

export const USER_QUERY = gql`
  query user(
    $email: String!
  ) {
    user (
      email: $email
    ) {
      username
      points
      email
    }
  }
`;

export const LATEST_QUESTIONS_QUERY = gql`
  query latest(
    $num: Int!
  ) {
    latest(
      num: $num
    ) {
      id
      reward
      views
      title
      body
      author {
        username
        avatar
      }
      answers {
        body
        author {
          username
        }
      }
      createdAt
      updatedAt
    }
  }
`;

export const QUESTION_QUERY = gql`
  query question(
    $questionID: String!
  ){
    question(
      questionID: $questionID
    ){
      id
      reward
      views
      title
      body
      author {
        username
        avatar
        points
      }
      createdAt
      updatedAt
    }
  }
`;

export const QUESTION_AUTHOR_QUERY = gql`
  query question(
    $questionID: String!
  ){
    question(
      questionID: $questionID
    ){
      id
      author {
        username
        avatar
        points
        email
        questions {
          id
          title
        }
      }
    }
  }
`;

export const QUESTION_ANSWERS_QUERY = gql`
  query question(
    $questionID: String!
  ){
    question(
      questionID: $questionID
    ){
      id
      answers {
        id
        body
        author {
          username
          avatar
        }
        createdAt
        updatedAt
      }
    }
  }
`;
