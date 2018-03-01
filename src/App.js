import React, { Component } from 'react'
import GraphView from './containers/GraphView/GraphView'
import About from './containers/About/About'
import Discoveries from './containers/Discoveries/Discoveries'
import Projects from './containers/Projects/Projects'
import NavigationSubpages from './components/NavigationSubpages/NavigationSubpages'
import {Route} from 'react-router-dom'

class App extends Component {
  render () {
    return (
      <div>
        <NavigationSubpages />
        <Route path='/' component={App}>
          <Route path='projects' component={Projects} />
          <Route path='graphview' component={GraphView} />
          <Route path='discoveries' component={Discoveries} />
          <Route path='about' component={About} />
        </Route>
      </div>
    )
  }
}

export default App
