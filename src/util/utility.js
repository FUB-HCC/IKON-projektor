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
  { name: "Ingenieurwissenschaften", field: 4, color: "#ed9798" },
  { name: "Unbekannt", field: 5, color: "#7675B2" }
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
  { name: "Geschichtswissenschaften", num: "27", field: 3, color: "#8184a7" },
  { name: "Zoologie", num: "28", field: 2, color: "#d9ef36" },
  { name: "Pflanzenwissenschaften", num: "29", field: 2, color: "#d9ef36" },
  { name: "Unbekannt", num: "30", field: 5, color: "#959ef9" }
];

export const categories = [
  {
    id: 0,
    title: "Abendveranstaltung",
    count: 6,
    connections: [],
    project_ids: [110038, 110075, 110059]
  },
  { id: 1, title: "App", count: 1, connections: [], project_ids: [110045] },
  { id: 2, title: "Ausstellung", count: 13, connections: [], project_ids: [] },
  {
    id: 3,
    title: "Beitrag in Sammelband",
    count: 4,
    connections: [],
    project_ids: [110046, 150019]
  },
  {
    id: 4,
    title: "Beitrag in Zeitschrift",
    count: 1,
    connections: [],
    project_ids: [130114]
  },
  { id: 5, title: "Beratung", count: 2, connections: [], project_ids: [] },
  {
    id: 6,
    title: "Bereitstellung Daten",
    count: 1,
    connections: [],
    project_ids: []
  },
  {
    id: 7,
    title: "Bereitstellung Infrastruktur",
    count: 1,
    connections: [],
    project_ids: []
  },
  { id: 8, title: "Bericht", count: 1, connections: [], project_ids: [110060] },
  { id: 9, title: "Buch", count: 1, connections: [], project_ids: [] },
  {
    id: 10,
    title: "Buchpr\u00e4sentation",
    count: 1,
    connections: [],
    project_ids: [110044]
  },
  {
    id: 11,
    title: "Dokumentation Workshop",
    count: 9,
    connections: [],
    project_ids: [
      110038,
      110038,
      110038,
      110060,
      110060,
      110060,
      110060,
      110060,
      110060
    ]
  },
  {
    id: 12,
    title: "Freizeitangebot",
    count: 2,
    connections: [],
    project_ids: []
  },
  {
    id: 13,
    title: "F\u00fchrung",
    count: 12,
    connections: [],
    project_ids: []
  },
  { id: 14, title: "Hackathon", count: 1, connections: [], project_ids: [] },
  {
    id: 15,
    title: "Infrastruktur Partizipationsraum",
    count: 1,
    connections: [],
    project_ids: []
  },
  { id: 16, title: "Kooperation", count: 3, connections: [], project_ids: [] },
  {
    id: 17,
    title: "Lehrmaterialien",
    count: 6,
    connections: [],
    project_ids: [150041]
  },
  { id: 18, title: "Monografie", count: 4, connections: [], project_ids: [] },
  {
    id: 19,
    title: "Netzwerkanalyse",
    count: 1,
    connections: [],
    project_ids: [110038]
  },
  {
    id: 20,
    title: "Offenes Nachmittagsangebot",
    count: 1,
    connections: [],
    project_ids: []
  },
  {
    id: 21,
    title: "Partizipationsangebot",
    count: 7,
    connections: [],
    project_ids: []
  },
  {
    id: 22,
    title: "Performance",
    count: 1,
    connections: [],
    project_ids: [110059]
  },
  {
    id: 23,
    title: "Plattform",
    count: 1,
    connections: [],
    project_ids: [110060]
  },
  {
    id: 24,
    title: "Podiumsdiskussion",
    count: 7,
    connections: [],
    project_ids: []
  },
  {
    id: 25,
    title: "Pressemitteilung",
    count: 37,
    connections: [],
    project_ids: [
      170000,
      130140,
      130165,
      170000,
      130167,
      110044,
      130134,
      130161,
      130132,
      130143
    ]
  },
  {
    id: 26,
    title: "Publikation",
    count: 5,
    connections: [],
    project_ids: [110038, 110038, 110060, 110060, 110060]
  },
  { id: 27, title: "Quiz", count: 1, connections: [], project_ids: [] },
  {
    id: 28,
    title: "Sammelband",
    count: 1,
    connections: [],
    project_ids: [110044]
  },
  {
    id: 29,
    title: "Schulbildungsangebot",
    count: 6,
    connections: [],
    project_ids: []
  },
  {
    id: 30,
    title: "Sch\u00fclertraining",
    count: 1,
    connections: [],
    project_ids: []
  },
  {
    id: 31,
    title: "Sonderausstellung",
    count: 1,
    connections: [],
    project_ids: []
  },
  {
    id: 32,
    title: "Tagungsbericht",
    count: 3,
    connections: [],
    project_ids: [110060, 110060, 110060]
  },
  {
    id: 33,
    title: "Trainingsbericht",
    count: 1,
    connections: [],
    project_ids: [110060]
  },
  {
    id: 34,
    title: "Virtual-Reality Anwendung",
    count: 2,
    connections: [],
    project_ids: [120007, 120007]
  },
  { id: 35, title: "Vorlesung", count: 1, connections: [], project_ids: [] },
  { id: 36, title: "Vortrag", count: 2, connections: [], project_ids: [] },
  {
    id: 37,
    title: "Wanderausstellung",
    count: 2,
    connections: [],
    project_ids: []
  },
  {
    id: 38,
    title: "Wissenschaft kommunizieren",
    count: 1,
    connections: [],
    project_ids: [130128]
  },
  {
    id: 39,
    title: "Wissenstransfer \u00fcber Person",
    count: 1,
    connections: [],
    project_ids: []
  },
  {
    id: 40,
    title: "Workshop",
    count: 8,
    connections: [],
    project_ids: [120007, 110059]
  },
  {
    id: 41,
    title: "interaktive Anwendung",
    count: 1,
    connections: [],
    project_ids: [120007]
  }
];
//[{"id": 0, "title": "Abendveranstaltung", "count": 6, "connections": []}, {"id": 1, "title": "App", "count": 1, "connections": []}, {"id": 2, "title": "Ausstellung", "count": 13, "connections": []}, {"id": 3, "title": "Beitrag in Sammelband", "count": 4, "connections": []}, {"id": 4, "title": "Beitrag in Zeitschrift", "count": 1, "connections": []}, {"id": 5, "title": "Beratung", "count": 2, "connections": []}, {"id": 6, "title": "Bereitstellung Daten", "count": 1, "connections": []}, {"id": 7, "title": "Bereitstellung Infrastruktur", "count": 1, "connections": []}, {"id": 8, "title": "Bericht", "count": 1, "connections": []}, {"id": 9, "title": "Buch", "count": 1, "connections": []}, {"id": 10, "title": "Buchpr\u00e4sentation", "count": 1, "connections": []}, {"id": 11, "title": "Dokumentation Workshop", "count": 9, "connections": []}, {"id": 12, "title": "Freizeitangebot", "count": 2, "connections": []}, {"id": 13, "title": "F\u00fchrung", "count": 12, "connections": []}, {"id": 14, "title": "Hackathon", "count": 1, "connections": []}, {"id": 15, "title": "Infrastruktur Partizipationsraum", "count": 1, "connections": []}, {"id": 16, "title": "Kooperation", "count": 3, "connections": []}, {"id": 17, "title": "Lehrmaterialien", "count": 6, "connections": []}, {"id": 18, "title": "Monografie", "count": 4, "connections": []}, {"id": 19, "title": "Netzwerkanalyse", "count": 1, "connections": []}, {"id": 20, "title": "Offenes Nachmittagsangebot", "count": 1, "connections": []}, {"id": 21, "title": "Partizipationsangebot", "count": 7, "connections": []}, {"id": 22, "title": "Performance", "count": 1, "connections": []}, {"id": 23, "title": "Plattform", "count": 1, "connections": []}, {"id": 24, "title": "Podiumsdiskussion", "count": 7, "connections": []}, {"id": 25, "title": "Pressemitteilung", "count": 37, "connections": []}, {"id": 26, "title": "Publikation", "count": 5, "connections": []}, {"id": 27, "title": "Quiz", "count": 1, "connections": []}, {"id": 28, "title": "Sammelband", "count": 1, "connections": []}, {"id": 29, "title": "Schulbildungsangebot", "count": 6, "connections": []}, {"id": 30, "title": "Sch\u00fclertraining", "count": 1, "connections": []}, {"id": 31, "title": "Sonderausstellung", "count": 1, "connections": []}, {"id": 32, "title": "Tagungsbericht", "count": 3, "connections": []}, {"id": 33, "title": "Trainingsbericht", "count": 1, "connections": []}, {"id": 34, "title": "Virtual-Reality Anwendung", "count": 2, "connections": []}, {"id": 35, "title": "Vorlesung", "count": 1, "connections": []}, {"id": 36, "title": "Vortrag", "count": 2, "connections": []}, {"id": 37, "title": "Wanderausstellung", "count": 2, "connections": []}, {"id": 38, "title": "Wissenschaft kommunizieren", "count": 1, "connections": []}, {"id": 39, "title": "Wissenstransfer \u00fcber Person", "count": 1, "connections": []}, {"id": 40, "title": "Workshop", "count": 8, "connections": []}, {"id": 41, "title": "interaktive Anwendung", "count": 1, "connections": []}]
//[{"id": 0, "title": "Abendveranstaltung", "count": 6, "connections": [110038, 110075, 110059]}, {"id": 1, "title": "App", "count": 1, "connections": [110045]}, {"id": 2, "title": "Ausstellung", "count": 13, "connections": []}, {"id": 3, "title": "Beitrag in Sammelband", "count": 4, "connections": [110046, 150019]}, {"id": 4, "title": "Beitrag in Zeitschrift", "count": 1, "connections": [130114]}, {"id": 5, "title": "Beratung", "count": 2, "connections": []}, {"id": 6, "title": "Bereitstellung Daten", "count": 1, "connections": []}, {"id": 7, "title": "Bereitstellung Infrastruktur", "count": 1, "connections": []}, {"id": 8, "title": "Bericht", "count": 1, "connections": [110060]}, {"id": 9, "title": "Buch", "count": 1, "connections": []}, {"id": 10, "title": "Buchpr\u00e4sentation", "count": 1, "connections": [110044]}, {"id": 11, "title": "Dokumentation Workshop", "count": 9, "connections": [110038, 110038, 110038, 110060, 110060, 110060, 110060, 110060, 110060]}, {"id": 12, "title": "Freizeitangebot", "count": 2, "connections": []}, {"id": 13, "title": "F\u00fchrung", "count": 12, "connections": []}, {"id": 14, "title": "Hackathon", "count": 1, "connections": []}, {"id": 15, "title": "Infrastruktur Partizipationsraum", "count": 1, "connections": []}, {"id": 16, "title": "Kooperation", "count": 3, "connections": []}, {"id": 17, "title": "Lehrmaterialien", "count": 6, "connections": [150041]}, {"id": 18, "title": "Monografie", "count": 4, "connections": []}, {"id": 19, "title": "Netzwerkanalyse", "count": 1, "connections": [110038]}, {"id": 20, "title": "Offenes Nachmittagsangebot", "count": 1, "connections": []}, {"id": 21, "title": "Partizipationsangebot", "count": 7, "connections": []}, {"id": 22, "title": "Performance", "count": 1, "connections": [110059]}, {"id": 23, "title": "Plattform", "count": 1, "connections": [110060]}, {"id": 24, "title": "Podiumsdiskussion", "count": 7, "connections": []}, {"id": 25, "title": "Pressemitteilung", "count": 37, "connections": [170000, 130140, 130165, 170000, 130167, 110044, 130134, 130161, 130132, 130143]}, {"id": 26, "title": "Publikation", "count": 5, "connections": [110038, 110038, 110060, 110060, 110060]}, {"id": 27, "title": "Quiz", "count": 1, "connections": []}, {"id": 28, "title": "Sammelband", "count": 1, "connections": [110044]}, {"id": 29, "title": "Schulbildungsangebot", "count": 6, "connections": []}, {"id": 30, "title": "Sch\u00fclertraining", "count": 1, "connections": []}, {"id": 31, "title": "Sonderausstellung", "count": 1, "connections": []}, {"id": 32, "title": "Tagungsbericht", "count": 3, "connections": [110060, 110060, 110060]}, {"id": 33, "title": "Trainingsbericht", "count": 1, "connections": [110060]}, {"id": 34, "title": "Virtual-Reality Anwendung", "count": 2, "connections": [120007, 120007]}, {"id": 35, "title": "Vorlesung", "count": 1, "connections": []}, {"id": 36, "title": "Vortrag", "count": 2, "connections": []}, {"id": 37, "title": "Wanderausstellung", "count": 2, "connections": []}, {"id": 38, "title": "Wissenschaft kommunizieren", "count": 1, "connections": [130128]}, {"id": 39, "title": "Wissenstransfer \u00fcber Person", "count": 1, "connections": []}, {"id": 40, "title": "Workshop", "count": 8, "connections": [120007, 110059]}, {"id": 41, "title": "interaktive Anwendung", "count": 1, "connections": [120007]}]

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
