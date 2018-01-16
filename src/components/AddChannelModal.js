import React from 'react';
import { Button, Form, Input, Modal } from 'semantic-ui-react';

const AddChannelModal = ({ open, onClose }) => (
  <Modal open={open} onClose={onClose}>
    <Modal.Header>Add a Channel</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input fluid placeholder="Channel Name" />
        </Form.Field>
        <Form.Group widths="equal">
          <Button onClick={onClose} fluid>Cancel</Button>
          <Button fluid>Create Channel</Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

export default AddChannelModal;
