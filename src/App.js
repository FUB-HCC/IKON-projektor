import React, { Component } from "react";
import GraphView from "./pages/GraphView/graph-view";
import About from "./pages/About/about";
import Discoveries from "./pages/Discoveries/discoveries";
import Projects from "./pages/Projects/projects";
import { default as NavigationSubpages } from "./components/NavigationSubpages/navigation-subpages";
import Footer from "./components/Footer/Footer";
import Sidebar from "./components/SideBar/sidebar";
import { ConnectedRouter } from "connected-react-router";
import { Route, Redirect, Switch } from "react-router";
import { history } from "./index";
import classes from "./App.module.css";
import { getFiltersFromURL } from "./store/actions/actions";
import Hammer from "react-hammerjs";

// var myElement = document.getElementById('myElement');
// var mc = new Hammer(myElement);

// mc.on("panleft panright tap press", function(ev) {
//   myElement.textContent = ev.type +" gesture detected.";
// });

class App extends Component {
  componentDidMount() {
    getFiltersFromURL();
  }

  state = {
    isSidebarShown: false,
    showPopup: false
  }

  showPopup = (isSet) => {
    this.setState({
      // isSidebarShown: !this.state.isSidebarShown
      showPopup: isSet
    })
  }
  
  showSidebar = (isSet) => {
    this.setState({
      // isSidebarShown: !this.state.isSidebarShown
      isSidebarShown: isSet
    })
  }

  handleSwipe = (event) => {
    switch (event.direction){
      case 2:
          this.showSidebar(true);
          break;
      case 4:
          this.showSidebar(false);
          break;
      case 16:
        this.showPopup(true);
        break;
      case 8:
        this.showPopup(false);
        break;
      default:
        console.log("Not defined!");
        break;
    }
  }

  render() {
    const {isSidebarShown} = this.state;
    return (
      <ConnectedRouter history={history}>
        <React.Fragment>
          <NavigationSubpages />
          <Hammer onSwipe={this.handleSwipe} direction={"DIRECTION_ALL"}>
            <div className={classes.bodyWrap}>
              <div className={classes.contentWindow} style={{width: isSidebarShown ? "74vw" : "99vw"}}>
                <Switch>
                  <Route
                    exact
                    path="/"
                    render={() => <Redirect to="/explore" />}
                  />
                  <Route path="/projects" component={Projects} />
                  <Route path="/explore" component={GraphView}/>
                  <Route path="/discoveries" component={Discoveries} />
                  <Route path="/about" component={About} />
                </Switch>
              </div>
              <div className={classes.sidebarHint} onClick={this.showSidebar} style={{right: isSidebarShown ? "25vw" : ""}} />
              <div className={classes.sidebar} style={{display: isSidebarShown ? "" : "none"}}>
                <Sidebar />
              </div>
              {/*<Footer />*/}
              {this.state.showPopup ? <About /> : null }
            </div>
          </Hammer>
        </React.Fragment>
      </ConnectedRouter>
    );
  }
}

export default App;
