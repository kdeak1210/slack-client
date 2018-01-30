import React from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { withFormik } from 'formik';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import MultiSelectUsers from './MultiSelectUsers';

const DirectMessageModal = ({
  open,
  onClose,
  teamId,
  currentUserId,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  resetForm,
  setFieldValue,
}) => (
  <Modal open={open} onClose={onClose} >
    <Modal.Header>Direct Message a Team Member</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <MultiSelectUsers
            placeholder="select members to message"
            value={values.members}
            handleChange={(e, { value }) => setFieldValue('members', value)}
            teamId={teamId}
            currentUserId={currentUserId}
          />
        </Form.Field>
        <Form.Group>
          <Button
            disabled={isSubmitting}
            fluid
            onClick={(e) => {
              resetForm();
              onClose(e);
            }}
          >
            Cancel
          </Button>
          <Button disabled={isSubmitting} onClick={handleSubmit} fluid>
            Start Messaging
          </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

const getOrCreateChannelMutation = gql`
  mutation($teamId: Int!, $members: [Int!]!) {
    getOrCreateChannel(teamId: $teamId, members: $members)
  }
`;

export default compose(
  withRouter,
  graphql(getOrCreateChannelMutation),
  withFormik({
    mapPropsToValues: () => ({ members: [] }),
    handleSubmit: async ({ members }, { props: { onClose, teamId, mutate }, setSubmitting }) => {
      const response = await mutate({ variables: { teamId, members } });
      console.log(response);

      onClose();
      setSubmitting(false);
    },
  }),
)(DirectMessageModal);
