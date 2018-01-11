import React, { Component } from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Button, Container, Form, Header, Input, Message } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class Login extends Component {
  constructor(props) {
    super(props);

    extendObservable(this, {
      email: '',
      password: '',
      errors: {},
    });
  }

  login = async () => {
    const { email, password } = this;
    const response = await this.props.mutate({
      variables: { email, password },
    });
    console.log(response);

    const {
      ok, token, refreshToken, errors,
    } = response.data.login;

    if (ok) {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      this.props.history.push('/');
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });

      this.errors = err;
    }
  }

  updateCredentials = (e) => {
    const { name, value } = e.target;
    this[name] = value;
  }

  render() {
    const { email, password, errors: { emailError, passwordError } } = this;
    const errorList = [];

    if (emailError) {
      errorList.push(emailError);
    }

    if (passwordError) {
      errorList.push(passwordError);
    }

    return (
      <Container>
        <Header as="h2">Login</Header>
        <Form>
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
          <Button onClick={this.login}>Submit</Button>
        </Form>
        { (errorList.length)
          ? <Message error header="Please fix the following form error(s): " list={errorList} />
          : null
        }
      </Container>
    );
  }
}

const loginMutation = gql`
  mutation ($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      token
      refreshToken
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(loginMutation)(observer(Login));
