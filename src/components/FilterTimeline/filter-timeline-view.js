import React from "react";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import style from "./filter-timeline.module.css";
import { RangeSlider } from "@blueprintjs/core";

class FilterTimelineView extends React.Component {
  render() {
    const {
      maxRange,
      currentSelectedRange,
      changeTimeRangeFilter
    } = this.props;
    return (
      <div className={style.filterTimelineWrapper}>
        <div className={style.filterTimelineTitle}>
          <span className={style.titleText}>Zeitraum</span>
        </div>
        <div className={style.filterTimelineSlider}>
          <RangeSlider
            min={maxRange[0]}
            max={maxRange[1]}
            labelStepSize={4}
            value={currentSelectedRange}
            onChange={changeTimeRangeFilter}
          />
        </div>
      </div>
    );
  }
}

export default FilterTimelineView;
