import { fieldsStringToInt } from "../../util/utility";
import _ from "lodash";

export const processProjectsData = state => {
  const projectData = transformPoints(state.projects);
  return projectData.map(project => {
    project.hauptthema =
      project["Forschungsthema, Expertise, Kompetenzen"][0] &&
      project["Forschungsthema, Expertise, Kompetenzen"][0].split("/")[1]
        ? project["Forschungsthema, Expertise, Kompetenzen"][0].split("/")[1]
        : "Sonstige";

    project.timeframe = project.timeframe.map(d =>
      d && d.raw ? new Date(d.timestamp * 1000).getFullYear() : d
    );
    if (
      project["Forschungsthema, Expertise, Kompetenzen"][0] &&
      project["Forschungsthema, Expertise, Kompetenzen"][0].split("/")[0]
    ) {
      return {
        ...project,
        forschungsbereich: project[
          "Forschungsthema, Expertise, Kompetenzen"
        ][0].split("/")[0],
        forschungsbereichNumber: fieldsStringToInt(
          project["Forschungsthema, Expertise, Kompetenzen"][0].split("/")[0]
        )
      };
    } else {
      return {
        ...project,
        forschungsbereich: "Sonstige",
        forschungsbereichNumber: fieldsStringToInt("Sonstige")
      };
    }
  });
};

export const processMissingProjects = state => {
  return state.missingprojects.map(mproject => ({
    ...mproject,
    forschungsbereich: "Unveröffentlicht",
    timeframe: mproject.timeframe.map(d =>
      d && d.raw ? new Date(d.timestamp * 1000).getFullYear() : 2000
    )
  }));
};

export const linkCatsToProjectsData = (projects, targetgroups) => {
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
      .map(targetgroup => targetgroup.id)
  }));
};

// export const processClusterData = state => ({
//   ...state.clusterData,
//   transformedPoints: transformPoints(state)
// });

const transformPoints = projects => {
  const minX = _.min(projects.map(c => c.mappoint[0]));
  const minY = _.min(projects.map(c => c.mappoint[1]));
  return projects.map(p => {
    return {
      ...p,
      mappoint: [p.mappoint[0] - minX, p.mappoint[1] - minY]
    };
  });
};

export const processTargetgroups = state => {
  return state.targetgroups.map(targetgroup => {
    const projects = targetgroup.ktas
      .filter(kta => kta.Drittmittelprojekt && kta.Drittmittelprojekt[0])
      .map(kta => kta.Drittmittelprojekt[0]);
    return {
      ...targetgroup,
      projects: [...new Set(projects)]
    };
  });
};

export const processInfrastructures = state => {
  return state.infrastructures.map(infrastructure => ({
    ...infrastructure,
    type: "infrastructure"
  }));
};

export const processCollections = state => {
  return state.collections.map(collection => ({
    ...collection,
    type: "collection"
  }));
};

export const processKtas = ktas =>
  ktas.map(kta => ({
    ...kta,
    timeframe: [
      kta["Gestartet am"] && kta["Gestartet am"].length > 0
        ? new Date(kta["Gestartet am"][0].timestamp * 1000)
        : new Date(0),
      kta["Endet am"] && kta["Endet am"].length > 0
        ? new Date(kta["Endet am"][0].timestamp * 1000)
        : new Date(0)
    ]
  }));
