import React from 'react';
import { Button, Form, Input, Modal } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import findIndex from 'lodash/findIndex';

import { allTeamsQuery } from '../graphql/team';

const AddChannelModal = ({
  open,
  onClose,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
}) => (
  <Modal open={open} onClose={onClose} >
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
        <Form.Group widths="equal">
          <Button disabled={isSubmitting} onClick={onClose} fluid>
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
  mutation ($teamId: Int!, $name: String!){
    createChannel(teamId: $teamId, name: $name) {
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
    mapPropsToValues: () => ({ name: '' }),
    handleSubmit: async (values, { props: { teamId, mutate, onClose }, setSubmitting }) => {
      await mutate({
        variables: { teamId, name: values.name },
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
          const data = proxy.readQuery({ query: allTeamsQuery });
          // Add our channel from the mutation to the end of our team's channel.
          const teamIndex = findIndex(data.allTeams, ['id', teamId]);
          data.allTeams[teamIndex].channels.push(channel);
          // Write our data back to the cache.
          proxy.writeQuery({ query: allTeamsQuery, data });
        },
      });
      onClose();
      setSubmitting(false);
    },
  }),
)(AddChannelModal);
