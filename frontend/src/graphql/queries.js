import { gql } from '@apollo/client';

export const CHATBOX_QUERY = gql`
  query chatboxes($boxkey: String!) {
    chatboxes(
      boxkey: $boxkey
    ) {
      id
      name
      messages {
        sender {
          name
        }
        body
      }
    }
  }
`;
