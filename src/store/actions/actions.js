import * as actionTypes from "./actionTypes";
import axios from "axios";

// action emitters to keep the containers clean

export const changeGraph = value => {
  return {
    type: actionTypes.CHANGE_GRAPH,
    value: value
  };
};

export const filterChange = (filterId, value) => {
  return {
    type: actionTypes.FILTER_CHANGE,
    id: filterId,
    value: value
  };
};

export const activatePopover = (datapoint, vis) => {
  return {
    type: actionTypes.ACTIVATE_POPOVER,
    element: datapoint,
    vis: vis
  };
};

export const deactivatePopover = () => {
  return {
    type: actionTypes.DEACTIVATE_POPOVER
  };
};

export const getFiltersFromURL = () => {
  return {
    type: actionTypes.GET_FILTERS_FROM_URL
  };
};

export const fetchClusterData = () => {
  return dispatch => {
    axios.get("/clusters.json").then(result => {
      dispatch(updateClusterData(result.data));
    });
  };
};

export const fetchInstitutionsData = () => {
  return dispatch => {
    axios.get("/institutions.json").then(result => {
      dispatch(updateInstitutionsData(result.data));
    });
  };
};

export const fetchProjectsData = () => {
  return dispatch => {
    axios.get("/mfnprojects.json").then(result => {
      dispatch(updateProjectsData(result.data));
    });
  };
};

export const fetchKTAData = () => {
  return dispatch => {
    axios.get("/formats.json").then(result => {
      dispatch(updateKTAData(result.data));
    });
  };
};

export const updateClusterData = clusterData => {
  return {
    type: actionTypes.UPDATE_CLUSTER_DATA,
    value: clusterData
  };
};

export const updateInstitutionsData = clusterData => {
  return {
    type: actionTypes.UPDATE_INSTITUTIONS_DATA,
    value: clusterData
  };
};

export const updateProjectsData = clusterData => {
  return {
    type: actionTypes.UPDATE_PROJECTS_DATA,
    value: clusterData
  };
};

export const updateKTAData = ktaData => {
  return {
    type: actionTypes.UPDATE_KTA_DATA,
    value: ktaData
  };
};

export const setSideBarComponent = component => {
  return {
    type: actionTypes.SET_SIDE_BAR_COMPONENT,
    value: component
  }
}
