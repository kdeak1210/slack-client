import React, { Component } from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Button, Container, Header, Input } from 'semantic-ui-react';

export default observer(class Login extends Component {
  constructor(props) {
    super(props);

    extendObservable(this, {
      email: '',
      password: '',
    });
  }

  login = () => {
    const { email, password } = this;
    console.log(email);
    console.log(password);
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
});
