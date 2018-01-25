import React, { Component } from 'react';
import { Comment } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Messages from '../components/Messages';

// eslint-disable-next-line react/prefer-stateless-function
class DirectMessageContainer extends Component {
  // componentWillMount() {
  //   this.unsubscribe = this.subscribe(this.props.channelId);
  // }

  // // Lifecycle method called when component gets new props
  // componentWillReceiveProps({ channelId }) {
  //   if (this.props.channelId !== channelId) {
  //     if (this.unsubscribe) {
  //       this.unsubscribe();
  //     }
  //     this.unsubscribe = this.subscribe(channelId);
  //   }
  // }

  // componentWillUnmount() {
  //   if (this.unsubscribe) {
  //     this.unsubscribe();
  //   }
  // }

  // subscribe = channelId =>
  //   this.props.data.subscribeToMore({
  //     document: newChannelMessageSubscription,
  //     variables: {
  //       channelId,
  //     },
  //     updateQuery: (prev, { subscriptionData }) => {
  //       if (!subscriptionData.data) {
  //         return prev;
  //       }
  //       return {
  //         ...prev,
  //         messages: [...prev.messages, subscriptionData.data.newChannelMessage],
  //       };
  //     },
  //   });

  render() {
    const { data: { directMessages, loading } } = this.props;

    return loading ? null : (
      <Messages>
        <Comment.Group>
          {directMessages.map(m => (
            <Comment key={`direct-message-${m.id}`}>
              <Comment.Avatar src="/assets/images/avatar/small/matt.jpg" />
              <Comment.Content>
                <Comment.Author as="a">{ m.sender.username }</Comment.Author>
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
      </Messages>
    );
  }
}

const directMessagesQuery = gql`
  query ($teamId: Int!, $userId: Int!) {
    directMessages(teamId: $teamId, otherUserId: $userId) {
      id
      sender {
        username
      }
      text
      created_at
    }
  }
`;

export default graphql(directMessagesQuery, {
  variables: props => ({
    teamId: props.teamId,
    userId: props.userId,
  }),
  options: {
    fetchPolicy: 'network-only', // won't cache this query.
  },
})(DirectMessageContainer);
