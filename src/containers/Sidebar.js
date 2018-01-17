import React, { Component } from 'react';
import decode from 'jwt-decode';

import Channels from '../components/Channels';
import Teams from '../components/Teams';
import AddChannelModal from '../components/AddChannelModal';
import InviteModal from '../components/InviteModal';

export default class Sidebar extends Component {
  state = {
    openAddChannelModal: false,
    openInviteModal: false,
  }

  handleCloseAddChannelModal = () => {
    this.setState({ openAddChannelModal: false });
  }

  handleAddChannelClick = () => {
    this.setState({ openAddChannelModal: true });
  }

  handleInviteClick = () => {
    this.setState({ openInviteModal: true });
  }

  handleCloseInviteModal = () => {
    this.setState({ openInviteModal: false });
  }

  render() {
    const { teams, team } = this.props;
    const { openAddChannelModal, openInviteModal } = this.state;

    let username = '';
    try {
      const token = localStorage.getItem('token');
      const { user } = decode(token);
      // eslint-disable-next-line prefer-destructuring
      username = user.username;
    } catch (err) {}

    return (
      <React.Fragment>
        <Teams teams={teams} />
        <Channels
          teamName={team.name}
          teamId={team.id}
          username={username}
          channels={team.channels}
          users={[{ id: 1, name: 'slackbot' }, { id: 2, name: 'user1' }]}
          onAddChannelClick={this.handleAddChannelClick}
          onInviteClick={this.handleInviteClick}
        />
        <AddChannelModal
          teamId={team.id}
          open={openAddChannelModal}
          onClose={this.handleCloseAddChannelModal}
        />
        <InviteModal
          teamId={team.id}
          open={openInviteModal}
          onClose={this.handleCloseInviteModal}
        />
      </React.Fragment>
    );
  }
}
