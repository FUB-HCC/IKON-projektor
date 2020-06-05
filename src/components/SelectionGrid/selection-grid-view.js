import React from "react";
import SelectionGridOverview from "./selection-grid-overview";
import SelectionGridDetail from "./selection-grid-detail";
import style from "./selection-grid.module.css";
import { menuBarHeight, sideBarWidth, appMargin } from "../../App";

class SelectionGridView extends React.Component {
  render() {
    const height = window.innerHeight - menuBarHeight - 5 * appMargin;
    const width = window.innerWidth * 0.45;
    if (!this.props.isDataProcessed) {
      return <div />;
    }
    return (
      <div width={window.innerWidth}>
        <div className={style.wrapper}>
          <SelectionGridOverview
            className={style.sideWrapper}
            selectedOrdering={this.props.selectedOrdering}
            selectOrdering={this.props.selectOrdering}
            data={this.props.allOrderings}
            height={height}
            width={width}
            size={this.props.size}
            changeSize={this.props.changeGridSize}
          />
          <SelectionGridDetail
            className={style.sideWrapper}
            selectedOrdering={this.props.selectedOrderingData}
            height={height}
            width={width}
            changeGraph={this.props.changeGraph}
          />
        </div>
      </div>
    );
  }
}

export default SelectionGridView;
