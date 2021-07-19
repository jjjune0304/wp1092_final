import { gql } from '@apollo/client';

export const CHATBOX_SUBSCRIPTION = gql`
  subscription messageAdded($boxkey: String!) {
    chatboxes(
      boxkey: $boxkey
    ) {
      message {
        id
        sender {
          id
          name
        }
        body
      }
    }
  }
`;

export const FEEDBACK_SUBSCRIPTION = gql`
  subscription {
    feedback
  }
`;

export const INBOX_SUBSCRIPTION = gql`
  subscription {
    inbox {
      type
      message
      qID
      refID
      time 
    }
  }
`;
