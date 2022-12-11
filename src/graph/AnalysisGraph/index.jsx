import React, {useEffect} from 'react';
import * as d3 from "d3";
import index from './index.module.css';
import {useRecoilState} from "recoil";
import {algorithmState, edgesState, hoverState, node1State, node2State, nodesState} from "../../state/store";
import _ from 'lodash'
import {blue, cyan, geekblue, gold, green, grey, purple, red, volcano} from "@ant-design/colors";

const AnalysisGraph = () => {
    const [node1] = useRecoilState(node1State)
    const [node2] = useRecoilState(node2State)
    const [nodes] = useRecoilState(nodesState)
    const [edges] = useRecoilState(edgesState)
    const [hover] = useRecoilState(hoverState)
    const [algorithm] = useRecoilState(algorithmState)
    const width = 890
    const height = 465
    let analysisSvg
    let gBottom
    useEffect(() => {
        if (nodes.length !== 0 && edges.length !== 0) {
            d3.select('#analysisGraph').selectAll('*').remove()
            analysisSvg = d3.select('#analysisGraph')
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr('viewBox', [0, 0, width, height])
            gBottom = analysisSvg.append('g')
            if (nodes[node1 - 1].neighbor.includes(node2)) {
                analysisSvg.append('line')
                    .attr('x1', width / 2)
                    .attr('y1', 161)
                    .attr('x2', width / 2)
                    .attr('y2', 299)
                    .attr('stroke', blue[3])
                    .attr('stroke-width', 5)
            }
            let minDegree = Number.MAX_VALUE
            let maxDegree = 0
            nodes.forEach(d => {
                if (d.degree > maxDegree) {
                    maxDegree = d.degree
                }
                if (d.degree < minDegree) {
                    minDegree = d.degree
                }
            })
            const sizeLinear1 = d3.scaleLinear()
                .domain([minDegree, maxDegree])
                .range([8, 25])
            const sizeLinear2 = d3.scaleLinear()
                .domain([minDegree, maxDegree])
                .range([8, 25])
            let node1NeighborsAverageDegree = 0
            nodes[node1 - 1].neighbor.forEach(d => {
                node1NeighborsAverageDegree += nodes[d - 1].degree
            })
            node1NeighborsAverageDegree /= nodes[node1 - 1].neighbor.length
            let node2NeighborsAverageDegree = 0
            nodes[node2 - 1].neighbor.forEach(d => {
                node2NeighborsAverageDegree += nodes[d - 1].degree
            })
            node2NeighborsAverageDegree /= nodes[node2 - 1].neighbor.length
            const densities = new Array(nodes.length).fill(0)
            for (let i = 0; i < nodes.length; i++) {
                const thisNeighbors = nodes[i].neighbor
                let density = 0
                thisNeighbors.forEach(d => {
                    density += Math.sqrt(Math.pow((nodes[i].x - nodes[d - 1].x), 2) + Math.pow((nodes[i].y - nodes[d - 1].y), 2))
                })
                densities[i] = density / thisNeighbors.length
            }
            const maxDensity = _.max(densities)
            const minDensity = _.min(densities)
            const densityColorLinear = d3.scaleLinear()
                .domain([minDensity, maxDensity])
                .range([5, 1])
            analysisSvg.append('circle')
                .attr('cx', width / 2)
                .attr('cy', 140)
                .attr('r', 20)
                .attr('fill', blue[densityColorLinear(densities[node1 - 1]).toFixed(0)])
            analysisSvg.append('text')
                .attr('x', width / 2)
                .attr('y', 145)
                .attr('text-anchor', 'middle')
                .attr('font-family', 'sans-serif')
                .text(nodes[node1 - 1].id)
            let node1Neighbor1 = []
            let node1Neighbor2 = []
            let node1Neighbor3 = []
            const node1Neighbors = nodes[node1 - 1].neighbor
            const node2Neighbors = nodes[node2 - 1].neighbor
            const node1CommonNeighbors = _.intersection(node1Neighbors, node2Neighbors)
            for (let i = 0; i < node1CommonNeighbors.length; i++) {
                for (let j = 0; j < nodes[node1CommonNeighbors[i] - 1].neighbor.length; j++) {
                    if (node1CommonNeighbors.includes(nodes[node1CommonNeighbors[i] - 1].neighbor[j])) {
                        node1Neighbor1.push(node1CommonNeighbors[i])
                        break
                    }
                }
            }
            node1CommonNeighbors.forEach(d => {
                if (!node1Neighbor1.includes(d)) {
                    node1Neighbor2.push(d)
                }
            })
            node1Neighbors.forEach(d => {
                if (!node1CommonNeighbors.includes(d) && d !== node2) {
                    node1Neighbor3.push(d)
                }
            })
            const node1Arc1 = d3.arc()
                .innerRadius(21)
                .outerRadius(21 + sizeLinear1(nodes[node1 - 1].degree))
                .startAngle(0)
                .endAngle(2 * Math.PI * (node1Neighbor1.length / (node1Neighbor1.length + node1Neighbor2.length + node1Neighbor3.length)))
            const node1Arc2 = d3.arc()
                .innerRadius(21)
                .outerRadius(21 + sizeLinear1(nodes[node1 - 1].degree))
                .startAngle(2 * Math.PI * (node1Neighbor1.length / (node1Neighbor1.length + node1Neighbor2.length + node1Neighbor3.length)))
                .endAngle(2 * Math.PI * ((node1Neighbor1.length + node1Neighbor2.length) / (node1Neighbor1.length + node1Neighbor2.length + node1Neighbor3.length)))
            const node1Arc3 = d3.arc()
                .innerRadius(21)
                .outerRadius(21 + sizeLinear1(nodes[node1 - 1].degree))
                .startAngle(2 * Math.PI * ((node1Neighbor1.length + node1Neighbor2.length) / (node1Neighbor1.length + node1Neighbor2.length + node1Neighbor3.length)))
                .endAngle(2 * Math.PI)
            analysisSvg.append('path')
                .attr('d', node1Arc1)
                .attr('fill', green[2])
                .attr('transform', `translate(${width / 2}, 140)`)
            analysisSvg.append('path')
                .attr('d', node1Arc2)
                .attr('fill', gold[2])
                .attr('transform', `translate(${width / 2}, 140)`)
            analysisSvg.append('path')
                .attr('d', node1Arc3)
                .attr('fill', red[2])
                .attr('transform', `translate(${width / 2}, 140)`)
            analysisSvg.append('circle')
                .attr('cx', width / 2)
                .attr('cy', 140)
                .attr('r', 21 + sizeLinear1(node1NeighborsAverageDegree))
                .attr('fill', 'none')
                .attr('stroke', grey[1])
                .attr('stroke-width', 1)
            analysisSvg.append('line')
                .attr('x1', 30)
                .attr('y1', 140)
                .attr('x2', width / 2 - 21 - sizeLinear1(nodes[node1 - 1].degree))
                .attr('y2', 140)
                .attr('stroke', grey[1])
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', '5, 2')
            analysisSvg.append('line')
                .attr('x1', width / 2 + 21 + sizeLinear1(nodes[node1 - 1].degree))
                .attr('y1', 140)
                .attr('x2', 860)
                .attr('y2', 140)
                .attr('stroke', grey[1])
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', '5, 2')
            analysisSvg.append('circle')
                .attr('cx', width / 2)
                .attr('cy', 320)
                .attr('r', 20)
                .attr('fill', blue[densityColorLinear(densities[node2 - 1]).toFixed(0)])
            analysisSvg.append('text')
                .attr('x', width / 2)
                .attr('y', 325)
                .attr('text-anchor', 'middle')
                .attr('font-family', 'sans-serif')
                .text(nodes[node2 - 1].id)
            let node2Neighbor1 = []
            let node2Neighbor2 = []
            let node2Neighbor3 = []
            const node2CommonNeighbors = _.intersection(node1Neighbors, node2Neighbors)
            for (let i = 0; i < node2CommonNeighbors.length; i++) {
                for (let j = 0; j < nodes[node2CommonNeighbors[i] - 1].neighbor.length; j++) {
                    if (node2CommonNeighbors.includes(nodes[node2CommonNeighbors[i] - 1].neighbor[j])) {
                        node2Neighbor1.push(node2CommonNeighbors[i])
                        break
                    }
                }
            }
            node2CommonNeighbors.forEach(d => {
                if (!node2Neighbor1.includes(d)) {
                    node2Neighbor2.push(d)
                }
            })
            node2Neighbors.forEach(d => {
                if (!node2CommonNeighbors.includes(d) && d !== node1) {
                    node2Neighbor3.push(d)
                }
            })
            const node2Arc1 = d3.arc()
                .innerRadius(21)
                .outerRadius(21 + sizeLinear1(nodes[node2 - 1].degree))
                .startAngle(0)
                .endAngle(2 * Math.PI * (node2Neighbor1.length / (node2Neighbor1.length + node2Neighbor2.length + node2Neighbor3.length)))
            const node2Arc2 = d3.arc()
                .innerRadius(21)
                .outerRadius(21 + sizeLinear1(nodes[node2 - 1].degree))
                .startAngle(2 * Math.PI * (node2Neighbor1.length / (node2Neighbor1.length + node2Neighbor2.length + node2Neighbor3.length)))
                .endAngle(2 * Math.PI * ((node2Neighbor1.length + node2Neighbor2.length) / (node2Neighbor1.length + node2Neighbor2.length + node2Neighbor3.length)))
            const node2Arc3 = d3.arc()
                .innerRadius(21)
                .outerRadius(21 + sizeLinear1(nodes[node2 - 1].degree))
                .startAngle(2 * Math.PI * ((node2Neighbor1.length + node2Neighbor2.length) / (node2Neighbor1.length + node2Neighbor2.length + node2Neighbor3.length)))
                .endAngle(2 * Math.PI)
            analysisSvg.append('path')
                .attr('d', node2Arc1)
                .attr('fill', green[2])
                .attr('transform', `translate(${width / 2}, 320)`)
            analysisSvg.append('path')
                .attr('d', node2Arc2)
                .attr('fill', gold[2])
                .attr('transform', `translate(${width / 2}, 320)`)
            analysisSvg.append('path')
                .attr('d', node2Arc3)
                .attr('fill', red[2])
                .attr('transform', `translate(${width / 2}, 320)`)
            analysisSvg.append('circle')
                .attr('cx', width / 2)
                .attr('cy', 320)
                .attr('r', 21 + sizeLinear1(node2NeighborsAverageDegree))
                .attr('fill', 'none')
                .attr('stroke', grey[1])
                .attr('stroke-width', 1)
            analysisSvg.append('line')
                .attr('x1', 30)
                .attr('y1', 320)
                .attr('x2', width / 2 - 21 - sizeLinear1(nodes[node2 - 1].degree))
                .attr('y2', 320)
                .attr('stroke', grey[1])
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', '5, 2')
            analysisSvg.append('line')
                .attr('x1', width / 2 + 21 + sizeLinear1(nodes[node2 - 1].degree))
                .attr('y1', 320)
                .attr('x2', 860)
                .attr('y2', 320)
                .attr('stroke', grey[1])
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', '5, 2')
            const node1LeftSpace = (width / 2 - 21 - sizeLinear1(nodes[node1 - 1].degree) - 30) / (Math.ceil(node1Neighbor3.length / 2) + 1)
            const node1RightSpace = (860 - (width / 2 + 21 + sizeLinear1(nodes[node1 - 1].degree))) / (Math.floor(node1Neighbor3.length / 2) + 1)
            const node1Neighbor3Distance = []
            let node1Neighbor3MaxDistance = 0
            node1Neighbor3.forEach(d => {
                const distance = Math.sqrt(Math.pow((nodes[node1 - 1].x - nodes[d - 1].x), 2) + Math.pow((nodes[node1 - 1].y - nodes[d - 1].y), 2))
                node1Neighbor3Distance.push(distance)
                if (distance > node1Neighbor3MaxDistance) {
                    node1Neighbor3MaxDistance = distance
                }
            })
            const node1HeightLinear = d3.scaleLinear()
                .domain([0, node1Neighbor3MaxDistance])
                .range([30, 80])
            for (let i = 0; i < node1Neighbor3.length; i++) {
                const thisNodeNeighbors = nodes[node1Neighbor3[i] - 1].neighbor
                const thisNodeNeighbor1 = []
                thisNodeNeighbors.forEach(d => {
                    if (nodes[d - 1].neighbor.includes(node1)) {
                        thisNodeNeighbor1.push(d)
                    }
                })
                const thisNodeArc1 = d3.arc()
                    .innerRadius(0)
                    .outerRadius(sizeLinear2(nodes[node1Neighbor3[i] - 1].degree))
                    .startAngle(0)
                    .endAngle(2 * Math.PI * (thisNodeNeighbor1.length / nodes[node1Neighbor3[i] - 1].degree))
                const thisNodeArc2 = d3.arc()
                    .innerRadius(0)
                    .outerRadius(sizeLinear2(nodes[node1Neighbor3[i] - 1].degree))
                    .startAngle(2 * Math.PI * (thisNodeNeighbor1.length / nodes[node1Neighbor3[i] - 1].degree))
                    .endAngle(2 * Math.PI)
                analysisSvg.append('path')
                    .attr('d', thisNodeArc1)
                    .attr('fill', geekblue[2])
                    .attr('transform', `translate(${i < Math.ceil(node1Neighbor3.length / 2) ? (30 + (i + 1) * node1LeftSpace) : (width / 2 + 21 + sizeLinear1(nodes[node1 - 1].degree) + (i - Math.ceil(node1Neighbor3.length / 2) + 1) * node1RightSpace)}, ${140 - node1HeightLinear(node1Neighbor3Distance[i])})`)
                analysisSvg.append('path')
                    .attr('d', thisNodeArc2)
                    .attr('fill', volcano[1])
                    .attr('transform', `translate(${i < Math.ceil(node1Neighbor3.length / 2) ? (30 + (i + 1) * node1LeftSpace) : (width / 2 + 21 + sizeLinear1(nodes[node1 - 1].degree) + (i - Math.ceil(node1Neighbor3.length / 2) + 1) * node1RightSpace)}, ${140 - node1HeightLinear(node1Neighbor3Distance[i])})`)
                analysisSvg.append('text')
                    .attr('x', i < Math.ceil(node1Neighbor3.length / 2) ? (30 + (i + 1) * node1LeftSpace) : (width / 2 + 21 + sizeLinear1(nodes[node1 - 1].degree) + (i - Math.ceil(node1Neighbor3.length / 2) + 1) * node1RightSpace))
                    .attr('y', 145 - node1HeightLinear(node1Neighbor3Distance[i]))
                    .attr('text-anchor', 'middle')
                    .attr('font-family', 'sans-serif')
                    .text(node1Neighbor3[i])
                analysisSvg.append('line')
                    .attr('x1', i < Math.ceil(node1Neighbor3.length / 2) ? (30 + (i + 1) * node1LeftSpace) : (width / 2 + 21 + sizeLinear1(nodes[node1 - 1].degree) + (i - Math.ceil(node1Neighbor3.length / 2) + 1) * node1RightSpace))
                    .attr('y1', 140)
                    .attr('x2', i < Math.ceil(node1Neighbor3.length / 2) ? (30 + (i + 1) * node1LeftSpace) : (width / 2 + 21 + sizeLinear1(nodes[node1 - 1].degree) + (i - Math.ceil(node1Neighbor3.length / 2) + 1) * node1RightSpace))
                    .attr('y2', 140 + sizeLinear2(nodes[node1Neighbor3[i] - 1].degree) - node1HeightLinear(node1Neighbor3Distance[i]))
                    .attr('stroke', red[3])
                    .attr('stroke-width', 5)
                analysisSvg.append('circle')
                    .attr('cx', i < Math.ceil(node1Neighbor3.length / 2) ? (30 + (i + 1) * node1LeftSpace) : (width / 2 + 21 + sizeLinear1(nodes[node1 - 1].degree) + (i - Math.ceil(node1Neighbor3.length / 2) + 1) * node1RightSpace))
                    .attr('cy', 140 - node1HeightLinear(node1Neighbor3Distance[i]))
                    .attr('r', sizeLinear2(nodes[node1Neighbor3[i] - 1].degree))
                    .attr('fill', 'none')
                    .attr('stroke', [1].includes(hover) ? green[4] : 'none')
                    .attr('stroke-width', 3)
            }
            const node2LeftSpace = (width / 2 - 21 - sizeLinear1(nodes[node2 - 1].degree) - 30) / (Math.ceil(node2Neighbor3.length / 2) + 1)
            const node2RightSpace = (860 - (width / 2 + 21 + sizeLinear1(nodes[node2 - 1].degree))) / (Math.floor(node2Neighbor3.length / 2) + 1)
            const node2Neighbor3Distance = []
            let node2Neighbor3MaxDistance = 0
            node2Neighbor3.forEach(d => {
                const distance = Math.sqrt(Math.pow((nodes[node2 - 1].x - nodes[d - 1].x), 2) + Math.pow((nodes[node2 - 1].y - nodes[d - 1].y), 2))
                node2Neighbor3Distance.push(distance)
                if (distance > node2Neighbor3MaxDistance) {
                    node2Neighbor3MaxDistance = distance
                }
            })
            const node2HeightLinear = d3.scaleLinear()
                .domain([0, node2Neighbor3MaxDistance])
                .range([30, 80])
            for (let i = 0; i < node2Neighbor3.length; i++) {
                const thisNodeNeighbors = nodes[node2Neighbor3[i] - 1].neighbor
                const thisNodeNeighbor1 = []
                thisNodeNeighbors.forEach(d => {
                    if (nodes[d - 1].neighbor.includes(node1)) {
                        thisNodeNeighbor1.push(d)
                    }
                })
                const thisNodeArc1 = d3.arc()
                    .innerRadius(0)
                    .outerRadius(sizeLinear2(nodes[node2Neighbor3[i] - 1].degree))
                    .startAngle(0)
                    .endAngle(2 * Math.PI * (thisNodeNeighbor1.length / nodes[node2Neighbor3[i] - 1].degree))
                const thisNodeArc2 = d3.arc()
                    .innerRadius(0)
                    .outerRadius(sizeLinear2(nodes[node2Neighbor3[i] - 1].degree))
                    .startAngle(2 * Math.PI * (thisNodeNeighbor1.length / nodes[node2Neighbor3[i] - 1].degree))
                    .endAngle(2 * Math.PI)
                analysisSvg.append('path')
                    .attr('d', thisNodeArc1)
                    .attr('fill', purple[2])
                    .attr('transform', `translate(${i < Math.ceil(node2Neighbor3.length / 2) ? (30 + (i + 1) * node2LeftSpace) : (width / 2 + 21 + sizeLinear1(nodes[node2 - 1].degree) + (i - Math.ceil(node2Neighbor3.length / 2) + 1) * node2RightSpace)}, ${320 + node2HeightLinear(node2Neighbor3Distance[i])})`)
                analysisSvg.append('path')
                    .attr('d', thisNodeArc2)
                    .attr('fill', volcano[1])
                    .attr('transform', `translate(${i < Math.ceil(node2Neighbor3.length / 2) ? (30 + (i + 1) * node2LeftSpace) : (width / 2 + 21 + sizeLinear1(nodes[node2 - 1].degree) + (i - Math.ceil(node2Neighbor3.length / 2) + 1) * node2RightSpace)}, ${320 + node2HeightLinear(node2Neighbor3Distance[i])})`)
                analysisSvg.append('text')
                    .attr('x', i < Math.ceil(node2Neighbor3.length / 2) ? (30 + (i + 1) * node2LeftSpace) : (width / 2 + 21 + sizeLinear1(nodes[node2 - 1].degree) + (i - Math.ceil(node2Neighbor3.length / 2) + 1) * node2RightSpace))
                    .attr('y', 325 + node2HeightLinear(node2Neighbor3Distance[i]))
                    .attr('text-anchor', 'middle')
                    .attr('font-family', 'sans-serif')
                    .text(node2Neighbor3[i])
                analysisSvg.append('line')
                    .attr('x1', i < Math.ceil(node2Neighbor3.length / 2) ? (30 + (i + 1) * node2LeftSpace) : (width / 2 + 21 + sizeLinear1(nodes[node2 - 1].degree) + (i - Math.ceil(node2Neighbor3.length / 2) + 1) * node2RightSpace))
                    .attr('y1', 320)
                    .attr('x2', i < Math.ceil(node2Neighbor3.length / 2) ? (30 + (i + 1) * node2LeftSpace) : (width / 2 + 21 + sizeLinear1(nodes[node2 - 1].degree) + (i - Math.ceil(node2Neighbor3.length / 2) + 1) * node2RightSpace))
                    .attr('y2', 320 - sizeLinear2(nodes[node2Neighbor3[i] - 1].degree) + node2HeightLinear(node2Neighbor3Distance[i]))
                    .attr('stroke', red[3])
                    .attr('stroke-width', 5)
                analysisSvg.append('circle')
                    .attr('cx', i < Math.ceil(node2Neighbor3.length / 2) ? (30 + (i + 1) * node2LeftSpace) : (width / 2 + 21 + sizeLinear1(nodes[node2 - 1].degree) + (i - Math.ceil(node2Neighbor3.length / 2) + 1) * node2RightSpace))
                    .attr('cy', 320 + node2HeightLinear(node2Neighbor3Distance[i]))
                    .attr('r', sizeLinear2(nodes[node2Neighbor3[i] - 1].degree))
                    .attr('fill', 'none')
                    .attr('stroke', [2].includes(hover) ? green[4] : 'none')
                    .attr('stroke-width', 3)
            }
            const node1Neighbor12 = _.concat(node1Neighbor1, node1Neighbor2)
            const centerLeftSpace = (width / 2 - 21 - sizeLinear1(Math.max(nodes[node1 - 1].degree, nodes[node2 - 1].degree)) - 30) / (Math.ceil(node1Neighbor12.length / 2) + 1)
            const centerRightSpace = (860 - (width / 2 + 21 + sizeLinear1(Math.max(nodes[node1 - 1].degree, nodes[node2 - 1].degree)))) / (Math.floor(node1Neighbor12.length / 2) + 1)
            const centerDistance1 = []
            const centerDistance2 = []
            node1Neighbor12.forEach(d => {
                centerDistance1.push(Math.sqrt(Math.pow((nodes[node1 - 1].x - nodes[d - 1].x), 2) + Math.pow((nodes[node1 - 1].y - nodes[d - 1].y), 2)))
                centerDistance2.push(Math.sqrt(Math.pow((nodes[node2 - 1].x - nodes[d - 1].x), 2) + Math.pow((nodes[node2 - 1].y - nodes[d - 1].y), 2)))
            })
            const centerY = []
            for (let i = 0; i < node1Neighbor12.length; i++) {
                centerY.push(180 * (centerDistance1[i] / (centerDistance1[i] + centerDistance2[i])))
            }
            let min = Number.MAX_VALUE
            let max = 0
            node1Neighbor12.forEach(d => {
                min = Math.min(min, 1 / nodes[d - 1].neighbor.length)
                max = Math.max(max, 1 / nodes[d - 1].neighbor.length)
            })
            const strokeLinear = d3.scaleLinear()
                .domain([min, max])
                .range([3, 7])
            for (let i = 0; i < node1Neighbor12.length; i++) {
                const thisNodeNeighbors = nodes[node1Neighbor12[i] - 1].neighbor
                const thisNodeNeighbor1 = []
                const thisNodeNeighbor2 = []
                const thisNodeNeighbor3 = []
                thisNodeNeighbors.forEach(d => {
                    if (nodes[d - 1].neighbor.includes(node1) && nodes[d - 1].neighbor.includes(node2)) {
                        thisNodeNeighbor1.push(d)
                    } else if (nodes[d - 1].neighbor.includes(node1)) {
                        thisNodeNeighbor2.push(d)
                    } else if (nodes[d - 1].neighbor.includes(node2)) {
                        thisNodeNeighbor3.push(d)
                    }
                })
                const thisNodeArc1 = d3.arc()
                    .innerRadius(0)
                    .outerRadius(sizeLinear2(nodes[node1Neighbor12[i] - 1].degree))
                    .startAngle(0)
                    .endAngle(2 * Math.PI * (thisNodeNeighbor1.length / nodes[node1Neighbor12[i] - 1].degree))
                const thisNodeArc2 = d3.arc()
                    .innerRadius(0)
                    .outerRadius(sizeLinear2(nodes[node1Neighbor12[i] - 1].degree))
                    .startAngle(2 * Math.PI * (thisNodeNeighbor1.length / nodes[node1Neighbor12[i] - 1].degree))
                    .endAngle(2 * Math.PI * ((thisNodeNeighbor1.length + thisNodeNeighbor2.length) / nodes[node1Neighbor12[i] - 1].degree))
                const thisNodeArc3 = d3.arc()
                    .innerRadius(0)
                    .outerRadius(sizeLinear2(nodes[node1Neighbor12[i] - 1].degree))
                    .startAngle(2 * Math.PI * ((thisNodeNeighbor1.length + thisNodeNeighbor2.length) / nodes[node1Neighbor12[i] - 1].degree))
                    .endAngle(2 * Math.PI * ((thisNodeNeighbor1.length + thisNodeNeighbor2.length + thisNodeNeighbor3.length) / nodes[node1Neighbor12[i] - 1].degree))
                const thisNodeArc4 = d3.arc()
                    .innerRadius(0)
                    .outerRadius(sizeLinear2(nodes[node1Neighbor12[i] - 1].degree))
                    .startAngle(2 * Math.PI * ((thisNodeNeighbor1.length + thisNodeNeighbor2.length + thisNodeNeighbor3.length) / nodes[node1Neighbor12[i] - 1].degree))
                    .endAngle(2 * Math.PI)
                const thisNodeArc5 = d3.arc()
                    .innerRadius(0)
                    .outerRadius(sizeLinear2(nodes[node1Neighbor12[i] - 1].degree))
                    .startAngle(2 * Math.PI * (thisNodeNeighbor1.length / nodes[node1Neighbor12[i] - 1].degree))
                    .endAngle(2 * Math.PI)
                const appendLine = () => {
                    for (let j = 0; j < node1Neighbor12.length; j++) {
                        if (nodes[node1Neighbor12[i] - 1].neighbor.includes(node1Neighbor12[j])) {
                            gBottom.append('line')
                                .classed('temp', true)
                                .attr('x1', i < Math.ceil(node1Neighbor12.length / 2) ? (30 + (i + 1) * centerLeftSpace) : (width / 2 + 21 + sizeLinear1(Math.max(nodes[node1 - 1].degree, nodes[node2 - 1].degree)) + (i - Math.ceil(node1Neighbor12.length / 2) + 1) * centerRightSpace))
                                .attr('y1', 140 + centerY[i])
                                .attr('x2', j < Math.ceil(node1Neighbor12.length / 2) ? (30 + (j + 1) * centerLeftSpace) : (width / 2 + 21 + sizeLinear1(Math.max(nodes[node1 - 1].degree, nodes[node2 - 1].degree)) + (j - Math.ceil(node1Neighbor12.length / 2) + 1) * centerRightSpace))
                                .attr('y2', 140 + centerY[j])
                                .transition()
                                .duration(200)
                                .attr('stroke', gold[2])
                                .attr('stroke-width', 3)
                        }
                    }
                }
                analysisSvg.append('path')
                    .attr('d', thisNodeArc1)
                    .attr('fill', '#E0E0FF')
                    .attr('transform', `translate(${i < Math.ceil(node1Neighbor12.length / 2) ? (30 + (i + 1) * centerLeftSpace) : (width / 2 + 21 + sizeLinear1(Math.max(nodes[node1 - 1].degree, nodes[node2 - 1].degree)) + (i - Math.ceil(node1Neighbor12.length / 2) + 1) * centerRightSpace)}, ${140 + centerY[i]})`)
                    .on('mouseover', function () {
                        d3.select(this)
                            .style('cursor', 'pointer')
                        appendLine()
                    })
                    .on('mouseout', function () {
                        gBottom.selectAll('.temp').remove()
                    })
                analysisSvg.append('path')
                    .attr('d', thisNodeArc2)
                    .attr('fill', geekblue[2])
                    .attr('transform', `translate(${i < Math.ceil(node1Neighbor12.length / 2) ? (30 + (i + 1) * centerLeftSpace) : (width / 2 + 21 + sizeLinear1(Math.max(nodes[node1 - 1].degree, nodes[node2 - 1].degree)) + (i - Math.ceil(node1Neighbor12.length / 2) + 1) * centerRightSpace)}, ${140 + centerY[i]})`)
                    .on('mouseover', function () {
                        d3.select(this)
                            .style('cursor', 'pointer')
                        appendLine()
                    })
                    .on('mouseout', function () {
                        gBottom.selectAll('.temp').remove()
                    })
                analysisSvg.append('path')
                    .attr('d', thisNodeArc3)
                    .attr('fill', purple[2])
                    .attr('transform', `translate(${i < Math.ceil(node1Neighbor12.length / 2) ? (30 + (i + 1) * centerLeftSpace) : (width / 2 + 21 + sizeLinear1(Math.max(nodes[node1 - 1].degree, nodes[node2 - 1].degree)) + (i - Math.ceil(node1Neighbor12.length / 2) + 1) * centerRightSpace)}, ${140 + centerY[i]})`)
                    .on('mouseover', function () {
                        d3.select(this)
                            .style('cursor', 'pointer')
                        appendLine()
                    })
                    .on('mouseout', function () {
                        gBottom.selectAll('.temp').remove()
                    })
                analysisSvg.append('path')
                    .attr('d', thisNodeArc4)
                    .attr('fill', volcano[1])
                    .attr('transform', `translate(${i < Math.ceil(node1Neighbor12.length / 2) ? (30 + (i + 1) * centerLeftSpace) : (width / 2 + 21 + sizeLinear1(Math.max(nodes[node1 - 1].degree, nodes[node2 - 1].degree)) + (i - Math.ceil(node1Neighbor12.length / 2) + 1) * centerRightSpace)}, ${140 + centerY[i]})`)
                    .on('mouseover', function () {
                        d3.select(this)
                            .style('cursor', 'pointer')
                        appendLine()
                    })
                    .on('mouseout', function () {
                        gBottom.selectAll('.temp').remove()
                    })
                analysisSvg.append('path')
                    .attr('d', thisNodeArc1)
                    .attr('fill', 'none')
                    .attr('stroke', [6].includes(hover) ? green[4] : 'none')
                    .attr('stroke-width', 3)
                    .attr('transform', `translate(${i < Math.ceil(node1Neighbor12.length / 2) ? (30 + (i + 1) * centerLeftSpace) : (width / 2 + 21 + sizeLinear1(Math.max(nodes[node1 - 1].degree, nodes[node2 - 1].degree)) + (i - Math.ceil(node1Neighbor12.length / 2) + 1) * centerRightSpace)}, ${140 + centerY[i]})`)
                analysisSvg.append('path')
                    .attr('d', thisNodeArc5)
                    .attr('fill', 'none')
                    .attr('stroke', [7].includes(hover) ? green[4] : 'none')
                    .attr('stroke-width', 3)
                    .attr('transform', `translate(${i < Math.ceil(node1Neighbor12.length / 2) ? (30 + (i + 1) * centerLeftSpace) : (width / 2 + 21 + sizeLinear1(Math.max(nodes[node1 - 1].degree, nodes[node2 - 1].degree)) + (i - Math.ceil(node1Neighbor12.length / 2) + 1) * centerRightSpace)}, ${140 + centerY[i]})`)
                analysisSvg.append('text')
                    .attr('x', i < Math.ceil(node1Neighbor12.length / 2) ? (30 + (i + 1) * centerLeftSpace) : (width / 2 + 21 + sizeLinear1(Math.max(nodes[node1 - 1].degree, nodes[node2 - 1].degree)) + (i - Math.ceil(node1Neighbor12.length / 2) + 1) * centerRightSpace))
                    .attr('y', 145 + centerY[i])
                    .attr('text-anchor', 'middle')
                    .attr('font-family', 'sans-serif')
                    .text(node1Neighbor12[i])
                analysisSvg.append('line')
                    .attr('x1', i < Math.ceil(node1Neighbor12.length / 2) ? (30 + (i + 1) * centerLeftSpace) : (width / 2 + 21 + sizeLinear1(Math.max(nodes[node1 - 1].degree, nodes[node2 - 1].degree)) + (i - Math.ceil(node1Neighbor12.length / 2) + 1) * centerRightSpace))
                    .attr('y1', 140)
                    .attr('x2', i < Math.ceil(node1Neighbor12.length / 2) ? (30 + (i + 1) * centerLeftSpace) : (width / 2 + 21 + sizeLinear1(Math.max(nodes[node1 - 1].degree, nodes[node2 - 1].degree)) + (i - Math.ceil(node1Neighbor12.length / 2) + 1) * centerRightSpace))
                    .attr('y2', 140 + centerY[i] - sizeLinear2(nodes[node1Neighbor12[i] - 1].degree))
                    .attr('stroke', cyan[3])
                    .attr('stroke-width', ['RA', 'ERD'].includes(algorithm) ? strokeLinear(1 / nodes[node1Neighbor12[i] - 1].neighbor.length) : 5)
                analysisSvg.append('line')
                    .attr('x1', i < Math.ceil(node1Neighbor12.length / 2) ? (30 + (i + 1) * centerLeftSpace) : (width / 2 + 21 + sizeLinear1(Math.max(nodes[node1 - 1].degree, nodes[node2 - 1].degree)) + (i - Math.ceil(node1Neighbor12.length / 2) + 1) * centerRightSpace))
                    .attr('y1', 320)
                    .attr('x2', i < Math.ceil(node1Neighbor12.length / 2) ? (30 + (i + 1) * centerLeftSpace) : (width / 2 + 21 + sizeLinear1(Math.max(nodes[node1 - 1].degree, nodes[node2 - 1].degree)) + (i - Math.ceil(node1Neighbor12.length / 2) + 1) * centerRightSpace))
                    .attr('y2', 140 + centerY[i] + sizeLinear2(nodes[node1Neighbor12[i] - 1].degree))
                    .attr('stroke', cyan[3])
                    .attr('stroke-width', ['RA', 'ERD'].includes(algorithm) ? strokeLinear(1 / nodes[node1Neighbor12[i] - 1].neighbor.length) : 5)
                analysisSvg.append('circle')
                    .attr('cx', width / 2)
                    .attr('cy', 320)
                    .attr('r', 21 + sizeLinear1(nodes[node2 - 1].degree))
                    .attr('fill', 'none')
                    .attr('stroke', ([1].includes(hover) && nodes[node1 - 1].neighbor.includes(node2)) ? green[4] : 'none')
                    .attr('stroke-width', 3)
                analysisSvg.append('circle')
                    .attr('cx', width / 2)
                    .attr('cy', 140)
                    .attr('r', 21 + sizeLinear1(nodes[node1 - 1].degree))
                    .attr('fill', 'none')
                    .attr('stroke', ([2].includes(hover) && nodes[node1 - 1].neighbor.includes(node2)) ? green[4] : 'none')
                    .attr('stroke-width', 3)
                analysisSvg.append('circle')
                    .attr('cx', i < Math.ceil(node1Neighbor12.length / 2) ? (30 + (i + 1) * centerLeftSpace) : (width / 2 + 21 + sizeLinear1(Math.max(nodes[node1 - 1].degree, nodes[node2 - 1].degree)) + (i - Math.ceil(node1Neighbor12.length / 2) + 1) * centerRightSpace))
                    .attr('cy', 140 + centerY[i])
                    .attr('r', sizeLinear2(nodes[node1Neighbor12[i] - 1].degree))
                    .attr('fill', 'none')
                    .attr('stroke', [1, 2, 3].includes(hover) ? green[4] : 'none')
                    .attr('stroke-width', 3)
                if (algorithm === 'RA') {
                    analysisSvg.append('text')
                        .attr('x', i < Math.ceil(node1Neighbor12.length / 2) ? (30 + (i + 1) * centerLeftSpace) : (width / 2 + 21 + sizeLinear1(Math.max(nodes[node1 - 1].degree, nodes[node2 - 1].degree)) + (i - Math.ceil(node1Neighbor12.length / 2) + 1) * centerRightSpace))
                        .attr('y', 145 + centerY[i])
                        .attr('text-anchor', 'middle')
                        .attr('font-family', 'sans-serif')
                        .attr('transform', 'translate(20, -25)')
                        .text(`1/${nodes[node1Neighbor12[i] - 1].neighbor.length}`)
                }
                if ([3].includes(hover) && algorithm !== 'RA') {
                    analysisSvg.append('text')
                        .attr('x', i < Math.ceil(node1Neighbor12.length / 2) ? (30 + (i + 1) * centerLeftSpace) : (width / 2 + 21 + sizeLinear1(Math.max(nodes[node1 - 1].degree, nodes[node2 - 1].degree)) + (i - Math.ceil(node1Neighbor12.length / 2) + 1) * centerRightSpace))
                        .attr('y', 145 + centerY[i])
                        .attr('text-anchor', 'middle')
                        .attr('font-family', 'sans-serif')
                        .attr('transform', 'translate(0, -30)')
                        .text(`k = ${nodes[node1Neighbor12[i] - 1].neighbor.length}`)
                }
                if ([6, 7].includes(hover)) {
                    analysisSvg.append('text')
                        .attr('x', i < Math.ceil(node1Neighbor12.length / 2) ? (30 + (i + 1) * centerLeftSpace) : (width / 2 + 21 + sizeLinear1(Math.max(nodes[node1 - 1].degree, nodes[node2 - 1].degree)) + (i - Math.ceil(node1Neighbor12.length / 2) + 1) * centerRightSpace))
                        .attr('y', 145 + centerY[i])
                        .attr('text-anchor', 'middle')
                        .attr('font-family', 'sans-serif')
                        .attr('transform', 'translate(0, -48)')
                        .text(`k(i) = ${thisNodeNeighbor1.length}`)
                    let temp = 0
                    if (nodes[node1 - 1].neighbor.includes(node1Neighbor12[i])) {
                        temp++
                    }
                    if (nodes[node2 - 1].neighbor.includes(node1Neighbor12[i])) {
                        temp++
                    }
                    analysisSvg.append('text')
                        .attr('x', i < Math.ceil(node1Neighbor12.length / 2) ? (30 + (i + 1) * centerLeftSpace) : (width / 2 + 21 + sizeLinear1(Math.max(nodes[node1 - 1].degree, nodes[node2 - 1].degree)) + (i - Math.ceil(node1Neighbor12.length / 2) + 1) * centerRightSpace))
                        .attr('y', 145 + centerY[i])
                        .attr('text-anchor', 'middle')
                        .attr('font-family', 'sans-serif')
                        .attr('transform', 'translate(0, -30)')
                        .text(`k(e) = ${nodes[node1Neighbor12[i] - 1].neighbor.length - thisNodeNeighbor1.length - temp}`)
                }
            }
            if ([4].includes(hover)) {
                analysisSvg.append('text')
                    .attr('x', width / 2)
                    .attr('y', 115 - sizeLinear1(nodes[node1 - 1].degree))
                    .attr('text-anchor', 'middle')
                    .attr('font-family', 'sans-serif')
                    .text(`k = ${nodes[node1 - 1].neighbor.length}`)
            }
            if ([5].includes(hover)) {
                analysisSvg.append('text')
                    .attr('x', width / 2)
                    .attr('y', 355 + sizeLinear1(nodes[node1 - 1].degree))
                    .attr('text-anchor', 'middle')
                    .attr('font-family', 'sans-serif')
                    .text(`k = ${nodes[node2 - 1].neighbor.length}`)
            }
        }
    }, [nodes, edges, node1, node2, hover, algorithm])
    return (
        <div className={index.graph} id={'analysisGraph'}/>
    )
}

export default AnalysisGraph