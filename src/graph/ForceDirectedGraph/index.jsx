import React, {useEffect, useState} from 'react';
import * as d3 from "d3";
import index from './index.module.css';
import getGraph from '../../api/getGraph'
import _ from 'lodash'
import {blue, green} from "@ant-design/colors";
import {node1State, node2State, datasetState} from '../../state/store';
import {useRecoilState} from "recoil";

const ForceDirectedGraph = () => {
    const [dataset, setDataset] = useRecoilState(datasetState)
    const [node1, setNode1] = useRecoilState(node1State)
    const [node2, setNode2] = useRecoilState(node2State)
    const changeNode1 = (value) => {
        setNode1(value)
    }
    const changeNode2 = (value) => {
        setNode2(value)
    }
    const [nodes, setNodes] = useState()
    const [edges, setEdges] = useState()
    const [minDegree, setMinDegree] = useState()
    const [maxDegree, setMaxDegree] = useState()
    const width = 600
    const height = 500
    let forceDirectedSvg
    let forceDirectedG
    let gEdge
    let gNode
    let gTop
    const ticked = () => {
        gTop.selectAll('*').remove()
        let neighbors
        const linear = d3.scaleLinear()
            .domain([minDegree, maxDegree])
            .range([4, 8])
        gEdge.selectAll('line')
            .data(edges)
            .join('line')
            .attr('id', (d, i) => `edge${i}`)
            .attr('x1', d => nodes[d.source.index].x)
            .attr('y1', d => nodes[d.source.index].y)
            .attr('x2', d => nodes[d.target.index].x)
            .attr('y2', d => nodes[d.target.index].y)
            .attr("stroke", blue[3])
            .on('mouseover', function () {
                gEdge.selectAll('line')
                    .style('cursor', 'pointer')
                    .transition()
                    .duration(300)
                    .attr('stroke', blue[1])
                gTop._groups[0][0].appendChild(this)
                d3.select(this)
                    .transition()
                    .duration(300)
                    .attr('stroke', blue[5])
                    .attr('stroke-width', 5)
                gNode.selectAll('circle')
                    .transition()
                    .duration(300)
                    .attr('fill', green[2])
                gTop.append('circle')
                    .classed('temp', true)
                    .attr('cx', this.x1.animVal.value)
                    .attr('cy', this.y1.animVal.value)
                    .transition()
                    .duration(300)
                    .attr("r", 8)
                    .attr("fill", green[8])
                gTop.append('circle')
                    .classed('temp', true)
                    .attr('cx', this.x2.animVal.value)
                    .attr('cy', this.y2.animVal.value)
                    .transition()
                    .duration(300)
                    .attr("r", 8)
                    .attr("fill", green[8])
            })
            .on('mouseout', function () {
                gTop.selectAll('.temp').remove()
                gEdge._groups[0][0].appendChild(this)
                gEdge.selectAll('line')
                    .transition()
                    .duration(200)
                    .attr('stroke', blue[3])
                    .attr('stroke-width', 1)
                gNode.selectAll('circle')
                    .transition()
                    .duration(200)
                    .attr('r', d => linear(d.degree))
                    .attr('fill', green[6])
            })
        gNode.selectAll('circle')
            .data(nodes)
            .join('circle')
            .attr('id', (d, i) => `node${i}`)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", d => linear(d.degree))
            .attr("fill", green[6])
            .on('mouseover', function () {
                gNode.selectAll('circle')
                    .style('cursor', 'pointer')
                    .transition()
                    .duration(300)
                    .attr('fill', green[2])
                d3.select(this)
                    .transition()
                    .duration(300)
                    .attr('r', 8)
                    .attr('fill', green[8])
                gEdge.selectAll('line')
                    .transition()
                    .duration(300)
                    .attr('stroke', blue[1])
                neighbors = nodes[this.__data__.index].neighbor
                neighbors.forEach(d => {
                    gTop.append('line')
                        .classed('temp', true)
                        .attr('x1', this.cx.animVal.value)
                        .attr('y1', this.cy.animVal.value)
                        .attr('x2', d3.select(`#node${d - 1}`)._groups[0][0].cx.animVal.value)
                        .attr('y2', d3.select(`#node${d - 1}`)._groups[0][0].cy.animVal.value)
                        .transition()
                        .duration(300)
                        .attr("stroke", blue[5])
                        .attr("stroke-width", 5)
                })
                neighbors.forEach(d => {
                    gTop._groups[0][0].appendChild(d3.select(`#node${d - 1}`)._groups[0][0])
                    d3.select(`#node${d - 1}`)
                        .transition()
                        .duration(300)
                        .attr('r', 8)
                        .attr('fill', green[8])
                })
                gTop._groups[0][0].appendChild(this)
            })
            .on('mouseout', function () {
                gTop.selectAll('.temp').remove()
                neighbors.forEach(d => {
                    gNode._groups[0][0].appendChild(d3.select(`#node${d - 1}`)._groups[0][0])
                })
                gNode._groups[0][0].appendChild(this)
                gEdge.selectAll('line')
                    .transition()
                    .duration(200)
                    .attr('stroke', blue[3])
                    .attr('stroke-width', 1)
                gNode.selectAll('circle')
                    .transition()
                    .duration(200)
                    .attr('r', d => linear(d.degree))
                    .attr('fill', green[6])
            })
            .on('click', function () {
                changeNode1(parseInt(this.id.substring(4)) + 1)
            })
            .on('contextmenu', function (e) {
                e.preventDefault()
                changeNode2(parseInt(this.id.substring(4)) + 1)
            })
    }
    useEffect(() => {
        getGraph(dataset).then(
            res => {
                if (res.code === 1) {
                    const tempNodes = []
                    const tempEdges = []
                    let tempMinDegree = Number.MAX_VALUE
                    let tempMaxDegree = 0
                    res.data.graph.forEach((d1) => {
                        if (d1.degree > tempMaxDegree) {
                            tempMaxDegree = d1.degree
                        }
                        if (d1.degree < tempMinDegree) {
                            tempMinDegree = d1.degree
                        }
                        tempNodes.push({"id": d1.vertex, "neighbor": d1.edge, 'degree': d1.degree})
                        d1.edge.forEach(d2 => {
                            tempEdges.push({"source": d1.vertex, "target": d2})
                        })
                    })
                    setNodes(tempNodes)
                    setEdges(tempEdges)
                    setMaxDegree(tempMaxDegree)
                    setMinDegree(tempMinDegree)
                } else {
                    console.log(`力导向图 API 报错，错误原因为${res.message}`)
                }
            }
        )
    }, [dataset])
    useEffect(() => {
        d3.select('#forceDirectedGraph').selectAll('*').remove()
        forceDirectedSvg = d3.select('#forceDirectedGraph')
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr('viewBox', [0, 0, width, height])
        forceDirectedG = forceDirectedSvg.append('g')
        gEdge = forceDirectedG.append('g')
        gNode = forceDirectedG.append('g')
        gTop = forceDirectedG.append('g')
        forceDirectedSvg.call(d3.zoom().on('zoom', (e) => {
            forceDirectedG.attr('transform', e.transform)
        }))
        if (!_.isUndefined(nodes) && !_.isUndefined(edges)) {
            d3.forceSimulation(nodes)
                .force("charge", d3.forceManyBody().strength(-100))
                .force("link", d3.forceLink(edges).id(d => d.id))
                .force("center", d3.forceCenter(width / 2, height / 2))
                .force("collide", d3.forceCollide(d => d.degree))
                .on('tick', ticked)
        }
    }, [nodes, edges])
    return (
        <div className={index.graph} id={'forceDirectedGraph'}/>
    )
}

export default ForceDirectedGraph