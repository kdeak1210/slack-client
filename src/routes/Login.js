import React, { Component } from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Button, Container, Header, Input } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class Login extends Component {
  constructor(props) {
    super(props);

    extendObservable(this, {
      email: '',
      password: '',
    });
  }

  login = async () => {
    const { email, password } = this;
    const response = await this.props.mutate({ 
      variables: { email, password },
    });
    console.log(response);
    
    const { ok, token, refreshToken } = response.data.login;

    if (ok) {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);      
    }
  }

  updateCredentials = (e) => {
    const { name, value } = e.target;
    this[name] = value;
  }

  render() {
    const { email, password } = this;
    return (
      <Container>
        <Header as="h2">Login</Header>
        <Input
          name="email"
          onChange={this.updateCredentials}
          value={email}
          placeholder="email"
          fluid
        />
        <Input
          name="password"
          onChange={this.updateCredentials}
          value={password}
          type="password"
          placeholder="password"
          fluid
        />
        <Button onClick={this.login}>Submit</Button>
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
