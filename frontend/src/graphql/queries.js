import { gql } from '@apollo/client';

export const ME_QUERY = gql`
  query me {
    me {
      email
      username
      avatar
      points
    }
  }
`;

export const USER_QUERY = gql`
  query user(
    $email: String!
  ) {
    user (
      email: $email
    ) {
      email
      username
      avatar
      points
    }
  }
`;

export const VALUABLE_QUESTIONS_QUERY = gql`
  query valuable(
    $num: Int!
  ) {
    valuable(
      num: $num
    ) {
      id
      reward
      title
    }
  }
`;

export const HOTTEST_QUESTIONS_QUERY = gql`
  query hottest(
    $num: Int!
  ) {
    hottest(
      num: $num
    ) {
      id
      reward
      title
    }
  }
`;

export const SEARCH_QUERY = gql`
  query search(
    $keyword: String!
  ) {
    search(
      keyword: $keyword
    ) {
      id
      reward
      views
      title
      body
      createdAt
      updatedAt
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

export const QUESTION_AUTHOR_QUERY_LITE = gql`
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
      }
    }
  }
`;

export const QUESTION_COMMENTS_QUERY = gql`
  query question(
    $questionID: String!
  ){
    question(
      questionID: $questionID
    ){
      id
      comments {
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
        like
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
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const QUESTION_ANSWERS_COUNT_QUERY = gql`
  query question(
    $questionID: String!
  ){
    question(
      questionID: $questionID
    ){
      id
      answers {
        id 
      }
    }
  }
`

export const QUESTION_COMMENTS_COUNT_QUERY = gql`
  query question(
    $questionID: String!
  ){
    question(
      questionID: $questionID
    ){
      id
      comments {
        id 
      }
    }
  }
`

export const POPOVER_QUESTION_ANSWERS_QUERY = gql`
  query question(
    $questionID: String!
  ){
    question(
      questionID: $questionID
    ){
      id
      answers {
        body
        like
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