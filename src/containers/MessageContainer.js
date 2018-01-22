import React from 'react';
import { Comment } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Messages from '../components/Messages';

const Message = ({
  id, text, created_at, user: { username },
}) => (
  <Comment key={`message-${id}`}>
    <Comment.Avatar src="/assets/images/avatar/small/matt.jpg" />
    <Comment.Content>
      <Comment.Author as="a">{ username }</Comment.Author>
      <Comment.Metadata>
        <div>{ created_at }</div>
      </Comment.Metadata>
      <Comment.Text>{ text }</Comment.Text>
      <Comment.Actions>
        <Comment.Action>Reply</Comment.Action>
      </Comment.Actions>
    </Comment.Content>
  </Comment>
);

const MessageContainer = ({ data: { loading, messages } }) => (loading ? null : (
  <Messages>
    <Comment.Group>
      {messages.map(m => Message(m))}
    </Comment.Group>
  </Messages>
));

const messagesQuery = gql`
  query ($channelId: Int!) {
    messages(channelId: $channelId) {
      id
      text
      user {
        username
      }
      created_at
    }
  }
`;

export default graphql(messagesQuery, {
  variables: props => ({
    channelId: props.channelId,
  }),
})(MessageContainer);
