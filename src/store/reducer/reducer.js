import * as actionTypes from '../actions/actionTypes'
import {updateState} from '../utility'
// import { updateState } from '../utility'  ONLY UPDATE STATE WITH THIS FUNCTION usage: updateObject(state, newObjToMergeWithState)

const queryString = require('query-string') // queryString import

const initialState = {
  graph: '0',
  researchField: 'String', // Forschungsbereiche (String)
  topic: 'String', // Topics (String)
  funding: 'String', // Geldgeber (String)
  researchRegion: 'String', // Forschungsregionen (String)
  cooperations: 'String', // Kooperationspartner (String)
  researchObjects: 'String', // Forschungsobjekte (String)
  completness: 2 // “Completeness” (int, size of project-array)
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.URL_UPDATES_STATE: return updateState(state, {})
    default:
      return urlUpdatesState(state) // is this not genius?
  }
}

// Keep the switch lean by outsourcing the actual code below

// urlUpdatesState: Don't call this function. Only used upon initial loading
const urlUpdatesState = (state) => {
  const parsedObj = queryString.parse(location.search)
  return {
    ...state,
    ...parsedObj
  }
}

export default reducer
