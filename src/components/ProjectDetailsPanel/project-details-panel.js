import connect from "react-redux/es/connect/connect";
import ProjectDetailsPanelView from "./project-details-panel-view";
import { unClicked, labelClicked } from "../../store/actions/actions";

const mapStateToProps = state => {
  const { isDataProcessed, isClicked, projects } = state.main;
  if (isDataProcessed) {
    return {
      projectData: projects.find(p => p.id === isClicked.project)
    };
  } else {
    return {};
  }
};

const mapDispatchToProps = dispatch => ({
  returnToFilterView: () => {
    dispatch(unClicked());
  },
  showLabelDetails: label => {
    dispatch(labelClicked(label));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectDetailsPanelView);
