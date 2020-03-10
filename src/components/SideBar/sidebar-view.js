import React from "react";
import style from "./sidebar.module.css";
import { appMargin, menuBarHeight, sideBarWidth } from "../../App";
import MFNLogo from "../NavigationSubpages/mfn-logo";
import ActionButtons from "../NavigationSubpages/action-buttons";
import SampleStatesList from "../SampleStatesList/sample-states-list";

class SideBarView extends React.Component {
  constructor(props) {
    super();
    this.state = {
      height: props.isTouch ? this.heightTouch : this.heightStandard
    };
  }

  heightStandard = window.innerHeight - menuBarHeight - appMargin * 2;
  heightTouch = window.innerHeight - menuBarHeight - appMargin * 2 - 120 - 136;

  componentDidMount() {
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }

  resize() {
    this.setState({
      height: this.props.isTouch ? this.heightTouch : this.heightStandard
    });
  }

  render() {
    return (
      <div
        className={style.sideBarWrapper}
        style={{ height: this.state.height, width: sideBarWidth }}
        id="detailsPanelID"
      >
        {this.props.isTouch && (
          <>
            <MFNLogo />
            <SampleStatesList />
            <ActionButtons />
          </>
        )}
        {this.props.isDataProcessed && this.props.sideBarComponent}
      </div>
    );
  }
}

export default SideBarView;
