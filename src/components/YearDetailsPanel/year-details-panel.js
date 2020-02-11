import connect from "react-redux/es/connect/connect";
import YearDetailsPanelView from "./year-details-panel-view";
import {
  unClicked,
  projectClicked,
  ktaClicked
} from "../../store/actions/actions";

const mapStateToProps = state => {
  const { isClicked, projects, ktas, isDataProcessed } = state.main;
  if (isDataProcessed) {
    const [year, title] = isClicked.year.split("|");
    return {
      year: year,
      title: title,
      projects: projects.filter(
        p =>
          p.forschungsbereich === title &&
          p.timeframe[0] <= year &&
          year <= p.timeframe[1]
      ),
      ktas: ktas.filter(
        kta =>
          kta.targetgroups.includes(title) &&
          kta.timeframe[0].getFullYear() <= year &&
          year <= kta.timeframe[1].getFullYear()
      )
    };
  }
  return {};
};

const mapDispatchToProps = dispatch => ({
  returnToFilterView: () => {
    dispatch(unClicked());
  },
  showProjectDetails: project => {
    dispatch(projectClicked(project));
  },
  showKtaDetails: kta => {
    dispatch(ktaClicked(kta));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(YearDetailsPanelView);
