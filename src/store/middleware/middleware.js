import { stringify as queryStringify } from 'query-string';
import { history } from '../../index';
import {
  fieldsStringToInt,
  sponsorStringToInt,
  topicStringToInt
} from '../utility';

export const updateUrl = store => next => action => {
  const result = next(action);
  const newState = store.getState().main;
  let newUrlData = {
    g: newState.graph,
    f: newState.filters.forschungsgebiet.value,
    t: newState.filters.hauptthema.value,
    s: newState.filters.geldgeber.value,
    sP: newState.selectedProject
  };

  let minifiedUrlData = {
    ...newUrlData,
    t: newUrlData.t.map(f => topicStringToInt(f)),
    f: newUrlData.f.map(t => fieldsStringToInt(t)),
    s: newUrlData.s.map(s => sponsorStringToInt(newState, s))
  };
  const newUrl = '?' + queryStringify(minifiedUrlData);
  if (newUrl !== window.location.search) {
    history.push(newUrl);
  }

  return result;
};

export const logger = store => next => action => {
  console.groupCollapsed(action.type ? action.type : 'ASYNC ACTION');
  console.info('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  console.groupEnd();
  return result;
};

export const thunk = store => next => action =>
  typeof action === 'function'
    ? action(store.dispatch, store.getState)
    : next(action);
