// update the state in an immutable way and update the url without refreshing the page
import {stringify as queryStringify} from 'query-string'

export const updateUrl = (filterState, graphState, urlData = {}) => {
  let newUrlData = {}
  urlData.graph ? newUrlData.graph = urlData.graph : newUrlData.graph = graphState

  urlData.field ? newUrlData.field = urlData.field : newUrlData.field = filterState[0].value

  urlData.topic ? newUrlData.topic = urlData.topic : newUrlData.topic = filterState[1].value

  urlData.sponsor ? newUrlData.topic = urlData.sponsor : newUrlData.sponsor = filterState[2].value

  const newUrl = '?' + queryStringify(newUrlData)
  history.pushState(null, null, newUrl)

  const filterValues = [newUrlData.field, newUrlData.topic, newUrlData.sponsor]
  const updatedData = {
    graph: newUrlData.graph,
    filter: filterState.map((f, i) => ({
      name: f.name,
      key: f.key,
      type: f.type,
      value: filterValues[i]
    }))
  }
  return updatedData
}
