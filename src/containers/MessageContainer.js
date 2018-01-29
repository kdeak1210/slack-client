import React, { Component } from 'react';
import { Comment } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import FileUpload from '../components/FileUpload';

const newChannelMessageSubscription = gql`
  subscription ($channelId: Int!) {
    newChannelMessage(channelId: $channelId) {
      id
      text
      user {
        username
      }
      created_at
    }
  }
`;

const localStyle = {
  fileUpload: {
    gridColumn: 3,
    gridRow: 2,
    paddingLeft: '20px',
    paddingRight: '20px',
    display: 'flex',
    flexDirection: 'column-reverse',
    overflowY: 'auto',
  },
};

class MessageContainer extends Component {
  componentWillMount() {
    this.unsubscribe = this.subscribe(this.props.channelId);
  }

  // Lifecycle method called when component gets new props
  componentWillReceiveProps({ channelId }) {
    if (this.props.channelId !== channelId) {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.unsubscribe = this.subscribe(channelId);
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  /** Subscribes the component to a gql subscription
   * Note, subscribeToMore apollo data prop returns an unsubscribe function
   */
  subscribe = channelId =>
    this.props.data.subscribeToMore({
      document: newChannelMessageSubscription,
      variables: {
        channelId,
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }
        return {
          ...prev,
          messages: [...prev.messages, subscriptionData.data.newChannelMessage],
        };
      },
    });

  render() {
    const { data: { messages, loading }, channelId } = this.props;
    return loading ? null : (

      <FileUpload
        style={localStyle.fileUpload}
        channelId={channelId}
        disableClick
      >
        <Comment.Group>
          {messages.map(m => (
            <Comment key={`message-${m.id}`}>
              {/* <Comment.Avatar src="" /> */}
              <Comment.Content>
                <Comment.Author as="a">{ m.user.username }</Comment.Author>
                <Comment.Metadata>
                  <div>{ m.created_at }</div>
                </Comment.Metadata>
                <Comment.Text>{ m.text }</Comment.Text>
                <Comment.Actions>
                  <Comment.Action>Reply</Comment.Action>
                </Comment.Actions>
              </Comment.Content>
            </Comment>
            ))}
        </Comment.Group>
      </FileUpload>

    );
  }
}

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
  options: {
    fetchPolicy: 'network-only', // won't cache this query.
  },
})(MessageContainer);
