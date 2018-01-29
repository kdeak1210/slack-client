import React from 'react';
import { Button, Checkbox, Form, Input, Modal } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import findIndex from 'lodash/findIndex';

import MultiSelectUsers from '../components/MultiSelectUsers';
import { meQuery } from '../graphql/team';

const AddChannelModal = ({
  open,
  onClose,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  resetForm,
  setFieldValue,
  teamId,
}) => (
  <Modal
    open={open}
    onClose={() => {
      resetForm();
      onClose();
    }}
  >
    <Modal.Header>Add a Channel</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            name="name"
            fluid
            placeholder="Channel Name"
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            value={!values.public}
            label="Private"
            onChange={(e, { checked }) => setFieldValue('public', !checked)}
            toggle
          />
        </Form.Field>
        {values.public ? null : (
          <Form.Field>
            <MultiSelectUsers
              placeholder="select members to invite"
              value={values.members}
              handleChange={(e, { value }) => setFieldValue('members', value)}
              teamId={teamId}
            />
          </Form.Field>
        )}
        <Form.Group widths="equal">
          <Button
            disabled={isSubmitting}
            fluid
            onClick={() => {
              resetForm();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button disabled={isSubmitting} onClick={handleSubmit} fluid>
            Create Channel
          </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

const createChannelMutation = gql`
  mutation ($teamId: Int!, $name: String!, $public: Boolean, $members: [Int!]){
    createChannel(teamId: $teamId, name: $name, public: $public, members: $members) {
      ok
      channel {
        id
        name
      }
    }
  }
`;

export default compose(
  graphql(createChannelMutation),
  withFormik({
    mapPropsToValues: () => ({ public: true, name: '', members: [] }),
    handleSubmit: async (values, { props: { teamId, mutate, onClose }, setSubmitting }) => {
      await mutate({
        variables: {
          teamId, name: values.name, public: values.public, members: values.members,
        },
        // Show UI change BEFORE async returns. Reverts if errors out
        optimisticResponse: {
          createChannel: {
            __typename: 'Mutation',
            ok: true,
            channel: {
              __typename: 'Channel',
              id: -1, // dont know id yet
              name: values.name, // DO know what name will be
            },
          },
        },
        update: (proxy, { data: { createChannel } }) => {
          const { ok, channel } = createChannel;
          if (!ok) {
            return;
          }

          // Read the data from our cache for this query.
          const data = proxy.readQuery({ query: meQuery });
          // Add our channel from the mutation to the end of our team's channel.
          const teamIndex = findIndex(data.me.teams, ['id', teamId]);
          data.me.teams[teamIndex].channels.push(channel);
          // Write our data back to the cache.
          proxy.writeQuery({ query: meQuery, data });
        },
      });
      onClose();
      setSubmitting(false);
    },
  }),
)(AddChannelModal);
