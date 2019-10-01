import connect from "react-redux/es/connect/connect";
import ProjectDetailsPanelView from "./project-details-panel-view";

const mapStateToProps = state => {
  return {
    projectData: state.main.projects.find(
      p => p.id === state.main.selectedProject
    )
  };
};

export default connect(mapStateToProps)(ProjectDetailsPanelView);
