export const getAllInstitutions = (institutionsData, projects) => {
  let institutions = []

  institutionsData.forEach(institution => {
    let newInstitution = {
      name: institution.name,
      projects: [],
      id: institution.institution_id,
      pos: institution.loc,
      coordinates: [institution.loc.lng, institution.loc.lat],
      numberProjects: 0
    }

    for (let prop in projects) {
      let project = projects[prop]
      if (project.institution_id === newInstitution.id) {
        newInstitution.projects.push(project)
        newInstitution.numberProjects = newInstitution.numberProjects + 1
      } else {
        project.cooperating_institutions.forEach(cooperatingInstitutionId => {
          if (cooperatingInstitutionId === newInstitution.id) {
            newInstitution.projects.push(project)
            newInstitution.numberProjects = newInstitution.numberProjects + 1
          }
        })
      }
    }

    if (newInstitution.numberProjects > 0) institutions.push(newInstitution)
  })

  console.log(institutions)
  return institutions
}

export const getResearchAreasForInstitutions = (institutions, projects) => {
  let projectsOfSelectedInstitutions = []
  for (let i in projects) {
    let project = projects[i]
    institutions.forEach(institution => {
      if (project.institution_id === institution.id && projectsOfSelectedInstitutions.indexOf(project) === -1) {
        projectsOfSelectedInstitutions.push(project)
      } else {
        project.cooperating_institutions.forEach(cooperatingInstitutionId => {
          if (cooperatingInstitutionId === institution.id && projectsOfSelectedInstitutions.indexOf(project) === -1) {
            projectsOfSelectedInstitutions.push(project)
          }
        })
      }
    })
  }
  return getAllResearchAreas(projectsOfSelectedInstitutions)
}

export const getAllResearchAreas = (projects) => {
  let researchAreas = []
  for (let prop in projects) {
    for (let region of projects[prop].region) {
      let index = -1
      for (let area in researchAreas) {
        if (researchAreas[area].forschungsregion === region) {
          index = area
        }
      }

      if (index === -1) {
        researchAreas.push({forschungsregion: region, projects: [projects[prop]]})
      } else {
        researchAreas[index].projects.push(projects[prop])
      }
    }
  }
  console.log(researchAreas)
  return researchAreas
}
