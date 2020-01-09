import React from "react";
import style from "./sidebar.module.css";
import PanelButtons from "./panel-buttons";
import { appMargin, menuBarHeight } from "../../App";

class SideBarView extends React.Component {
  constructor() {
    super();
    this.state = { height: window.innerHeight - menuBarHeight - appMargin * 2 };
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
      <div
        className={style.sideBarWrapper}
        style={{ height: this.state.height }}
      >
        <PanelButtons />
        {this.props.sideBarComponent}
      </div>
    );
  }
}

export default SideBarView;
