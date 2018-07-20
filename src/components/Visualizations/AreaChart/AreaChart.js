import React, {Component} from 'react'
import {get} from 'axios'
import {feature} from 'topojson-client'
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Marker,
  Markers,
  Lines,
  Line
} from 'react-simple-maps'
import { Motion, spring } from 'react-motion'

const wrapperStyles = {
  width: '100%',
  // maxWidth: 980,
  margin: '0 auto',
  fontFamily: 'Roboto, sans-serif'
}
const sampleInstitutes = [
  {name: 'Tokyo',
    coordinates: [139.6917, 35.6895],
    numberProjects: 378,
    researchAreas: [ // Country codes as ISO_A3
      {area: 'RUS', number: 100},
      {area: 'STP', number: 100},
      {area: 'EGY', number: 50},
      {area: 'SOM', number: 50},
      {area: 'CAF', number: 78}
    ]},
  {name: 'Jakarta', coordinates: [106.8650, -6.1751], numberProjects: 305},
  {name: 'Delhi', coordinates: [77.1025, 28.7041], numberProjects: 249},
  {name: 'Manila', coordinates: [120.9842, 14.5995], numberProjects: 241},
  {name: 'Seoul', coordinates: [126.9780, 37.5665], numberProjects: 234},
  {name: 'Shanghai', coordinates: [121.4737, 31.2304], numberProjects: 234},
  {name: 'Karachi', coordinates: [67.0099, 24.8615], numberProjects: 221},
  {name: 'Beijing', coordinates: [116.4074, 39.9042], numberProjects: 210},
  {name: 'New York', coordinates: [-74.0059, 40.7128], numberProjects: 206},
  {name: 'Guangzhou', coordinates: [113.2644, 23.1291], numberProjects: 205},
  {name: 'Sao Paulo', coordinates: [-46.6333, -23.5505], numberProjects: 203},
  {name: 'Mexico City', coordinates: [-99.1332, 19.4326], numberProjects: 200},
  {name: 'Mumbai', coordinates: [72.8777, 19.0760], numberProjects: 177},
  {name: 'Osaka', coordinates: [135.5022, 34.6937], numberProjects: 174},
  {name: 'Moscow', coordinates: [37.6173, 55.7558], numberProjects: 161},
  {name: 'Dhaka', coordinates: [90.4125, 23.8103], numberProjects: 156},
  {name: 'Greater Cairo', coordinates: [31.2357, 30.0444], numberProjects: 156},
  {name: 'Los Angeles', coordinates: [-118.2437, 34.0522], numberProjects: 150},
  {name: 'Bangkok', coordinates: [100.5018, 13.7563], numberProjects: 149},
  {name: 'Kolkata', coordinates: [88.3639, 22.5726], numberProjects: 146},
  {name: 'Buenos Aires', coordinates: [-58.3816, -34.6037], numberProjects: 141},
  {name: 'Tehran', coordinates: [51.3890, 35.6892], numberProjects: 135},
  {name: 'Istanbul', coordinates: [28.9784, 41.0082], numberProjects: 132},
  {name: 'Lagos', coordinates: [3.3792, 6.5244], numberProjects: 131},
  {name: 'Shenzhen', coordinates: [114.0579, 22.5431], numberProjects: 120},
  {name: 'Rio de Janeiro', coordinates: [-43.1729, -22.9068], numberProjects: 117},
  {name: 'Kinshasa', coordinates: [15.2663, -4.4419], numberProjects: 115},
  {name: 'Tianjin', coordinates: [117.3616, 39.3434], numberProjects: 109},
  {name: 'Paris', coordinates: [2.3522, 48.8566], numberProjects: 108},
  {name: 'Lima', coordinates: [-77.0428, -12.0464], numberProjects: 107}
]

class AreaChart extends Component {
  constructor () {
    super()
    this.state = {
      zoom: 1,
      center: [0, 20],
      geographyPaths: [],
      institutions: [],
      zoomableGroup: null,
      includedAreas: [],
      selectedMarker: null,
      regionsPaths: [],
      regionPathToRender: []
    }
    this.loadPaths = this.loadPaths.bind(this)
    this.handleZoom = this.handleZoom.bind(this)
    this.handleCountryClick = this.handleCountryClick.bind(this)
    this.handleMarkerClick = this.handleMarkerClick.bind(this)
    this.handlerSrollMap = this.handlerSrollMap.bind(this)
    this.buildCurves = this.buildCurves.bind(this)
    this.handleMoveEnd = this.handleMoveEnd.bind(this)
  }

  updateData () {

  }

  componentDidMount () {
    this.loadPaths()
    this.zoomableGroup.zoomableGroupNode.addEventListener('wheel', this.handlerSrollMap)
  }

  loadPaths () {
    get('./topo/world-110m-simplyfied.json').then(res => {
      let worldTopo = res
      if (res.status !== 200) return
      const world = worldTopo.data
      // Transform your paths with topojson however you want...
      const countries = feature(world, world.objects[Object.keys(world.objects)[0]]).features
      this.setState({geographyPaths: countries, institutions: sampleInstitutes})
      this.zoomableGroup.zoomableGroupNode.addEventListener('wheel', this.handlerSrollMap)
    })

    let promises = []
    // TODO check US and netherlands
    promises.push(get('./topo/countries/germany/dach-states.json'))
    promises.push(get('./topo/countries/algeria/algeria-provinces.json'))
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
    promises.push(get('./topo/countries/nepal/nepal-districts.json'))
    // promises.push(get('./topo/countries/netherlands/nl-gemeentegrenzen-2016.json'))
    promises.push(get('./topo/countries/new-zealand/new-zealand-districts.json'))
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
    promises.push(get('./topo/countries/united-states/lower-quality-20m/20m-US-congressional-districts-2015.json'))

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
    console.log('Clicked on country: ', country)
  }

