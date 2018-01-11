import React, { Component } from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Button, Container, Form, Header, Input, Message } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class CreateTeam extends Component {
  constructor(props) {
    super(props);

    extendObservable(this, {
      name: '',
      errors: {},
    });
  }

  onSubmit = async () => {
    const { name } = this;
    const response = await this.props.mutate({
      variables: { name },
    });
    console.log(response);

    const { ok, errors } = response.data.createTeam;

    if (ok) {
      this.props.history.push('/');
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });

      this.errors = err;
    }
  }

  onChange = (e) => {
    const { name, value } = e.target;
    this[name] = value;
  }

  render() {
    const { name, errors: { nameError } } = this;
    const errorList = [];

    if (nameError) {
      errorList.push(nameError);
    }

    return (
      <Container>
        <Header as="h2">Create Team</Header>
        <Form>
          <Form.Field error={!!nameError}>
            <Input
              name="name"
              onChange={this.onChange}
              value={name}
              placeholder="Name"
              fluid
            />
          </Form.Field>
          <Button onClick={this.onSubmit}>Create</Button>
        </Form>
        { (errorList.length)
          ? <Message error header="Please fix the following form error(s): " list={errorList} />
          : null
        }
      </Container>
    );
  }
}

const createTeamMutation = gql`
  mutation ($name: String!) {
    createTeam(name: $name) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(createTeamMutation)(observer(CreateTeam));
