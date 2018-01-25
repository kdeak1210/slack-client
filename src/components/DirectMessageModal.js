import React from 'react';
import { Button, Form, Input, Modal } from 'semantic-ui-react';
import Downshift from 'downshift';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const DirectMessageModal = ({
  open,
  onClose,
  teamId,
  data: { loading, teamMembers },
  history,
}) => (
  <Modal open={open} onClose={onClose} >
    <Modal.Header>Add a Channel</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          {/* <Input name="name" fluid placeholder="Search users" /> */}
          {!loading && (
            <Downshift
              onChange={(selectedUser) => {
                history.push(`/view-team/user/${teamId}/${selectedUser.id}`);
                onClose();
              }}
              render={({
                getInputProps,
                getItemProps,
                isOpen,
                inputValue,
                selectedItem,
                highlightedIndex,
              }) => (
                <div>
                  <Input fluid {...getInputProps({ placeholder: 'Username of person to message?' })} />
                  {isOpen ? (
                    <div style={{ border: '1px solid #ccc' }}>
                      {teamMembers
                        .filter(i =>
                            !inputValue ||
                            i.username.toLowerCase().includes(inputValue.toLowerCase()))
                        .map((item, index) => (
                          <div
                            {...getItemProps({ item })}
                            key={item.id}
                            style={{
                              backgroundColor:
                                highlightedIndex === index ? 'gray' : 'white',
                              fontWeight: selectedItem === item ? 'bold' : 'normal',
                            }}
                          >
                            {item.username}
                          </div>
                        ))}
                    </div>
                  ) : null}
                </div>
              )}
            />
          )}
        </Form.Field>
        <Button onClick={onClose} fluid>
          Cancel
        </Button>
      </Form>
    </Modal.Content>
  </Modal>
);

const teamMembersQuery = gql`
  query ($teamId: Int!) {
    teamMembers(teamId: $teamId) {
      id
      username
    }
  }
`;

export default withRouter(graphql(teamMembersQuery)(DirectMessageModal));
