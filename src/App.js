import React, { Component } from 'react'
import GraphView from './pages/GraphView'
import About from './pages/About'
import Discoveries from './pages/Discoveries'
import Projects from './pages/Projects'
import { default as NavigationSubpages } from './components/NavigationSubpages/NavigationSubpages'
import Footer from './components/Footer/Footer'
import Sidebar from './components/Sidebar/Sidebar'
import { ConnectedRouter } from 'connected-react-router'
import { Route, Redirect, Switch } from 'react-router'
import {history} from './index'
import classes from './App.css'

class App extends Component {
  render () {
    return (
      <ConnectedRouter history={history}>
        <React.Fragment>
          <NavigationSubpages/>
          <div className={classes.bodyWrap}>
              <Switch>
                <Route exact path='/' render={() => (<Redirect to="/explore"/>)}/>
                <Route path='/projects' component={Projects} />
                <Route path='/explore' component={GraphView} />
                <Route path='/discoveries' component={Discoveries} />
                <Route path='/about' component={About} />
              </Switch>
            <div className={classes.sidebar}>
              <Sidebar />
            </div>
          </div>
          <Footer />
        </React.Fragment>
      </ConnectedRouter>
    )
  }
}

export default App