  handleMarkerClick (marker) {
    let newIncludedAreas = []
    if (marker.researchAreas) {
      for (let researchArea of marker.researchAreas) {
        newIncludedAreas.push(researchArea.area)
      }
    }
    this.setState({
      zoom: 1.3,
      center: marker.coordinates,
      includedAreas: newIncludedAreas,
      selectedMarker: marker
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
    this.checkRegionToRender(this.state.center, this.state.zoom)
  }

  handleMoveStart (currentCenter) {
    console.log('New center: ', currentCenter)
  }

  handleMoveEnd (newCenter) {
    console.log('New center: ', newCenter)
    // TODO Fix center bug
    /* this.setState({
      center: [newCenter[0], newCenter[1]]
    }) */
    this.checkRegionToRender(newCenter, this.state.zoom)
  }

  checkRegionToRender (center, zoom) {
    // calculate grometric center of single countries
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
          if (regionPath[0].properties.ISO === geographyPath.properties.ISO_A3) {
            this.setState({regionPathToRender: regionPath})
          }
        }
      } */
    }
    // console.log(this.state.regionsPaths)
    // console.log(`center: ${center}`)
    // console.log(`zoom: ${zoom}`)
  }

  // This funtion returns a curve command that builds a quadratic curve.
  // And depending on the line's curveStyle property it curves in one direction or the other.
  buildCurves (start, end, line) {
    const x0 = start[0]
    const x1 = end[0]
    const y0 = start[1]
    const y1 = end[1]
    const curve = {
      forceUp: `${x1} ${y0}`,
      forceDown: `${x0} ${y1}`
    }[line.curveStyle]

    return `M ${start.join(' ')} Q ${curve} ${end.join(' ')}`
  }

  render () {
    return (
      <div style={wrapperStyles}>
        <button onClick={() => this.handleZoom(1.25)}>{'Zoom in'}</button>
        <button onClick={() => this.handleZoom(1 / 1.25)}>{'Zoom out'}</button>

        <Motion
          defaultStyle={{
            zoom: 1,
            x: 0,
            y: 20
          }}
          style={{
            zoom: spring(this.state.zoom, {stiffness: 210, damping: 20}),
            x: spring(this.state.center[0], {stiffness: 210, damping: 20}),
            y: spring(this.state.center[1], {stiffness: 210, damping: 20})
          }}
        >
          {({zoom, x, y}) => (
            <ComposableMap
              projectionConfig={{
                scale: 205,
                rotation: [0, 0, 0]
              }}
              width={980}
              height={551}
              style={{
                width: '100%',
                height: 'auto'
              }}
            >
              <ZoomableGroup
                onMoveStart={this.handleMoveStart}
                onMoveEnd={this.handleMoveEnd}
                onwheel={this.handlerSrollMap}
                ref={(node) => { this.zoomableGroup = node }}
                center={[x, y]}
                zoom={zoom}>
                <Geographies geography={this.state.geographyPaths} disableOptimization>
                  {(geographies, projection) =>
                    geographies.map((geography, i) =>
                      <Geography
                        key={`${geography.properties.ADM0_A3}-${i}`}
                        cacheId={`path-${geography.properties.ADM0_A3}-${i}`}
                        onClick={this.handleCountryClick}
                        round
                        geography={geography}
                        projection={projection}
                        style={{
                          default: {
                            fill: '#ECEFF1',
                            stroke: '#607D8B',
                            strokeWidth: 0.75,
                            outline: 'none'
                          },
                          hover: {
                            fill: '#607D8B',
                            stroke: '#607D8B',
                            strokeWidth: 0.75,
                            outline: 'none'
                          },
                          pressed: {
                            fill: '#ff418b',
                            stroke: '#607D8B',
                            strokeWidth: 0.75,
                            outline: 'none'
                          }
                        }}
                      />
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
                            fill: '#607D8B',
                            stroke: '#607D8B',
                            strokeWidth: 0.2,
                            outline: 'none'
                          },
                          pressed: {
                            fill: '#ff418b',
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
                      return this.state.includedAreas.indexOf(geography.properties.ISO_A3) !== -1 && (
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
                    this.state.institutions.map((institution, i) => {
                      let markerFillColor = 'rgba(255,87,34,0.8)'
                      if (this.state.selectedMarker && this.state.selectedMarker.name === institution.name) markerFillColor = '#4b9123'
                      return <Marker
                        key={`institution-marker-${i}`}
                        marker={institution}
                        onClick={this.handleMarkerClick}
                        style={{
                          default: {
                            fill: markerFillColor,
                            stroke: '#FFFFFF'
                          },
                          hover: {
                            fill: '#4b9123',
                            stroke: '#2e2e2e'
                          },
                          pressed: {
                            fill: '#918c45',
                            stroke: '#2e2e2e'
                          }
                        }}>
                        <circle cx={0} cy={0} r={this.state.zoom * institution.numberProjects / 30}/>
                      </Marker>
                    }
                    )}
                </Markers>
                <Lines>
                  <Line
                    line={{
                      coordinates: {
                        start: [0, 0],
                        end: [-99.1, 19.4]
                      }
                    }}
                    buildPath={this.buildCurves}
                  />
                </Lines>
              </ZoomableGroup>
            </ComposableMap>
          )}
        </Motion>
      </div>
    )
  }
}

export default AreaChart
