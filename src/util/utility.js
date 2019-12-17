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
  { name: "Naturwissenschaften", field: 1, color: "#ad494a" },
  { name: "Lebenswissenschaften", field: 2, color: "#e69e57" },
  { name: "Geistes- und Sozialwissenschaften", field: 3, color: "#14a5b5" },
  { name: "Ingenieurwissenschaften", field: 4, color: "#9467bd" },
  { name: "Sonstige", field: 5, color: "#989aa1" }
];

const topicMapping = [
  {
    name: "Agrar-, Forstwissenschaften und Tiermedizin",
    num: "19",
    field: 2,
    color: "#989aa1"
  },
  { name: "Geologie und Paläontologie", num: "22", field: 1, color: "#989aa1" },
  {
    name: "Geochemie, Mineralogie und Kristallographie",
    num: "23",
    field: 1,
    color: "#7d913c"
  },
  { name: "Geophysik und Geodäsie", num: "24", field: 1, color: "#989aa1" },
  {
    name: "Atmosphären-, Meeres- und Klimaforschung",
    num: "25",
    field: 1,
    color: "#989aa1"
  },
  {
    name: "Kunst-, Musik-, Theater- und Medienwissenschaften",
    num: "26",
    field: 3,
    color: "#989aa1"
  },
  {
    name: "Sozialwissenschaften",
    num: "1",
    field: 3,
    color: "#989aa1"
  },
  {
    name: "Informatik",
    num: "2",
    field: 4,
    color: "#989aa1"
  },
  {
    name: "Erziehungswissenschaft und Bildungsforschung",
    num: "3",
    field: 3,
    color: "#989aa1"
  },
  {
    name: "Mathematik",
    num: "4",
    field: 1,
    color: "#989aa1"
  },
  { name: "Geschichtswissenschaften", num: "27", field: 3, color: "#989aa1" },
  { name: "Zoologie", num: "28", field: 2, color: "#989aa1" },
  { name: "Pflanzenwissenschaften", num: "29", field: 2, color: "#989aa1" },
  { name: "Sonstige", num: "30", field: 5, color: "#989aa1" }
];

const iconPaths = [
  "m50,27.7c-12.4,0 -22.3,10 -22.3,22.3c0,12.4 10,22.3 22.3,22.3s22.3,-9.9 22.3,-22.3s-9.9,-22.3 -22.3,-22.3z",
  "m65.9,69.6c-0.5,0 -31.4,0 -31.4,0c-2.1,0 -4.1,-1.2 -4.1,-3.7c0,0 0,-28.3 0,-30.8c0,-3 1.9,-4.7 4.2,-4.7l30.8,0c2.5,0.1 4.3,2.3 4.3,3.9l0,31.8c-0.2,1.9 -2.2,3.5 -3.8,3.5z",
  "m65.8,69.9l-31.6,0c-5.4,0 -7.1,-5.6 -4.3,-10.3l15.9,-31.8c1.9,-3.8 6,-3.8 8.3,-0.4c0,0 13.2,26.7 16.2,32.3s-0.5,10.2 -4.5,10.2z",
  "m74.1,52.4c-0.3,0.3 -21.3,21.3 -21.3,21.3c-1.4,1.4 -3.6,1.9 -5.3,0.2c0,0 -19.3,-19.3 -20.9,-20.9c-2.1,-2.1 -2,-4.5 -0.4,-6.1l20.9,-20.9c1.7,-1.6 4.4,-1.4 5.5,-0.2l21.6,21.6c1.2,1.4 1,3.9 -0.1,5z"
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

export const getIcon = num => {
  return num < 2 ? iconPaths[num] : iconPaths[0];
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
