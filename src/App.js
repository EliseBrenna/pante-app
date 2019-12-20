import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';

import Authenticate from './components/Authenticate';
import Home from './components/Home';
import Login from './components/Login';
import Logout from './components/Logout';
import Profile from './components/Profile';
import Signup from './components/Signup';
import Support from './components/Support';

import './App.css';

class App extends React.Component {
  render() {
    return (
      <HashRouter>
      <Switch>
        <Route path="/" exact component={Authenticate} />
        <Route path="/home" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/logout" component={Logout} />
        <Route path="/profile" component={Profile} />
        <Route path="/signup" component={Signup} />
        <Route path="/support" component={Support} />
      </Switch>
    </HashRouter>
    )
  }
}

export default App;