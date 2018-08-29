import React, {Component} from 'react'
import * as d3 from 'd3'

let treeData = {
  'name': 'Top Level',
  'children': [
    {
      'name': 'Level 2: A',
      'children': [
        { 'name': 'Son of A' },
        { 'name': 'Daughter of A' }
      ]
    },
    { 'name': 'Level 2: B' }
  ]
}

class Tree extends Component {
  constructor (props) {
    super(props)
    this.state = {
      treeData: {}
    }
  }

  componentDidMount () {
    this.setState({treeData: treeData})
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
      .size([width, height])

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
      .attr('d', (d) => {
        let dx = d.x + deltaX
        let dy = d.y + deltaY
        let dParentX = d.parent.x + deltaX
        let dParentY = d.parent.y + deltaY

        return 'M' + dx + ',' + dy +
                  'C' + dx + ',' + (dy + dParentY) / 2 +
                  ' ' + dParentX + ',' + (dy + dParentY) / 2 +
                  ' ' + dParentX + ',' + dParentY
      })

    console.log(nodes)

    // adds each node as a group
    let node = g.selectAll('.node')
      .data(nodes.descendants())
      .enter().append('g')
      .attr('class', (d) => {
        return 'node' +
                  (d.children ? ' node--internal' : ' node--leaf')
      })
      .attr('transform', (d) => {
        console.log(d)

        let dx = d.x + deltaX
        let dy = d.y + deltaY
        console.log(scale)
        console.log(translation)

        return 'translate(' + dx + ',' + dy + ')'
      })

      // adds the circle to the node
    node.append('circle')
      .attr('r', 10)

      // adds the text to the node
    node.append('text')
      .attr('dy', '.35em')
      .attr('y', (d) => { return d.children ? -20 : 20 })
      .style('text-anchor', 'middle')
      .text((d) => { return d.data.name })

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
