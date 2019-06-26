import {stringify as queryStringify} from "query-string";
import {history} from "../../index";
import {
  fieldsStringToInt,
  sponsorStringToInt,
  topicStringToInt
} from "../utility";

export const updateUrl = store => next => action  => {
    console.log(window.location.search)
    const result = next(action)
    const newState = store.getState().main
    console.log(newState)
    let newUrlData = {}
    newUrlData.g = newState.graph
    newUrlData.f = newState.filter[0].value
    newUrlData.t = newState.filter[1].value
    newUrlData.s = newState.filter[2].value
    newUrlData.sP = newState.selectedProject

    let minifiedUrlData = {
      ...newUrlData,
      t: newUrlData.t.map(f => topicStringToInt(f)),
      f: newUrlData.f.map(t => fieldsStringToInt(t)),
      s: newUrlData.s.map(s => sponsorStringToInt(newState, s))}
    const newUrl = '?' + queryStringify(minifiedUrlData)
    console.log(newUrl)
    if(newUrl !== window.location.search){
      history.push(newUrl)
    }

    return result
}
