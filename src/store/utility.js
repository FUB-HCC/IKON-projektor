// update the state in an immutable way and update the url without refreshing the page
import {stringify as queryStringify} from 'query-string'

export const updateUrl = (newState, urlData = {}) => {
  let newUrlData = {}
  urlData.g ? newUrlData.g = urlData.g : newUrlData.g = newState.graph

  urlData.f ? newUrlData.f = urlData.f.map(f => { return fieldsIntToString(f) }) : newUrlData.f = newState.filter[0].value

  urlData.t ? newUrlData.t = urlData.t.map(t => { return topicIntToString(t) }) : newUrlData.t = newState.filter[1].value

  // Since the sponsor in the new dataset is always the same, the former code resulted in "urlData.s.map is not a function"
  // This is a workaround for now, until we know what the sponsor filter will become eventually
  // Check this issue for more information: https://github.com/FUB-HCC/IKON-projektor/issues/34
  if (urlData.s && urlData.s instanceof Array) {
    newUrlData.s = urlData.s.map(s => sponsorIntToString(newState, s))
  } else newUrlData.s = urlData.s && !(urlData.s instanceof Array) ? [sponsorIntToString(newState, urlData.s)] : newState.filter[2].value

  urlData.sP ? newUrlData.sP = urlData.sP : newUrlData.sP = newState.selectedProject

  let minifiedUrlData = {
    ...newUrlData,
    t: newUrlData.t.map(f => topicStringToInt(f)),
    f: newUrlData.f.map(t => fieldsStringToInt(t)),
    s: newUrlData.s.map(s => sponsorStringToInt(newState, s))}
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
    selectedProject: newUrlData.sP
  }
}

// field colors
const fieldsMapping = [
  /* {name: 'Evolution und Geoprozesse', field: 1, color: '#7d913c'},
  {name: 'Sammlungsentwicklung und Biodiversitätsentdeckung', field: 2, color: '#d9ef36'},
  {name: 'Digitale Welt und Informationswissenschaft', field: 3, color: '#8184a7'},
  {name: 'Wissenskommunikation und Wissensforschung', field: 4, color: '#ed9798'}, */
  {name: 'Naturwissenschaften', field: 1, color: '#f4a310'},
  {name: 'Lebenswissenschaften', field: 2, color: '#f12626'},
  {name: 'Geistes- und Sozialwissenschaften', field: 3, color: '#7ad101'},
  {name: 'Ingenieurwissenschaften', field: 4, color: '#ed9798'},
  {name: 'Unbekannt', field: 5, color: '#9c9bff'}
]

// topic(hauptthema) colors
const topicMapping = [
  // {name: 'Wissenschaftsdatenmanagement', num: '1', field: 3, color: '#8184a7'},
  // {name: 'Biodiversitäts- und Geoinformatik', num: '2', field: 3, color: '#8184a7'},
  //  {name: 'Perspektiven auf Natur - PAN', num: '3', field: 4, color: '#ed9798'},
  // {name: 'Historische Arbeitsstelle', num: '4', field: 4, color: '#ed9798'},
  // {name: 'Sammlungsentwicklung', num: '5', field: 2, color: '#d9ef36'},
  // {name: 'Wissenschaft in der Gesellschaft', num: '6', field: 4, color: '#ed9798'},
  // {name: 'Bildung und Vermittlung', num: '7', field: 4, color: '#ed9798'},
  // {name: 'Evolutionäre Morphologie', num: '8', field: 1, color: '#7d913c'},
  // {name: 'Ausstellung und Wissenstransfer', num: '9', field: 4, color: '#ed9798'},
  // {name: 'Mikroevolution', num: '10', field: 1, color: '#7d913c'},
  // {name: 'Impakt- und Meteoritenforschung', num: '11', field: 1, color: '#7d913c'},
  // {name: 'Diversitätsdynamik', num: '12', field: 1, color: '#7d913c'},
  // {name: 'Biodiversitätsentdeckung', num: '13', field: 2, color: '#d9ef36'},
  // {name: 'IT- Forschungsinfrastrukturen', num: '14', field: 3, color: '#8184a7'},
  // {name: 'Kompetenzzentrum Sammlung', num: '15', field: 2, color: '#d9ef36'},
  // {name: 'Geowissenschaften', num: '16', field: 1, color: '#7d913c'},
  // {name: 'Biologie', num: '17', field: 2, color: '#d9ef36'},
  // {name: 'Geisteswissenschaften', num: '18', field: 3, color: '#8184a7'},
  {name: 'Agrar-, Forstwissenschaften und Tiermedizin', num: '19', field: 2, color: '#d9ef36'},
  // {name: 'Informatik, System- und Elektrotechnik', num: '20', field: 4, color: '#ed9798'},
  // {name: 'Sozial- und Verhaltenswissenschaften', num: '21', field: 3, color: '#8184a7'},
  {name: 'Geologie und Paläontologie', num: '22', field: 1, color: '#7d913c'},
  {name: 'Geochemie, Mineralogie und Kristallographie', num: '23', field: 1, color: '#7d913c'},
  {name: 'Geophysik und Geodäsie', num: '24', field: 1, color: '#7d913c'},
  {name: 'Atmosphären-, Meeres- und Klimaforschung', num: '25', field: 1, color: '#7d913c'},
  {name: 'Kunst-, Musik-, Theater- und Medienwissenschaften', num: '26', field: 3, color: '#8184a7'},
  {name: 'Geschichtswissenschaften', num: '27', field: 3, color: '#8184a7'},
  {name: 'Zoologie', num: '28', field: 2, color: '#d9ef36'},
  {name: 'Pflanzenwissenschaften', num: '29', field: 2, color: '#d9ef36'},
  {name: 'Unbekannt', num: '30', field: 5, color: '#ffffff'}
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
  return fieldsMapping.find(e => e.name === field) ? fieldsMapping.find(e => e.name === field).color : '#989aa1' // default color field
}

export const getTopicColor = (topic) => {
  return topicMapping.find(e => e.name === topic) ? topicMapping.find(e => e.name === topic).color : '#989aa1' // default color topic
}

export const sponsorStringToInt = (state, str) => {
  return state.filter[2].distValues.find(e => e === str) ? state.filter[2].distValues.indexOf(str) : str
}

export const sponsorIntToString = (state, int) => {
  return state.filter[2].distValues[int] ? state.filter[2].distValues[int] : int
}

export const getColor = (input) => {
  const fColor = getFieldColor(input)
  return fColor === '#989aa1' ? getTopicColor(input) : fColor
}
