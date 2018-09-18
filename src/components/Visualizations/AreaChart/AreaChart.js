import React, {Component} from 'react'
import {get} from 'axios'
import {feature} from 'topojson-client'
import * as parse from 'csv-parse'
/** import {connect} from 'react-redux' */
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Marker,
  Markers,
  Lines,
  Line
} from './ReactSimpleMaps'
import {getCenterOfBounds} from 'geolib'
import {Motion, spring} from 'react-motion'
import {getInstitutions, getAllResearchAreas} from './areaUtility'
import classes from './AreaChart.css'
import CloseIcon from '../../../assets/Exit.svg'
import Hammer from 'react-hammerjs'

const RESEARCH_AREA_STR = 'Research Areas'
const INSTITUTIONS_STR = 'Institutions'

class AreaChart extends Component {
  constructor (props) {
    super(props)
    this.state = {
      zoom: 1,
      zoomOld: 1,
      center: [0, 20],
      geographyPaths: [],
      institutions: [],
      zoomableGroup: null,
      selectedMarker: null,
      regionsPaths: [],
      regionPathToRender: [],
      cities: [],
      projects: [],
      selectedProjectCurve: null,
      selectedProjectNode: null,
      projectCurves: [],
      width: props.width * 0.6,
      height: props.height * 0.6,
      margin: props.margin,
      projectsPopoverHidden: true,
      selectedDimension: RESEARCH_AREA_STR,
      allResearchAreas: []
    }
    this.loadPaths = this.loadPaths.bind(this)
    this.handleZoom = this.handleZoom.bind(this)
    this.handleCountryClick = this.handleCountryClick.bind(this)
    this.handleMarkerClick = this.handleMarkerClick.bind(this)
    this.handlerSrollMap = this.handlerSrollMap.bind(this)
    this.buildCurves = this.buildCurves.bind(this)
    this.handleMoveEnd = this.handleMoveEnd.bind(this)
    this.handleLineClick = this.handleLineClick.bind(this)
    this.closeProjectsModal = this.closeProjectsModal.bind(this)
    this.renderProjectsLines = this.renderProjectsLines.bind(this)
    this.handleProjectHoverIn = this.handleProjectHoverIn.bind(this)
    this.handleProjectHoverOut = this.handleProjectHoverOut.bind(this)

    this.renderProjectsPopover = this.renderProjectsPopover.bind(this)

    // The hover popover when hovering research areas
    this.renderProjectsHover = this.renderProjectsHover.bind(this)
    this.handleCountryMouseEnter = this.handleCountryMouseEnter.bind(this)
    this.handleCountryMouseLeave = this.handleCountryMouseLeave.bind(this)
    this.handleCountryMouseMove = this.handleCountryMouseMove.bind(this)

    // touch zoom handler:
    this.handlePinch = this.handlePinch.bind(this)
    this.handlePinchEnd = this.handlePinchEnd.bind(this)
    this.handlePinchStart = this.handlePinchStart.bind(this)
    this.changeDimension = this.changeDimension.bind(this)
  }

  updateData (data, width, height) {
    let allResearchAreas = getAllResearchAreas(data)
    this.setState({allResearchAreas: allResearchAreas, projects: data, width: width * 0.6, height: height * 0.6})
  }

  componentDidMount () {
    this.loadPaths()
    this.zoomableGroup.zoomableGroupNode.addEventListener('wheel', this.handlerSrollMap)
  }

  closeProjectsModal () {
    console.log('close projects modal')
    this.setState({projectsPopoverHidden: true})
  }

  changeDimension () {
    let allResearchRegions = []
    let allInstitutions = []
    if (this.state.selectedDimension === RESEARCH_AREA_STR) {
      allInstitutions = getInstitutions(this.state.projects)
    } else if (this.state.selectedDimension === INSTITUTIONS_STR) {
      allResearchRegions = getAllResearchAreas(this.state.projects)
    }
    this.setState({
      projectCurves: [],
      institutions: allInstitutions,
      allResearchAreas: allResearchRegions,
      selectedDimension: (this.state.selectedDimension === RESEARCH_AREA_STR ? INSTITUTIONS_STR : RESEARCH_AREA_STR)
    })
  }

