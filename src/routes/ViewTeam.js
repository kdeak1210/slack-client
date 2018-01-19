import React from 'react';
import { graphql } from 'react-apollo';
import findIndex from 'lodash/findIndex';
import { Redirect } from 'react-router-dom';

import AppLayout from '../components/AppLayout';
import Header from '../components/Header';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';
import Sidebar from '../containers/Sidebar';
import { allTeamsQuery } from '../graphql/team';

const ViewTeam = ({
  data: { loading, allTeams, inviteTeams },
  match: { params: { teamId, channelId } },
}) => {
  if (loading) {
    return null;
  }

  const teams = [...allTeams, ...inviteTeams];

  if (!teams.length) {
    return <Redirect to="/create-team" />;
  }

  const teamIdInteger = parseInt(teamId, 10);
  const teamIndex = teamIdInteger ? findIndex(teams, ['id', teamIdInteger]) : 0;
  const team = teamIndex === -1 ? teams[0] : teams[teamIndex];

  const channelIdInteger = parseInt(channelId, 10);
  const channelIndex = channelIdInteger ? findIndex(team.channels, ['id', channelIdInteger]) : 0;
  const channel = channelIndex === -1 ? team.channels[0] : team.channels[channelIndex];

  return (
    <AppLayout>
      <Sidebar
        teams={teams.map(t => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase(),
        }))}
        team={team}
      />
      {channel && (
        <React.Fragment>
          <Header channelName={channel.name} />
          <Messages channelId={channel.id} >
            <ul className="message-list">
              <li />
              <li />
            </ul>
          </Messages>
          <SendMessage channelName={channel.name} channelId={channel.id} />
        </React.Fragment>
      )}
    </AppLayout>
  );
};

export default graphql(allTeamsQuery)(ViewTeam);
