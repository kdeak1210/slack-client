import React, { Component } from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Button, Container, Form, Header, Input, Message } from 'semantic-ui-react';
import { graphql } from 'react-apollo';

import { createTeamMutation } from '../graphql/team';

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
    let response = null;

    try {
      response = await this.props.mutate({
        variables: { name },
      });
    } catch (err) {
      // console.log(err)
      this.props.history.push('/login');
      return;
    }

    console.log(response);

    const { ok, errors, team } = response.data.createTeam;

    if (ok) {
      this.props.history.push(`/view-team/${team.id}`);
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

export default graphql(createTeamMutation)(observer(CreateTeam));
