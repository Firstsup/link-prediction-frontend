import React, {useEffect, useState} from 'react';
import * as d3 from "d3";
import index from './index.module.css';
import getGraph from '../../api/getGraph'
import _ from 'lodash'
import {blue, geekblue, green, purple} from "@ant-design/colors";
import {node1State, node2State, datasetState, nodesState, edgesState} from '../../state/store';
import {useRecoilState} from "recoil";

const ForceDirectedGraph = () => {
    const [dataset] = useRecoilState(datasetState)
    const [node1, setNode1] = useRecoilState(node1State)
    const [node2, setNode2] = useRecoilState(node2State)
    const [, setNodes] = useRecoilState(nodesState)
    const [, setEdges] = useRecoilState(edgesState)
    const changeNode1 = (value) => {
        setNode1(value)
    }
    const changeNode2 = (value) => {
        setNode2(value)
    }
    const [thisNodes, setThisNodes] = useState()
    const [thisEdges, setThisEdges] = useState()
    const [minDegree, setMinDegree] = useState()
    const [maxDegree, setMaxDegree] = useState()
    const width = 600
    const height = 500
    let forceDirectedSvg
    let forceDirectedG
    let gEdge
    let gNode
    let gTop
    let time = 0
    const ticked = () => {
        time++
        if (time === 300) {
            setNodes(thisNodes)
            setEdges(thisEdges)
        }
        gTop.selectAll('*').remove()
        let neighbors
        const linear = d3.scaleLinear()
            .domain([minDegree, maxDegree])
            .range([4, 8])
        gEdge.selectAll('line')
            .data(thisEdges)
            .join('line')
            .attr('id', (d, i) => `edge${i + 1}`)
            .attr('x1', d => thisNodes[d.source.index].x)
            .attr('y1', d => thisNodes[d.source.index].y)
            .attr('x2', d => thisNodes[d.target.index].x)
            .attr('y2', d => thisNodes[d.target.index].y)
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
            .data(thisNodes)
            .join('circle')
            .attr('id', (d, i) => `node${i + 1}`)
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
                neighbors = thisNodes[this.__data__.index].neighbor
                neighbors.forEach(d => {
                    gTop.append('line')
                        .classed('temp', true)
                        .attr('x1', this.cx.animVal.value)
                        .attr('y1', this.cy.animVal.value)
                        .attr('x2', d3.select(`#node${d}`)._groups[0][0].cx.animVal.value)
                        .attr('y2', d3.select(`#node${d}`)._groups[0][0].cy.animVal.value)
                        .transition()
                        .duration(300)
                        .attr("stroke", blue[5])
                        .attr("stroke-width", 5)
                })
                neighbors.forEach(d => {
                    gTop._groups[0][0].appendChild(d3.select(`#node${d}`)._groups[0][0])
                    d3.select(`#node${d}`)
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
                    gNode._groups[0][0].appendChild(d3.select(`#node${d}`)._groups[0][0])
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
                changeNode1(parseInt(this.id.substring(4)))
            })
            .on('contextmenu', function (e) {
                e.preventDefault()
                changeNode2(parseInt(this.id.substring(4)))
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
                    setThisNodes(tempNodes)
                    setThisEdges(tempEdges)
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
        if (!_.isUndefined(thisNodes) && !_.isUndefined(thisEdges)) {
            d3.forceSimulation(thisNodes)
                .force("charge", d3.forceManyBody().strength(-100))
                .force("link", d3.forceLink(thisEdges).id(d => d.id))
                .force("center", d3.forceCenter(width / 2, height / 2))
                .force("collide", d3.forceCollide(d => d.degree))
                .on('tick', ticked)
        }
    }, [thisNodes, thisEdges])
    useEffect(() => {
        if (!_.isNil(d3.select(`#node${node1}`)._groups[0][0])) {
            d3.selectAll('.temp').remove()
            const node1Arc = d3.arc()
                .innerRadius(d3.select(`#node${node1}`)._groups[0][0].r.animVal.value + 1)
                .outerRadius(d3.select(`#node${node1}`)._groups[0][0].r.animVal.value + 6)
                .startAngle(0)
                .endAngle(Math.PI * 2)
            const node2Arc = d3.arc()
                .innerRadius(d3.select(`#node${node2}`)._groups[0][0].r.animVal.value + 1)
                .outerRadius(d3.select(`#node${node2}`)._groups[0][0].r.animVal.value + 6)
                .startAngle(0)
                .endAngle(Math.PI * 2)
            d3.select(d3.select(`#node${node1}`)._groups[0][0].parentElement.parentElement)
                .append('path')
                .classed('temp', true)
                .attr('d', node1Arc)
                .attr('fill', geekblue[5])
                .attr('transform', `translate(${d3.select(`#node${node1}`)._groups[0][0].cx.animVal.value}, ${d3.select(`#node${node1}`)._groups[0][0].cy.animVal.value})`)
            d3.select(d3.select(`#node${node2}`)._groups[0][0].parentElement.parentElement)
                .append('path')
                .classed('temp', true)
                .attr('d', node2Arc)
                .attr('fill', purple[5])
                .attr('transform', `translate(${d3.select(`#node${node2}`)._groups[0][0].cx.animVal.value}, ${d3.select(`#node${node2}`)._groups[0][0].cy.animVal.value})`)
        }
    }, [node1, node2])
    return (
        <div className={index.graph} id={'forceDirectedGraph'}/>
    )
}

export default ForceDirectedGraph