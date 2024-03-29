import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom';
import './App.css';
import HowItWorks from "./pages/HowItWorks";
import Home from "./pages/Home";
import Cookbook from "./pages/Cookbook";
import Notes from "./pages/Notes";
import Page from "./pages/Page";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";


class App extends Component {
  render () {
    const App = () => (
      <div>
        <Switch>
          <Route exact path='/' component={ Home } />
          <Route path = '/about' component={ HowItWorks } />
          <Route path = '/main' component={ Cookbook } />
          <Route path = '/notes/:chapter/:recipeName' component={ Notes } />
          <Route path = '/recipe/:chapter/:recipeName' component={ Page } />
          <Route path = '/login' component={ Login } />
          <Route path = '/signup' component={ Signup } />
          <Route path = '/logout' component={ Home } />
          <Route component={ NotFound } />
        </Switch>
      </div>
    )
    return (
      <Switch>
        <App />
      </Switch>
    );
  }
}


export default App;
