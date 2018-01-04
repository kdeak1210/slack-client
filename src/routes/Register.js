import React, { Component } from 'react';
import { Button, Container, Header, Input } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class Register extends Component {

  state = {
    username: '',
    email: '',
    password: '',
  };

  register = async () => {
    //console.log(this.state);
    const response = await this.props.mutate({
      variables: this.state,
    });
    console.log('RESPONSE: ' + JSON.stringify(response));
  };

  updateCredentials = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value }); // ex name = 'email', [] uses the prop email
  };

  render() {

    const { username, email, password } = this.state;

    return (
      <Container>
        <Header as="h2">Register</Header>
        <Input 
          name="username" 
          onChange={this.updateCredentials} 
          value={username} 
          placeholder="username" 
          fluid 
        />
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
        <Button onClick={this.register}>Submit</Button>
      </Container>
    );
  }
}

const registerMutation = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password)    
  }
`;

export default graphql(registerMutation)(Register);
