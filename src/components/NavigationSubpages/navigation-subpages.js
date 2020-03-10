import React, { Component } from "react";

import "intro.js/introjs.css";
import "intro.js/themes/introjs-modern.css";
import classes from "./navigation-subpages.module.css";
import { connect } from "react-redux";
import { menuBarHeight } from "../../App";
import { changeGraph } from "../../store/actions/actions";
import MFNLogo from "./mfn-logo";
import ActionButtons from "./action-buttons";

class NavigationSubpages extends Component {
  render() {
    const { changeGraph } = this.props;
    return (
      <div className={classes.navbar} style={{ flexBasis: menuBarHeight }}>
        <ul className={classes.leftpanel}>
          <li>
            <MFNLogo />
          </li>
          <li>
            <div
              className={
                classes.leftElement +
                " " +
                (this.props.graph === "0" ? classes.active : "")
              }
              onClick={() => changeGraph("0")}
            >
              WISSEN
            </div>
          </li>
          <li>
            <div
              className={
                classes.leftElement +
                " " +
                (this.props.graph === "1" ? classes.active : "")
              }
              onClick={() => changeGraph("1")}
            >
              ZEIT
            </div>
          </li>
          <li>
            <div
              className={
                classes.leftElement +
                " " +
                (this.props.graph === "2" ? classes.active : "")
              }
              onClick={() => changeGraph("2")}
            >
              RAUM
            </div>
          </li>
        </ul>
        <ActionButtons />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeGraph: value => dispatch(changeGraph(value))
  };
};
const mapStateToProps = state => {
  return {
    graph: state.main.graph
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationSubpages);
