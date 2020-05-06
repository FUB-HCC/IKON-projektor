import { fieldsStringToInt } from "../../util/utility";

/* the property "Forschungsthema, Expertise, Kompetenzen" of projects is split into "hauptthema" and "forschungsbereich" by which they are later sorted. the date format is changed and the research regions of a project are translated into continents */
export const processProjectsData = state => {
  const projectData = state.projects;
  return projectData.map(project => {
    project.hauptthema =
      project["Forschungsthema, Expertise, Kompetenzen"][0] &&
      project["Forschungsthema, Expertise, Kompetenzen"][0].split("/")[1]
        ? project["Forschungsthema, Expertise, Kompetenzen"][0].split("/")[1]
        : "Sonstige";
    project.forschungsregionen = project["Geographische Verschlagwortung"].map(
      geo => getContinentFromProject(geo)
    );
    project.timeframe = project.timeframe.map(d =>
      d ? new Date(parseInt(d) * 1000).getFullYear() : 1970
    );
    if (
      project["Forschungsthema, Expertise, Kompetenzen"][0] &&
      project["Forschungsthema, Expertise, Kompetenzen"][0].split("/")[0]
    ) {
      return {
        ...project,
        forschungsbereichStr: project[
          "Forschungsthema, Expertise, Kompetenzen"
        ][0].split("/")[0],
        forschungsbereich: fieldsStringToInt(
          project["Forschungsthema, Expertise, Kompetenzen"][0].split("/")[0]
        )
      };
    } else {
      return {
        ...project,
        forschungsbereichStr: "Sonstige",
        forschungsbereich: fieldsStringToInt("Sonstige")
      };
    }
  });
};

const getContinentFromProject = geo => {
  switch (parseInt(geo.charAt(0))) {
    case 1: {
      return "Südamerika";
    }
    case 2: {
      return "Nordamerika";
    }
    case 3: {
      return "Südamerika";
    }
    case 4: {
      return "Europa";
    }
    case 5: {
      return "Asien";
    }
    case 6: {
      return "Afrika";
    }
    case 7: {
      return "Australien";
    }
    default: {
      return "Europa";
    }
  }
};

export const linkLabelsToProjectsData = (projects, labels) => {
  return projects.map(project => ({
    ...project,
    labels: labels
      .filter(targetgroup =>
        targetgroup.ktas.find(
          kta =>
            kta.Drittmittelprojekt[0] &&
            kta.Drittmittelprojekt[0].id === project.id
        )
      )
      .map(targetgroup => targetgroup.id)
  }));
};

/* targetgroups as well as formats get a list of projects that they are indirectly connected to through knowledge transfer activities to make the linking in the graph visualization easier. */
export const processLabels = (processedProjects, state) => {
  return state.labels.map(label => {
    const projectIds = label.ktas
      .filter(kta => kta.Drittmittelprojekt && kta.Drittmittelprojekt[0])
      .map(kta => kta.Drittmittelprojekt[0].id);
    return {
      ...label,
      projects: [
        ...new Set(processedProjects.filter(p => projectIds.includes(p.id)))
      ]
    };
  });
};

const distance = (continent, institution) =>
  Math.sqrt(
    Math.pow(continent.centroidX - institution.long, 2) +
      Math.pow(continent.centroidY - institution.lat, 2)
  );
const disambiguateContinents = (candidates, institution) =>
  candidates.sort(
    (a, b) => distance(a, institution) - distance(b, institution)
  );

/* checks if an institution is within the bounding box of a continent. if it is in two bounding boxes, the distance to the center of the continent decides */
const getContinentOfInstitution = (continentList, institution) => {
  if (!institution || !institution.lon) return null;
  const candidates = continentList.filter(
    con =>
      con.longMin < institution.lon &&
      con.longMax > institution.lon &&
      con.latMin < institution.lat &&
      con.latMax > institution.lat
  );
  if (candidates.length === 0) {
    return "";
  }
  if (candidates.length > 1) {
    disambiguateContinents(candidates, institution);
  }
  institution.continent = candidates[0].name;
  candidates[0].institutionCount += 1;
  return institution.continent;
};

/* For each institution the continent is found, and the weight of that continent is increased. This is for the geomap*/
export const processInstitutions = state => {
  let newContinents = state.continents;
  return {
    ...state,
    institutions: state.institutions
      .map(inst => ({
        ...inst,
        continent: getContinentOfInstitution(newContinents, inst)
      }))
      .filter(inst => inst.lon && inst.lat),
    continents: newContinents
  };
};
