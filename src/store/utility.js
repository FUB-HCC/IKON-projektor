// update the state in an immutable way and update the url without refreshing the page
import {stringify as queryStringify} from 'query-string'

export const updateFilter = (oldObject, updatedProperties) => {
  const newFilter = {
    ...oldObject,
    ...updatedProperties
  }
  const newUrl = '?' + queryStringify(newFilter)
  history.pushState(null, null, newUrl)
  return newFilter
}