  loadPaths () {
    get('./topo/world-110m-simplyfied.json').then(res => {
      let worldTopo = res
      if (res.status !== 200) return
      const world = worldTopo.data
      // Transform your paths with topojson however you want...
      const countries = feature(world, world.objects[Object.keys(world.objects)[0]]).features
      this.setState({geographyPaths: countries})
      this.zoomableGroup.zoomableGroupNode.addEventListener('wheel', this.handlerSrollMap)
    })

    // Data from here: https://github.com/curran/data/tree/gh-pages/geonames
    get('./topo/cities500000.csv').then(res => {
      parse(res.data, {columns: true}, (err, cities) => {
        if (err) {
          console.error(err)
        } else {
          let newCities = []
          cities.forEach(city => {
            city.coordinates = [city.longitude, city.latitude]
            newCities.push(city)
          })
          this.setState({cities: newCities})
        }
      })
    })

    let promises = []

    // TODO https://www.react-simple-maps.io/country-map-with-admin-units To learn how to convert shapefiles into
    // TODO topojson that can be used with react-simple-maps read How to convert and prepare TopoJSON files
    // TODO for interactive mapping with d3 on medium.
    promises.push(get('./topo/countries/germany/germany-states.json'))
    /* promises.push(get('./topo/countries/algeria/algeria-provinces.json'))
                                promises.push(get('./topo/countries/argentina/argentina-provinces.json'))
                                promises.push(get('./topo/countries/azerbaijan/azerbaijan-regions.json'))
                                promises.push(get('./topo/countries/belgium/benelux-countries.json'))
                                promises.push(get('./topo/countries/china/china-provinces.json'))
                                promises.push(get('./topo/countries/colombia/colombia-departments.json'))
                                promises.push(get('./topo/countries/czech-republic/czech-republic-regions.json'))
                                promises.push(get('./topo/countries/denmark/denmark-counties.json'))
                                promises.push(get('./topo/countries/finland/finland-regions.json'))
                                promises.push(get('./topo/countries/france/fr-departments.json'))
                                promises.push(get('./topo/countries/india/india-states.json'))
                                promises.push(get('./topo/countries/ireland/ireland-counties.json'))
                                promises.push(get('./topo/countries/italy/italy-regions.json'))
                                promises.push(get('./topo/countries/japan/jp-prefectures.json'))
                                promises.push(get('./topo/countries/liberia/liberia-districts.json'))
                                promises.push(get('./topo/countries/nepal/nepal-districts.json')) */
    // TODO check US and netherlands
    // promises.push(get('./topo/countries/netherlands/nl-gemeentegrenzen-2016.json'))
    /* promises.push(get('./topo/countries/new-zealand/new-zealand-districts.json'))
                                promises.push(get('./topo/countries/norway/norway-counties.json'))
                                promises.push(get('./topo/countries/pakistan/pakistan-districts.json'))
                                promises.push(get('./topo/countries/peru/peru-departments.json'))
                                promises.push(get('./topo/countries/philippines/philippines-provinces.json'))
                                promises.push(get('./topo/countries/poland/poland-provinces.json'))
                                promises.push(get('./topo/countries/portugal/portugal-districts.json'))
                                promises.push(get('./topo/countries/romania/romania-counties.json'))
                                promises.push(get('./topo/countries/south-africa/south-africa-provinces.json'))
                                promises.push(get('./topo/countries/spain/spain-province-with-canary-islands.json'))
                                promises.push(get('./topo/countries/sweden/sweden-counties.json'))
                                promises.push(get('./topo/countries/turkey/turkiye.json'))
                                promises.push(get('./topo/countries/united-arab-emirates/united-arab-emirates.json'))
                                promises.push(get('./topo/countries/united-kingdom/uk-counties.json'))
                                promises.push(get('./topo/countries/venezuela/venezuela-estados.json'))
                                promises.push(get('./topo/countries/united-states/lower-quality-20m/20m-US-congressional-districts-2015.json')) */

    Promise.all(promises).then(res => {
      if (res[0].status !== 200) return
      const regionsPaths = []
      for (let result of res) {
        let regionsTopo = result
        let region = regionsTopo.data
        // Transform your paths with topojson however you want...
        let regionPath = feature(region, region.objects[Object.keys(region.objects)[0]]).features
        for (let path of regionPath) {
          regionsPaths.push(path)
        }
      }

      this.setState({regionsPaths: regionsPaths})
    })
  }

