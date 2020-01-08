import React from "react";
import FilterTimeline from "../FilterTimeline/filter-timeline";
import FilterPanelButtons from "./filter-panel-buttons";
import FilterSelection from "../FilterSelection/filter-selection";

const FilterPanel = props => (
  <div>
    <FilterPanelButtons />
    <FilterTimeline />
    <FilterSelection />
  </div>
);

export default FilterPanel;
