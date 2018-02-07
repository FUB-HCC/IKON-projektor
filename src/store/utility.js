// update the state in an immutable way and update the url without refreshing the page
import {stringify as queryStringify} from 'query-string'

export const updateUrl = (filterState, graphState, urlData = {}) => {
  let newUrlData = {}
  urlData.graph ? newUrlData.graph = urlData.graph : newUrlData.graph = graphState

  urlData.field ? newUrlData.field = urlData.field : newUrlData.field = filterState[0].value

  urlData.topic ? newUrlData.topic = urlData.topic.map(t => { return topicIntToString(t) }) : newUrlData.topic = filterState[1].value

  urlData.sponsor ? newUrlData.sponsor = urlData.sponsor : newUrlData.sponsor = filterState[2].value

  let minifiedUrlData = {...newUrlData, topic: newUrlData.topic.map(t => topicStringToInt(t))}
  const newUrl = '?' + queryStringify(minifiedUrlData)
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

const fieldsMapping = [
  {name: 'Evolution und Geoprozesse', num: '1'},
  {name: 'Sammlungsentwicklung und Biodiversitätsentdeckung', num: '2'},
  {name: 'Digitale Welt und Informationswissenschaft', num: '3'},
  {name: 'Wissenskommunikation und Wissensforschung', num: '4'}
]

const topicMapping = [
  {name: 'Wissenschaftsdatenmanagement', num: '1'},
  {name: 'Biodiversitäts- und Geoinformatik', num: '2'},
  {name: 'Perspektiven auf Natur - PAN', num: '3'},
  {name: 'Historische Arbeitsstelle', num: '4'},
  {name: 'Sammlungsentwicklung', num: '5'},
  {name: 'Wissenschaft in der Gesellschaft', num: '6'},
  {name: 'Bildung und Vermittlung', num: '7'},
  {name: 'Evolutionäre Morphologie', num: '8'},
  {name: 'Ausstellung und Wissenstransfer', num: '9'},
  {name: 'Mikroevolution', num: '10'},
  {name: 'Impakt- und Meteoritenforschung', num: '11'},
  {name: 'Diversitätsdynamik', num: '12'},
  {name: 'Biodiversitätsentdeckung', num: '13'},
  {name: 'IT- Forschungsinfrastrukturen', num: '14'},
  {name: 'Kompetenzzentrum Sammlung', num: '15'}
]

export const fieldsIntToString = (number) => {
  return fieldsMapping.find(e => e.num === number) ? fieldsMapping.find(e => e.num === number).name : number
}

export const fieldsStringToInt = (str) => {
  return fieldsMapping.find(e => e.name === str) ? fieldsMapping.find(e => e.name === str).num : str
}

export const topicIntToString = (number) => {
  return topicMapping.find(e => e.num === number) ? topicMapping.find(e => e.num === number).name : number
}

export const topicStringToInt = (str) => {
  return topicMapping.find(e => e.name === str) ? topicMapping.find(e => e.name === str).num : str
}

console.log(fieldsIntToString('2'), fieldsStringToInt('qqw'), topicIntToString('3'), topicStringToInt('ss'))
