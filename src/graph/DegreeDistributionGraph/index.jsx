import React, {useEffect, useState} from 'react';
import * as d3 from "d3";
import index from './index.module.css';
import getGraph from "../../api/getGraph";
import {useRecoilState} from "recoil";
import {datasetState, node1State, node2State} from "../../state/store";
import {blue, cyan, green, grey, purple, red, yellow} from "@ant-design/colors";
import _ from 'lodash'

const DegreeDistributionGraph = () => {
    const [dataset, setDataset] = useRecoilState(datasetState)
    const [node1, setNode1] = useRecoilState(node1State)
    const [node2, setNode2] = useRecoilState(node2State)
    const [nodesDegree, setNodesDegree] = useState()
    const [nodes, setNodes] = useState()
    const [minDegree, setMinDegree] = useState()
    const [maxDegree, setMaxDegree] = useState()
    const width = 260
    const height = 341
    let degreeDistributionSvg
    useEffect(() => {
        getGraph(dataset).then(
            res => {
                if (res.code === 1) {
                    const tempNodesDegree = new Map()
                    const tempNodes = []
                    let tempMinDegree = Number.MAX_VALUE
                    let tempMaxDegree = 0
                    res.data.graph.forEach((d1) => {
                        if (d1.degree > tempMaxDegree) {
                            tempMaxDegree = d1.degree
                        }
                        if (d1.degree < tempMinDegree) {
                            tempMinDegree = d1.degree
                        }
                        tempNodesDegree.has(d1.degree) ? tempNodesDegree.set(d1.degree, tempNodesDegree.get(d1.degree) + 1) : tempNodesDegree.set(d1.degree, 1)
                        tempNodes.push(d1.degree)
                    })
                    setNodes(tempNodes)
                    const nodesDegreeArr = []
                    tempNodesDegree.forEach((value, key) => {
                        nodesDegreeArr.push([key, value])
                    })
                    const sortedNodesDegree = nodesDegreeArr.sort((a, b) => {
                        return a[0] - b[0]
                    })
                    setNodesDegree(sortedNodesDegree)
                    setMaxDegree(tempMaxDegree)
                    setMinDegree(tempMinDegree)
                } else {
                    console.log(`力导向图 API 报错，错误原因为${res.message}`)
                }
            }
        )
    }, [dataset])
    useEffect(() => {
        if (!_.isUndefined(nodesDegree)) {
            d3.select('#degreeDistributionGraph').selectAll('*').remove()
            degreeDistributionSvg = d3.select('#degreeDistributionGraph')
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr('viewBox', [0, 0, width, height])
            const yLinear = d3.scaleLinear()
                .domain([minDegree - 1, maxDegree + 1])
                .range([0, 251])
            const antiYLinear = d3.scaleLinear()
                .domain([minDegree - 1, maxDegree + 1])
                .range([251, 0])
            let maxCount = 0
            nodesDegree.unshift([minDegree - 1, 0])
            nodesDegree.push([maxDegree + 1, 0])
            nodesDegree.forEach(d => {
                maxCount = Math.max(maxCount, d[1])
            })
            const xLinear = d3.scaleLinear()
                .domain([0, maxCount * 1.1])
                .range([0, 100])
            const antiXLinear = d3.scaleLinear()
                .domain([0, maxCount * 1.1])
                .range([100, 0])
            const segmentsRight = []
            const segmentsLeft = []
            for (let i = 0; i < nodesDegree.length; i++) {
                segmentsRight.push({
                    x: width / 2 + xLinear(nodesDegree[i][1]),
                    y: 281 - yLinear(nodesDegree[i][0])
                })
                segmentsLeft.push({
                    x: width / 2 - xLinear(nodesDegree[i][1]),
                    y: 281 - yLinear(nodesDegree[i][0])
                })
            }
            const line = d3.line()
                .curve(d3.curveCardinal)
                .x(d => d.x)
                .y(d => d.y)
            degreeDistributionSvg.append('path')
                .attr('d', line(segmentsRight))
                .attr("stroke", cyan[3])
                .attr("stroke-width", 2)
                .attr('fill', blue[1])
            degreeDistributionSvg.append('path')
                .attr('d', line(segmentsLeft))
                .attr("stroke", cyan[3])
                .attr("stroke-width", 2)
                .attr('fill', blue[1])
            degreeDistributionSvg.append('line')
                .attr('x1', width / 2)
                .attr('y1', 281)
                .attr('x2', width / 2)
                .attr('y2', 291)
                .attr('transform', 'translate(0.5, 0)')
                .attr('stroke', grey[9])
                .attr('stroke-dasharray', '2, 1')
            const degree1 = nodes[node1 - 1]
            const degree2 = nodes[node2 - 1]
            degreeDistributionSvg.append('line')
                .attr('x1', width / 2 - 110)
                .attr('y1', 281 - yLinear(degree1))
                .attr('x2', width / 2 + 110)
                .attr('y2', 281 - yLinear(degree1))
                .transition()
                .duration(500)
                .attr('stroke', red[3])
                .attr('stroke-dasharray', '5, 2')
                .attr('stroke-width', 2)
            degreeDistributionSvg.append('line')
                .attr('x1', width / 2 - 110)
                .attr('y1', 281 - yLinear(degree2))
                .attr('x2', width / 2 + 110)
                .attr('y2', 281 - yLinear(degree2))
                .transition()
                .duration(500)
                .attr('stroke', purple[5])
                .attr('stroke-dasharray', '5, 2')
                .attr('stroke-width', 2)
            // degreeDistributionSvg.append('line')
            //     .attr('x1', width / 2 + xLinear(maxCount))
            //     .attr('y1', 50)
            //     .attr('x2', width / 2 + xLinear(maxCount))
            //     .attr('y2', 300)
            //     .attr('stroke', grey[2])
            //     .attr('stroke-dasharray', '5, 2')
            //     .attr('stroke-width', 1)
            degreeDistributionSvg.append('text')
                .attr('x', width / 2 - 110)
                .attr('y', degree1 >= degree2 ? (273 - yLinear(degree1)) : (298 - yLinear(degree1)))
                .text(`Node1`)
            degreeDistributionSvg.append('text')
                .attr('x', width / 2 - 110)
                .attr('y', degree1 < degree2 ? (273 - yLinear(degree2)) : (298 - yLinear(degree2)))
                .text(`Node2`)
            for (let i = 0; i < nodesDegree.length; i++) {
                if (i !== 0 && i !== nodesDegree.length - 1) {
                    degreeDistributionSvg.append('circle')
                        .style('cursor', 'pointer')
                        .attr('cx', width / 2 + xLinear(nodesDegree[i][1]))
                        .attr('cy', 281 - yLinear(nodesDegree[i][0]))
                        .attr('r', 5)
                        .attr('opacity', 0)
                        .on('mouseover', function () {
                            degreeDistributionSvg.append('line')
                                .classed('temp', true)
                                .attr('x1', width / 2 + xLinear(nodesDegree[i][1]))
                                .attr('y1', 30)
                                .attr('x2', width / 2 + xLinear(nodesDegree[i][1]))
                                .attr('y2', 291)
                                .attr('stroke', grey[2])
                                .attr('stroke-dasharray', '5, 2')
                                .attr('stroke-width',)
                            degreeDistributionSvg.append('text')
                                .classed('temp', true)
                                .attr('x', width / 2 + xLinear(nodesDegree[i][1]) + 5)
                                .attr('y', 30)
                                .text(nodesDegree[i][1])
                        })
                        .on('mouseout', function () {
                            degreeDistributionSvg.selectAll('.temp').remove()
                        })
                }
            }
            const xAxis = d3.axisBottom(xLinear).ticks(3).tickSize(2)
            const antiXAxis = d3.axisBottom(antiXLinear).ticks(3).tickSize(2)
            const antiYAxis = d3.axisRight(antiYLinear).ticks(maxDegree - minDegree + 3).tickSize(4)
            degreeDistributionSvg.append('g')
                .attr('transform', `translate(${width / 2}, 291)`)
                .call(xAxis)
            degreeDistributionSvg.append('g')
                .attr('transform', `translate(${width / 2 - 100}, 291)`)
                .call(antiXAxis)
            degreeDistributionSvg.append('g')
                .attr('transform', `translate(${width / 2}, 30)`)
                .call(antiYAxis)
        }
    }, [nodesDegree, node1, node2])
    return (
        <div className={index.graph} id={'degreeDistributionGraph'}/>
    )
}

export default DegreeDistributionGraph