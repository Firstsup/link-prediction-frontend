import React, {useEffect, useState} from 'react';
import * as d3 from "d3";
import index from './index.module.css';
import {useMount} from "ahooks";
import getStatistics from "../../api/getStatistics";
import {useRecoilState} from "recoil";
import {datasetState} from "../../state/store";
import {geekblue, grey, lime, magenta} from "@ant-design/colors";
import _ from 'lodash'

const StatisticsGraph = () => {
    const [dataset] = useRecoilState(datasetState)
    const [statistics, setStatistics] = useState()
    const width = 341
    const height = 340
    const statisticsText = ['Size', 'Clustering Coefficient', 'Power Law Exponent', 'Gini Coefficient', 'Mean Distance', 'Diameter', 'Average Degree', 'Volume']
    const statisticsUnit = ['n', 'c', 'γ', 'G', 'δm', 'δ', `d`, 'm']
    let statisticsSvg
    useMount(() => {
        getStatistics().then(
            res => {
                if (res.code === 1) {
                    setStatistics(res.data.statistics)
                } else {
                    console.log(`图参数 API 报错，错误原因为${res.message}`)
                }
            }
        )
    })
    useEffect(() => {
        if (!_.isUndefined(statistics)) {
            d3.select('#statisticsGraph').selectAll('*').remove()
            statisticsSvg = d3.select('#statisticsGraph')
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr('viewBox', [0, 0, width, height])
            let currentStatistic
            statistics.forEach((d, i) => {
                if (d.datasetName === dataset) {
                    currentStatistic = d
                }
            })
            const radiusReduce = 33
            const computeTextAnchor = (i) => {
                if (i === 0 || i === 4) {
                    return 'middle'
                } else if (i >= 1 && i <= 3) {
                    return 'end'
                } else {
                    return 'start'
                }
            }
            const linears = []
            const averages = []
            statisticsText.forEach(d => {
                const label = d[0].toLowerCase().concat(d.substring(1)).replace(/\s/g, "")
                let min = Number.MAX_VALUE
                let max = 0
                let sum = 0
                let count = 0
                statistics.forEach(d => {
                    if (d[label]) {
                        count++
                        sum += d[label]
                        if (d[label] < min) {
                            min = d[label]
                        }
                        if (d[label] > max) {
                            max = d[label]
                        }
                    }
                })
                linears.push(d3.scaleLinear()
                    .domain([min * 0.9, max * 1.1])
                    .range([0, radiusReduce * 4]))
                averages.push(sum / count)
            })
            for (let i = 0; i <= 3; i++) {
                const arc = d3.arc()
                    .innerRadius(i * radiusReduce)
                    .outerRadius((i + 1) * radiusReduce)
                    .startAngle(0)
                    .endAngle(Math.PI * 2)
                statisticsSvg.append('path')
                    .attr('d', arc)
                    .attr('stroke', grey[3])
                    .attr('fill', i % 2 === 0 ? '#F0FFF0' : '#F0FFFF')
                    .attr('transform', `translate(${width / 2}, ${height / 2})`)
            }
            for (let i = 0; i < 8; i++) {
                statisticsSvg.append('line')
                    .attr('x1', width / 2)
                    .attr('y1', height / 2)
                    .attr('x2', width / 2 + Math.sin(2 * Math.PI / 8 * i) * radiusReduce * 4)
                    .attr('y2', height / 2 + Math.cos(2 * Math.PI / 8 * i) * radiusReduce * 4)
                    .attr('stroke', grey[1])
            }
            statisticsSvg.selectAll('text')
                .data(statisticsUnit)
                .enter()
                .append('text')
                .attr('x', (d, i) => width / 2 + Math.sin(2 * Math.PI / 8 * (i + 4)) * (radiusReduce * 4 + 15))
                .attr('y', (d, i) => height / 2 + Math.cos(2 * Math.PI / 8 * (i + 4)) * (radiusReduce * 4 + 15) + 5)
                .attr('text-anchor', (d, i) => computeTextAnchor(i))
                .text(d => d)
            const points = []
            for (let i = 0; i < 8; i++) {
                statisticsSvg.append('line')
                    .attr('x1', width / 2 + Math.sin(2 * Math.PI / 8 * (i + 4)) * linears[i](averages[i]))
                    .attr('y1', height / 2 + Math.cos(2 * Math.PI / 8 * (i + 4)) * linears[i](averages[i]))
                    .attr('x2', width / 2 + Math.sin(2 * Math.PI / 8 * (i + 4 + 1)) * linears[(i + 1) % 8](averages[(i + 1) % 8]))
                    .attr('y2', height / 2 + Math.cos(2 * Math.PI / 8 * (i + 4 + 1)) * linears[(i + 1) % 8](averages[(i + 1) % 8]))
                    .attr('stroke-width', 2)
                    .attr('stroke-dasharray', '5, 2')
                    .attr('stroke', grey[2])
            }
            for (let i = 0; i < 8; i++) {
                const currentLabel = statisticsText[i][0].toLowerCase().concat(statisticsText[i].substring(1)).replace(/\s/g, "")
                const nextLabel = statisticsText[(i + 1) % 8][0].toLowerCase().concat(statisticsText[(i + 1) % 8].substring(1)).replace(/\s/g, "")
                points.push([width / 2 + Math.sin(2 * Math.PI / 8 * (i + 4)) * linears[i](currentStatistic[currentLabel]), height / 2 + Math.cos(2 * Math.PI / 8 * (i + 4)) * linears[i](currentStatistic[currentLabel])])
                statisticsSvg.append('line')
                    .attr('x1', width / 2 + Math.sin(2 * Math.PI / 8 * (i + 4)) * linears[i](currentStatistic[currentLabel]))
                    .attr('y1', height / 2 + Math.cos(2 * Math.PI / 8 * (i + 4)) * linears[i](currentStatistic[currentLabel]))
                    .attr('x2', width / 2 + Math.sin(2 * Math.PI / 8 * (i + 4 + 1)) * linears[(i + 1) % 8](currentStatistic[nextLabel]))
                    .attr('y2', height / 2 + Math.cos(2 * Math.PI / 8 * (i + 4 + 1)) * linears[(i + 1) % 8](currentStatistic[nextLabel]))
                    .transition()
                    .duration(500)
                    .attr('stroke-width', 3)
                    .attr("stroke", geekblue[3])
            }
            let pointsStr = ''
            points.forEach(d => {
                pointsStr += `${d[0]},${d[1]} `
            })
            statisticsSvg.append('polygon')
                .attr('points', pointsStr)
                .transition()
                .duration(500)
                .attr('fill', magenta[2])
                .attr('opacity', 0.3)
            for (let i = 0; i < 8; i++) {
                statisticsSvg.append('circle')
                    .attr('cx', width / 2 + Math.sin(2 * Math.PI / 8 * (i + 4)) * linears[i](averages[i]))
                    .attr('cy', height / 2 + Math.cos(2 * Math.PI / 8 * (i + 4)) * linears[i](averages[i]))
                    .on('mouseover', function (event) {
                        d3.select(this)
                            .style('cursor', 'pointer')
                        statisticsSvg.append('text')
                            .classed('temp', true)
                            .attr('x', event.offsetX + 5)
                            .attr('y', event.offsetY - 5)
                            .style('font-weight', 'bold')
                            .text(averages[i])
                    })
                    .on('mouseout', function () {
                        statisticsSvg.select('.temp')
                            .remove()
                    })
                    .attr('r', 3)
                    .attr('fill', grey[1])
            }
            for (let i = 0; i < 8; i++) {
                const currentLabel = statisticsText[i][0].toLowerCase().concat(statisticsText[i].substring(1)).replace(/\s/g, "")
                statisticsSvg.append('circle')
                    .attr('cx', width / 2 + Math.sin(2 * Math.PI / 8 * (i + 4)) * linears[i](currentStatistic[currentLabel]))
                    .attr('cy', height / 2 + Math.cos(2 * Math.PI / 8 * (i + 4)) * linears[i](currentStatistic[currentLabel]))
                    .on('mouseover', function (event) {
                        d3.select(this)
                            .style('cursor', 'pointer')
                        statisticsSvg.append('text')
                            .classed('temp', true)
                            .attr('x', event.offsetX + 5)
                            .attr('y', event.offsetY - 5)
                            .style('font-weight', 'bold')
                            .text(currentStatistic[currentLabel])
                    })
                    .on('mouseout', function () {
                        statisticsSvg.select('.temp')
                            .remove()
                    })
                    .transition()
                    .duration(500)
                    .attr('r', 4)
                    .attr('fill', lime[8])
            }
            statisticsSvg.append('circle')
                .attr('cx', width / 2)
                .attr('cy', height / 2)
                .attr('r', 4)
        }
    }, [dataset, statistics])
    return (
        <div className={index.graph} id={'statisticsGraph'}/>
    )
}

export default StatisticsGraph