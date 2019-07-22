
export const createNewStateFromUrlData = (state, urlData) =>{
  const filterValues = {
    forschungsgebiet: urlData.f ? urlData.f.map(f => fieldsIntToString(f)) : [],
    hauptthema: urlData.t ? urlData.t.map(t => fieldsIntToString(t)) : [],
    geldgeber: urlData.s ? urlData.s.map(s => fieldsIntToString(s)) : []
  }

  let newState = {
    graph: urlData.g ? urlData.g : '0',
    filters: {
      ...state.filters,
      forschungsgebiet: {
        ...state.filters.forschungsgebiet,
        value: filterValues.forschungsgebiet
      },
      hauptthema: {
        ...state.filters.hauptthema,
        value: filterValues.hauptthema
      },
      geldgeber: {
        ...state.filters.geldgeber,
        value: filterValues.geldgeber
      }
    },
    selectedProject: urlData.sP
  }
  return newState
}

// field colors
const fieldsMapping = [
  /* {name: 'Evolution und Geoprozesse', field: 1, color: '#7d913c'},
  {name: 'Sammlungsentwicklung und Biodiversitätsentdeckung', field: 2, color: '#d9ef36'},
  {name: 'Digitale Welt und Informationswissenschaft', field: 3, color: '#8184a7'},
  {name: 'Wissenskommunikation und Wissensforschung', field: 4, color: '#ed9798'}, */
  {name: 'Naturwissenschaften', field: 1, color: '#A4782E'},
  {name: 'Lebenswissenschaften', field: 2, color: '#994A49'},
  {name: 'Geistes- und Sozialwissenschaften', field: 3, color: '#435B22'},
  {name: 'Ingenieurwissenschaften', field: 4, color: '#ed9798'},
  {name: 'Unbekannt', field: 5, color: '#7675B2'}
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
  // {name: 'Unbekannt', num: '30', field: 5, color: '#ffffff'}
  {name: 'Unbekannt', num: '30', field: 5, color: '#959ef9'}
]

export const categories = [
  { title: "Museumsbesucher", connections: [], id: 0 },
  { title: "Laien", connections: [], id: 1 },
  { title: "Forschungsinstitute", connections: [], id: 2 },
  { title: "Museen", connections: [], id: 3 },
  { title: "Behörden", connections: [], id: 4 },
  { title: "Biodiversitätsforschende", connections: [], id: 5 },
  { title: "Öffentlichkeit", connections: [], id: 6 },
  { title: "Ethikrat", connections: [], id: 7 },
  { title: "Fachpublikum", connections: [], id: 8 },
  { title: "LehrerInnen & ErzieherInnen", connections: [], id: 9 },
  { title: "SchülerInnen", connections: [], id: 10 },
  { title: "Leibniz-Institute", connections: [], id: 11 },
  { title: "Akteure i. d. nat. Biodiv.-Forschung und -Politik", connections: [], id: 12 },
  { title: "Politik", connections: [], id: 13 },
  { title: "Forschungsförderer", connections: [], id: 14 },
  { title: "Studierende", connections: [], id: 15 },
  { title: "Vereine und Naturschutzverbände", connections: [], id: 16 },
  { title: "Wissenschaft", connections: [], id: 17 },
  { title: "Medien", connections: [], id: 18 },
  { title: "Wirtschaft", connections: [], id: 19 },
  // { title: "Tester", connections: [], id: 16 },
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
  return state.filters.geldgeber.uniqueVals.find(e => e === str) ? state.filters.geldgeber.uniqueVals.indexOf(str) : str
}

export const sponsorIntToString = (state, int) => {
  return state.filters.geldgeber.uniqueVals[int] ? state.filters.geldgeber.uniqueVals[int] : int
}

export const getColor = (input) => {
  const fColor = getFieldColor(input)
  return fColor === '#989aa1' ? getTopicColor(input) : fColor
}
