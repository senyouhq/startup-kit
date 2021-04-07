import * as d3 from 'd3'
import './demo.scss'

const width = 800
const height = 800
const nodeWidth = 100
const container = d3.select('#root').append('div').attr('id', 'container')
console.log('Demo', container)
const svg = container.append('svg').attr('width', width).attr('height', height)

// const svg = d3.create('svg').attr('viewBox', [-width / 2, 0, width, height])

function findRoot(node) {
  if (!node.parent) return node

  return findRoot(node.parent)
}

function tree(nodes, links) {
  const nodesMap = new Map()
  // const depthMap = new Map()
  // const separation = 50

  for (const node of nodes) {
    node.parent = null
    node.children = []
    nodesMap.set(node.id, node)
  }

  for (const link of links) {
    const sourceNode = nodesMap.get(link.source)
    const targetNode = nodesMap.get(link.target)
    sourceNode.children.push(targetNode)
    targetNode.parent = sourceNode
  }

  const data = findRoot(nodes[0])
  const root = d3.hierarchy(data)
  root.dx = 10
  root.dy = width / (root.height + 1)
  return d3.tree([width, height]).nodeSize([root.data.width + 20, root.data.height + 50])(root)
}

function createNode(id, label) {
  const node = {
    id,
    width: nodeWidth,
    height: 50,
    color: 'white',
    strokeWidth: 1,
    strokeColor: '#000',
    label,
    fontSize: 12,
    textAnchor: 'middle',
  }

  return node
}

const nodes = [
  createNode(0, 'zero'),
  createNode(1, 'one'),
  createNode(2, 'two'),
  createNode(3, 'three'),
]

const links = [
  { source: 0, target: 1 },
  { source: 1, target: 2 },
  { source: 0, target: 3 },
]

const markers = [
  {
    id: 0,
    name: 'circle',
    path: 'M 0, 0  m -5, 0  a 5,5 0 1,0 10,0  a 5,5 0 1,0 -10,0',
    viewbox: '-6 -6 12 12',
  },
  { id: 1, name: 'square', path: 'M 0,0 m -5,-5 L 5,-5 L 5,5 L -5,5 Z', viewbox: '-5 -5 10 10' },
  { id: 2, name: 'arrow', path: 'M 0,0 m -5,-5 L 5,0 L -5,5 Z', viewbox: '-5 -5 10 10' },
  { id: 2, name: 'stub', path: 'M 0,0 m -1,-5 L 1,-5 L 1,5 L -1,5 Z', viewbox: '-1 -5 2 10' },
]

function updateNodeControlPoints(n, x = null, y = null) {
  n.x = x || n.x
  n.y = y || n.y
  n.control_top = {
    x: n.x + n.data.width / 2,
    y: n.y - (n.data.strokeWidth + 1),
  }

  n.control_bottom = {
    x: n.x + n.data.width / 2,
    y: n.y + n.data.height + (n.data.strokeWidth + 1),
  }
}

const root = tree(nodes, links)
for (const link of links) {
  root.descendants().forEach((n) => {
    if (n.data.id === link.source) link.source = n
    if (n.data.id === link.target) link.target = n
    updateNodeControlPoints(n)
  })
}

const line = d3
  .linkVertical()
  .x((d) => d.x)
  .y((d) => d.y)

function dragged(event, d) {
  d.x = event.x
  d.y = event.y

  updateNodeControlPoints(d)

  d3.select(this).attr('transform', (d) => `translate(${d.x}, ${d.y})`)

  svg.selectAll('path.link').attr('d', (d) =>
    line({
      source: d.source.control_bottom,
      target: d.target.control_top,
    })
  )
}

const defs = svg.append('svg:defs')

const marker = defs
  .selectAll('marker')
  .data(markers)
  .join('marker')
  .attr('id', function (d) {
    return 'marker_' + d.name
  })
  .attr('markerHeight', 5)
  .attr('markerWidth', 5)
  .attr('markerUnits', 'strokeWidth')
  .attr('orient', 'auto')
  .attr('refX', 0)
  .attr('refY', 0)
  .attr('viewBox', function (d) {
    return d.viewbox
  })
  .append('path')
  .attr('d', function (d) {
    return d.path
  })
  .attr('fill', function (d, i) {
    return '#000'
  })

const link = svg
  .append('g')
  .attr('fill', 'none')
  .attr('stroke', '#999')
  .attr('stroke-opacity', 0.6)
  .selectAll('path')
  .data(links)
  .join('path')
  .attr('class', 'link')
  .attr('d', (d) =>
    line({
      source: d.source.control_bottom,
      target: d.target.control_top,
    })
  )
  .style('marker-end', (d) => `url(#marker_arrow)`)

console.log('root.descendants()', root.descendants())
const node = svg
  .append('g')
  .selectAll('g.node')
  .data(root.descendants())
  .join('g')
  .attr('class', 'node')
  .attr('transform', (d) => `translate(${d.x}, ${d.y})`)
  .call(d3.drag().on('drag', dragged))

node
  .append('rect')
  .attr('width', (d) => d.data.width)
  .attr('height', (d) => d.data.height)
  .attr('stroke-width', (d) => d.data.strokeWidth)
  .attr('stroke', (d) => d.data.strokeColor)
  .attr('fill', (d) => d.data.color)

node
  .append('text')
  .text((d) => d.data.label)
  .attr('font-size', (d) => d.data.fontSize)
  .attr('text-anchor', (d) => d.data.textAnchor)
  .attr('x', (d) => d.data.width / 2)
  .attr('y', (d) => d.data.height / 2 + d.data.fontSize / 2)

export default null
