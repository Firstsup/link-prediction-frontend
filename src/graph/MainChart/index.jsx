import React from 'react';
import * as d3 from "d3";
import index from './index.module.css';
import {useMount} from "ahooks";

const MainChart = () => {
    const author1 = [3, 1, 1, 0.25, 0.1458]
    const author2 = [9, 14, 2, 3.1595, 4.1501]
    const part1 = [[8, 10, 1], [10, 14, 3], [3, 3, 3]]
    const part2 = [[2, 5, 3], [4, 5, 7], [3, 3, 3], [6, 7, 7]]
    const part3 = [[2, 7, 3], [4, 2, 1], [3, 5, 3], [6, 8, 3]]
    const part4 = [[2, 2, 2], [5, 14, 3], [3, 3, 3], [4, 3, 6], [2, 5, 7]]
    const color1 = ["#003a8c", "#0050b3", "#096dd9", "#1890ff", "#40a9ff", "#69c0ff", "#91d5ff", "#bae7ff"]
    useMount(() => {
        const svg = d3.select('#mainChart')
            .append("svg")
            .attr("width", 1200)
            .attr("height", 630)
        svg.selectAll(".line1")
            .data(part1)
            .enter()
            .append("line")
            .attr("x1", 125)
            .attr("y1", (d, i) => {
                return 75 + 300 / (part1.length - 1) * i
            })
            .attr("x2", 275)
            .attr("y2", 225)
            .attr("stroke", (d, i) => {
                return color1[Number(d[2])]
            })
            .attr("stroke-width", (d, i) => {
                return d[1]
            })
        svg.selectAll(".line2")
            .data(part2)
            .enter()
            .append("line")
            .attr("x1", 400)
            .attr("y1", (d, i) => {
                return 75 + 300 / (part2.length - 1) * i
            })
            .attr("x2", 275)
            .attr("y2", 225)
            .attr("stroke", (d, i) => {
                return color1[Number(d[2])]
            })
            .attr("stroke-width", (d, i) => {
                return d[1]
            })
        svg.selectAll(".line3")
            .data(part3)
            .enter()
            .append("line")
            .attr("x1", 400)
            .attr("y1", (d, i) => {
                return 75 + 300 / (part2.length - 1) * i
            })
            .attr("x2", 525)
            .attr("y2", 225)
            .attr("stroke", (d, i) => {
                return color1[Number(d[2])]
            })
            .attr("stroke-width", (d, i) => {
                return d[1]
            })
        svg.selectAll(".line4")
            .data(part4)
            .enter()
            .append("line")
            .attr("x1", 675)
            .attr("y1", (d, i) => {
                return 75 + 300 / (part4.length - 1) * i
            })
            .attr("x2", 525)
            .attr("y2", 225)
            .attr("stroke", (d, i) => {
                return color1[Number(d[2])]
            })
            .attr("stroke-width", (d, i) => {
                return d[1]
            })
        svg.append("rect")
            .attr("id", "rect1")
            .attr("x", 250)
            .attr("y", 200)
            .attr("width", 50)
            .attr("height", 50)
            .attr("fill", "#69c0ff")
            .attr("stroke", "#b37feb")
        svg.append("rect")
            .attr("id", "rect2")
            .attr("x", 500)
            .attr("y", 200)
            .attr("width", 50)
            .attr("height", 50)
            .attr("fill", "#69c0ff")
            .attr("stroke", "#b37feb")
        svg.selectAll(".author1")
            .data(author1)
            .enter()
            .append("rect")
            .attr("class", "author1")
            .attr("x", 300)
            .attr("y", (d, i) => {
                return 200 + i * 10
            })
            .attr("width", (d, i) => {
                return d * 10
            })
            .attr("height", 9)
            .attr("fill", "#ff4d4f")
        svg.selectAll(".author2")
            .data(author2)
            .enter()
            .append("rect")
            .attr("class", author2)
            .attr("x", (d, i) => {
                return 500 - d * 10
            })
            .attr("y", (d, i) => {
                return 200 + i * 10 + 0.5
            })
            .attr("width", (d, i) => {
                return d * 10
            })
            .attr("height", 9)
            .attr("fill", "#ff4d4f")
        svg.selectAll(".part1")
            .data(part1)
            .enter()
            .append("circle")
            .attr("cx", 125)
            .attr("cy", (d, i) => {
                return 75 + 300 / (part1.length - 1) * i
            })
            .attr("r", (d, i) => {
                return d[0] * 3
            })
            .attr("fill", "#95de64")
            .attr("stroke", "#b37feb")
        svg.selectAll(".part2")
            .data(part2)
            .enter()
            .append("circle")
            .attr("cx", 400)
            .attr("cy", (d, i) => {
                return 75 + 300 / (part2.length - 1) * i
            })
            .attr("r", (d, i) => {
                return d[0] * 3
            })
            .attr("fill", "#95de64")
            .attr("stroke", "#b37feb")
        svg.selectAll(".part3")
            .data(part4)
            .enter()
            .append("circle")
            .attr("cx", 675)
            .attr("cy", (d, i) => {
                return 75 + 300 / (part4.length - 1) * i
            })
            .attr("r", (d, i) => {
                return d[0] * 3
            })
            .attr("fill", "#95de64")
            .attr("stroke", "#b37feb")
    })
    return (
        <div className={index.all} id={'mainChart'}/>
    )
}

export default MainChart