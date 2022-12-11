import React, {useEffect, useState} from 'react';
import * as d3 from "d3";
import index from './index.module.css';
import {useRecoilState} from "recoil";
import {algorithmState, aState, bState, datasetState, matrixState, node1State, node2State} from "../../state/store";
import _ from 'lodash'
import {blue, grey} from "@ant-design/colors";
import getAlgorithmResult from "../../api/getAlgorithmResult";
import {ALGORITHMS} from "../../constants";

const AlgorithmResultGraph = () => {
    const [dataset] = useRecoilState(datasetState)
    const [algorithm] = useRecoilState(algorithmState)
    const [node1] = useRecoilState(node1State)
    const [node2] = useRecoilState(node2State)
    const [a] = useRecoilState(aState)
    const [b] = useRecoilState(bState)
    const [matrix] = useRecoilState(matrixState)
    const [ranks, setRanks] = useState()
    const [nodesCount, setNodesCount] = useState()
    const width = 296
    const height = 300
    let algorithmResultSvg
    useEffect(() => {
        getAlgorithmResult(dataset, node1, node2, a, b).then(
            res => {
                setRanks(res.data.result)
                setNodesCount(res.data.nodesCount)
            }
        )
    }, [dataset, node1, node2, a, b])
    useEffect(() => {
        if (!_.isUndefined(ranks) && !_.isUndefined(nodesCount) && matrix.length !== 0) {
            d3.select('#algorithmResultGraph').selectAll('*').remove()
            algorithmResultSvg = d3.select('#algorithmResultGraph')
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr('viewBox', [0, 0, width, height])
            const linear = d3.scaleLinear()
                .domain([(nodesCount * (nodesCount - 1)) / 2, 0])
                .range([0, 100])
            const arcs = []
            for (let i = 0; i < 11; i++) {
                arcs.push(d3.arc()
                    .innerRadius(0)
                    .outerRadius(linear(ranks[i]))
                    .startAngle(i * 2 * Math.PI / 11)
                    .endAngle((i + 1) * 2 * Math.PI / 11))
            }
            for (let i = 0; i < 11; i++) {
                algorithmResultSvg.append('path')
                    .attr('d', arcs[i])
                    .attr('fill', ALGORITHMS.indexOf(algorithm) === i ? blue[5] : blue[1])
                    .attr('stroke', grey[1])
                    .attr('transform', `translate(${width / 2}, ${height / 2 + 20})`)
                    .style('cursor', 'pointer')
                    .on('mouseover', function () {
                        algorithmResultSvg.append('text')
                            .classed('temp', true)
                            .attr('x', width / 2 + Math.sin((i + 0.5) * 2 * Math.PI / 11) * linear(ranks[i]) / 2)
                            .attr('y', height / 2 + 20 - Math.cos((i + 0.5) * 2 * Math.PI / 11) * linear(ranks[i]) / 2)
                            .attr('text-anchor', 'middle')
                            .attr('font-family', 'sans-serif')
                            .attr('transform', `translate(0, 5)`)
                            .text(ranks[i])
                    })
                    .on('mouseout', function () {
                        algorithmResultSvg.selectAll('.temp').remove()
                    })
            }
            for (let i = 0; i < 11; i++) {
                algorithmResultSvg.append('line')
                    .attr('x1', width / 2)
                    .attr('y1', height / 2 + 20)
                    .attr('x2', width / 2 + Math.sin(i * 2 * Math.PI / 11) * 100)
                    .attr('y2', height / 2 + 20 - Math.cos(i * 2 * Math.PI / 11) * 100)
                    .attr('stroke', grey[1])
            }
            for (let i = 0; i < 11; i++) {
                algorithmResultSvg.append('text')
                    .attr('x', width / 2 + Math.sin((i + 0.5) * 2 * Math.PI / 11) * 115)
                    .attr('y', height / 2 + 20 - Math.cos((i + 0.5) * 2 * Math.PI / 11) * 115)
                    .attr('text-anchor', 'middle')
                    .attr('font-family', 'sans-serif')
                    .attr('transform', `translate(0, 5)`)
                    .text(ALGORITHMS[i])
            }
            algorithmResultSvg.append('circle')
                .attr('cx', width / 2)
                .attr('cy', height / 2 + 20)
                .attr('r', 100)
                .attr('stroke', grey[1])
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', '5, 2')
                .attr('fill', 'none')
            algorithmResultSvg.append('circle')
                .attr('cx', width / 2)
                .attr('cy', height / 2 + 20)
                .attr('r', 4)
            algorithmResultSvg.append('text')
                .attr('x', width / 2)
                .attr('y', 30)
                .attr('text-anchor', 'middle')
                .attr('font-family', 'sans-serif')
                .attr('font-size', 20)
                .text(`Score: ${Number.isInteger(matrix[node1 - 1][node2 - 1]) ? matrix[node1 - 1][node2 - 1] : matrix[node1 - 1][node2 - 1].toFixed(3)}`)
        }
    }, [ranks, nodesCount, matrix])
    return (
        <div className={index.graph} id={'algorithmResultGraph'}/>
    )
}

export default AlgorithmResultGraph