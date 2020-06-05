import * as actionTypes from "./actionTypes";
import axios from "axios";
import { batch } from "react-redux";
const Flatted = require("flatted/esm");

/* value can be 0=WISSEN, 1=ZEIT, 2=RAUM. switches to the page accordingly (only if not touch version)*/
export const changeGraph = value => {
  return {
    type: actionTypes.CHANGE_GRAPH,
    value: value
  };
};

/* triggered when checkbox in filter panel was clicked. filterId is e.g. "forschungsgebiet" value is e.g. 1 for "Naturwissenschaften" (ordering can be found in utility) */
export const checkboxFilterChange = (filterId, value) => {
  return {
    type: actionTypes.CHECKBOX_FILTER_CHANGE,
    id: filterId,
    value: value
  };
};

/* triggered when time range slider was changed, value is start and end year, e.g. [2008,2019] */
export const timerangeFilterChange = value => {
  return {
    type: actionTypes.TIMERANGE_FILTER_CHANGE,
    value: value
  };
};

/* hovering events for different elements (help to highlight on hover) In touch version hover event is triggered on one tap, value is id of the hovered element. changes the isHovered state to that id */
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

/* click events for different elements (the sidebar component will be changed according to the clicked element) In touch version click event is triggered on double tap, value is id of the clicked element. changes the "isClicked" state to that id */
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

/*data can be "continent1|continent2" when arc or
"continent|c" when continent or
"continent|f" when "Forschungsregion"-circle of continent is clicked */
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

/* when data=true the uncertainty landscape will be shown and the links are only visible on hover. otherwise only the links are shown.*/
export const showUncertainty = data => {
  return {
    type: actionTypes.SHOW_UNCERTAINTY,
    value: data
  };
};

/* draws a MfN-green circle around the uncertainty landscape to highlight it, when data=true */
export const highlightUncertainty = data => {
  return {
    type: actionTypes.HIGHLIGHT_UNCERTAINTY,
    value: data
  };
};

/* highlights all labels that fit to one point in the legend. e.g. legendKey="ktas" highlights all kta-labels*/
export const legendHovered = legendKey => ({
  type: actionTypes.LEGEND_HOVERED,
  value: legendKey
});

/* fetches the flattened data graph from the backend and parses it back into  json. Also triggers updating and after that processing of the data*/
export const fetchData = () => {
  return dispatch => {
    axios
      .get("test.json", {
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
/* fetches an array with all the names of visualization-states that have been shared with the touchscreen from the backend so far*/
export const fetchSampleList = () => {
  return dispatch => {
    axios.get("sharing.txt").then(result => {
      batch(() => {
        dispatch(updateSampleList(result.data));
        dispatch(processDataIfReady());
      });
    });
  };
};

/* with "api/sharing/<STATENAME>" the state url of a specific vis. is fetched from the backend */
export const fetchIndividualSample = name => {
  return dispatch => {
    axios({
      method: "GET",
      url: encodeURI("sharing.txt" + name)
    })
      .then(response => {
        batch(() => {
          dispatch(sampleClicked(response.data));
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  };
};

/* can only be triggered in browser version, sends the current state url to the backend, the "name" can be set in the shareDialog and the current date will be added to it (e.g. "ANSICHTNAME|8.4.2020")*/
export const shareUrl = name => {
  axios({
    method: "post",
    url: encodeURI("sharing.txt" + name),
    data: JSON.stringify(window.location.search)
  }).then(function(response) {
    if (response.status === 200) {
      window.alert("Die Ansicht wurde an den Touch Screen geschickt.");
    }
  });
};

/* fills the states with just fetched and unprocessed data from api/graph first */
export const updateData = data => {
  return {
    type: actionTypes.UPDATE_DATA,
    value: data
  };
};

/* fills state with data= the shared states names list after it has been fetched from backend */
export const updateSampleList = data => {
  return {
    type: actionTypes.UPDATE_SAMPLE_LIST,
    value: data
  };
};

/* when all initial data has been loaded into the state, processing starts*/
export const processDataIfReady = () => {
  return {
    type: actionTypes.PROCESS_DATA_IF_READY
  };
};

/* is triggered when the introduction intro.js tour is started (by clicking the MfN-Logo)*/
export const tourStarted = () => {
  return {
    type: actionTypes.TOUR_STARTED
  };
};

/* is triggered when "Tutorial" button is clicked */
export const tutorialStarted = () => {
  return {
    type: actionTypes.TUTORIAL_STARTED
  };
};

/* triggered when "Teilen" button is clicked (in browser version only), opens share Dialog that lets you send the current url to the backend after specifying a name */
export const shareDialogOpened = () => {
  return {
    type: actionTypes.SHARE_DIALOG_OPENED
  };
};

/* triggered when "Zurücksetzen" button is clicked loads window.location.pathname */
export const pageReset = () => {
  return {
    type: actionTypes.PAGE_RESET
  };
};

/* triggered when a "Anzeigen im VIA-Wiki" button is clicked in the details panel of e.g. a project. the url is encoded and opened on a new tab*/
export const showViaWikiRequested = url => ({
  type: actionTypes.SHOW_VIA_WIKI_REQUESTED,
  value: url
});

/* loads the state of the clicked sample that was fetched from the backend with fetchIndividualSample before */
export const sampleClicked = url => ({
  type: actionTypes.SAMPLE_CLICKED,
  value: url
});

/* is triggered when "Geteilte Ansichten" button is clicked, sets sidebar component to sample list, changes the "isClicked" state */
export const showSampleList = () => ({
  type: actionTypes.SHOW_SAMPLE_LIST
});

/* opens overview grid*/
export const toOverview = number => {
  return {
    type: actionTypes.TO_OVERVIEW,
    value: number
  };
};
