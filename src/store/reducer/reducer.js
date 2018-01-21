import * as actionTypes from '../actions/actionTypes'
import {updateState} from '../utility'
// import { updateState } from '../utility'  ONLY UPDATE STATE WITH THIS FUNCTION usage: updateObject(state, newObjToMergeWithState)

const queryString = require('query-string') // queryString import

const initialState = {
  graph: '0',
  field: '', // Forschungsbereiche (String)
  topic: '', // Topics (String)
  funding: '', // Geldgeber (String)
  region: '', // Forschungsregionen (String)
  coop: '', // Kooperationspartner (String)
  objects: '', // Forschungsobjekte (String)
  complete: '' // “Completeness” (int, size of project-array)
}

// Keep the reducer switch lean by outsourcing the actual code below

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_FILTER: return updateState(state, {[action.key]: action.value})
    default: return urlUpdatesState(state)
  }
}

// urlUpdatesState: Don't call this function. Only used upon initial loading
const urlUpdatesState = (state) => {
  const parsedObj = queryString.parse(location.search)
  return updateState(state, parsedObj)
}

export default reducer
