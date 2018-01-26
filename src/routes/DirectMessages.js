import React from 'react';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import findIndex from 'lodash/findIndex';
import { Redirect } from 'react-router-dom';

import AppLayout from '../components/AppLayout';
import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import Sidebar from '../containers/Sidebar';
import DirectMessageContainer from '../containers/DirectMessageContainer';
import { meQuery } from '../graphql/team';

const DirectMessage = ({
  mutate,
  data: { loading, me, getUser },
  match: { params: { teamId, userId } },
}) => {
  if (loading) {
    return null;
  }

  const { teams, username } = me;

  if (!teams.length) {
    return <Redirect to="/create-team" />;
  }

  const teamIdInteger = parseInt(teamId, 10);
  const teamIndex = teamIdInteger ? findIndex(teams, ['id', teamIdInteger]) : 0;
  const team = teamIndex === -1 ? teams[0] : teams[teamIndex];

  return (
    <AppLayout>
      <Sidebar
        teams={teams.map(t => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase(),
        }))}
        team={team}
        username={username}
      />
      <Header channelName={getUser.username} />
      <DirectMessageContainer teamId={team.id} userId={userId} />
      <SendMessage
        placeholder={userId}
        onSubmit={async (text) => {
          const response = await mutate({
            variables: {
              text,
              receiverId: userId,
              teamId,
            },
            optimisticResponse: {
              createDirectMessage: true,
            },
            update: (proxy) => {
              const data = proxy.readQuery({ query: meQuery });
              const teamIndex2 = findIndex(data.me.teams, ['id', team.id]);
              const notAlreadyThere = data.me.teams[teamIndex2].directMessageMembers.every(member => member.id !== parseInt(userId, 10));
              if (notAlreadyThere) {
                data.me.teams[teamIndex2].directMessageMembers.push({
                  __typename: 'User',
                  id: userId,
                  username: getUser.username,
                });
                // Write our data back to the cache.
                proxy.writeQuery({ query: meQuery, data });
              }
            },
          });
          console.log(response);
        }}
      />
    </AppLayout>
  );
};

const createDirectMessageMutation = gql`
  mutation($receiverId: Int!, $text: String!, $teamId: Int!) {
    createDirectMessage(receiverId: $receiverId, text: $text, teamId: $teamId)
  }
`;

const directMessageMeQuery = gql`
  query ($userId: Int!) {
    getUser(userId: $userId) {
      username
    }
    me {
      id
      username
      teams {
        id
        name
        admin
        directMessageMembers {
          id
          username
        }
        channels {
          id
          name
        }
      }
    }
  }
`;

export default compose(
  graphql(directMessageMeQuery, {
    options: props => ({
      variables: { userId: props.match.params.userId },
      fetchPolicy: 'network-only',
    }),
  }),
  graphql(createDirectMessageMutation),
)(DirectMessage);
