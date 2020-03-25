import * as actionTypes from "./actionTypes";
import axios from "axios";
import { batch } from "react-redux";
const Flatted = require("flatted/esm");
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

export const instClicked = data => {
  return {
    type: actionTypes.INST_CLICKED,
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

export const fetchData = () => {
  return dispatch => {
    axios
      .get("/api/graph", {
        transformResponse: res => Flatted.parse(res)
      })
      .then(result => {
        batch(() => {
          dispatch(updateData(result.data));
          dispatch(processDataIfReady());
        });
      });
  };
};

export const fetchSampleList = () => {
  return dispatch => {
    axios.get("/api/sharing").then(result => {
      batch(() => {
        dispatch(updateSampleList(result.data));
        dispatch(processDataIfReady());
      });
    });
  };
};

export const fetchIndividualSample = name => {
  return dispatch => {
    axios({
      method: "GET",
      url: encodeURI("/api/sharing/" + name)
    })
      .then(response => {
        console.log(response);
        // batch(() => {
        //   dispatch(sampleClicked(response));
        // });
      })
      .catch(function(error) {
        console.log(error);
      });
  };
};

export const shareUrl = name => {
  axios({
    method: "post",
    url: encodeURI("/api/sharing/" + name),
    data: JSON.stringify(window.location.search)
  }).then(function(response) {
    console.log(response.status);
  });
};

export const updateData = data => {
  return {
    type: actionTypes.UPDATE_DATA,
    value: data
  };
};

export const updateSampleList = data => {
  return {
    type: actionTypes.UPDATE_SAMPLE_LIST,
    value: data
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

export const sampleClicked = url => ({
  type: actionTypes.SAMPLE_CLICKED,
  value: url
});

export const showSampleList = () => ({
  type: actionTypes.SHOW_SAMPLE_LIST
});
