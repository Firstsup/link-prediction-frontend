import React, {useEffect, useState} from 'react';
import * as d3 from "d3";
import index from './index.module.css';
import {useRecoilState} from "recoil";
import {datasetState, algorithmState, aState, bState} from "../../state/store";
import getAUCPrecision from "../../api/getAUCPrecision";
import _ from 'lodash'
import {cyan, grey, lime} from "@ant-design/colors";
import {ALGORITHMS} from "../../constants";
import getLERTRAUCPrecisionOnly from "../../api/getLERTRAUCPrecisionOnly";

const AUCPrecisionGraph = () => {
    const [dataset] = useRecoilState(datasetState)
    const [algorithm] = useRecoilState(algorithmState)
    const [a] = useRecoilState(aState)
    const [b] = useRecoilState(bState)
    const [AUCs, setAUCs] = useState()
    const [precisions, setPrecisions] = useState()
    const width = 890
    const height = 80
    let AUCPrecisionSvg
    useEffect(() => {
        getAUCPrecision(dataset, a, b).then(
            res => {
                const score = res.data.score
                const AUCs = []
                const precisions = []
                score.forEach(d => {
                    AUCs.push(d.AUCScore)
                    precisions.push(d.precisionScore)
                })
                setAUCs(AUCs)
                setPrecisions(precisions)
            }
        )
    }, [dataset])
    useEffect(() => {
        if (!_.isUndefined(AUCs) && !_.isUndefined(precisions)) {
            getLERTRAUCPrecisionOnly(dataset, a, b).then(
                res => {
                    const LERTRScore = res.data.score
                    const tempAUCs = []
                    const tempPrecisions = []
                    for (let i = 0; i < AUCs.length - 1; i++) {
                        tempAUCs[i] = AUCs[i]
                    }
                    tempAUCs[AUCs.length - 1] = LERTRScore.AUCScore
                    for (let i = 0; i < precisions.length - 1; i++) {
                        tempPrecisions[i] = precisions[i]
                    }
                    tempPrecisions[precisions.length - 1] = LERTRScore.precisionScore
                    setAUCs(tempAUCs)
                    setPrecisions(tempPrecisions)
                }
            )
        }
    }, [a, b])
    useEffect(() => {
        if (!_.isUndefined(AUCs) && !_.isUndefined(precisions)) {
            d3.select('#AUCPrecisionGraph').selectAll('*').remove()
            AUCPrecisionSvg = d3.select('#AUCPrecisionGraph')
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr('viewBox', [0, 0, width, height])
            AUCPrecisionSvg.append('text')
                .attr('x', 95)
                .attr('y', 43)
                .attr('text-anchor', 'end')
                .attr('font-family', 'sans-serif')
                .attr('font-size', 16)
                .text('AUC')
            AUCPrecisionSvg.append('text')
                .attr('x', 525)
                .attr('y', 43)
                .attr('text-anchor', 'end')
                .attr('font-family', 'sans-serif')
                .attr('font-size', 16)
                .text('Precision')
            const linear = d3.scaleLinear()
                .domain([0, 1])
                .range([0, 280])
            const defs1 = AUCPrecisionSvg.append('defs')
            const linearGradient1 = defs1
                .append('linearGradient')
                .attr('id', 'gradient1')
            linearGradient1.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', cyan[2])
            linearGradient1.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', cyan[4])
            const defs2 = AUCPrecisionSvg.append('defs')
            const linearGradient2 = defs2
                .append('linearGradient')
                .attr('id', 'gradient2')
            linearGradient2.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', lime[2])
            linearGradient2.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', lime[4])
            AUCPrecisionSvg.append('rect')
                .attr('x', 110)
                .attr('y', 30)
                .attr('width', 280)
                .attr('height', 16)
                .attr('fill', grey[1])
            AUCPrecisionSvg.append('rect')
                .attr('x', 540)
                .attr('y', 30)
                .attr('width', 280)
                .attr('height', 16)
                .attr('fill', grey[1])
            const arc1 = d3.arc()
                .innerRadius(0)
                .outerRadius(8)
                .startAngle(0)
                .endAngle(-Math.PI)
            const arc2 = d3.arc()
                .innerRadius(0)
                .outerRadius(8)
                .startAngle(0)
                .endAngle(Math.PI)
            AUCPrecisionSvg.append('path')
                .attr('d', arc1)
                .attr('fill', cyan[2])
                .attr('transform', `translate(110, 38)`)
            AUCPrecisionSvg.append('path')
                .attr('d', arc2)
                .attr('fill', grey[1])
                .attr('transform', `translate(390, 38)`)
            AUCPrecisionSvg.append('path')
                .attr('d', arc1)
                .attr('fill', lime[2])
                .attr('transform', `translate(540, 38)`)
            AUCPrecisionSvg.append('path')
                .attr('d', arc2)
                .attr('fill', grey[1])
                .attr('transform', `translate(820, 38)`)
            AUCPrecisionSvg.append('rect')
                .attr('x', 110)
                .attr('y', 30)
                .attr('width', linear(AUCs[ALGORITHMS.indexOf(algorithm)]))
                .attr('height', 16)
                .attr('fill', "url('#gradient1')")
            AUCPrecisionSvg.append('rect')
                .attr('x', 540)
                .attr('y', 30)
                .attr('width', linear(precisions[ALGORITHMS.indexOf(algorithm)]))
                .attr('height', 16)
                .attr('fill', "url('#gradient2')")
            AUCPrecisionSvg.append('circle')
                .attr('cx', 110 + linear(AUCs[ALGORITHMS.indexOf(algorithm)]))
                .attr('cy', 38)
                .attr('r', 10)
                .attr('fill', cyan[5])
            AUCPrecisionSvg.append('circle')
                .attr('cx', 110 + linear(AUCs[ALGORITHMS.indexOf(algorithm)]))
                .attr('cy', 38)
                .attr('r', 4)
                .attr('fill', 'white')
            AUCPrecisionSvg.append('circle')
                .attr('cx', 540 + linear(precisions[ALGORITHMS.indexOf(algorithm)]))
                .attr('cy', 38)
                .attr('r', 10)
                .attr('fill', lime[5])
            AUCPrecisionSvg.append('circle')
                .attr('cx', 540 + linear(precisions[ALGORITHMS.indexOf(algorithm)]))
                .attr('cy', 38)
                .attr('r', 4)
                .attr('fill', 'white')
            AUCPrecisionSvg.append('text')
                .attr('x', 110 + linear(AUCs[ALGORITHMS.indexOf(algorithm)]))
                .attr('y', 68)
                .attr('text-anchor', 'middle')
                .attr('fill', grey[5])
                .attr('font-size', 20)
                .attr('font-family', 'sans-serif')
                .text(Number.isInteger(AUCs[ALGORITHMS.indexOf(algorithm)]) ? AUCs[ALGORITHMS.indexOf(algorithm)] : AUCs[ALGORITHMS.indexOf(algorithm)].toFixed(3))
            AUCPrecisionSvg.append('text')
                .attr('x', 540 + linear(precisions[ALGORITHMS.indexOf(algorithm)]))
                .attr('y', 68)
                .attr('text-anchor', 'middle')
                .attr('fill', grey[5])
                .attr('font-size', 20)
                .attr('font-family', 'sans-serif')
                .text(Number.isInteger(precisions[ALGORITHMS.indexOf(algorithm)]) ? precisions[ALGORITHMS.indexOf(algorithm)] : precisions[ALGORITHMS.indexOf(algorithm)].toFixed(3))
            const minAUC = _.min(AUCs)
            const maxAUC = _.max(AUCs)
            const minPrecision = _.min(precisions)
            const maxPrecision = _.max(precisions)
            AUCPrecisionSvg.append('line')
                .attr('x1', 110 + linear(minAUC))
                .attr('y1', 10)
                .attr('x2', 110 + linear(minAUC))
                .attr('y2', 30)
                .attr('stroke', grey[2])
                .attr('stroke-width', 2)
            AUCPrecisionSvg.append('line')
                .attr('x1', 110 + linear(minAUC))
                .attr('y1', 20)
                .attr('x2', 110 + linear(minAUC) + 8)
                .attr('y2', 15)
                .attr('stroke', grey[2])
                .attr('stroke-width', 2)
            AUCPrecisionSvg.append('line')
                .attr('x1', 110 + linear(minAUC))
                .attr('y1', 20)
                .attr('x2', 110 + linear(minAUC) + 8)
                .attr('y2', 25)
                .attr('stroke', grey[2])
                .attr('stroke-width', 2)
            AUCPrecisionSvg.append('line')
                .attr('x1', 110 + linear(maxAUC))
                .attr('y1', 10)
                .attr('x2', 110 + linear(maxAUC))
                .attr('y2', 30)
                .attr('stroke', grey[2])
                .attr('stroke-width', 2)
            AUCPrecisionSvg.append('line')
                .attr('x1', 110 + linear(maxAUC))
                .attr('y1', 20)
                .attr('x2', 110 + linear(maxAUC) - 8)
                .attr('y2', 15)
                .attr('stroke', grey[2])
                .attr('stroke-width', 2)
            AUCPrecisionSvg.append('line')
                .attr('x1', 110 + linear(maxAUC))
                .attr('y1', 20)
                .attr('x2', 110 + linear(maxAUC) - 8)
                .attr('y2', 25)
                .attr('stroke', grey[2])
                .attr('stroke-width', 2)
            AUCPrecisionSvg.append('text')
                .attr('x', 110 + linear(minAUC) - 5)
                .attr('y', 23)
                .attr('text-anchor', 'end')
                .attr('fill', grey[5])
                .attr('font-size', 14)
                .attr('font-family', 'sans-serif')
                .text(`${ALGORITHMS[AUCs.indexOf(minAUC)]}: ${Number.isInteger(minAUC) ? minAUC : minAUC.toFixed(3)}`)
            AUCPrecisionSvg.append('text')
                .attr('x', 110 + linear(maxAUC) + 5)
                .attr('y', 23)
                .attr('text-anchor', 'start')
                .attr('fill', grey[5])
                .attr('font-size', 14)
                .attr('font-family', 'sans-serif')
                .text(`${ALGORITHMS[AUCs.indexOf(maxAUC)]}: ${Number.isInteger(maxAUC) ? maxAUC : maxAUC.toFixed(3)}`)
            AUCPrecisionSvg.append('line')
                .attr('x1', 540 + linear(minPrecision))
                .attr('y1', 10)
                .attr('x2', 540 + linear(minPrecision))
                .attr('y2', 30)
                .attr('stroke', grey[2])
                .attr('stroke-width', 2)
            AUCPrecisionSvg.append('line')
                .attr('x1', 540 + linear(minPrecision))
                .attr('y1', 20)
                .attr('x2', 540 + linear(minPrecision) + 8)
                .attr('y2', 15)
                .attr('stroke', grey[2])
                .attr('stroke-width', 2)
            AUCPrecisionSvg.append('line')
                .attr('x1', 540 + linear(minPrecision))
                .attr('y1', 20)
                .attr('x2', 540 + linear(minPrecision) + 8)
                .attr('y2', 25)
                .attr('stroke', grey[2])
                .attr('stroke-width', 2)
            AUCPrecisionSvg.append('line')
                .attr('x1', 540 + linear(maxPrecision))
                .attr('y1', 10)
                .attr('x2', 540 + linear(maxPrecision))
                .attr('y2', 30)
                .attr('stroke', grey[2])
                .attr('stroke-width', 2)
            AUCPrecisionSvg.append('line')
                .attr('x1', 540 + linear(maxPrecision))
                .attr('y1', 20)
                .attr('x2', 540 + linear(maxPrecision) - 8)
                .attr('y2', 15)
                .attr('stroke', grey[2])
                .attr('stroke-width', 2)
            AUCPrecisionSvg.append('line')
                .attr('x1', 540 + linear(maxPrecision))
                .attr('y1', 20)
                .attr('x2', 540 + linear(maxPrecision) - 8)
                .attr('y2', 25)
                .attr('stroke', grey[2])
                .attr('stroke-width', 2)
            AUCPrecisionSvg.append('text')
                .attr('x', 540 + linear(minPrecision) - 5)
                .attr('y', 23)
                .attr('text-anchor', 'end')
                .attr('fill', grey[5])
                .attr('font-size', 14)
                .attr('font-family', 'sans-serif')
                .text(`${ALGORITHMS[precisions.indexOf(minPrecision)]}: ${Number.isInteger(minPrecision) ? minPrecision : minPrecision.toFixed(3)}`)
            AUCPrecisionSvg.append('text')
                .attr('x', 540 + linear(maxPrecision) + 5)
                .attr('y', 23)
                .attr('text-anchor', 'start')
                .attr('fill', grey[5])
                .attr('font-size', 14)
                .attr('font-family', 'sans-serif')
                .text(`${ALGORITHMS[precisions.indexOf(maxPrecision)]}: ${Number.isInteger(maxPrecision) ? maxPrecision : maxPrecision.toFixed(3)}`)
        }
    }, [AUCs, precisions, algorithm])
    return (
        <div className={index.graph} id={'AUCPrecisionGraph'}/>
    )
}

export default AUCPrecisionGraph