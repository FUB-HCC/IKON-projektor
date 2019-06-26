import React, {Component} from 'react'
import * as d3 from 'd3'
import assets from '../../assets'
import PetriDishDetailModal from '../Modal/PetriDishDetailModal'
import * as projectData from '../../assets/publicData'

const dataDump = require('./PetriDish.json')

class PetriDishView extends Component {
  constructor (props) {
    super(props)
    let projects = []
    // for (let i = 0; i < nlpDump.data.points.length; i++) {
    //   projects.push({point: nlpDump.data.points[i], cluster: nlpDump.data.clusters[i]})
    // }
    for (let i = 0; i < dataDump.project_data.length; i++) {
      projects.push({point: dataDump.project_data[i].point, cluster: dataDump.project_data[i].cluster, projectId: dataDump.project_data[i].id})
    }
    this.state = {
      nlpProjectsDump: projects, // TODO: Change from the static dump data below to the API
      width: 0,
      height: 0,      
      detailModal: false,
      selectedProjectId: false,
      project: {},
      title: '',
      year: '',
      counter: 0,
      index: 0

    }
    this.updateHulls = this.updateHulls.bind(this)
    this.closeDetailModal = this.closeDetailModal.bind(this)
  }

  updateData (data, width, height) {
    this.setState({data, width, height})
  }

  closeDetailModal () {
    this.setState({detailModal: false})
  }

  render () {
    this.updateHulls()   
    
    return <div>
      <div id={'clusterContainer'} width={this.state.width} height={this.state.height} ></div>
      {this.state.detailModal && this.state.selectedProjectId &&
          <PetriDishDetailModal projectId={this.state.selectedProjectId} closeDetailModal={this.closeDetailModal} />
      }
    </div>
  }

  handleClusterClick (clusterId, points) {
    // TODO
    alert(`Cluster clicked ${clusterId}`)
  }

  handleMouseMoveOnCluster (points) {
    // TODO integrate hoverPopup same as in the map and the timeline
  }

  updateHulls () {
    let width = this.state.width
    let height = this.state.height

    // TODO scale as needed
    let scale = 50
    let offsetY = 0.5 * height
    let offsetX = 0.5 * width

    let clusters = []
    let clusterProjects = []
    this.state.nlpProjectsDump.forEach(value => {
      if (clusters[value.cluster]) {
        clusters[value.cluster].push([(value.point[0] * scale + offsetX), (value.point[1] * scale + offsetY)])
        clusterProjects[value.cluster].push(value.projectId)
      } else {
        clusters[value.cluster] = []
        clusterProjects[value.cluster] = []
      }
    })

    let container = d3.select('#clusterContainer')
    container.selectAll('*').remove()
    let svg = container.append('svg').attr('width', width)
      .attr('id', 'cluster-svg')
      .attr('height', height)

    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'none')

    clusters.forEach((points, index) => {
      let clusterId = index
      if (points.length >= 3) { // d3.polygonHull requires at least 3 data points
        let randomColor = randomRgba()        
        let hull = svg.append('path')
          .attr('id', `cluster-hull-${clusterId}`)
          .attr('class', 'hull')
          .attr('fill', randomColor)
          .attr('rx', '20') // rounded rect
          .attr('ry', '20') // rounded rect
          .style('stroke', randomColor)
          .style('stroke-width', '2em')
          .attr('stroke-linejoin', 'round')
          .attr('stroke-offset', '20')
          .attr('opacity', '0.6')
          .on('mouseenter', (e) => {
            // Bring the cluster to the foreground when mouse enters it
            let clusterPathElement = document.getElementById(`cluster-hull-${clusterId}`)
            let clusterPoints = document.getElementsByClassName(`cluster-point-${clusterId}`)
            let n = 0
            while (n < clusterPoints.length / 2) { // workaround for bringing all data points and the hull to the foreground
              for (let i = 0; i < clusterPoints.length; i++) {
                document.getElementById('cluster-svg').appendChild(clusterPoints[i])
              }
              document.getElementById('cluster-svg').insertBefore(clusterPathElement, clusterPoints[0])
              n++
            }
          })
          .on('mousemove', (points) => {
            hull.attr('opacity', '1')
            this.handleMouseMoveOnCluster(points)
          })
          .on('mouseleave', (points) => {
            hull.attr('opacity', '0.6')
          })
          // .on('click', (points) => this.handleClusterClick(clusterId, points))

        let polygon = d3.polygonHull(points)

        hull.datum(polygon).attr('d', function (d) {
          return 'M' + d.join('L') + 'Z'
        })

        // Use this in case you want to display a text in the hull:
        // let text = svg.append('text').text('Hull Title').attr('text-anchor', 'middle')
        // text.attr('transform', 'translate(' + d3.polygonCentroid(polygon) + ')').raise()

        points.forEach((point, index) => {
          let projectId = clusterProjects[clusterId][index]
          let clusterSVG = setColor(projectId)
          svg.append('image')
            .attr('class', `clusterPoint${clusterId}`)
            .attr('id', `cluster-point-${point[0]},${point[1]}`)
            .attr('xlink:href', clusterSVG)
            .attr('x', point[0])
            .attr('y', point[1])
            .attr('width', 16)
            .attr('height', 16)
            .style('cursor', 'pointer')
            .on('click', (points) => {
              if (this.state.detailModal) {
                this.closeDetailModal()
              }
              this.setState({detailModal: true, selectedProjectId: projectId})
            })
        })
      }
    })
  }

  componentDidMount () {
    this.updateHulls()
  }
}

const randomRgba = () => {
  return '#262626'
  // let o = Math.round
  // let r = Math.random
  // let s = 255
  // return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ', 1' + ')'
}

const setColor = (projectId) => {
  let projects = projectData.getProjectsData()
  let projectDetail = projects.find((element) => {
    if (element.id === projectId) {
      return element
    }
    return null
  })

  switch (projectDetail.research_area) {
    case 'Naturwissenschaften (119 Mitglieder)':
      return assets.clusterNaturSVG
    case 'Lebenswissenschaften (231 Mitglieder)':
      return assets.clusterLebenSVG
    case 'Geistes- und Sozialwissenschaften (136 Mitglieder)':
      return assets.clusterGeistSVG
    default:
      return assets.clusterUnbekantSVG
  }

  // switch (colorIndex) {
  //   case 0:
  //     return assets.clusterGeistSVG
  //   case 1:
  //     return assets.clusterLebenSVG
  //   case 2:
  //     return assets.clusterLebenSVG
  //   case 3:
  //     return assets.clusterLebenSVG
  //   default:
  //     return assets.clusterUnbekantSVG
  // }
}

export default PetriDishView
