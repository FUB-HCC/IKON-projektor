import { fieldsStringToInt } from "../../util/utility";

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

export const processMissingProjects = state => {
  return state.missingprojects.map(mproject => ({
    ...mproject,
    forschungsbereich: "Unveröffentlicht",
    timeframe: mproject.timeframe.map(d =>
      d ? new Date(parseInt(d * 1000)).getFullYear() : 2000
    )
  }));
};

export const linkCatsToProjectsData = (projects, targetgroups, formats) => {
  return projects.map(project => ({
    ...project,
    targetgroups: targetgroups
      .filter(targetgroup =>
        targetgroup.ktas.find(
          kta =>
            kta.Drittmittelprojekt[0] &&
            kta.Drittmittelprojekt[0].id === project.id
        )
      )
      .map(targetgroup => targetgroup.id),
    formats: formats
      .filter(format =>
        format.ktas.find(
          kta =>
            kta.Drittmittelprojekt[0] &&
            kta.Drittmittelprojekt[0].id === project.id
        )
      )
      .map(format => format.id)
  }));
};

export const processTargetgroups = (processedProjects, state) => {
  return state.targetgroups.map(targetgroup => {
    const projectIds = targetgroup.ktas
      .filter(kta => kta.Drittmittelprojekt && kta.Drittmittelprojekt[0])
      .map(kta => kta.Drittmittelprojekt[0].id);
    return {
      ...targetgroup,
      projects: [
        ...new Set(processedProjects.filter(p => projectIds.includes(p.id)))
      ]
    };
  });
};

export const processFormats = (processedProjects, state) => {
  return state.formats.map(format => {
    const projectIds = format.ktas
      .filter(kta => kta.Drittmittelprojekt && kta.Drittmittelprojekt[0])
      .map(kta => kta.Drittmittelprojekt[0].id);
    return {
      ...format,
      projects: [
        ...new Set(processedProjects.filter(p => projectIds.includes(p.id)))
      ]
    };
  });
};

export const processInfrastructures = (processedProjects, state) => {
  return state.infrastructures.map(infrastructure => ({
    ...infrastructure,
    projects: processedProjects.filter(project =>
      infrastructure.projects.find(p => p.id === project.id)
    ),
    type: "infrastructure"
  }));
};

export const processCollections = (processedProjects, state) => {
  return state.collections.map(collection => ({
    ...collection,
    projects: processedProjects.filter(project =>
      collection.projects.find(p => p.id === project.id)
    ),
    type: "collection"
  }));
};

export const processKtas = ktas =>
  ktas.map(kta => ({
    ...kta,
    timeframe: [
      kta["Gestartet am"] && kta["Gestartet am"].length > 0
        ? new Date(parseInt(kta["Gestartet am"][0].timestamp) * 1000)
        : new Date(0),
      kta["Endet am"] && kta["Endet am"].length > 0
        ? new Date(parseInt(kta["Endet am"][0].timestamp) * 1000)
        : new Date(0)
    ]
  }));

const distance = (continent, institution) =>
  Math.sqrt(
    Math.pow(continent.centroidX - institution.long, 2) +
      Math.pow(continent.centroidY - institution.lat, 2)
  );
const disambiguateContinents = (candidates, institution) =>
  candidates.sort(
    (a, b) => distance(a, institution) - distance(b, institution)
  );
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
