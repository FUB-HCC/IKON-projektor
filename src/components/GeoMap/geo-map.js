import { connect } from "react-redux";
import GeoMapView from "./geo-map-view";
import { instClicked } from "../../store/actions/actions";
import { applyFilters } from "../../util/utility";

const edgesFromClique = clique => {
  let pairs = [];
  clique.forEach((v1, i) => {
    clique.slice(i + 1).forEach(v2 => {
      pairs.push([v1, v2]);
    });
  });
  return pairs;
};

const mapDispatchToProps = dispatch => {
  return {
    showInstDetails: inst => {
      dispatch(instClicked(inst));
    }
  };
};

const mapStateToProps = state => {
  const {
    projects,
    institutions,
    continents,
    isDataProcessed,
    filters
  } = state.main;
  let connections = [];
  let continentConnections = {};
  let continentsForView = [];
  let projectsForView = [];
  let mfn = {};
  if (isDataProcessed) {
    projectsForView = applyFilters(projects, filters);
    continentsForView = continents;
    const continent = inst =>
      institutions.find(institution => institution.id === inst.id)
        ? institutions.find(institution => institution.id === inst.id).continent
        : "";

    mfn = institutions.find(inst =>
      inst.name.includes("Museum für Naturkunde Berlin")
    );

    projectsForView.forEach(project => {
      if (project.Kooperationspartner.length > 0) {
        connections = connections.concat(
          edgesFromClique(project.Kooperationspartner.concat([mfn]))
        );
      }
      project.Kooperationspartner.forEach(c => continent(c));
    });
    connections.forEach(con => {
      if (!con[0] || !con[1]) {
        return;
      }
      const continent1 = con[0].continent;
      const continent2 = con[1].continent;
      if (continent1 && continent2 && continent1 !== continent2) {
        const key = JSON.stringify([continent1, continent2].sort());
        if (!continentConnections[key]) {
          continentConnections[key] = {
            start: continents.find(c => continent1 === c.name).anchorPoint,
            end: continents.find(c => continent2 === c.name).anchorPoint,
            weight: 1,
            name: continent1 + "|" + continent2
          };
        } else {
          continentConnections[key].weight += 1;
        }
      }
    });
  }
  return {
    projects: projectsForView,
    institutions: institutions,
    continents: continentsForView,
    continentConnections: continentConnections,
    mfn: mfn
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GeoMapView);
