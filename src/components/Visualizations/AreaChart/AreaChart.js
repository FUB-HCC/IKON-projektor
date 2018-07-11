import React, { Component } from 'react'
import { geoMercator, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'

const sampleData = [
  { name: 'Tokyo', coordinates: [139.6917, 35.6895], numberProjects: 37843000 },
  { name: 'Jakarta', coordinates: [106.8650, -6.1751], numberProjects: 30539000 },
  { name: 'Delhi', coordinates: [77.1025, 28.7041], numberProjects: 24998000 },
  { name: 'Manila', coordinates: [120.9842, 14.5995], numberProjects: 24123000 },
  { name: 'Seoul', coordinates: [126.9780, 37.5665], numberProjects: 23480000 },
  { name: 'Shanghai', coordinates: [121.4737, 31.2304], numberProjects: 23416000 },
  { name: 'Karachi', coordinates: [67.0099, 24.8615], numberProjects: 22123000 },
  { name: 'Beijing', coordinates: [116.4074, 39.9042], numberProjects: 21009000 },
  { name: 'New York', coordinates: [-74.0059, 40.7128], numberProjects: 20630000 },
  { name: 'Guangzhou', coordinates: [113.2644, 23.1291], numberProjects: 20597000 },
  { name: 'Sao Paulo', coordinates: [-46.6333, -23.5505], numberProjects: 20365000 },
  { name: 'Mexico City', coordinates: [-99.1332, 19.4326], numberProjects: 20063000 },
  { name: 'Mumbai', coordinates: [72.8777, 19.0760], numberProjects: 17712000 },
  { name: 'Osaka', coordinates: [135.5022, 34.6937], numberProjects: 17444000 },
  { name: 'Moscow', coordinates: [37.6173, 55.7558], numberProjects: 16170000 },
  { name: 'Dhaka', coordinates: [90.4125, 23.8103], numberProjects: 15669000 },
  { name: 'Greater Cairo', coordinates: [31.2357, 30.0444], numberProjects: 15600000 },
  { name: 'Los Angeles', coordinates: [-118.2437, 34.0522], numberProjects: 15058000 },
  { name: 'Bangkok', coordinates: [100.5018, 13.7563], numberProjects: 14998000 },
  { name: 'Kolkata', coordinates: [88.3639, 22.5726], numberProjects: 14667000 },
  { name: 'Buenos Aires', coordinates: [-58.3816, -34.6037], numberProjects: 14122000 },
  { name: 'Tehran', coordinates: [51.3890, 35.6892], numberProjects: 13532000 },
  { name: 'Istanbul', coordinates: [28.9784, 41.0082], numberProjects: 13287000 },
  { name: 'Lagos', coordinates: [3.3792, 6.5244], numberProjects: 13123000 },
  { name: 'Shenzhen', coordinates: [114.0579, 22.5431], numberProjects: 12084000 },
  { name: 'Rio de Janeiro', coordinates: [-43.1729, -22.9068], numberProjects: 11727000 },
  { name: 'Kinshasa', coordinates: [15.2663, -4.4419], numberProjects: 11587000 },
  { name: 'Tianjin', coordinates: [117.3616, 39.3434], numberProjects: 10920000 },
  { name: 'Paris', coordinates: [2.3522, 48.8566], numberProjects: 10858000 },
  { name: 'Lima', coordinates: [-77.0428, -12.0464], numberProjects: 10750000 }
]

class AreaChart extends Component {
  updateData () {}

  constructor () {
    super()
    this.state = {
      // defining worldData as part of the WorldMap component state
      // empty array in the beginning, and the data will be loaded asynchronously,
      // once the component mounts (see componentDidMount)
      worldData: [],
      // example data for marker
      institutions: []
    }

    this.handleCountryClick = this.handleCountryClick.bind(this)
    this.handleMarkerClick = this.handleMarkerClick.bind(this)
  }

  /**
   * The projection is used to render the d-path of the country paths, as well as the cx and cy property of the
   * marker circles. Since the projection is customised, it makes more sense to write a method for it
   * @returns {*}
   */
  projection () {
    return geoMercator()
      .scale(100)
      .translate([ 800 / 2, 450 / 2 ])
  }

  /**
   * Topojson data fetching logic and state management for this.state.worlddata
   *
   */
  handleCountryClick (countryIndex) {
    console.log('Clicked on country: ', this.state.worldData[countryIndex])
  }
  handleMarkerClick (markerIndex) {
    console.log('Marker: ', this.state.institutions[markerIndex])
  }

  /**
   * React lifecycle method
   */
  componentDidMount () {
    // TopoJSON from here: https://github.com/topojson/world-atlas#world/110m.json
    fetch('./worldmapTopoJSON.json')
      .then(response => {
        if (response.status !== 200) {
          console.log(`There was a problem: ${response.status}`)
          return
        }
        response.json().then(worldData => {
          this.setState({
            worldData: feature(worldData, worldData.objects.countries).features,
            institutions: sampleData
          })
        })
      })
  }
  render () {
    return (
      <svg width={ 800 } height={ 450 } viewBox="0 0 800 450">
        <g className="countries">
          {
            this.state.worldData.map((d, i) => (
              <path
                key={ `path-${i}` }
                d={ geoPath().projection(this.projection())(d) }
                className="country"
                // In order to not make all countries the same colour, I use the index of the country
                // within the worldData array to set the opacity of the country path fill. If you have
                // data, you can use the same strategy to create a choropleth map.
                fill={ `rgba(38,50,56,${1 / this.state.worldData.length * i})` }
                stroke="#FFFFFF"
                strokeWidth={ 0.5 }
                // Adding events to the SVG paths works the same way as adding events to any other element in JSX.
                // The same approach can be used for other events (e.g. mouseEnter, mouseLeave, mouseMove)
                // for countries, but also for markers.
                onClick={ () => this.handleCountryClick(i) }
              />
            ))
          }
        </g>
        <g className="markers">
          {
            // If you want to add tooltips to your map, you can use the technique outlined above for
            //  event handling. To render the actual tooltip, you can use a library like redux-tooltip.

            this.state.institutions.map((institution, i) => (
              <circle
                key={ `marker-${i}` }
                cx={ this.projection()(institution.coordinates)[0] }
                cy={ this.projection()(institution.coordinates)[1] }
                r={ institution.numberProjects / 3000000 }
                fill="#91403c"
                stroke="#FFFFFF"
                className="marker"
                onClick={ () => this.handleMarkerClick(i) }
              />
            ))
          }
        </g>
      </svg>
    )
  }
}

export default AreaChart
