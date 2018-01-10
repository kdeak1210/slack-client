import React, { Component } from 'react';
import { Button, Container, Form, Header, Input, Message } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class Register extends Component {
  state = {
    username: '',
    usernameError: '',
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
  };

  register = async () => {
    this.setState({ // Firstly clear out the errors (reset)
      usernameError: '',
      emailError: '',
      passwordError: '',
    });

    const { username, email, password } = this.state;
    const response = await this.props.mutate({
      variables: { username, email, password },
    });

    const { ok, errors } = response.data.register;

    if (ok) {
      this.props.history.push('/'); // Redirect them Home
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });
      // console.log(err);
      this.setState(err);
    }
    // console.log(response);
  };

  updateCredentials = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value }); // ex name = 'email', [] uses the prop email
  };

  render() {
    const {
      username, email, password, usernameError, emailError, passwordError,
    } = this.state;
    const errorList = [];

    if (usernameError) {
      errorList.push(usernameError);
    }

    if (emailError) {
      errorList.push(emailError);
    }

    if (passwordError) {
      errorList.push(passwordError);
    }

    return (
      <Container>
        <Header as="h2">Register</Header>
        <Form>
          <Form.Field error={!!usernameError}>
            <Input
              name="username"
              onChange={this.updateCredentials}
              value={username}
              placeholder="username"
              fluid
            />
          </Form.Field>
          <Form.Field error={!!emailError}>
            <Input
              name="email"
              onChange={this.updateCredentials}
              value={email}
              placeholder="email"
              fluid
            />
          </Form.Field>
          <Form.Field error={!!passwordError}>
            <Input
              name="password"
              onChange={this.updateCredentials}
              value={password}
              type="password"
              placeholder="password"
              fluid
            />
          </Form.Field>
          <Button onClick={this.register}>Submit</Button>
        </Form>
        { (errorList.length)
          ? <Message error header="Please fix the following form error(s): " list={errorList} />
          : null
        }
      </Container>
    );
  }
}

const registerMutation = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      ok
      errors {
        path
        message
      }
    } 
  }
`;

export default graphql(registerMutation)(Register);
