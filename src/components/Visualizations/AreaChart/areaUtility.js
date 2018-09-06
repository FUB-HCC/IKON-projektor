export const getInstitutions = (projects) => {
  let institutions = []
  for (let prop in projects) {
    let index = -1
    for (let i = 0; i < institutions.length; i++) {
      if (institutions[i].name === projects[prop].geldgeber) {
        index = i
        break
      }
    } // checked if geldgeber is already in institutions array

    if (index > -1) {
      institutions[index].projects.push(Object.assign({id: prop}, projects[prop]))
      institutions[index].numberProjects = institutions[index].projects.length
    } else if (index === -1) {
      institutions.push({
        name: projects[prop].geldgeber,
        projects: [Object.assign({id: prop}, projects[prop])],
        pos: projects[prop].pos,
        coordinates: [projects[prop].pos.long, projects[prop].pos.lat],
        numberProjects: 1
      })
    }

    // TODO do the same for kooperationspartner
  }
  return institutions
}

export const getAllResearchAreas = (projects) => {
  let researchAreas = []
  for (let prop in projects) {
    for (let forschungsregion of projects[prop].forschungsregion) {
      let index = -1
      for (let area in researchAreas) {
        if (researchAreas[area].forschungsregion === forschungsregion) {
          index = area
        }
      }

      if (index === -1) {
        researchAreas.push({forschungsregion: forschungsregion, projects: [projects[prop]]})
      } else {
        researchAreas[index].projects.push(projects[prop])
      }
    }
  }

  return researchAreas
}
