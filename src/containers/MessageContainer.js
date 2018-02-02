import React, { Component } from 'react';
import { Comment } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import FileUpload from '../components/FileUpload';
import RenderText from '../components/RenderText';

const newChannelMessageSubscription = gql`
  subscription ($channelId: Int!) {
    newChannelMessage(channelId: $channelId) {
      id
      text
      user {
        username
      }
      url
      mimetype
      created_at
    }
  }
`;

const localStyle = {
  fileUpload: {
    display: 'flex',
    flexDirection: 'column-reverse',
  },
  wrapper: {
    gridColumn: 3,
    gridRow: 2,
    paddingLeft: '20px',
    paddingRight: '20px',
    display: 'flex',
    flexDirection: 'column-reverse',
    overflowY: 'auto',
  },
};

const Message = ({ message: { url, text, mimetype } }) => {
  if (url) {
    if (mimetype.startsWith('image/')) {
      return <img src={url} alt="Uploaded File" />;
    } else if (mimetype === 'text/plain') {
      return <RenderText url={url} />;
    } else if (mimetype.startsWith('audio/')) {
      return (
        <div>
          <audio controls>
            <source src={url} type={mimetype} />
          </audio>
        </div>
      );
    }
  }
  return <Comment.Text>{text}</Comment.Text>;
};

class MessageContainer extends Component {
  state = {
    hasMoreItems: true,
    reachedTop: false,
  }

  componentWillMount() {
    this.unsubscribe = this.subscribe(this.props.channelId);
  }

  // Lifecycle method called when component gets new props
  componentWillReceiveProps({ data: { messages }, channelId }) {
    if (this.props.channelId !== channelId) {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.unsubscribe = this.subscribe(channelId);
    }

    // check for new messages (have existing, receiving NEW, & lengths dont match)
    if (
      this.scroller &&
      this.scroller.scrollTop < 20 &&
      this.props.data.messages &&
      messages &&
      this.props.data.messages.length !== messages.length
    ) {
      // 35 items, but new ones haven't yet rendered
      const heightBeforeRender = this.scroller.scrollHeight;
      // wait for 70 items (or more) to render
      setTimeout(() => {
        if (this.scroller) {
          this.scroller.scrollTop = this.scroller.scrollHeight - heightBeforeRender;
          this.setState({ reachedTop: false });
        }
      }, 100);
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
          messages: [subscriptionData.data.newChannelMessage, ...prev.messages],
        };
      },
    });

  handleScroll = () => {
    const { data: { messages, fetchMore }, channelId } = this.props;
    if (
      !this.state.reachedTop &&
      this.scroller &&
      this.scroller.scrollTop < 100 &&
      this.state.hasMoreItems &&
      messages.length >= 35
    ) {
      console.log('Reached Top');
      this.setState({ reachedTop: true });
      fetchMore({
        variables: {
          channelId, // keep same channelId
          cursor: messages[messages.length - 1].created_at, // date of last message
        },
        // Takes previousResult, what we fetched, and combines them together
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }

          if (fetchMoreResult.messages.length < 35) {
            // Reached end of list ex 35 35 23 0 0 0
            this.setState({ hasMoreItems: false });
          }

          return {
            ...previousResult,
            messages: [...previousResult.messages, ...fetchMoreResult.messages],
          };
        },
      });
    }
  }

  render() {
    const { data: { messages, loading }, channelId } = this.props;
    return loading ? null : (
      <div
        style={localStyle.wrapper}
        ref={(scroller) => {
          this.scroller = scroller;
        }}
        onScroll={this.handleScroll}
      >
        <FileUpload
          style={localStyle.fileUpload}
          channelId={channelId}
          disableClick
        >
          <Comment.Group>
            {messages
              .slice()
              .reverse()
              .map(m => (
                <Comment key={`message-${m.id}`}>
                  {/* <Comment.Avatar src="" /> */}
                  <Comment.Content>
                    <Comment.Author as="a">{ m.user.username }</Comment.Author>
                    <Comment.Metadata>
                      <div>{ m.created_at }</div>
                    </Comment.Metadata>
                    <Message message={m} />
                    <Comment.Actions>
                      <Comment.Action>Reply</Comment.Action>
                    </Comment.Actions>
                  </Comment.Content>
                </Comment>
              ))}
          </Comment.Group>
        </FileUpload>
      </div>
    );
  }
}

const messagesQuery = gql`
  query ($cursor: String, $channelId: Int!) {
    messages(cursor: $cursor, channelId: $channelId) {
      id
      text
      user {
        username
      }
      url
      mimetype
      created_at
    }
  }
`;

export default graphql(messagesQuery, {
  options: props => ({
    fetchPolicy: 'network-only', // won't cache this query.
    variables: {
      channelId: props.channelId,
    },
  }),
})(MessageContainer);