  handleCountryClick (country) {
    this.setState({
      projectCurves: [],
      institutions: []
    })

    let researchArea = null
    let countryCoordinates = [Number(this.calculateGeometricCenter(country)[0]), Number(this.calculateGeometricCenter(country)[1])]
    let allInstitutions = getInstitutions(this.state.projects)
    for (let area of this.state.allResearchAreas) {
      if (area.forschungsregion === country.properties.ISO_A2) {
        researchArea = area
        break
      }
    }

    if (researchArea) {
      let newProjectCurves = []
      let relatedInstitutions = []
      for (let project of researchArea.projects) {
        for (let institution of allInstitutions) {
          if (institution.name === project.geldgeber) {
            let projectLine = {
              project: project,
              start: countryCoordinates,
              end: institution.coordinates,
              controlPoint: undefined
            }
            newProjectCurves.push(projectLine)
          }
          if (relatedInstitutions.indexOf(institution) === -1) relatedInstitutions.push(institution)
        }
      }

      this.setState({
        zoom: 1,
        center: countryCoordinates,
        projectCurves: newProjectCurves,
        zoomOld: 1,
        institutions: relatedInstitutions
      })
    }
  }

  handleLineClick (coordinates, mapsComponent, e) {
    this.props.onProjectClick({project: this.state.selectedProject}, 2)
  }

  handleProjectHoverIn (project) {
    this.setState({hoveredProject: project})
  }

  handleProjectHoverOut (project) {
    this.setState({hoveredProject: undefined})
  }

  handleMarkerClick (marker) {
    let newProjectCurves = []
    console.log(marker)

    for (let project of marker.projects) {
      for (let forschungsregionIso of project.forschungsregion) {
        let projectCurveIndex = -1
        for (let i = 0; i < newProjectCurves.length; i++) {
          if (newProjectCurves[i].forschungsregion === forschungsregionIso) {
            projectCurveIndex = i
            break
          }
        }
        if (projectCurveIndex > -1) {
          newProjectCurves[projectCurveIndex].projects.push(project)
          newProjectCurves[projectCurveIndex].numProjects = newProjectCurves[projectCurveIndex].numProjects + 1
        } else {
          newProjectCurves.push({forschungsregion: forschungsregionIso, projects: [project], numProjects: 1})
        }
      }
    }

    console.log(newProjectCurves)

    this.setState({
      zoom: 1,
      center: marker.coordinates,
      projectCurves: newProjectCurves,
      selectedMarker: marker,
      zoomOld: 1
    })
  }

  handlerSrollMap (scrollEvent) {
    if (scrollEvent.deltaY < 0) {
      if (this.state.zoom < 8) this.handleZoom(1.25)
    } else {
      if (this.state.zoom > 0.75) this.handleZoom(1 / 1.25)
    }
  }

  handleZoom (factor) {
    this.setState({
      zoom: this.state.zoom * factor
    })
    setTimeout(() => {
      this.setState({
        zoomOld: this.state.zoom
      })
    }, 1000)
    this.checkRegionToRender(this.state.center, this.state.zoom)
  }

  handlePinch (event) {
    let scale = ((event.scale))
    if (Math.abs(this.state.zoom - (this.state.zoomOld * scale)) > 0.01) {
      // console.log(Math.abs(this.state.zoom - (this.state.zoomOld * scale)))
      this.setState({zoom: this.state.zoomOld * scale})
    }
  }

  handlePinchEnd (event) {
    console.log('Pinch zoom end')
    this.setState({zoom: this.state.zoomOld * event.scale, zoomOld: this.state.zoomOld * event.scale})
    console.log({zoom: this.state.zoomOld * event.scale, zoomOld: this.state.zoomOld * event.scale})
  }

  handlePinchStart (event) {
    console.log('Pinch zoom start')
    this.setState({zoomOld: this.state.zoom})
  }

  handleMoveStart (currentCenter) {
    console.log('New center: ', currentCenter)
  }

  handleMoveEnd (newCenter) {
    this.setState({center: [newCenter[0], newCenter[1]]})
    console.log('New center: ', newCenter)
    this.checkRegionToRender(newCenter, this.state.zoom)
  }

