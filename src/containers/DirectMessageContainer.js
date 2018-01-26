import React, { Component } from 'react';
import { Comment } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Messages from '../components/Messages';

const newDirectMessageSubscription = gql`
  subscription ($teamId: Int!, $userId: Int!) {
    newDirectMessage(teamId: $teamId, userId: $userId) {
      id
      sender {
        username
      }
      text
      created_at
    }
  }
`;

class DirectMessageContainer extends Component {
  componentWillMount() {
    this.unsubscribe = this.subscribe(this.props.teamId, this.props.userId);
  }

  // Lifecycle method called when component gets new props
  componentWillReceiveProps({ teamId, userId }) {
    if (this.props.teamId !== teamId || this.props.userId !== userId) {
      // One of the id's changed (navigated away from DM), unsubscribe
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.unsubscribe = this.subscribe(this.props.teamId, this.props.userId);
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  subscribe = (teamId, userId) =>
    this.props.data.subscribeToMore({
      document: newDirectMessageSubscription,
      variables: {
        teamId,
        userId,
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }
        return {
          ...prev,
          directMessages: [...prev.directMessages, subscriptionData.data.newDirectMessage],
        };
      },
    });

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
  options: props => ({
    fetchPolicy: 'network-only', // won't cache this query.
    variables: {
      teamId: props.teamId,
      userId: props.userId,
    },
  }),
})(DirectMessageContainer);
