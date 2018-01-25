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
  data: { mutate, loading, me },
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
      <React.Fragment>
        <Header channelName="username placeholder" />
        <DirectMessageContainer teamId={teamId} userId={userId} />
        <SendMessage
          placeholder={userId}
          onSubmit={async (text) => {
            const response = await mutate({
              variables: {
                text,
                receiverId: userId,
                teamId,
              },
            });
          }}
        />
      </React.Fragment>

    </AppLayout>
  );
};

const createDirectMessageMutation = gql`
  mutation($receiverId: Int!, $text: String!, $teamId: Int!) {
    createDirectMessage(receiverId: $receiverId, text: $text, teamId: $teamId)
  }
`;

export default compose(
  graphql(meQuery, { options: { fetchPolicy: 'network-only' } }),
  graphql(createDirectMessageMutation),
)(DirectMessage);
