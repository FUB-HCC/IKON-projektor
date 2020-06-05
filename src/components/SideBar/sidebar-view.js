import React from "react";
import style from "./sidebar.module.css";
import { appMargin, menuBarHeight, sideBarWidth } from "../../App";
import MFNLogo from "../NavigationSubpages/mfn-logo";
import ActionButtons from "../NavigationSubpages/action-buttons";

class SideBarView extends React.Component {
  constructor(props) {
    super();
    this.state = {
      height: props.isTouch ? this.heightTouch : this.heightStandard
    };
  }

  heightStandard = window.innerHeight - menuBarHeight - appMargin * 2 - 10;
  heightTouch = window.innerHeight - appMargin * 2;

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
    if (this.props.graph === "3") return <div />;
    return (
      <div
        className={style.sideBarWrapper}
        style={{
          height: this.state.height,
          width: sideBarWidth,
          overflowY: this.props.isTouch ? "auto" : "inherit",
          overflowX: "hidden"
        }}
        id="detailsPanelID"
      >
        {this.props.isTouch && (
          <>
            <MFNLogo />
            <ActionButtons />
          </>
        )}
        {this.props.isDataProcessed && this.props.sideBarComponent}
      </div>
    );
  }
}

export default SideBarView;
