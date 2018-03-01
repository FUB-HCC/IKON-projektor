import React, { Component } from 'react'
import GraphView from './containers/GraphView/GraphView'
import About from './containers/About/About'
import Discoveries from './containers/Discoveries/Discoveries'
import Projects from './containers/Projects/Projects'
import NavigationSubpages from './components/NavigationSubpages/NavigationSubpages'
import { ConnectedRouter } from 'react-router-redux'
import { Route, Redirect } from 'react-router'
import {history} from './index'

class App extends Component {
  render () {
    return (
      <ConnectedRouter history={history}>
        <div>
          <NavigationSubpages/>
          <Route exact path='/' render={() => (<Redirect to="/explore"/>)}/>
          <Route path='/projects' component={Projects} />
          <Route path='/explore' component={GraphView} />
          <Route path='/discoveries' component={Discoveries} />
          <Route path='/about' component={About} />
        </div>
      </ConnectedRouter>
    )
  }
}

export default App