  checkRegionToRender (center, zoom) {
    // calculate geometric center of single countries
    for (let geographyPath of this.state.geographyPaths) {
      let long = 0
      let lat = 0
      let numberCoordinates = 0
      for (let coordinateArray of geographyPath.geometry.coordinates) {
        for (let coordinate of coordinateArray) {
          long += coordinate[0]
          lat += coordinate[1]
          numberCoordinates++
        }
      }

      long = long / numberCoordinates
      lat = lat / numberCoordinates

      // TODO only show country states when zoomed close to a country
      /* if (Math.abs(long - center[0]) < zoom && Math.abs(lat - center[1]) < zoom) {
                                                  console.log(geographyPath)
                                                  console.log(`${geographyPath.properties.NAME} Long: ${long} Lat: ${lat}`)
                                                  for (let regionPath of this.state.regionsPaths) {
                                                    if (regionPath[0].properties.ISO === geographyPath.properties.ISO_A2) {
                                                      this.setState({regionPathToRender: regionPath})
                                                    }
                                                  }
                                                } */
    }
    // console.log(this.state.regionsPaths)
    // console.log(`center: ${center}`)
    // console.log(`zoom: ${zoom}`)
  }

  calculateGeometricCenter (geographyPath) {
    let allCoordinateArray = [...geographyPath.geometry.coordinates]
    let depth = 0
    if (allCoordinateArray[0] instanceof Array) depth = 1
    if (allCoordinateArray[0] && allCoordinateArray[0][0] instanceof Array) depth = 2
    if (allCoordinateArray[0] && allCoordinateArray[0][0] && allCoordinateArray[0][0][0] instanceof Array) depth = 3
    if (allCoordinateArray[0] && allCoordinateArray[0][0] && allCoordinateArray[0][0][0] && allCoordinateArray[0][0][0][0] instanceof Array) depth = 4
    depth--
    let i = 0
    while (i < depth) {
      allCoordinateArray = [].concat(...allCoordinateArray)
      i++
    }
    let processedArray = []
    allCoordinateArray.forEach(value => {
      processedArray.push({latitude: value[1], longitude: value[0]})
    })

    // Start: Workaround for some countries
    if (geographyPath.properties.ISO_A2 === 'RU') {
      processedArray = [{latitude: 61.068917, longitude: -266.885585}]
    } else if (geographyPath.properties.ISO_A2 === 'US') {
      processedArray = [{latitude: 38.659778, longitude: -99.414548}]
    }
    // End: Workaround

    let center = getCenterOfBounds(processedArray)
    return [center.longitude, center.latitude]
  }

  buildCurves (start, end, line) {
    let controlPoint = this.calculateControlPoint(start, end, line.index)

    let newProjectCurves = []
    let changed = false
    for (let projectCurve of this.state.projectCurves) {
      if (!projectCurve.controlPoint && projectCurve.project.id === line.projectCurve.project.id) {
        let x = Math.pow(1 - 0.5, 2) * start[0] + 2 * (1 - 0.5) * 0.5 * controlPoint[0] + Math.pow(0.5, 2) * end[0]
        let y = Math.pow(1 - 0.5, 2) * start[1] + 2 * (1 - 0.5) * 0.5 * controlPoint[1] + Math.pow(0.5, 2) * end[1]
        projectCurve.controlPoint = [x, y]
        projectCurve = Object.assign({controlPoint: [x, y]}, projectCurve)
        changed = true
      }
      newProjectCurves.push(projectCurve)
    }
    setTimeout(() => { // TODO: a state change should not be done in a render method
      if (changed) this.setState({projectCurves: newProjectCurves})
    }, 1)

    return `M ${start.join(' ')} Q ${controlPoint.join(' ')}, ${end.join(' ')}`
  }

  calculateControlPoint (start, end, index) {
    const m = (start[1] - end[1]) / (start[0] - end[0])
    const mOrtho = -(1 / m)
    const midpoint = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2]
    const b = midpoint[1] - (mOrtho * midpoint[0])

