/* globals jQuery */
import * as d3 from 'd3'
import './demo.scss'
;(function ($) {
  const width = 800
  const height = 800
  const nodeWidth = 100

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

  const $actions = $('<div id="actions">').appendTo('#root')
  $actions.append('<label>親ノード</label>')

  const $select = $('<select class="parent">').appendTo($actions)
  nodes.forEach((n) => {
    $select.append(`<option value="${n.id}">id:${n.id} ${n.label}</option>`)
  })
  $actions.append('<label>追加するノード名</label>')
  const $nodeName = $('<input class="node-name">').val('新しいノード').appendTo($actions)

  $('<button>ノードの追加</button>')
    .appendTo($actions)
    // .text('Add node')
    .on('click', function () {
      const nodeName = $nodeName.val().trim()
      const parentId = Number($select.val())
      if (!nodeName) {
        window.alert('ノード名を入れてください')
        return
      }
      const newId = Math.max(...nodes.map((n) => n.id)) + 1

      nodes.push(createNode(newId, nodeName))
      links.push({ source: parentId, target: newId })

      const originalVal = $select.val()
      $select.empty()
      nodes.forEach((n) => {
        $select.append(`<option value="${n.id}">id:${n.id} ${n.label}</option>`)
      })
      $select.val(originalVal)

      draw()
    })

  const container = d3.select('#root').append('div').attr('id', 'container')

  const svg = container
    .append('svg')
    .attr('viewBox', [-width / 2, 0, width, height])
    .attr('width', width)
    .attr('height', height)

  const line = d3
    .linkVertical()
    .x((d) => d.x)
    .y((d) => d.y)

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
    // return d3.tree([width, height]).nodeSize([root.data.width + 20, root.data.height + 50])(root)
    return d3
      .tree()
      .size([width, height])
      .nodeSize([root.data.width + 20, root.data.height + 50])(root)
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

  function draw() {
    svg.selectAll('*').remove()
    const root = tree(nodes, links)
    const linksData = links.map((l) => ({ ...l }))
    for (const link of linksData) {
      root.descendants().forEach((n) => {
        if (n.data.id === link.source) link.source = n
        if (n.data.id === link.target) link.target = n
        updateNodeControlPoints(n)
      })
    }

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

    svg
      .append('svg:defs')
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

    svg
      .append('g')
      .attr('fill', 'none')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('path')
      .data(linksData)
      .join('path')
      .attr('class', 'link')
      .attr('d', (d) =>
        line({
          source: d.source.control_bottom,
          target: d.target.control_top,
        })
      )
      .style('marker-end', (d) => `url(#marker_arrow)`)

    const node = svg
      .append('g')
      .selectAll('g.node')
      .data(root.descendants())
      .join('g')
      .attr('class', 'node')
      .attr('transform', (d) => {
        return `translate(${d.x}, ${d.y})`
      })
      .on('click', function (event, d) {
        console.log('Clicked on:', d)
        window.alert(`id: ${d.data.id} の${d.data.label}がクリックされました`)
      })
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
  }
  draw()
})(jQuery)

export default null
