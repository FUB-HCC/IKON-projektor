import React from "react";
import style from "./filter-timeline.module.css";

const FilterTimeline = props => {
  return (
    <div className={style.filterTimelineWrapper}>
      <div className={style.filterTimelineTitle}>
        <span className={style.titleText}>Zeitraum</span>
      </div>
      <div className={style.filterTimelineSlider}></div>
    </div>
  );
};

export default FilterTimeline;
