import {select as d3Select} from 'd3-selection'
import {scaleLinear as d3ScaleLinear} from 'd3-scale'
import {forceSimulation as d3ForceSimulation, forceCollide as d3ForceCollide, forceCenter as d3ForceCenter} from 'd3-force'
import {fieldsIntToString, getFieldColor} from '../../../store/utility'

class ProjectGraph {
  /*
    Description
    TODO:
      Update Forcesimulation/Scales
      Check Forcesimulation,Scale,Tick, innerouter Radius, circleMiddle, flowPoint, Circle

      ADD Links
      Correct updateData

      Tooltip not disapearing und update
  */

  constructor (svgId, data, width, height, type = 'forschungsbereiche', config = {}) {
    /*
      Public
      updates all nessecary data and shows the Visulisation
        svgId - defines the SVG Id (e.g."#svgChart") where the Visulisation should be appended
        data  - the newProjects.json set or a subset of it
        type  - String defining the Visualisation Type
        config- Json with variables defining the Style properties
    */
    this.colors = {
      fb: {
        '1': '#7d913c',
        '2': '#d9ef36',
        '3': '#8184a7',
        '4': '#985152'
      },
      fbLight: {
        '1': '',
        '2': '',
        '3': '',
        '4': ''
      },
      fbDark: {
        '1': '',
        '2': '',
        '3': '',
        '4': ''
      },
      system: {
        'active': '#f0faf0',
        'inactive': '#989aa1',
        'background': '#434058'
      }
    }

    this.flowPointRadius = 90
    this.animationTime = 1500
    this.delayTime = 0
    this.type = type
    this.data = data

    this.svg = d3Select(svgId)
    this.width = width
    this.height = height
    this.circleMiddle = {x: this.width / 2, y: this.height / 2}
    this.g = this.svg.append('g')
      .attr('transform', 'translate(' + (this.width / 4) + ',' +
        (this.height / 4) + ')')
    this.background = this.svg.append('circle')
      .attr('class', 'background')
      .style('fill', this.colors.system.active)
      .style('opacity', 0.04)
      .attr('r', this.height / 4)
      .attr('cx', this.width / 2)
      .attr('cy', this.height / 2)

    this.scaleX = d3ScaleLinear()
      .domain([-30, 30])
      .range([0, 600])
    this.scaleY = d3ScaleLinear()
      .domain([0, 50])
      .range([500, 0])

    this.outerRadius = this.height / 4
    this.visData = this._processData(data, type)
    let area = this.outerRadius * this.outerRadius * Math.PI
    let areaPerElem = (area / this.visData.length) * (80 / 100)
    let radius = Math.sqrt(areaPerElem / Math.PI)
    let scale = radius / 5
    this.force = d3ForceSimulation()
    // .force("link", d3.forceLink().id(function(d) { return d.project.id; }))
    // .force("charge", d3.forceManyBody().strength(-10))
      .force('collide', d3ForceCollide(radius))// ForceStrength?
      .force('center', d3ForceCenter(this.width / 2, this.height / 2))
      .alphaTarget(1)
    this.tooltip = d3Select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)

    this.visData = this._processData(data, type)
    this._updateD3Functions()
    this._updateSvgElements()

    this.polygon = [{'x': -3 * scale, 'y': -1 * scale}, {'x': -3 * scale, 'y': 1 * scale}, {'x': -1 * scale, 'y': 3 * scale},
      {'x': 1 * scale, 'y': 3 * scale}, {'x': 3 * scale, 'y': 1 * scale}, {'x': 3 * scale, 'y': -1 * scale},
      {'x': 1 * scale, 'y': -3 * scale}, {'x': -1 * scale, 'y': -3 * scale}]

