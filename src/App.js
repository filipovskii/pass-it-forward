import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import Card from './Card.js'
import Home from './Home.js'
import './App.css';

// xxx todo browser history

class App extends Component {
  render() {
    return (
      <Router>
        <div className='router'>
          <Route exact path='/' component={Home} />
          <Route path='/:cardSlug' component={Card} />
        </div>
      </Router>
    );
  }
}

export default App;
