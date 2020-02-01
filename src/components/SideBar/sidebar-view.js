import React from "react";
import style from "./sidebar.module.css";
import { appMargin, menuBarHeight } from "../../App";
import MFNLogo from "../MfnLogoTour/mfn-logo";
import ActionButtons from "../ActionButtons/action-buttons";
import SampleStatesList from "../SampleStatesList/sample-states-list";

class SideBarView extends React.Component {
  constructor() {
    super();
    this.state = { height: window.innerHeight };
  }

  componentDidMount() {
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }

  resize() {
    this.setState({
      height: window.innerHeight - menuBarHeight - appMargin * 2
    });
  }

  render() {
    return (
      <div className={style.sideBarWrapper}>
        <MFNLogo />
        <SampleStatesList />
        <ActionButtons />
        {this.props.sideBarComponent}
      </div>
    );
  }
}

export default SideBarView;
