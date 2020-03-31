import connect from "react-redux/es/connect/connect";
import { unClicked, fetchIndividualSample } from "../../store/actions/actions";
import SampleStatesListView from "./sample-states-list-view";

const mapStateToProps = state => {
  const { isDataProcessed, sampleList } = state.main;
  if (isDataProcessed) {
    return {
      sampleList: sampleList
    };
  } else {
    return {};
  }
};

const mapDispatchToProps = dispatch => ({
  returnToFilterView: () => {
    dispatch(unClicked());
  },
  onClickSample: name => {
    dispatch(fetchIndividualSample(name));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SampleStatesListView);
