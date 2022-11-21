import React from 'react';
import * as d3 from "d3";
import index from './index.module.css';
import {useRecoilState} from "recoil";
import {node1State, node2State} from "../../state/store";
import {Input} from "antd";

const AnalysisGraph = () => {
    const [node1, setNode1] = useRecoilState(node1State)
    const [node2, setNode2] = useRecoilState(node2State)
    return (
        <>
            <Input value={node1}/>
            <Input value={node2}/>
            <div className={index.graph} id={'analysisGraph'}/>
        </>
    )
}

export default AnalysisGraph