    const offset = (index % 2 === 0 ? 1 : -1)
    let xControl = midpoint[0] + offset * 1.5
    let yControl = mOrtho * xControl + b
    let controlPoint = [xControl, yControl]
    let distance = Math.sqrt(Math.pow(controlPoint[0] - midpoint[0], 2) + Math.pow(controlPoint[1] - midpoint[1], 2))
    // TODO this is not efficient: evaluate if it leads to performance problems
    let iteration = 0
    while (distance < 18 * index) {
      xControl = midpoint[0] + offset * iteration
      iteration++
      yControl = mOrtho * xControl + b
      controlPoint = [xControl, yControl]
      distance = Math.sqrt(Math.pow(controlPoint[0] - midpoint[0], 2) + Math.pow(controlPoint[1] - midpoint[1], 2))
    }
    return controlPoint
  }

  renderProjectsLines (projectCurve, i) {
    let strokeWidth = 2 / Math.pow(this.state.zoom, 1 / 4)
    let color = 'rgba(78, 0, 80, 0.72)'
    if (this.state.hoveredProject === projectCurve.project) {
      color = '#4b9123'
    }

    return <Line
      key={`project-line-${i}`}
      onClick={(line, coordinates, e) => {
        this.setState({selectedProject: projectCurve.project}, () => {
          this.handleLineClick(coordinates, line, e)
        })
      }}
      onMouseEnter={(line, event) => { this.handleProjectHoverIn(projectCurve.project) }}
      onMouseLeave={(line, event) => { this.handleProjectHoverOut(projectCurve.project) }}
      line={{
        coordinates: {
          start: projectCurve.start,
          end: projectCurve.end
        },
        projectCurve: projectCurve,
        index: i
      }}
      buildPath={this.buildCurves}
      preserveMarkerAspect={false}
      style={{
        default: {
          fill: 'rgba(255, 255, 255, 0)',
          stroke: color,
          strokeWidth: strokeWidth,
          cursor: 'pointer',
          pointerEvents: 'stroke'
        },
        hover: {
          fill: 'rgba(255, 255, 255, 0)',
          stroke: '#4b9123',
          strokeWidth: strokeWidth,
          cursor: 'pointer',
          pointerEvents: 'stroke'
        },
        pressed: {
          fill: 'rgba(255, 255, 255, 0)',
          stroke: '#4b9123',
          strokeWidth: strokeWidth,
          cursor: 'pointer',
          pointerEvents: 'stroke'
        }
      }}
    />
  }

  renderProjectsPopover () {
    let selectedProjectCurve = this.state.selectedProjectCurve
    return !this.state.projectsPopoverHidden && <div className={classes.popover_body} style={{
      width: this.state.width * 0.56,
      height: this.state.height * 0.75
    }}>
      <h2 className={classes.projects_headline}>Projects</h2>
      <div className={classes.closebutton}
        style={{height: 0.8 * this.state.height / 12, width: 0.8 * this.state.height / 12}}><img
          src={CloseIcon} onClick={this.closeProjectsModal}/></div>
      <ol className={classes.projects_list} style={{
        height: (this.state.height * 0.65) + 'px'
      }}>
        {selectedProjectCurve.projects.map((project, i) => {
          return <li onClick={event => {
            this.setState({projectsPopoverHidden: true})
            this.props.onProjectClick({project: project}, 2)
          }} key={`project-list-link-${project.id}-${i}`}
          className={classes.projects_list_item}>{`${project.titel} (${project.id})`}</li>
        })}
      </ol>
    </div>
  }

  handleCountryMouseEnter (geography, evt) {
    this.setState({hoveredGeometry: geography})
  }

  handleCountryMouseMove (geography, evt) {
    this.setState({hoveredGeometry: geography, mouseLocation: [evt.nativeEvent.clientX, evt.nativeEvent.clientY]})
  }

  handleCountryMouseLeave (geography, evt) {
    this.setState({hoveredGeometry: undefined, mouseLocation: undefined})
  }

  renderProjectsHover () {
    let hoveredGeometry = this.state.hoveredGeometry
    let researchArea = null
    this.state.allResearchAreas.forEach(iterateResearchArea => {
      if (this.state.mouseLocation && hoveredGeometry && iterateResearchArea.forschungsregion === hoveredGeometry.properties.ISO_A2) {
        researchArea = iterateResearchArea
      }
    })

    return researchArea && <div className={classes.popover_body} style={{
      width: `30em`, // TODO dynamically style width
      height: `10em`, // TODO dynamically style height
      margin: `1.5em`,
      position: 'absolute',
      left: this.state.mouseLocation[0] + 'px',
      top: this.state.mouseLocation[1] + 'px'
    }}>
      <h2 className={classes.projects_headline}>Area: {hoveredGeometry.properties.NAME}</h2>
      <p className={classes.projects_list}>
                Number of projects in this research area: {researchArea.projects.length} <br/>
                Anzahl Themen:
                Das prominenteste Thema:
                Top Institution/ Partner:
      </p>
    </div>
  }

  render () {
    return (
      <Hammer onPinch={this.handlePinch} onPinchEnd={this.handlePinchEnd} onPinchStart={this.handlePinchStart}
        options={{
          recognizers: {
            pinch: {enable: true, pointers: 2, threshold: 0.005}
          }
        }}>

        <div style={{
          width: this.state.width,
          height: this.state.height,
          // maxWidth: 980,
          margin: '0 auto',
          fontFamily: 'Roboto, sans-serif'
        }}>

          <div style={{position: 'absolute', marginTop: this.state.height - 200}}>
            <button style={{marginLeft: '0.5em'}} className={[classes.zoombutton, classes.in].join(' ')}
              onClick={() => this.handleZoom(1.25)}>{'+'}</button>
            <button style={{marginLeft: '0.5em'}} className={[classes.zoombutton, classes.out].join(' ')}
              onClick={() => this.handleZoom(1 / 1.25)}>{'-'}</button>

            <div style={{position: 'absolute', marginTop: '6.5em'}}>
              <input className={[classes.tgl, classes['tgl-light']].join(' ')} id="cb1" type="checkbox"
                onClick={this.changeDimension}/>
              <label className={classes['tgl-btn']} htmlFor="cb1"></label>
              <h4>{this.state.selectedDimension}</h4>
            </div>
          </div>

          <Motion
            defaultStyle={{
              zoom: this.state.zoom,
              x: 0,
              y: 20
            }}
            style={{
              zoom: spring(this.state.zoom, {stiffness: 170, damping: 26}),
              // zoom: this.state.zoom,
              // x: spring(this.state.center[0], {stiffness: 210, damping: 20}),
              // y: spring(this.state.center[1], {stiffness: 210, damping: 20})
              x: this.state.center[0],
              y: this.state.center[1]
            }}
          >
            {({zoom, x, y}) => (
              <ComposableMap
                projectionConfig={{
                  scale: 205,
                  rotation: [0, 0, 0]
                }}
                width={this.state.width}
                height={this.state.height}
                style={{
                  width: '100%',
                  height: 'auto'
                }}
              >
                <ZoomableGroup
                  onMoveStart={this.handleMoveStart}
                  onMoveEnd={this.handleMoveEnd}
                  onwheel={this.handlerSrollMap}
                  disablePanning={false}
                  ref={(node) => {
                    this.zoomableGroup = node
                  }}
                  center={[x, y]}
                  zoom={zoom}>
                  <Geographies geography={this.state.geographyPaths} disableOptimization>
                    {(geographies, projection) =>
                      geographies.map((geography, i) => {
                        let fillColor = '#ECEFF1'
                        let fillColorHover = fillColor
                        let isResearchArea = false
                        for (let area of this.state.allResearchAreas) {
                          if (area.forschungsregion === geography.properties.ISO_A2) {
                            isResearchArea = true
                            fillColor = '#7ba3b3'
                            fillColorHover = '#698d9b'
                            break
                          }
                        }

                        return <Geography
                          key={`${geography.properties.ISO_A2}-${i}`}
                          cacheId={`path-${geography.properties.ISO_A2}-${i}`}
                          onClick={this.handleCountryClick}
                          onMouseEnter={(geography, event) => {
                            if (isResearchArea) {
                              this.handleCountryMouseEnter(geography, event)
                            }
                          }}
                          onMouseMove={(geography, event) => {
                            if (isResearchArea) {
                              this.handleCountryMouseMove(geography, event)
                            }
                          }}
                          onMouseLeave={(geography, event) => {
                            if (isResearchArea) {
                              this.handleCountryMouseLeave(geography, event)
                            }
                          }}
                          round
                          geography={geography}
                          projection={projection}
                          style={{
                            default: {
                              fill: fillColor,
                              stroke: '#607D8B',
                              strokeWidth: 0.75,
                              outline: 'none',
                              cursor: (isResearchArea ? 'pointer' : 'default'),
                              pointerEvents: 'fill'
                            },
                            hover: {
                              fill: fillColorHover,
                              stroke: '#607D8B',
                              strokeWidth: 0.75,
                              outline: 'none',
                              cursor: (isResearchArea ? 'pointer' : 'default'),
                              pointerEvents: 'fill'
                            },
                            pressed: {
                              fill: fillColorHover,
                              stroke: '#607D8B',
                              strokeWidth: 0.75,
                              outline: 'none',
                              cursor: (isResearchArea ? 'pointer' : 'default'),
                              pointerEvents: 'fill'
                            }
                          }}
                        />
                      }
                      )}
                  </Geographies>
                  <Geographies key={'test'} geography={this.state.regionsPaths} disableOptimization>
                    {(geographies, projection) =>
                      geographies.map((geography, i) =>
                        <Geography
                          key={`region-${geography.properties.ADM0_A3}-${i}`}
                          cacheId={`region-path-${geography.properties.ADM0_A3}-${i}`}
                          round
                          geography={geography}
                          projection={projection}
                          style={{
                            default: {
                              fill: '#ECEFF1',
                              stroke: '#607D8B',
                              strokeWidth: 0.2,
                              outline: 'none'
                            },
                            hover: {
                              fill: '#ECEFF1',
                              stroke: '#607D8B',
                              strokeWidth: 0.2,
                              outline: 'none'
                            },
                            pressed: {
                              fill: '#ECEFF1',
                              stroke: '#607D8B',
                              strokeWidth: 0.2,
                              outline: 'none'
                            }
                          }}
                        />
                      )}
                  </Geographies>
                  <Geographies geography={this.state.geographyPaths} disableOptimization>
                    {(geographies, projection) =>
                      geographies.map((geography, i) => {
                        let included = false
                        for (let projectCurve of this.state.projectCurves) {
                          if (projectCurve.forschungsregion === geography.properties.ISO_A2) {
                            included = true
                            break
                          }
                        }

                        return included && (
                          <Geography
                            key={`include-${geography.properties.ADM0_A3}-${i}`}
                            cacheId={`include-${geography.properties.ADM0_A3}-${i}`}
                            onClick={this.handleCountryClick}
                            round
                            geography={geography}
                            projection={projection}
                            style={{
                              default: {
                                fill: '#91403c',
                                stroke: '#607D8B',
                                strokeWidth: 0.75,
                                outline: 'none'
                              }
                            }}
                          />
                        )
                      })
                    }
                  </Geographies>
                  <Markers>
                    {
                      this.state.cities.map((city, i) => {
                        if (city.population < 5000000 / this.state.zoomOld || this.state.zoomOld < 2.5 || Math.abs(this.state.center[0] - city.coordinates[0]) > 60 || Math.abs(this.state.center[1] - city.coordinates[1]) > 45) return null
                        // console.log(city.coordinates)
                        // console.log(this.state.center)
                        let radius = 1
                        if (city.population > 500000) radius = 2
                        if (city.population > 1000000) radius = 3.25
                        if (city.population > 2500000) radius = 4
                        if (city.population > 5000000) radius = 5
                        if (city.population > 7500000) radius = 6
                        if (city.population > 10000000) radius = 7
                        return <Marker
                          key={`city-marker-${i}`}
                          marker={city}
                          onClick={(e) => {
                            console.log(e)
                          }}
                          style={{
                            default: {
                              fill: '#505050',
                              stroke: '#242424'
                            },
                            hover: {
                              fill: '#505050',
                              stroke: '#242424'
                            },
                            pressed: {
                              fill: '#505050',
                              stroke: '#242424'
                            }
                          }}>
                          <circle cx={0} cy={0}
                            r={(1 + (0.25 * (this.state.zoom - 1))) * radius}/>
                        </Marker>
                      }
                      )}
                  </Markers>

                  <Lines>
                    {
                      this.state.projectCurves.map((projectCurve, i) => {
                        return this.renderProjectsLines(projectCurve, i)
                      })
                    }
                  </Lines>
                  <Markers>
                    {
                      this.state.projectCurves.map((projectCurve, i) => {
                        let markerFillColor = '#cc3540'
                        if (this.state.hoveredProject === projectCurve.project) {
                          markerFillColor = '#4b9123'
                        }
                        if (projectCurve.controlPoint) {
                          let projectMarker = {
                            coordinates: projectCurve.controlPoint,
                            projectCurve: projectCurve
                          }
                          return <Marker
                            key={`controlPoint-marker-${i}`}
                            marker={projectMarker}
                            onClick={(marker, coordinates, e) => {
                              this.setState({selectedProject: projectCurve.project}, () => {
                                this.handleLineClick(coordinates, marker, e)
                              })
                            }}
                            onMouseEnter={(marker, event) => { this.handleProjectHoverIn(projectCurve.project) }}
                            onMouseLeave={(marker, event) => { this.handleProjectHoverOut(projectCurve.project) }}
                            preventTranslation={true}
                            preserveMarkerAspect={false}
                            style={{
                              default: {
                                fill: markerFillColor,
                                stroke: '#FFFFFF',
                                cursor: 'pointer'
                              },
                              hover: {
                                fill: '#4b9123',
                                stroke: '#2e2e2e',
                                cursor: 'pointer'
                              },
                              pressed: {
                                fill: '#918c45',
                                stroke: '#2e2e2e'
                              }
                            }}>
                            <circle cx={0} cy={0}
                              r={7}/>
                          </Marker>
                        }
                      }
                      )}
                  </Markers>

                  <Markers>
                    {
                      this.state.institutions.map((institution, i) => {
                        let markerFillColor = 'rgba(255,87,34,0.8)'
                        if (this.state.selectedMarker && this.state.selectedMarker.name === institution.name) markerFillColor = '#4b9123'
                        return <Marker
                          key={`institution-marker-${i}`}
                          marker={institution}
                          // onClick={this.handleMarkerClick}
                          preserveMarkerAspect={false}
                          style={{
                            default: {
                              fill: markerFillColor,
                              stroke: '#FFFFFF',
                              cursor: 'pointer'
                            },
                            hover: {
                              fill: '#4b9123',
                              stroke: '#2e2e2e',
                              cursor: 'pointer'
                            },
                            pressed: {
                              fill: '#918c45',
                              stroke: '#2e2e2e'
                            }
                          }}>
                          <circle cx={0} cy={0}
                            r={8}/>
                        </Marker>
                      }
                      )}
                  </Markers>
                </ZoomableGroup>
              </ComposableMap>
            )}
          </Motion>

          {this.renderProjectsPopover()}

          {this.renderProjectsHover()}
        </div>
      </Hammer>
    )
  }
}

