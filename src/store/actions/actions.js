import * as actionTypes from "./actionTypes";
import axios from "axios";
import { batch } from "react-redux";

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

export const projectHovered = projectId => {
  return {
    type: actionTypes.PROJECT_HOVERED,
    value: projectId
  };
};

export const catHovered = catId => {
  return {
    type: actionTypes.CAT_HOVERED,
    value: catId
  };
};

export const infraHovered = infraName => {
  return {
    type: actionTypes.INFRA_HOVERED,
    value: infraName
  };
};

export const ktaHovered = ktaId => {
  return {
    type: actionTypes.KTA_HOVERED,
    value: ktaId
  };
};

export const yearHovered = data => {
  return {
    type: actionTypes.YEAR_HOVERED,
    value: data
  };
};

export const unHovered = () => {
  return {
    type: actionTypes.UNHOVERED
  };
};

export const projectClicked = projectId => {
  return {
    type: actionTypes.PROJECT_CLICKED,
    value: projectId
  };
};

export const catClicked = catId => {
  return {
    type: actionTypes.CAT_CLICKED,
    value: catId
  };
};

export const infraClicked = infraName => {
  return {
    type: actionTypes.INFRA_CLICKED,
    value: infraName
  };
};

export const ktaClicked = ktaId => {
  return {
    type: actionTypes.KTA_CLICKED,
    value: ktaId
  };
};

export const yearClicked = data => {
  return {
    type: actionTypes.YEAR_CLICKED,
    value: data
  };
};

export const unClicked = () => {
  return {
    type: actionTypes.UNCLICKED
  };
};

export const showUncertainty = data => {
  return {
    type: actionTypes.SHOW_UNCERTAINTY,
    value: data
  };
};

export const highlightUncertainty = data => {
  return {
    type: actionTypes.HIGHLIGHT_UNCERTAINTY,
    value: data
  };
};

export const legendHovered = legendKey => ({
  type: actionTypes.LEGEND_HOVERED,
  value: legendKey
});

export const fetchClusterData = () => {
  return dispatch => {
    axios.get("https://localhost/api/clustering").then(result => {
      batch(() => {
        dispatch(updateClusterData(result.data));
        dispatch(processDataIfReady());
      });
    });
  };
};

export const fetchInstitutionsData = () => {
  return dispatch => {
    axios.get("https://localhost/api/institutions").then(result => {
      batch(() => {
        dispatch(updateInstitutionsData(result.data));
        dispatch(processDataIfReady());
      });
    });
  };
};

export const fetchProjectsData = () => {
  return dispatch => {
    axios.get("https://localhost/api/projects").then(result => {
      batch(() => {
        dispatch(updateProjectsData(result.data));
        dispatch(processDataIfReady());
      });
    });
  };
};

export const fetchKTAData = () => {
  return dispatch => {
    axios
      .get("https://localhost/api/knowledgeTransferActivities")
      .then(result => {
        batch(() => {
          dispatch(updateKTAData(result.data));
          dispatch(processDataIfReady());
        });
      });
  };
};

export const fetchKTAMappingData = () => {
  return dispatch => {
    axios.get("https://localhost/api/ktastargetgroups").then(result => {
      batch(() => {
        dispatch(updateKTAMappingData(result.data));
        dispatch(processDataIfReady());
      });
    });
  };
};

export const fetchTargetGroupsData = () => {
  return dispatch => {
    axios.get("https://localhost/api/targetgroups").then(result => {
      batch(() => {
        dispatch(updateTargetGroupsData(result.data));
        dispatch(processDataIfReady());
      });
    });
  };
};

export const fetchInfrastructureData = () => {
  return dispatch => {
    axios.get("https://localhost/api/infrastructure").then(result => {
      batch(() => {
        dispatch(updateInfrastructureData(result.data));
        dispatch(processDataIfReady());
      });
    });
  };
};

export const fetchCollectionsData = () => {
  return dispatch => {
    axios.get("https://localhost/api/collections").then(result => {
      batch(() => {
        dispatch(updateCollectionsData(result.data));
        dispatch(processDataIfReady());
      });
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

export const processDataIfReady = () => {
  return {
    type: actionTypes.PROCESS_DATA_IF_READY
  };
};

export const tourStarted = () => {
  return {
    type: actionTypes.TOUR_STARTED
  };
};

export const tutorialStarted = () => {
  return {
    type: actionTypes.TUTORIAL_STARTED
  };
};

export const shareDialogOpened = () => {
  return {
    type: actionTypes.SHARE_DIALOG_OPENED
  };
};

export const pageReset = () => {
  return {
    type: actionTypes.PAGE_RESET
  };
};

export const showViaWikiRequested = url => ({
  type: actionTypes.SHOW_VIA_WIKI_REQUESTED,
  value: url
});
