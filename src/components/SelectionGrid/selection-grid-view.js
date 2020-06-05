import React from "react";
import SelectionGridOverview from "./selection-grid-overview";
import SelectionGridDetail from "./selection-grid-detail";
import style from "./selection-grid.module.css";
import { menuBarHeight, sideBarWidth, appMargin } from "../../App";

class SelectionGridView extends React.Component {
  render() {
    const height = window.innerHeight - menuBarHeight - 5 * appMargin;
    const width = (window.innerWidth - sideBarWidth - 2 * appMargin) * 0.5;
    if (!this.props.isDataProcessed) {
      return <div />;
    }
    return (
      <div>
        <div className={style.wrapper}>
          <SelectionGridOverview
            className={style.sideWrapper}
            selectedOrdering={this.props.selectedOrdering}
            selectOrdering={this.props.selectOrdering}
            data={this.props.allOrderings}
            height={height}
            width={width - 10}
          />
          <SelectionGridDetail
            className={style.sideWrapper}
            selectedOrdering={this.props.selectedOrderingData}
            height={height}
            width={width}
          />
        </div>
        <div className={style.chooseButtonWrapper}>
          <span
            className={style.chooseButton}
            onClick={() => this.props.changeGraph("0")}
          >
            {" "}
            Diese Anordnung auswählen
          </span>
        </div>
      </div>
    );
  }
}

export default SelectionGridView;