// If this argument is specified, the new component will subscribe to Redux store updates.
// This means that any time the store is updated, mapStateToProps will be called.
// The results of mapStateToProps must be a plain object, which will be merged into the component’s props.
// If you don't want to subscribe to store updates, pass null or undefined in place of mapStateToProps
/** const mapStateToProps = (state, ownProps) => {
  console.log(state) // state
  console.log(ownProps) // undefined
  return {
    test1: 'test1'
  }
} */

// it will be given dispatch as the first parameter. It’s up to you to return an object that somehow
// uses dispatch to bind action creators in your own way. (Tip: you may use the bindActionCreators() helper from Redux.)
// If your mapDispatchToProps function is declared as taking two parameters, it will be called with dispatch as
// the first parameter and the props passed to the connected component as the second parameter, and will be re-invoked
// whenever the connected component receives new props. (The second parameter is normally referred to as ownProps by convention.)
/** const mapDispatchToProps = dispatch => {
  return {
     activatePopover: (value, vis) => dispatch(actions.activatePopover(value, vis)),
     deactivatePopover: () => dispatch(actions.deactivatePopover()),
  }
} */

// Connects a React component to a Redux store. It does not modify the component class
// passed to it; instead, it returns a new, connected component class for you to use.
// export default connect(mapStateToProps, mapDispatchToProps)(AreaChart)
/** export default connect(mapStateToProps, mapDispatchToProps)(AreaChart) */
export default AreaChart
