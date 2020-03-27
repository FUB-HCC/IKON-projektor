import connect from "react-redux/es/connect/connect";
import InstDetailsPanelView from "./inst-details-panel-view";
import { unClicked, projectClicked } from "../../store/actions/actions";

const mapStateToProps = state => {
  const { isClicked, projects, institutions, isDataProcessed } = state.main;
  if (isDataProcessed) {
    if (isClicked.inst.includes("|f")) {
      let region = isClicked.inst.split("|")[0];
      return {
        title: "Forschungsregion " + region,
        description: "Forschungsprojekte  mit dieser Forschungsregion:",
        projects: projects.filter(p => p.Forschungsregion === region),
        institutions: []
      };
    } else if (isClicked.inst.includes("|c")) {
      let continent = isClicked.inst.split("|")[0];
      return {
        title: continent,
        description: "Institutionen auf diesem Kontinent:",
        projects: [],
        institutions: institutions.filter(inst => inst.continent === continent)
      };
    } else {
      const [continent1, continent2] = isClicked.inst.split("|");
      let firstInstIds = institutions
        .filter(inst => inst.continent === continent1)
        .map(inst => inst.id);
      let scndInstIds = institutions
        .filter(inst => inst.continent === continent2)
        .map(inst => inst.id);
      return {
        title: "Kooperation zwischen " + continent1 + " und " + continent2,
        description:
          "Forschungsprojekte mit Kooperationen zwischen diesen Kontinenten:",
        projects: projects.filter(
          p =>
            p.Kooperationspartner.length > 1 &&
            p.Kooperationspartner.some(coop =>
              firstInstIds.includes(coop.id)
            ) &&
            p.Kooperationspartner.some(coop => scndInstIds.includes(coop.id))
        ),
        institutions: []
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
