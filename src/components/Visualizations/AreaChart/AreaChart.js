import React, {Component} from 'react'
import {get} from 'axios'
import {feature} from 'topojson-client'
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Marker,
  Markers
} from 'react-simple-maps'

const wrapperStyles = {
  width: '100%',
  // maxWidth: 980,
  margin: '0 auto',
  fontFamily: 'Roboto, sans-serif'
}
const sampleData = [
  {name: 'Tokyo', coordinates: [139.6917, 35.6895], numberProjects: 37843000},
  {name: 'Jakarta', coordinates: [106.8650, -6.1751], numberProjects: 30539000},
  {name: 'Delhi', coordinates: [77.1025, 28.7041], numberProjects: 24998000},
  {name: 'Manila', coordinates: [120.9842, 14.5995], numberProjects: 24123000},
  {name: 'Seoul', coordinates: [126.9780, 37.5665], numberProjects: 23480000},
  {name: 'Shanghai', coordinates: [121.4737, 31.2304], numberProjects: 23416000},
  {name: 'Karachi', coordinates: [67.0099, 24.8615], numberProjects: 22123000},
  {name: 'Beijing', coordinates: [116.4074, 39.9042], numberProjects: 21009000},
  {name: 'New York', coordinates: [-74.0059, 40.7128], numberProjects: 20630000},
  {name: 'Guangzhou', coordinates: [113.2644, 23.1291], numberProjects: 20597000},
  {name: 'Sao Paulo', coordinates: [-46.6333, -23.5505], numberProjects: 20365000},
  {name: 'Mexico City', coordinates: [-99.1332, 19.4326], numberProjects: 20063000},
  {name: 'Mumbai', coordinates: [72.8777, 19.0760], numberProjects: 17712000},
  {name: 'Osaka', coordinates: [135.5022, 34.6937], numberProjects: 17444000},
  {name: 'Moscow', coordinates: [37.6173, 55.7558], numberProjects: 16170000},
  {name: 'Dhaka', coordinates: [90.4125, 23.8103], numberProjects: 15669000},
  {name: 'Greater Cairo', coordinates: [31.2357, 30.0444], numberProjects: 15600000},
  {name: 'Los Angeles', coordinates: [-118.2437, 34.0522], numberProjects: 15058000},
  {name: 'Bangkok', coordinates: [100.5018, 13.7563], numberProjects: 14998000},
  {name: 'Kolkata', coordinates: [88.3639, 22.5726], numberProjects: 14667000},
  {name: 'Buenos Aires', coordinates: [-58.3816, -34.6037], numberProjects: 14122000},
  {name: 'Tehran', coordinates: [51.3890, 35.6892], numberProjects: 13532000},
  {name: 'Istanbul', coordinates: [28.9784, 41.0082], numberProjects: 13287000},
  {name: 'Lagos', coordinates: [3.3792, 6.5244], numberProjects: 13123000},
  {name: 'Shenzhen', coordinates: [114.0579, 22.5431], numberProjects: 12084000},
  {name: 'Rio de Janeiro', coordinates: [-43.1729, -22.9068], numberProjects: 11727000},
  {name: 'Kinshasa', coordinates: [15.2663, -4.4419], numberProjects: 11587000},
  {name: 'Tianjin', coordinates: [117.3616, 39.3434], numberProjects: 10920000},
  {name: 'Paris', coordinates: [2.3522, 48.8566], numberProjects: 10858000},
  {name: 'Lima', coordinates: [-77.0428, -12.0464], numberProjects: 10750000}
]

class AreaChart extends Component {
  constructor () {
    super()
    this.state = {
      zoom: 1,
      geographyPaths: [],
      institutions: [],
      zoomableGroup: null
    }
    this.loadPaths = this.loadPaths.bind(this)
    this.handleZoom = this.handleZoom.bind(this)
    this.handleCountryClick = this.handleCountryClick.bind(this)
    this.handleMarkerClick = this.handleMarkerClick.bind(this)
    this.handlerSrollMap = this.handlerSrollMap.bind(this)
  }

  componentDidMount () {
    this.loadPaths()
  }

  loadPaths () {
    get('./topo/world-110m-simplyfied.json')
      .then(res => {
        if (res.status !== 200) return
        const world = res.data
        // Transform your paths with topojson however you want...
        const countries = feature(world, world.objects[Object.keys(world.objects)[0]]).features
        this.setState({geographyPaths: countries, institutions: sampleData})
        this.zoomableGroup.zoomableGroupNode.addEventListener('wheel', this.handlerSrollMap)
      })
  }

  handleCountryClick (countryIndex) {
    console.log('Clicked on country: ', countryIndex)
  }

  handleMarkerClick (markerIndex) {
    console.log('Marker: ', markerIndex)
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
  }

  handleMoveStart (currentCenter) {
    console.log('New center: ', currentCenter)
  }

  handleMoveEnd (newCenter) {
    console.log('New center: ', newCenter)
  }

  render () {
    return (
      <div style={wrapperStyles}>
        <button onClick={() => this.handleZoom(1.25)}>{'Zoom in'}</button>
        <button onClick={() => this.handleZoom(1 / 1.25)}>{'Zoom out'}</button>
        <hr/>
        <ComposableMap
          projectionConfig={{
            scale: 160,
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
            zoom={this.state.zoom}>
            <Geographies geography={this.state.geographyPaths} disableOptimization>
              {(geographies, projection) =>
                geographies.map((geography, i) =>
                  <Geography
                    key={`${geography.properties.ADM0_A3}-${i}`}
                    cacheId={`path-${geography.properties.ADM0_A3}-${i}`}
                    onClick={() => this.handleCountryClick(i)}
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
                        fill: '#FF5722',
                        stroke: '#607D8B',
                        strokeWidth: 0.75,
                        outline: 'none'
                      }
                    }}
                  />
                )}
            </Geographies>
            <Markers>
              {this.state.institutions.map((institution, i) =>
                <Marker
                  key={`institution-marker-${i}`}
                  marker={institution}
                  onClick={() => this.handleMarkerClick(i)}
                  style={{
                    default: {
                      fill: '#91403c',
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
                  <circle cx={0} cy={0} r={this.state.zoom * institution.numberProjects / 3000000}/>
                </Marker>
              )}
            </Markers>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    )
  }
}

export default AreaChart
