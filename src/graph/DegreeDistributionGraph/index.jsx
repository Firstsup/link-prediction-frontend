import React, {useEffect, useState} from 'react';
import * as d3 from "d3";
import index from './index.module.css';
import getGraph from "../../api/getGraph";
import {useRecoilState} from "recoil";
import {datasetState, node1State, node2State} from "../../state/store";
import {grey} from "@ant-design/colors";
import _ from 'lodash'

const DegreeDistributionGraph = () => {
    const [dataset, setDataset] = useRecoilState(datasetState)
    const [node1, setNode1] = useRecoilState(node1State)
    const [node2, setNode2] = useRecoilState(node2State)
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
                    const tempNodes = new Map()
                    let tempMinDegree = Number.MAX_VALUE
                    let tempMaxDegree = 0
                    res.data.graph.forEach((d1) => {
                        if (d1.degree > tempMaxDegree) {
                            tempMaxDegree = d1.degree
                        }
                        if (d1.degree < tempMinDegree) {
                            tempMinDegree = d1.degree
                        }
                        tempNodes.has(d1.degree) ? tempNodes.set(d1.degree, tempNodes.get(d1.degree) + 1) : tempNodes.set(d1.degree, 1)
                    })
                    const nodesArr = []
                    tempNodes.forEach((value, key) => {
                        nodesArr.push([key, value])
                    })
                    const sortedNodes = nodesArr.sort((a, b) => {
                        return a[0] - b[0]
                    })
                    setNodes(sortedNodes)
                    setMaxDegree(tempMaxDegree)
                    setMinDegree(tempMinDegree)
                } else {
                    console.log(`力导向图 API 报错，错误原因为${res.message}`)
                }
            }
        )
    }, [dataset])
    useEffect(() => {
        if (!_.isUndefined(nodes)) {
            d3.select('#degreeDistributionGraph').selectAll('*').remove()
            degreeDistributionSvg = d3.select('#degreeDistributionGraph')
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr('viewBox', [0, 0, width, height])
            degreeDistributionSvg.append('line')
                .attr('x1', width / 2 - 100)
                .attr('y1', 291)
                .attr('x2', width / 2 + 100)
                .attr('y2', 291)
                .attr('stroke-width', 2)
                .attr('stroke', grey[2])
            degreeDistributionSvg.append('line')
                .attr('x1', width / 2)
                .attr('y1', 291)
                .attr('x2', width / 2)
                .attr('y2', 50)
                .attr('stroke-width', 2)
                .attr('stroke', grey[2])
            const yLinear = d3.scaleLinear()
                .domain([minDegree - 1, maxDegree + 1])
                .range([0, 211])
            let maxCount = 0
            nodes.unshift([minDegree - 1, 0])
            nodes.push([maxDegree + 1, 0])
            nodes.forEach(d => {
                maxCount = Math.max(maxCount, d[1])
            })
            const xLinear = d3.scaleLinear()
                .domain([0, maxCount])
                .range([0, 80])
            const segments = []
            for (let i = 0; i < nodes.length; i++) {
                segments.push({
                    x: width / 2 + xLinear(nodes[i][1]),
                    y: 281 - yLinear(nodes[i][0])
                })
            }
            const line = d3.line()
                .curve(d3.curveBasis)
                .x(d => d.x)
                .y(d => d.y)
            degreeDistributionSvg.append('path')
                .attr('d', line(segments))
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr('fill', 'none')
        }
    }, [nodes])
    return (
        <div className={index.graph} id={'degreeDistributionGraph'}/>
    )
}

export default DegreeDistributionGraph