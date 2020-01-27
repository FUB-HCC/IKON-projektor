import React from "react";
import FilterTimeline from "../FilterTimeline/filter-timeline";
import FilterSelection from "../FilterSelection/filter-selection";

const FilterPanel = props => (
  <div
    id="step5"
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%"
    }}
  >
    <FilterTimeline />
    <FilterSelection />
  </div>
);

export default FilterPanel;