    this.force.nodes(this.visData)
      .on('tick', this._tick(this))
    /* tmpForce.force("link")
            .links(linksP); */
  }
  updateData (data, width, height) {
    /*
      Public
      Updates The Visulisation with the new Data
        data - the newProjects.json set or a subset of it
    */
    this.width = width
    this.height = height
    this.circleMiddle = {x: this.width / 2, y: this.height / 2}
    this.g.attr('transform', 'translate(' + (this.width / 4) + ',' +
      (this.height / 4) + ')')
    this.background.attr('cx', this.width / 2)
      .attr('cy', this.height / 2).attr('r', this.height / 4)
    this.force.force('center', d3ForceCenter(this.width / 2, this.height / 2))
      .force('collide', d3ForceCollide(this.height / 55))// ForceStrength?

    this.visData = this._processData(data, this.type)
    this._updateD3Functions()
    this._updateSvgElements()
    this.outerRadius = this.height / 4
    let area = this.outerRadius * this.outerRadius * Math.PI
    let areaPerElem = (area / this.visData.length) * (80 / 100)
    let radius = Math.sqrt(areaPerElem / Math.PI)
    let scale = radius / 5
    this.outerRadius = this.outerRadius - radius * (3 / 5)
    this.polygon = [{'x': -3 * scale, 'y': -1 * scale}, {'x': -3 * scale, 'y': 1 * scale}, {'x': -1 * scale, 'y': 3 * scale},
      {'x': 1 * scale, 'y': 3 * scale}, {'x': 3 * scale, 'y': 1 * scale}, {'x': 3 * scale, 'y': -1 * scale},
      {'x': 1 * scale, 'y': -3 * scale}, {'x': -1 * scale, 'y': -3 * scale}]
    this.force.force('collide', d3ForceCollide(radius)).nodes(this.visData)
  }
  updateType (type) {
    /*
      Public
      Changes how the data is displayed (e.g. different Values on the axises)
        type  - String defining the Visualisation Type
    */
    this.visData = this._processData(this.data, type)
    this._updateD3Functions()
    this._updateSvgElements()
  }

  _processData (data, type) {
    /*
      Private
      Transforms the data in to a format which can be easily used for the Visulisation.
        inData - the newProjects.json set or a subset of it

        Returns the processed data.

    */
    let result = null
    switch (type) {
      case 'forschungsbereiche':
        result = this._processFbs(data, type)
        break
      case 'kooperationspartner':
        // TODO
        break
      default:
        console.log('ForceGraph Error: Unkown type')
    }
    return result
  }
  _processFbs (data, type) {
    /*
    */
    let fbPercent = [0, 0, 0, 0]
    let projectCount = 0
    let pId
    for (pId in data) {
      fbPercent[data[pId].forschungsbereich - 1]++
      projectCount++
    }
    for (let i = 0; i < fbPercent.length; i++) {
      fbPercent[i] = fbPercent[i] / projectCount
    }
    let sectors = this._processSectors(fbPercent)

    let pointData = []
    for (pId in data) {
      let fb = data[pId].forschungsbereich - 1
      let point = {
        color: getFieldColor(fieldsIntToString(fb + 1)),
        project: data[pId],
        sector: sectors[fb]
      }
      pointData.push(point)
    }
    return pointData
  }
  _processSectors (sectorPercentages) {
    /*
      Calculates the Sectors in which each Project should be
      {startAngle: 0, endAngle: 2.426180465148553, flowPoint: {x:,y:}}

        sectorPercentages - [0.2,0.3,0.5] sum of percentages has to be 1

    */

    let sectors = []
    let angleSum = -(2 * Math.PI) / 4
    for (let i = 0; i < sectorPercentages.length; i++) {
      let startAngle = angleSum
      angleSum += (2 * Math.PI) * sectorPercentages[i]
      let endAngle = angleSum

      let sectorWidth = endAngle - startAngle
      let flowPointAngle = (startAngle + sectorWidth / 2)
      sectors.push({
        startAngle: startAngle,
        endAngle: endAngle,
        flowPoint: {
          x: this.circleMiddle.x + this.flowPointRadius * Math.sin(flowPointAngle),
          y: this.circleMiddle.y - this.flowPointRadius * Math.cos(flowPointAngle)
        }
      })
    }
    return sectors
  }
  _updateD3Functions () {
    /*
      Private
      Updates all nessecary D3 funcitons (e.g. ForceSimulation, Scales)
    */
  }
  _updateSvgElements () {
    /*
      Private
      Updates all nessecary SVG elements
    */
    this._updateNodes()
    this._updateLinks()
  }
  _updateNodes () {
    let that = this
    let nodes = this.svg.selectAll('.nodes')
      .data(this.visData, function (d) { return Math.random() })

    nodes.exit()
      .style('opacity', 0)
      .remove()
    nodes.enter()
      .append('g')
      .attr('class', 'nodes')
      .append('polygon')
      .attr('fill', function (d) {
        return d.color
      })
      .attr('stroke', function (d) {
        return d.color
      })
      .style('opacity', 1)
      .style('stroke-width', '1px')
      .on('click', function (d) {
        // TODO DISPATCH
      })
      .on('mouseover', function (d) {
        d3Select(this).style('cursor', 'pointer')
        d3Select(this).transition()
          .duration(500)
          .style('stroke', that.colors.system.active)
          .style('fill', that.colors.system.active)
        let svgPos = {x: 0, y: 0}
        that.tooltip.transition()
          .duration(500)
          .style('opacity', 0.8)
        that.tooltip.html(d.project.id)
          .style('color', that.colors.system.active)
          .style('left', (svgPos.x + d.x) + 'px')
          .style('top', (svgPos.y + d.y - 32) + 'px')
      })
      .on('mouseout', function (d) {
        d3Select(this).style('cursor', 'default')
        d3Select(this).transition()
          .duration(500)
          .style('stroke', d.color)
          .style('fill', d.color)
        that.tooltip.transition()
          .duration(500)
          .style('opacity', 0)
      })
  }
  _updateLinks () {
    // TODO Later
  }
  _tick (that) {
    return function () {
      /*
        Berechnet für die force simulation die bewegung jedes Projektes.

        Am Anfang, während die Projekte noch ausgeblendet sind werden sie Stark zu ihrem richtigen
        Sektor gezogen. Danach bewegen sie sich immer schwächer.
      */
      /* this.svg.selectAll(".links line").attr("x1", function(d) { return d.source.x; })
                         .attr("y1", function(d) { return d.source.y; })
                         .attr("x2", function(d) { return d.target.x; })
                         .attr("y2", function(d) { return d.target.y; }); */

      that.svg.selectAll('.nodes polygon')
        .attr('text', function (d) {
          return d.x + ' ' + d.y
        })
        .attr('points', function (d) {
          if (!ProjectGraph._isInSector(d.sector.startAngle,
            d.sector.endAngle,
            that.outerRadius,
            that.circleMiddle,
            d)) {
            d.vy += (d.sector.flowPoint.y - d.y) / 10
            d.vx += (d.sector.flowPoint.x - d.x) / 10
          }
          let nodeX = d.x
          let nodeY = d.y
          let tmpArr = []
          for (let i = 0; i < that.polygon.length; i++) {
            tmpArr.push([that.polygon[i].x + Number(nodeX),
              that.polygon[i].y + Number(nodeY)].join(','))
          }
          return tmpArr
        })
    }
  }

  /*
    Only for this._isInSector which is only used in this._tick
  */
  static _vecMinus (v1, v2) {
    return {x: (v1.x - v2.x), y: (v1.y - v2.y)}
  }
  static _distance (p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
  }

  static _radBetweenVectors (v1, v2) {
    let dot = v1.x * v2.x + v1.y * v2.y
    let det = v1.x * v2.y - v1.y * v2.x
    let angle = Math.atan2(det, dot)// -180, 180
    angle = -angle
    if (angle < 0) {
      angle = (angle + Math.PI * 2) % (Math.PI * 2)
    }

    return angle
  }
  static _isInSector (startAngleRad, endAngleRad, radius, middle, point) {
    let angle = ProjectGraph._radBetweenVectors(ProjectGraph._vecMinus(point, middle), {x: -1, y: 0})
    let dist = ProjectGraph._distance(middle, point)
    // +(Math.PI*2)/4 weil es bei uns links anfängt
    if (startAngleRad + (Math.PI * 2) / 4 < angle && angle < endAngleRad + (Math.PI * 2) / 4 && dist <= radius) {
      return true
    } else {
      return false
    }
  }
}

export default ProjectGraph
