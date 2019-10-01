import { connect } from "react-redux";
import FilterTimelineView from "./filter-timeline-view";
import { timerangeFilterChange } from "../../store/actions/actions";

const mapStateToProps = state => ({
  currentSelectedRange:
    state.main.filters.time.value.length > 0
      ? state.main.filters.time.value
      : [0, 0],
  maxRange: state.main.filters.time.uniqueVals
});

const mapDispatchToProps = dispatch => ({
  changeTimeRangeFilter: value => dispatch(timerangeFilterChange(value))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterTimelineView);
