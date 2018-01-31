import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import decode from 'jwt-decode';

import Home from './Home';
import Register from './Register';
import Login from './Login';
import CreateTeam from './CreateTeam';
import ViewTeam from './ViewTeam';

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  try {
    // try to decode the token. If can't decode, then user is invalid
    decode(token);
    const { exp } = decode(refreshToken);
    if (Date.now() / 1000 > exp) {
      // Current date has passed when the refresh token expired
      return false;
    }
  } catch (err) {
    return false;
  }
  return true;
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      (isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/login' }} />
      ))
    }
  />
);

export default () => (
  <Router>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/register" exact component={Register} />
      <Route path="/login" exact component={Login} />
      <PrivateRoute path="/view-team/:teamId?/:channelId?" exact component={ViewTeam} />
      <PrivateRoute path="/create-team" exact component={CreateTeam} />
    </Switch>
  </Router>
);
