// update the state in an immutable way and update the url without refreshing the page
import {stringify as queryStringify} from 'query-string'

export const updateUrl = (newState, urlData = {}) => {
  let newUrlData = {}
  urlData.graph ? newUrlData.g = urlData.graph : newUrlData.g = newState.graph

  urlData.f ? newUrlData.f = urlData.f.map(t => { return topicIntToString(t) }) : newUrlData.f = newState.filter[0].value

  urlData.t ? newUrlData.t = urlData.t.map(t => { return topicIntToString(t) }) : newUrlData.t = newState.filter[1].value

  urlData.s ? newUrlData.s = urlData.s : newUrlData.s = newState.filter[2].value

  urlData.selectedProject ? newUrlData.selectedProject = urlData.selectedProject : newUrlData.selectedProject = newState.selectedProject

  let minifiedUrlData = {...newUrlData, t: newUrlData.t.map(t => topicStringToInt(t)), f: newUrlData.f.map(t => fieldsStringToInt(t))}
  const newUrl = '?' + queryStringify(minifiedUrlData)
  history.pushState(null, null, newUrl)

  const filterValues = [newUrlData.f, newUrlData.t, newUrlData.s]
  return {
    graph: newUrlData.g,
    filter: newState.filter.map((f, i) => ({
      name: f.name,
      filterKey: f.filterKey,
      type: f.type,
      distValues: f.distValues,
      value: filterValues[i]
    })),
    selectedProject: newUrlData.selectedProject
  }
}

const fieldsMapping = [
  {name: 'Evolution und Geoprozesse', field: 1, color: '#7d913c'},
  {name: 'Sammlungsentwicklung und Biodiversitätsentdeckung', field: 2, color: '#d9ef36'},
  {name: 'Digitale Welt und Informationswissenschaft', field: 3, color: '#8184a7'},
  {name: 'Wissenskommunikation und Wissensforschung', field: 4, color: '#ed9798'}
]

const topicMapping = [
  {name: 'Wissenschaftsdatenmanagement', num: '1', field: 3, color: '#8184a7'},
  {name: 'Biodiversitäts- und Geoinformatik', num: '2', field: 3, color: '#8184a7'},
  {name: 'Perspektiven auf Natur - PAN', num: '3', field: 4, color: '#ed9798'},
  {name: 'Historische Arbeitsstelle', num: '4', field: 4, color: '#ed9798'},
  {name: 'Sammlungsentwicklung', num: '5', field: 2, color: '#d9ef36'},
  {name: 'Wissenschaft in der Gesellschaft', num: '6', field: 4, color: '#ed9798'},
  {name: 'Bildung und Vermittlung', num: '7', field: 4, color: '#ed9798'},
  {name: 'Evolutionäre Morphologie', num: '8', field: 1, color: '#7d913c'},
  {name: 'Ausstellung und Wissenstransfer', num: '9', field: 4, color: '#ed9798'},
  {name: 'Mikroevolution', num: '10', field: 1, color: '#7d913c'},
  {name: 'Impakt- und Meteoritenforschung', num: '11', field: 1, color: '#7d913c'},
  {name: 'Diversitätsdynamik', num: '12', field: 1, color: '#7d913c'},
  {name: 'Biodiversitätsentdeckung', num: '13', field: 2, color: '#d9ef36'},
  {name: 'IT- Forschungsinfrastrukturen', num: '14', field: 3, color: '#8184a7'},
  {name: 'Kompetenzzentrum Sammlung', num: '15', field: 2, color: '#d9ef36'}
]

export const fieldsIntToString = (number) => {
  number = parseInt(number, 10) // pls fix
  return fieldsMapping.find(e => e.field === number) ? fieldsMapping.find(e => e.field === number).name : number
}

export const fieldsStringToInt = (str) => {
  return fieldsMapping.find(e => e.name === str) ? fieldsMapping.find(e => e.name === str).field + '' : str
}

export const topicIntToString = (number) => {
  return topicMapping.find(e => e.num === number) ? topicMapping.find(e => e.num === number).name : 'Other'
}

export const topicStringToInt = (str) => {
  return topicMapping.find(e => e.name === str) ? topicMapping.find(e => e.name === str).num : str
}

export const topicToField = (topic) => {
  return topicMapping.concat(fieldsMapping).find(e => e.name === topic) ? topicMapping.concat(fieldsMapping).find(e => e.name === topic).field : 99
}

export const getFieldColor = (field) => {
  return fieldsMapping.find(e => e.name === field) ? fieldsMapping.find(e => e.name === field).color : '#989aa1'
}

export const getTopicColor = (topic) => {
  return topicMapping.find(e => e.name === topic) ? topicMapping.find(e => e.name === topic).color : '#989aa1'
}
