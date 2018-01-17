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

const ViewTeam = ({ data: { loading, allTeams }, match: { params: { teamId, channelId } } }) => {
  if (loading) {
    return null;
  }

  if (!allTeams.length) {
    return <Redirect to="/create-team" />;
  }

  const teamIdInteger = parseInt(teamId, 10);
  const teamIndex = teamIdInteger ? findIndex(allTeams, ['id', teamIdInteger]) : 0;
  const team = allTeams[teamIndex];

  const channelIdInteger = parseInt(channelId, 10);
  const channelIndex = channelIdInteger ? findIndex(team.channels, ['id', channelIdInteger]) : 0;
  const channel = team.channels[channelIndex];

  return (
    <AppLayout>
      <Sidebar
        teams={allTeams.map(t => ({
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
          <SendMessage channelName={channel.name} />
        </React.Fragment>
      )}
    </AppLayout>
  );
};

export default graphql(allTeamsQuery)(ViewTeam);
