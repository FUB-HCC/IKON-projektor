import { connect } from "react-redux";
import TechnicalUiView from "./technical-ui-view";
import { isTouchMode } from "../../util/utility";
import { changeGraph, selectVis } from "../../store/actions/actions";
import orderings from "../../assets/current_dump.json";

const mapStateToProps = state => {
  const selectedOrderingData = orderings[state.main.selectedOrdering];
  const allOrderings = orderings.map((ordering, index) => [index, ordering]);

  return {
    allOrderings: allOrderings,
    selectedOrdering: selectedOrderingData,
    isDataProcessed: state.main.isDataProcessed,
    isTouch: isTouchMode(state),
    scaling: Math.min(window.innerWidth * 0.5, window.innerHeight * 0.7)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeGraph: value => dispatch(changeGraph(value)),
    selectOrdering: value => dispatch(selectVis(value))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TechnicalUiView);
