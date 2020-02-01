import React, { Component } from "react";
import GraphView from "./pages/GraphView/graph-view";
import { default as NavigationSubpages } from "./components/NavigationSubpages/navigation-subpages";
import Sidebar from "./components/SideBar/sidebar";
import { ConnectedRouter } from "connected-react-router";
import { Route, Redirect, Switch } from "react-router";
import { history } from "./index";
import classes from "./App.module.css";

export const menuBarHeight = 65;
export const appMargin = 5;

class App extends Component {
  render() {
    return (
      <ConnectedRouter history={history}>
        <React.Fragment>
          <div className={classes.offsetWrapper} style={{ padding: appMargin }}>
            <div className={classes.appBody}>
              <div className={classes.sidebar}>
                <Sidebar />
              </div>
              <div className={classes.contentWindow}>
                <Switch>
                  <Route
                    exact
                    path="/"
                    render={() => <Redirect to="/explore" />}
                  />
                  <Route path="/explore" component={GraphView} />
                </Switch>
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
