import { pushStateToUrl } from "../../util/url-utils";
import * as actionTypes from "../actions/actionTypes";
import axios from "axios";

export const updateUrl = store => next => action => {
  const result = next(action);
  const newState = store.getState().main;
  pushStateToUrl(newState);
  return result;
};

export const logger = store => next => action => {
  console.groupCollapsed(action.type ? action.type : "ASYNC ACTION");
  console.info("dispatching", action);
  createLogMsgIfNecessary(store.getState(), action);
  let result = next(action);
  console.log("next state", store.getState());
  console.groupEnd();
  return result;
};

export const thunk = store => next => action =>
  typeof action === "function"
    ? action(store.dispatch, store.getState)
    : next(action);

const createLogMsgIfNecessary = (state, action) => {
  if (state.main.user) {
    switch (action.type) {
      case actionTypes.CHANGE_GRAPH:
      case actionTypes.TIMERANGE_FILTER_CHANGE:
      case actionTypes.PROJECT_HOVERED:
      case actionTypes.CAT_CLICKED:
      case actionTypes.CAT_HOVERED:
      case actionTypes.PROJECT_CLICKED:
      case actionTypes.INFRA_CLICKED:
      case actionTypes.INFRA_HOVERED:
      case actionTypes.KTA_HOVERED:
      case actionTypes.YEAR_HOVERED:
      case actionTypes.KTA_CLICKED:
      case actionTypes.YEAR_CLICKED:
      case actionTypes.SHOW_UNCERTAINTY:
      case actionTypes.LEGEND_HOVERED:
      case actionTypes.TUTORIAL_STARTED:
      case actionTypes.PAGE_RESET:
      case actionTypes.TOUR_STARTED:
      case actionTypes.SHARE_DIALOG_OPENED:
      case actionTypes.SHOW_VIA_WIKI_REQUESTED:
      case actionTypes.SHOW_SAMPLE_LIST:
      case actionTypes.SAMPLE_CLICKED:
        sendEvtDataToLogService(state.main.user, action.type, {
          key: "null",
          value: action.value,
          view: state.main.graph
        });
        break;
      case actionTypes.CHECKBOX_FILTER_CHANGE:
        sendEvtDataToLogService(state.main.user, action.type, {
          key: action.id,
          value: action.value,
          view: state.main.graph
        });
        break;
      default:
        break;
    }
  }
};

const sendEvtDataToLogService = (user, evtType, evtData) => {
  const logMsg = {
    user: user,
    event: evtType,
    eventData: JSON.stringify(evtData)
  };
  axios.post("/api/logging", logMsg);
};
