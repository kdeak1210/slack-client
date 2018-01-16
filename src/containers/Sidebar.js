import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import findIndex from 'lodash/findIndex';
import decode from 'jwt-decode';

import Channels from '../components/Channels';
import Teams from '../components/Teams';
import AddChannelModal from '../components/AddChannelModal';
import { allTeamsQuery } from '../graphql/team';

class Sidebar extends Component {
  state = {
    openAddChannelModal: false,
  }

  handleCloseAddChannelModal = () => {
    this.setState({ openAddChannelModal: false });
  }

  handleAddChannelClick = () => {
    this.setState({ openAddChannelModal: true });
  }

  render() {
    const { data: { loading, allTeams }, currentTeamId } = this.props;
    if (loading) {
      return null;
    }

    // Find the index of allTeams where 'id' is = to currentTeamId
    const teamIndex = currentTeamId ? findIndex(allTeams, ['id', parseInt(currentTeamId, 10)]) : 0;
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
          teamId={team.id}
          username={username}
          channels={team.channels}
          users={[{ id: 1, name: 'slackbot' }, { id: 2, name: 'user1' }]}
          onAddChannelClick={this.handleAddChannelClick}
        />
        <AddChannelModal
          teamId={team.id}
          open={this.state.openAddChannelModal}
          onClose={this.handleCloseAddChannelModal}
        />
      </React.Fragment>
    );
  }
}

export default graphql(allTeamsQuery)(Sidebar);

// props: data: { loading, allTeams }
