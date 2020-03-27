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
    num: 19,
    field: 2,
    color: "#989aa1"
  },
  { name: "Geologie und Paläontologie", num: 22, field: 1, color: "#989aa1" },
  {
    name: "Geochemie, Mineralogie und Kristallographie",
    num: 23,
    field: 1,
    color: "#7d913c"
  },
  { name: "Geophysik und Geodäsie", num: 24, field: 1, color: "#989aa1" },
  {
    name: "Atmosphären-, Meeres- und Klimaforschung",
    num: 25,
    field: 1,
    color: "#989aa1"
  },
  {
    name: "Kunst-, Musik-, Theater- und Medienwissenschaften",
    num: 26,
    field: 3,
    color: "#989aa1"
  },
  {
    name: "Sozialwissenschaften",
    num: 1,
    field: 3,
    color: "#989aa1"
  },
  {
    name: "Informatik",
    num: 2,
    field: 4,
    color: "#989aa1"
  },
  {
    name: "Erziehungswissenschaft und Bildungsforschung",
    num: 3,
    field: 3,
    color: "#989aa1"
  },
  {
    name: "Mathematik",
    num: 4,
    field: 1,
    color: "#989aa1"
  },
  { name: "Geschichtswissenschaften", num: 27, field: 3, color: "#989aa1" },
  { name: "Zoologie", num: 28, field: 2, color: "#989aa1" },
  { name: "Pflanzenwissenschaften", num: 29, field: 2, color: "#989aa1" },
  { name: "Sonstige", num: 30, field: 5, color: "#989aa1" },
  { name: "Astrophysik und Astronomie", num: 31, field: 1, color: "#7d913c" },
  {
    name: "Grundlagen der Biologie und Medizin",
    num: 32,
    field: 2,
    color: "#989aa1"
  }
];

export const continents = [
  {
    name: "Nordamerika",
    xOffset: 61.4,
    yOffset: 53.1,
    mapWidth: 378,
    mapHeight: 384,
    longMin: -168.1311,
    longMax: -11.39,
    latMin: 7.322,
    latMax: 83.5702,
    institutionCount: 0,
    anchorPoint: 1 / 12,
    centroidX: -89.76055,
    centroidY: 45.4461
  },
  {
    name: "Südamerika",
    xOffset: 97.8,
    yOffset: 96,
    mapWidth: 330,
    mapHeight: 384,
    longMin: -81.2897,
    longMax: -26.2463,
    latMin: -59.473,
    latMax: 12.6286,
    institutionCount: 0,
    anchorPoint: 3 / 12,
    centroidX: -53.768,
    centroidY: -23.4222
  },
  {
    name: "Europa",
    xOffset: 97.8,
    yOffset: 48.4,
    mapWidth: 292,
    mapHeight: 384,
    longMin: -10.6,
    longMax: 40.166,
    latMin: 34.8888,
    latMax: 71.27,
    institutionCount: 0,
    anchorPoint: 5 / 12,
    centroidX: 14.783,
    centroidY: 53.0794
  },
  {
    name: "Asien",
    xOffset: 63.1,
    yOffset: 55.4,
    mapWidth: 383,
    mapHeight: 387,
    longMin: 20.01,
    longMax: 189.82,
    latMin: -22.147,
    latMax: 81.328,
    institutionCount: 0,
    anchorPoint: 7 / 12,
    centroidX: 104.915,
    centroidY: 29.5905
  },
  {
    name: "Afrika",
    xOffset: 75.8,
    yOffset: 61.2,
    mapWidth: 348,
    mapHeight: 394,
    longMin: -17.537,
    longMax: 51.412,
    latMin: -34.822,
    latMax: 37.34,
    institutionCount: 0,
    anchorPoint: 9 / 12,
    centroidX: 16.9375,
    centroidY: 1.259
  },
  {
    name: "Australien",
    xOffset: 97.8,
    yOffset: 96,
    mapWidth: 330,
    mapHeight: 384,
    longMin: 112.9511,
    longMax: 159.1019,
    latMin: -54.749,
    latMax: -10.0516,
    institutionCount: 0,
    anchorPoint: 11 / 12,
    centroidX: 136.0265,
    centroidY: -32.4003
  }
];

export const fieldsIntToString = number => {
  if (isNaN(number)) return number;
  number = parseInt(number, 10); // pls fix
  return fieldsMapping.find(e => e.field === number)
    ? fieldsMapping.find(e => e.field === number).name
    : number;
};

export const fieldsStringToInt = str => {
  return fieldsMapping.find(e => e.name === str)
    ? fieldsMapping.find(e => e.name === str).field
    : str;
};

export const topicIntToString = number => {
  return topicMapping.find(e => e.num === number)
    ? topicMapping.find(e => e.num === number).name
    : "Sonstige";
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
  return fieldsMapping.find(e => e.field === field)
    ? fieldsMapping.find(e => e.field === field).color
    : "#989aa1"; // default color field
};

export const shortenString = (string, len) => {
  return string.length > len ? string.substring(0, len) + "..." : string;
};

export const getQueryStringParams = query => {
  return query
    ? (/^[?#]/.test(query) ? query.slice(1) : query)
        .split("&")
        .reduce((params, param) => {
          let [key, value] = param.split("=");
          params[key] = value ? value : "";
          return params;
        }, {})
    : {};
};

export const applyFilters = (data, filter) => {
  let filteredData = data;
  Object.values(filter).forEach(f => {
    let newFilteredData = {};
    filteredData = Object.keys(filteredData).forEach(d => {
      if (f.type === "string") {
        if (f.value.some(value => value === filteredData[d][f.filterKey]))
          newFilteredData[d] = filteredData[d];
      } else if (f.type === "timeframe") {
        if (
          f.value[0] <= filteredData[d][f.filterKey][0] &&
          f.value[1] >= filteredData[d][f.filterKey][1]
        ) {
          newFilteredData[d] = filteredData[d];
        }
      } else if (f.type === "array") {
        newFilteredData[d] = filteredData[d];
      } else {
        if (filteredData[d][f.filterKey].includes(f.value))
          newFilteredData[d] = filteredData[d];
      }
    });
    filteredData = newFilteredData;
  });
  return Object.values(filteredData);
};

export const applyMissingFilters = (data, filter) => {
  let filteredData = data;
  Object.values(filter).forEach(f => {
    let newFilteredData = {};
    filteredData = Object.keys(filteredData).forEach(d => {
      if (f.type === "timeframe") {
        if (
          f.value[0] <= filteredData[d][f.filterKey][0] &&
          f.value[1] >= filteredData[d][f.filterKey][1]
        ) {
          newFilteredData[d] = filteredData[d];
        }
      } else {
        newFilteredData[d] = filteredData[d];
      }
    });
    filteredData = newFilteredData;
  });
  return Object.values(filteredData);
};

export const isTouchMode = state =>
  state.router.location.pathname.includes("touch");
