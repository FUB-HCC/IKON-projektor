import React from "react";
import connect from "react-redux/es/connect/connect";
import GroupDetailsPanelView from "./group-details-panel-view";
import { setSideBarComponent } from "../../store/actions/actions";
import FilterPanel from "../FilterPanel/filter-panel";

const mapStateToProps = state => {
  const ktaIds = state.main.ktaMapping.filter(
    mapping => mapping.targetgroup_id === state.main.selectedGroup
  );
  const ktas = ktaIds
    .map(ktaId => state.main.ktas.find(kta => ktaId.kta_id === kta.id))
    .filter(kta => kta);
  const targetGroup = state.main.categories.find(
    cat => cat.id === state.main.selectedGroup
  );

  return {
    ktas: ktas,
    targetGroup: targetGroup
  };
};

const mapDispatchToProps = dispatch => ({
  returnToFilterView: () => dispatch(setSideBarComponent(<FilterPanel />))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupDetailsPanelView);
