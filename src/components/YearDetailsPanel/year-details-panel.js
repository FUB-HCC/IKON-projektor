import connect from "react-redux/es/connect/connect";
import YearDetailsPanelView from "./year-details-panel-view";
import {
  unClicked,
  projectClicked,
  ktaClicked
} from "../../store/actions/actions";
const mapStateToProps = state => {
  const {
    isClicked,
    projects,
    ktas,
    isDataProcessed,
    missingprojects
  } = state.main;
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
      ),
      ktas: ktas.filter(
        kta =>
          (kta.Zielgruppe.includes(title) ||
            kta.Format.find(format => format.name === title)) &&
          kta.timeframe[0].getFullYear() <= year &&
          year <= kta.timeframe[1].getFullYear()
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
  },
  showKtaDetails: kta => {
    dispatch(ktaClicked(kta));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(YearDetailsPanelView);
