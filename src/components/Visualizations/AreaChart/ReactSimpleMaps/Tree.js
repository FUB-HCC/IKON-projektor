import React, {Component} from 'react'
import * as d3 from 'd3'

class Tree extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tree: props.tree,
      treeData: {},
      selectedNode: null,
      hoveredNode: null
    }
    this.clickNode = this.clickNode.bind(this)
    this.mouseEnterNode = this.mouseEnterNode.bind(this)
    this.mouseOutNode = this.mouseOutNode.bind(this)
  }

  shouldComponentUpdate (nextProps, nextState) {
    // TODO only render when necessary
    let result = !Object.is(this.state, nextState)
    return result
  }

  mouseOutNode (d) {
    // console.log('Mouse out')
    const {
      onNodeMouseOut,
      projection
    } = this.props
    d.coordinates = projection.invert([d.x, d.y])
    // console.log(d)
    this.setState({hoveredNode: null})
    return onNodeMouseOut && onNodeMouseOut(d, projection.invert([d.x, d.y]))
  }

  mouseEnterNode (d) {
    // console.log('Mouse over')
    if (d.parent) {
      const {
        onNodeMouseEnter,
        projection
      } = this.props
      d.coordinates = projection.invert([d.x, d.y])
      // console.log(d)
      this.setState({hoveredNode: d})
      return onNodeMouseEnter && onNodeMouseEnter(d, projection.invert([d.x, d.y]))
    } else {
      return false
    }
  }

  clickNode (d) {
    const {
      onNodeClick,
      projection
    } = this.props
    d.coordinates = projection.invert([d.x, d.y])
    console.log('Click++++++++++++++++++++++++++++++++++++++++++++')
    console.log(d)
    this.setState({selectedNode: d})
    return onNodeClick && onNodeClick(d, projection.invert([d.x, d.y]))
  }

  componentDidMount () {
    // TODO THIS SHOULD BE DONE IN AreaChart.js
    let newTreeData = {
      'name': this.state.tree.name,
      'children': []
    }

    this.state.tree.projects.map((value, index) => {
      let newValue = Object.assign({name: value.titel, i: index}, value)
      if (newTreeData.children.length < 50) newTreeData.children.push(newValue)
    })

    console.log(newTreeData)

    this.setState({treeData: newTreeData})
  }

  render () {
    const {
      projection,
      zoom,
      tree,
      width,
      height,
      preserveMarkerAspect
    } = this.props

    // set the dimensions and margins of the diagram
    let margin = {top: 0, right: 0, bottom: 0, left: 0}

    // declares a tree layout and assigns the size
    let treemap = d3.tree()
      .size([width * 0.8, height])

    //  assigns the data to a hierarchy using parent-child relationships
    let nodes = d3.hierarchy(this.state.treeData)

    // maps the node data to the tree layout
    nodes = treemap(nodes)

    let rootNodeX = nodes.x
    let rootNodeY = nodes.y
    const scale = preserveMarkerAspect ? ` scale(${1 / zoom})` : ''
    const translation = projection(tree.coordinates)
    let treeX = translation[0]
    let treeY = translation[1]

    let deltaX = treeX - rootNodeX
    let deltaY = treeY - rootNodeY

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    d3.select('#institution-tree').select('g').remove()
    /* let svg = d3.select('#institution-tree').append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom) */
    let g = d3.select('#institution-tree').append('g')
      .attr('transform',
        'translate(' + margin.left + ',' + margin.top + ')')

    // adds the links between the nodes
    // let link = g.selectAll('.link')
    g.selectAll('.link')
      .data(nodes.descendants().slice(1))
      .enter().append('path')
      .attr('class', 'link')
      .style('fill', 'none').style('stroke', '#386253').style('stroke-width', '2px')
      .attr('d', (d) => {
        let dx = d.x + deltaX
        let dy
        if (!d.parent) { // root node
          dy = d.y + deltaY
        } else {
          dy = height - treeY
          if (d.data.i % 2 !== 0) { // results in two lines of projects
            dy = height - treeY - 30
          }
        }
        let dParentX = d.parent.x + deltaX
        let dParentY = d.parent.y + deltaY

        return 'M' + dx + ',' + dy +
              'C' + dx + ',' + (dy + dParentY) / 2 +
              ' ' + dParentX + ',' + (dy + dParentY) / 2 +
              ' ' + dParentX + ',' + dParentY
      })

    // adds each node as a group
    let node = g.selectAll('.node')
      .data(nodes.descendants())
      .enter().append('g')
      .attr('class', (d) => {
        return 'node' +
                    (d.children ? ' node--internal' : ' node--leaf')
      })
      .attr('transform', (d) => {
        // console.log(d)

        let dx = d.x + deltaX

        let dy
        if (!d.parent) {
          dy = d.y + deltaY
        } else {
          dy = height - (rootNodeY + deltaY)
          if (d.data.i % 2 !== 0) { // results in two lines of projects
            dy = height - (rootNodeY + deltaY) - 30
          }
        }
        // console.log(scale)
        // console.log(translation)

        return `translate(${dx},${dy}) ${scale}`
      }).on('mouseenter', (d) => {
        return this.mouseEnterNode(d)
      }).on('mouseleave', (d) => {
        if (d.parent) return this.mouseOutNode(d)
        else return false
      }).on('mousedown', (d) => {
        return this.clickNode(d)
      })

      // adds the circle to the node
    node.append('circle')
      .attr('r', 10)
      .style('fill', (d) => {
        if (this.state.selectedNode && d.data.id === this.state.selectedNode.data.id && d.parent) return '#623336'
        if (this.state.hoveredNode && d.data.id === this.state.hoveredNode.data.id && d.parent) return '#623336'
        return (d.parent ? '#386253' : '#9DBC25')
      }).style('stroke', (d) => {
        return (d.parent ? '#9DBC25' : '#386253')
      }).style('stroke-width', '3px').style('cursor', 'pointer')

    // adds the text to the node
    node.append('text')
      .attr('dy', '.35em')
      .attr('y', (d) => {
        return d.children ? -20 : 20
      })
      .style('text-anchor', 'middle')
      .style('fill', 'white')
      .style('stroke', 'grey').style('stroke-width', '0.5')
      .text((d) => {
        if (!d.parent) return d.data.name
      })

    return (
      <g className={'rsm-tree'} id={'institution-tree'}/>
    )
  }
}

Tree.defaultProps = {
  style: {
    default: {},
    hover: {},
    pressed: {}
  },
  tree: {
    coordinates: [0, 0]
  },
  tabable: true,
  preserveMarkerAspect: true
}

export default Tree
