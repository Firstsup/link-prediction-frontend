import React, {useEffect, useState} from 'react';
import * as d3 from "d3";
import index from './index.module.css';
import {useRecoilState} from "recoil";
import {datasetState} from "../../state/store";
import _ from 'lodash'
import {blue, magenta} from "@ant-design/colors";
import getLERTRResult from "../../api/getLERTRResult";
import {A, B} from '../../constants'

const LERTRGraph = () => {
    const [dataset] = useRecoilState(datasetState)
    const [result, setResult] = useState()
    const width = 296
    const height = 300
    let LERTRSvg
    useEffect(() => {
        getLERTRResult(dataset).then(
            res => {
                if (res.code === 1) {
                    setResult(res.data.score)
                } else {
                    console.log(`LERTR API 报错，错误原因为${res.message}`)
                }
            }
        )
    }, [dataset])
    useEffect(() => {
        if (!_.isUndefined(result)) {
            d3.select('#LERTRGraph').selectAll('*').remove()
            LERTRSvg = d3.select('#LERTRGraph')
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr('viewBox', [0, 0, width, height])
            const spaceWidth = 2
            const spaceHeight = 2
            const rectWidth = (220 - (A.length - 1) * spaceWidth) / A.length
            const rectHeight = (220 - (B.length - 1) * spaceHeight) / B.length
            let maxValue = 0
            let minValue = Number.MAX_VALUE
            for (let i = 0; i < A.length; i++) {
                for (let j = 0; j < B.length; j++) {
                    maxValue = Math.max(maxValue, result[i][j])
                    minValue = Math.min(minValue, result[i][j])
                }
            }
            const linear = d3.scaleLinear()
                .domain([minValue, maxValue])
                .range([0, 1])
            const compute = d3.interpolate(magenta[3], blue[3])
            for (let i = 0; i < A.length; i++) {
                for (let j = 0; j < B.length; j++) {
                    LERTRSvg.append('rect')
                        .attr('x', 45 + i * rectWidth + i * spaceWidth)
                        .attr('y', 246 - (j + 1) * rectHeight - j * spaceHeight)
                        .attr('width', rectWidth)
                        .attr('height', rectHeight)
                        .attr('fill', compute(linear(result[i][j])))
                }
            }
            for (let i = 0; i < A.length; i++) {
                LERTRSvg.append('text')
                    .attr('x', 45 + (i + 0.5) * rectWidth + i * spaceWidth)
                    .attr('y', 260)
                    .attr('font-size', 12)
                    .attr('text-anchor', 'middle')
                    .attr('font-family', 'sans-serif')
                    .text(A[i])
            }
            for (let i = 0; i < B.length; i++) {
                LERTRSvg.append('text')
                    .attr('x', 25)
                    .attr('y', 250 - (i + 0.5) * rectHeight - i * spaceHeight)
                    .attr('font-size', 12)
                    .attr('text-anchor', 'middle')
                    .attr('font-family', 'sans-serif')
                    .text(B[i])
            }
            LERTRSvg.append('text')
                .attr('x', 275)
                .attr('y', 275)
                .attr('text-anchor', 'middle')
                .attr('font-family', 'sans-serif')
                .text('α')
            LERTRSvg.append('text')
                .attr('x', 15)
                .attr('y', 20)
                .attr('text-anchor', 'middle')
                .attr('font-family', 'sans-serif')
                .text('β')
        }
    }, [result])
    return (
        <div className={index.graph} id={'LERTRGraph'}/>
    )
}

export default LERTRGraph