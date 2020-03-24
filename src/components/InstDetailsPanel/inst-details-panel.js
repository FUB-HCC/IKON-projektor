import connect from "react-redux/es/connect/connect";
import InstDetailsPanelView from "./inst-details-panel-view";
import { unClicked, projectClicked } from "../../store/actions/actions";

const mapStateToProps = state => {
  const { isClicked, projects, institutions, isDataProcessed } = state.main;
  if (isDataProcessed) {
    if (isClicked.inst.includes("|")) {
      const [continent1, continent2] = isClicked.inst.split("|");
      let firstInstIds = institutions
        .filter(inst => inst.continent === continent1)
        .map(inst => inst.id);
      let scndInstIds = institutions
        .filter(inst => inst.continent === continent2)
        .map(inst => inst.id);
      return {
        title: "Kooperation zwischen " + continent1 + " und " + continent2,
        projects: projects.filter(
          p =>
            p.Kooperationspartner.length > 1 &&
            p.Kooperationspartner.some(coop =>
              firstInstIds.includes(coop.id)
            ) &&
            p.Kooperationspartner.some(coop => scndInstIds.includes(coop.id))
        )
      };
    } else {
      return {
        title: "Forschungsregion " + isClicked.inst,
        projects: projects.filter(p => p.Forschungsregion === isClicked.inst)
      };
    }
  }
  return {};
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
)(InstDetailsPanelView);
