import { connect } from "react-redux";
import SelectionGridView from "./selection-grid-view";
import { isTouchMode } from "../../util/utility";
import {
  changeGraph,
  selectVis,
  changeGridSize
} from "../../store/actions/actions";
import orderings from "../../assets/current_dump.json";

const mapStateToProps = state => {
  const selectedOrderingData = orderings[state.main.selectedOrdering];
  const allOrderings = orderings.map((ordering, index) => [index, ordering]);
  const size = state.main.gridSize;
  const samples = allOrderings
    .sort((a, b) => (a[1].simFirst > b[1].simFirst ? 1 : -1))
    .splice(0, size * size)
    .sort((a, b) => (a[1].combDist > b[1].combDist ? 1 : -1));
  let grid = [];
  while (grid.length < size) {
    grid.push(
      samples
        .splice(0, size)
        .sort((a, b) => (a[1].stability > b[1].stability ? 1 : -1))
    );
  }

  return {
    size: size,
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
    changeGridSize: value => dispatch(changeGridSize(value)),
    selectOrdering: value => dispatch(selectVis(value))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectionGridView);
