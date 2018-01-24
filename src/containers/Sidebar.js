import React, { Component } from 'react';

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
    const { teams, team, username } = this.props;
    const { openAddChannelModal, openInviteModal } = this.state;

    return (
      <React.Fragment>
        <Teams teams={teams} />
        <Channels
          teamName={team.name}
          teamId={team.id}
          username={username}
          channels={team.channels}
          isOwner={team.admin}
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
