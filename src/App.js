import React, { Component } from "react";
import GraphView from "./pages/GraphView/graph-view";
import About from "./pages/About/about";
import Discoveries from "./pages/Discoveries/discoveries";
import Projects from "./pages/Projects/projects";
import { default as NavigationSubpages } from "./components/NavigationSubpages/navigation-subpages";
import Sidebar from "./components/SideBar/sidebar";
import { ConnectedRouter } from "connected-react-router";
import { Route, Redirect, Switch } from "react-router";
import { history } from "./index";
import classes from "./App.module.css";
import { getFiltersFromURL } from "./store/actions/actions";

export const menuBarHeight = 100;
export const appMargin = 10;

class App extends Component {
  componentDidMount() {
    getFiltersFromURL();
  }

  render() {
    return (
      <ConnectedRouter history={history}>
        <React.Fragment>
          <div className={classes.offsetWrapper} style={{ padding: appMargin }}>
            <NavigationSubpages height={menuBarHeight} />
            <div className={classes.appBody}>
              <div className={classes.contentWindow}>
                <Switch>
                  <Route
                    exact
                    path="/"
                    render={() => <Redirect to="/explore" />}
                  />
                  <Route path="/projects" component={Projects} />
                  <Route path="/explore" component={GraphView} />
                  <Route path="/discoveries" component={Discoveries} />
                  <Route path="/about" component={About} />
                </Switch>
              </div>
              <div className={classes.sidebar}>
                <Sidebar />
              </div>
              {/*<Footer />*/}
            </div>
          </div>
        </React.Fragment>
      </ConnectedRouter>
    );
  }
}

export default App;
