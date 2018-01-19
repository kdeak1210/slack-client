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

  toggleAddChannelModal = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.setState(state => ({ openAddChannelModal: !state.openAddChannelModal }));
  }

  toggleInviteModal = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.setState(state => ({ openInviteModal: !state.openInviteModal }));
  }

  render() {
    const { teams, team } = this.props;
    const { openAddChannelModal, openInviteModal } = this.state;

    let username = '';
    let isOwner = false;

    try {
      const token = localStorage.getItem('token');
      const { user } = decode(token);
      // eslint-disable-next-line prefer-destructuring
      username = user.username;
      isOwner = (user.id === team.owner);
    } catch (err) {}

    return (
      <React.Fragment>
        <Teams teams={teams} />
        <Channels
          teamName={team.name}
          teamId={team.id}
          username={username}
          channels={team.channels}
          isOwner={isOwner}
          users={[{ id: 1, name: 'slackbot' }, { id: 2, name: 'user1' }]}
          onAddChannelClick={this.toggleAddChannelModal}
          onInviteClick={this.toggleInviteModal}
        />
        <AddChannelModal
          teamId={team.id}
          open={openAddChannelModal}
          onClose={this.toggleAddChannelModal}
        />
        <InviteModal
          teamId={team.id}
          open={openInviteModal}
          onClose={this.toggleInviteModal}
        />
      </React.Fragment>
    );
  }
}
