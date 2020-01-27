import * as actionTypes from "./actionTypes";
import axios from "axios";

export const changeGraph = value => {
  return {
    type: actionTypes.CHANGE_GRAPH,
    value: value
  };
};

export const checkboxFilterChange = (filterId, value) => {
  return {
    type: actionTypes.CHECKBOX_FILTER_CHANGE,
    id: filterId,
    value: value
  };
};

export const timerangeFilterChange = value => {
  return {
    type: actionTypes.TIMERANGE_FILTER_CHANGE,
    value: value
  };
};

export const setSelectedProject = projectId => {
  return {
    type: actionTypes.SET_SELECTED_PROJECT,
    value: projectId
  };
};

export const setSelectedCat = catId => {
  return {
    type: actionTypes.SET_SELECTED_CAT,
    value: catId
  };
};

export const setSelectedInfra = infraName => {
  return {
    type: actionTypes.SET_SELECTED_INFRA,
    value: infraName
  };
};

export const setSelectedKta = ktaId => {
  return {
    type: actionTypes.SET_SELECTED_KTA,
    value: ktaId
  };
};

export const setSelectedYear = data => {
  return {
    type: actionTypes.SET_SELECTED_YEAR,
    value: data
  };
};

export const deselectItems = () => {
  return {
    type: actionTypes.DESELECT_ITEMS
  };
};

export const processDataIfReady = () => {
  return {
    type: actionTypes.PROCESS_DATA_IF_READY
  };
};

export const resetSelectedProject = () => {
  return {
    type: actionTypes.RESET_SELECTED_PROJECT
  };
};

export const deactivatePopover = () => {
  return {
    type: actionTypes.DEACTIVATE_POPOVER
  };
};

export const fetchClusterData = () => {
  return dispatch => {
    axios.get("https://localhost/api/clustering").then(result => {
      dispatch(updateClusterData(result.data));
      dispatch(processDataIfReady());
    });
  };
};

export const fetchInstitutionsData = () => {
  return dispatch => {
    axios.get("https://localhost/api/institutions").then(result => {
      dispatch(updateInstitutionsData(result.data));
      dispatch(processDataIfReady());
    });
  };
};

export const fetchProjectsData = () => {
  return dispatch => {
    axios.get("https://localhost/api/projects").then(result => {
      dispatch(updateProjectsData(result.data));
      dispatch(processDataIfReady());
    });
  };
};

export const fetchKTAData = () => {
  return dispatch => {
    axios
      .get("https://localhost/api/knowledgeTransferActivities")
      .then(result => {
        dispatch(updateKTAData(result.data));
        dispatch(processDataIfReady());
      });
  };
};

export const fetchKTAMappingData = () => {
  return dispatch => {
    axios.get("https://localhost/api/ktastargetgroups").then(result => {
      dispatch(updateKTAMappingData(result.data));
      dispatch(processDataIfReady());
    });
  };
};

export const fetchTargetGroupsData = () => {
  return dispatch => {
    axios.get("https://localhost/api/targetgroups").then(result => {
      dispatch(updateTargetGroupsData(result.data));
      dispatch(processDataIfReady());
    });
  };
};

export const fetchInfrastructureData = () => {
  return dispatch => {
    axios.get("https://localhost/api/infrastructure").then(result => {
      dispatch(updateInfrastructureData(result.data));
      dispatch(processDataIfReady());
    });
  };
};

export const fetchCollectionsData = () => {
  return dispatch => {
    axios.get("https://localhost/api/collections").then(result => {
      dispatch(updateCollectionsData(result.data));
      dispatch(processDataIfReady());
    });
  };
};

export const updateClusterData = clusterData => {
  return {
    type: actionTypes.UPDATE_CLUSTER_DATA,
    value: clusterData
  };
};

export const updateInstitutionsData = institutionsData => {
  return {
    type: actionTypes.UPDATE_INSTITUTIONS_DATA,
    value: institutionsData
  };
};

export const updateProjectsData = projectsData => {
  return {
    type: actionTypes.UPDATE_PROJECTS_DATA,
    value: projectsData
  };
};

export const updateKTAData = ktaData => {
  return {
    type: actionTypes.UPDATE_KTA_DATA,
    value: ktaData
  };
};

export const updateTargetGroupsData = targetgroups => {
  return {
    type: actionTypes.UPDATE_TARGETGROUPS_DATA,
    value: targetgroups
  };
};

export const updateInfrastructureData = infrastructures => {
  return {
    type: actionTypes.UPDATE_INFRASTRUCTURE_DATA,
    value: infrastructures
  };
};

export const updateCollectionsData = collections => {
  return {
    type: actionTypes.UPDATE_COLLECTIONS_DATA,
    value: collections
  };
};

export const updateKTAMappingData = ktaMappingData => {
  return {
    type: actionTypes.UPDATE_KTA_MAPPING_DATA,
    value: ktaMappingData
  };
};

export const setSideBarComponent = component => {
  return {
    type: actionTypes.SET_SIDE_BAR_COMPONENT,
    value: component
  };
};
