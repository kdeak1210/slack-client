import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import _ from 'lodash';
import decode from 'jwt-decode';

import Channels from '../components/Channels';
import Teams from '../components/Teams';

const Sidebar = ({ data: { loading, allTeams }, currentTeamId }) => {
  if (loading) {
    return null;
  }

  // Find the index of allTeams where 'id' is = to currentTeamId
  const teamIndex = _.findIndex(allTeams, ['id', currentTeamId]);
  const team = allTeams[teamIndex];
  let username = '';
  try {
    const token = localStorage.getItem('token');
    const { user } = decode(token);
    // eslint-disable-next-line prefer-destructuring
    username = user.username;
  } catch (err) {}

  return (
    <React.Fragment>
      <Teams teams={allTeams.map(t => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase(),
        }))}
      />
      <Channels
        teamName={team.name}
        username={username}
        channels={team.channels}
        users={[{ id: 1, name: 'slackbot' }, { id: 2, name: 'user1' }]}
      />
    </React.Fragment>
  );
};

const allTeamsQuery = gql`
  {
    allTeams {
      id
      name
      channels {
        id
        public
        name
      }
    }
  }
`;

export default graphql(allTeamsQuery)(Sidebar);

// props: data: { loading, allTeams }
