import { connect } from "react-redux";
import SelectionGridView from "./selection-grid-view";
import { isTouchMode } from "../../util/utility";
import { changeGraph, toOverview } from "../../store/actions/actions";
import orderings from "../../assets/current_dump.json";

const mapStateToProps = state => {
  const selectedOrderingData = orderings[state.main.selectedOrdering];
  const allOrderings = orderings
    .map((ordering, index) => [index, ordering])
    .sort((a, b) => (a[1].perp < b[1].perp ? 1 : -1))
    .slice(0, 100);
  let grid = [];
  while (allOrderings.length > 0) grid.push(allOrderings.splice(0, 10));

  return {
    allOrderings: grid,
    selectedOrderingData: selectedOrderingData,
    selectedOrdering: state.main.selectedOrdering,
    isDataProcessed: state.main.isDataProcessed,
    isTouch: isTouchMode(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeGraph: value => dispatch(changeGraph(value)),
    selectOrdering: value => dispatch(toOverview(value))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectionGridView);
