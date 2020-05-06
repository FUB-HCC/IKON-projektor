import connect from "react-redux/es/connect/connect";
import YearDetailsPanelView from "./year-details-panel-view";
import { unClicked, projectClicked } from "../../store/actions/actions";
const mapStateToProps = state => {
  const { isClicked, projects, isDataProcessed } = state.main;
  if (isDataProcessed && projects) {
    const [year, title] = isClicked.year.split("|");
    return {
      year: year,
      title: isNaN(title) ? title : parseInt(title),
      projects: projects.filter(
        p =>
          p.forschungsbereich === parseInt(title) &&
          p.timeframe[0] <= year &&
          year <= p.timeframe[1]
      )
    };
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
)(YearDetailsPanelView);
