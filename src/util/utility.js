export const createNewStateFromUrlData = (state, urlData) => {
  const filterValues = {
    forschungsgebiet: urlData.f ? urlData.f.map(f => fieldsIntToString(f)) : [],
    hauptthema: urlData.t ? urlData.t.map(t => fieldsIntToString(t)) : [],
    geldgeber: urlData.s ? urlData.s.map(s => fieldsIntToString(s)) : []
  };

  let newState = {
    graph: urlData.g ? urlData.g : "0",
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
  };
  return newState;
};

const fieldsMapping = [
  { name: "Naturwissenschaften", field: 1, color: "#A4782E" },
  { name: "Lebenswissenschaften", field: 2, color: "#994A49" },
  { name: "Geistes- und Sozialwissenschaften", field: 3, color: "#435B22" },
  { name: "Ingenieurwissenschaften", field: 4, color: "#8f5d5e" },
  { name: "Sonstige", field: 5, color: "#7675B2" }
];

const topicMapping = [
  {
    name: "Agrar-, Forstwissenschaften und Tiermedizin",
    num: "19",
    field: 2,
    color: "#d9ef36"
  },
  { name: "Geologie und Paläontologie", num: "22", field: 1, color: "#7d913c" },
  {
    name: "Geochemie, Mineralogie und Kristallographie",
    num: "23",
    field: 1,
    color: "#7d913c"
  },
  { name: "Geophysik und Geodäsie", num: "24", field: 1, color: "#7d913c" },
  {
    name: "Atmosphären-, Meeres- und Klimaforschung",
    num: "25",
    field: 1,
    color: "#7d913c"
  },
  {
    name: "Kunst-, Musik-, Theater- und Medienwissenschaften",
    num: "26",
    field: 3,
    color: "#8184a7"
  },
  {
    name: "Sozialwissenschaften",
    num: "1",
    field: 3,
    color: "#8184a7"
  },
  {
    name: "Informatik",
    num: "2",
    field: 4,
    color: "#8184a7"
  },
  {
    name: "Erziehungswissenschaft und Bildungsforschung",
    num: "3",
    field: 3,
    color: "#8184a7"
  },
  {
    name: "Mathematik",
    num: "4",
    field: 1,
    color: "#8184a7"
  },
  { name: "Geschichtswissenschaften", num: "27", field: 3, color: "#8184a7" },
  { name: "Zoologie", num: "28", field: 2, color: "#d9ef36" },
  { name: "Pflanzenwissenschaften", num: "29", field: 2, color: "#d9ef36" },
  { name: "Sonstige", num: "30", field: 5, color: "#959ef9" }
];

export const categories = [
  { id: 2, title: "Erwachsene", count: 1, connections: [], project_ids: [1] },
  { id: 1, title: "Jugendliche", count: 1, connections: [], project_ids: [1] },
  { id: 7, title: "Kinder", count: 1, connections: [], project_ids: [1] },
  {
    id: 115,
    title: "Kinder ab 5 Jahre",
    count: 1,
    connections: [],
    project_ids: [1]
  },
  {
    id: 108,
    title: "Kinder ab 10 Jahre",
    count: 1,
    connections: [],
    project_ids: [1]
  },
  {
    id: 201,
    title: "Kinder ab 8 Jahre",
    count: 1,
    connections: [],
    project_ids: [1]
  },
  {
    id: 21,
    title: "Schülerinnen und Schüler",
    count: 1,
    connections: [],
    project_ids: [1]
  },
  {
    id: 103,
    title: "Lehrerinnen und Lehrer",
    count: 1,
    connections: [],
    project_ids: [1]
  },
  {
    id: 104,
    title: "Erzieherinnen und Erzieher",
    count: 1,
    connections: [],
    project_ids: [1]
  },
  {
    id: 15,
    title: "Politikerinnen und Politiker",
    count: 1,
    connections: [],
    project_ids: [1]
  },
  {
    id: 12,
    title: "Unternehmerinnen und Unternehmer",
    count: 1,
    connections: [],
    project_ids: [1]
  },
  { id: 41, title: "KMU", count: 1, connections: [], project_ids: [1] },
  {
    id: 13,
    title: "Wissenschaftlerinnen und Wissenschaftler",
    count: 1,
    connections: [],
    project_ids: [1]
  },
  {
    id: 25,
    title: "Bürgerforscherinnen und Bürgerforscher",
    count: 1,
    connections: [],
    project_ids: [1]
  },
  {
    id: 23,
    title: "Präparatorinnen und Präparatoren",
    count: 1,
    connections: [],
    project_ids: [1]
  },
  {
    id: 29,
    title: "Sammlungspflegerinnen und Sammlungspfleger",
    count: 1,
    connections: [],
    project_ids: [1]
  },
  {
    id: 53,
    title: "Kulturschaffende",
    count: 1,
    connections: [],
    project_ids: [1]
  },
  {
    id: 99,
    title: "Künstlerinnen und Künstler",
    count: 1,
    connections: [],
    project_ids: [1]
  },
  { id: 94, title: "Zoll", count: 1, connections: [], project_ids: [1] }
];

export const fieldsIntToString = number => {
  number = parseInt(number, 10); // pls fix
  return fieldsMapping.find(e => e.field === number)
    ? fieldsMapping.find(e => e.field === number).name
    : number;
};

export const fieldsStringToInt = str => {
  return fieldsMapping.find(e => e.name === str)
    ? fieldsMapping.find(e => e.name === str).field + ""
    : str;
};

export const topicIntToString = number => {
  return topicMapping.find(e => e.num === number)
    ? topicMapping.find(e => e.num === number).name
    : "Other";
};

export const topicStringToInt = str => {
  return topicMapping.find(e => e.name === str)
    ? topicMapping.find(e => e.name === str).num
    : str;
};

export const topicToField = topic => {
  return topicMapping.concat(fieldsMapping).find(e => e.name === topic)
    ? topicMapping.concat(fieldsMapping).find(e => e.name === topic).field
    : 99;
};

export const getFieldColor = field => {
  return fieldsMapping.find(e => e.name === field)
    ? fieldsMapping.find(e => e.name === field).color
    : "#989aa1"; // default color field
};

export const getTopicColor = topic => {
  return topicMapping.find(e => e.name === topic)
    ? topicMapping.find(e => e.name === topic).color
    : "#989aa1"; // default color topic
};

export const sponsorStringToInt = (state, str) => {
  return state.filters.geldgeber.uniqueVals.find(e => e === str)
    ? state.filters.geldgeber.uniqueVals.indexOf(str)
    : str;
};

export const sponsorIntToString = (state, int) => {
  return state.filters.geldgeber.uniqueVals[int]
    ? state.filters.geldgeber.uniqueVals[int]
    : int;
};

export const getColor = input => {
  const fColor = getFieldColor(input);
  return fColor === "#989aa1" ? getTopicColor(input) : fColor;
};
