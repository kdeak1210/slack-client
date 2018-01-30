import React, { Component } from 'react';

import Channels from '../components/Channels';
import Teams from '../components/Teams';
import AddChannelModal from '../components/AddChannelModal';
import InviteModal from '../components/InviteModal';
import DirectMessageModal from '../components/DirectMessageModal';

export default class Sidebar extends Component {
  state = {
    openAddChannelModal: false,
    openInviteModal: false,
    openDirectMessageModal: false,
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

  toggleDirectMessageModal = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.setState(state => ({ openDirectMessageModal: !state.openDirectMessageModal }));
  }

  render() {
    const {
      teams, team, username, currentUserId,
    } = this.props;
    const { openAddChannelModal, openInviteModal, openDirectMessageModal } = this.state;

    const regularChannels = [];
    const dmChannels = [];

    team.channels.forEach((c) => {
      if (c.dm) {
        dmChannels.push(c);
      } else {
        regularChannels.push(c);
      }
    });

    return (
      <React.Fragment>
        <Teams teams={teams} />
        <Channels
          teamName={team.name}
          teamId={team.id}
          username={username}
          channels={regularChannels}
          dmChannels={dmChannels}
          isOwner={team.admin}
          users={team.directMessageMembers}
          onAddChannelClick={this.toggleAddChannelModal}
          onInviteClick={this.toggleInviteModal}
          onDirectMessageClick={this.toggleDirectMessageModal}
        />
        <AddChannelModal
          teamId={team.id}
          currentUserId={currentUserId}
          open={openAddChannelModal}
          onClose={this.toggleAddChannelModal}
        />
        <InviteModal
          teamId={team.id}
          open={openInviteModal}
          onClose={this.toggleInviteModal}
        />
        <DirectMessageModal
          teamId={team.id}
          currentUserId={currentUserId}
          open={openDirectMessageModal}
          onClose={this.toggleDirectMessageModal}
        />
      </React.Fragment>
    );
  }
}
