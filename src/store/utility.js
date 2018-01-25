// update the state in an immutable way and update the url without refreshing the page

export const updateState = (oldObject, updatedProperties) => {
  const queryString = require('query-string') // queryString import
  const newState = {
    ...oldObject,
    ...updatedProperties
  }
  const newUrl = '?' + queryString.stringify(newState)
  history.pushState(null, null, newUrl)
  return newState
}
