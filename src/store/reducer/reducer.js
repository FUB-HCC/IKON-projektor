import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../utility'

const queryString = require('query-string') // queryString import

const initialState = {
  graph: '0',
  filter: {
    researchField: 'String', // Forschungsbereiche (String)
    topic: 'String', // Topics (String)
    funding: 'String', // Geldgeber (String)
    researchRegion: 'String', // Forschungsregionen (String)
    cooperations: 'String', // Kooperationspartner (String)
    researchObjects: 'String', // Forschungsobjekte (String)
    completness: 2 // “Completeness” (int, size of project-array)
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.URL_UPDATES_STATE: return urlUpdatesState(state)
    default:
      return state
  }
}

// Keep the switch lean by outsourcing the actual code below

const urlUpdatesState = (state) => {
  const parsedObj = queryString.parse(location.search)
  console.log(parsedObj)
  return updateObject(state, parsedObj)
}

export default reducer
