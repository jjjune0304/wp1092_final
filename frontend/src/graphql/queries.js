import { gql } from '@apollo/client';

export const ME_QUERY = gql`
  query me {
    me {
      id
      email
      username
      avatar
      points
      feedback
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
      id
      email
      username
      avatar
      points
      feedback
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
      view: true
    ){
      id
      reward
      views
      title
      body
      author {
        id
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
        id
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
        id
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
          id
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
          id
          username
          avatar
        }
        comments {
          id
          text
          author {
            id
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
`;

export const POPOVER_QUESTION_ANSWERS_QUERY = gql`
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
          id
          username
          avatar
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const INBOX_ME_QUERY = gql`
  query me {
    me {
      id
      username
      inbox {
        id
        unread
        type
        message
        qID
        refID
        time
      }
    }
  }
`;