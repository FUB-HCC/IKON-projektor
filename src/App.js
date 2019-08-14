import React, { Component } from 'react'
import GraphView from './containers/GraphView/GraphView'
// import AreaChart from './containers/GraphView/AreaChart'
import GraphViewPetri from './containers/GraphView/GraphViewPetri'
import GraphViewTimeLine from './containers/GraphView/GraphViewTimeLine'
import About from './containers/About/About'
import Discoveries from './containers/Discoveries/Discoveries'
import Projects from './containers/Projects/Projects'
import { default as NavigationSubpages } from './components/NavigationSubpages/NavigationSubpages'
// import Footer from './components/Footer/Footer'
import Sidebar from './components/Sidebar/Sidebar'
import { ConnectedRouter } from 'react-router-redux'
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
            <div className={classes.BackGradient}>
              <Switch>
                <Route exact path='/' render={() => (<Redirect to="/explore"/>)}/>
                <Route path='/projects' component={Projects} />
                <Route path='/explore' component={GraphView} />
                <Route path='/discoveries' component={Discoveries} />
                <Route path='/about' component={About} />
              </Switch>
            </div>
            <div className={classes.BackGradientRight}>
              <Switch>
                {/* <Route exact path='/' render={() => (<Redirect to="/explore"/>)}/> */}
                <Route path='/projects' component={Projects} />
                <Route path='/explore' component={GraphViewPetri}/>
                <Route path='/discoveries' component={Discoveries} />
                <Route path='/about' component={About} />
              </Switch>
            </div>
            <div className={classes.BackGradientTimeLine}>
              <Switch>
                <Route path='/projects' component={Projects} />
                <Route path='/explore' component={GraphViewTimeLine}/>
                <Route path='/discoveries' component={Discoveries} />
                <Route path='/about' component={About} />
              </Switch>
            </div>
            <div className={classes.sidebar}>
              <Sidebar />
            </div>
          </div>
          {/* <Footer /> */}
        </React.Fragment>
      </ConnectedRouter>
    )
  }
}

export default App
