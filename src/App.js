import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';

import Authenticate from './components/Authenticate';
import Home from './components/Home';
import Login from './components/Login';
import Logout from './components/Logout';
import Profile from './components/Profile';
import Signup from './components/Signup';
import Support from './components/Support';
import Pant from './components/Pant';
import History from './components/History';
import EditProfile from './components/EditProfile';
import Withdraw from './components/Withdraw';
import FAQ from './components/FAQ';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <HashRouter>
        <ScrollToTop />
        <Switch>
          <Route path="/" exact component={Authenticate} />
          <Route path="/home" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/logout" component={Logout} />
          <Route path="/profile" component={Profile} />
          <Route path="/signup" component={Signup} />
          <Route path="/support" component={Support} />
          <Route path="/pant" exact component={Pant} />
          <Route path="/history" component={History} />
          <Route path="/editprofile" component={EditProfile} />
          <Route path="/withdraw" component={Withdraw} />
          <Route path="/faq" component={FAQ} />
        </Switch>
      </HashRouter>
    )
  }
}

export default App;