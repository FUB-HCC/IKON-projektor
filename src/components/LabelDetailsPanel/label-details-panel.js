import connect from "react-redux/es/connect/connect";
import LabelDetailsPanelView from "./label-details-panel-view";
import { unClicked, projectClicked } from "../../store/actions/actions";

const mapStateToProps = state => {
  if (state.main.isDataProcessed) {
    return {
      labelData: state.main.labels.find(
        c => c.id === state.main.isClicked.label
      ),
      type: "Label"
    };
  } else {
    return {};
  }
};

const mapDispatchToProps = dispatch => ({
  returnToFilterView: () => {
    dispatch(unClicked());
  },
  showProjectDetails: project => {
    dispatch(projectClicked(project));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LabelDetailsPanelView);
