import React from "react";
import FilterTimeline from "../FilterTimeline/filter-timeline";
import FilterSelection from "../FilterSelection/filter-selection";

const FilterPanel = props => (
  <div>
    <FilterTimeline />
    <FilterSelection />
  </div>
);

export default FilterPanel;
