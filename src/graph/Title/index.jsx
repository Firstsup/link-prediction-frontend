import React from 'react';
import index from './index.module.css'
import {Select} from "antd";
import {datasetState, algorithmState} from '../../state/store';
import {useRecoilState} from "recoil";
import {DATASETS, ALGORITHMS} from "../../constants";

const Title = () => {
    const [, setDataset] = useRecoilState(datasetState)
    const [, setAlgorithm] = useRecoilState(algorithmState)
    const handleDatasetChange = (value) => {
        setDataset(value)
    }
    const handleAlgorithmChange = (value) => {
        setAlgorithm(value)
    }
    const datasetOptions = []
    DATASETS.forEach(d => {
        datasetOptions.push({
            value: d,
            label: d
        })
    })
    const algorithmOptions = []
    ALGORITHMS.forEach(d => {
        algorithmOptions.push({
            value: d,
            label: d
        })
    })
    return (
        <div className={index.title}>
            <div className={index.text}>LPExplorer</div>
            <div className={index.selectDiv}>
                <span className={index.selectText}>
                Select Dataset
                </span>
                <Select
                    className={index.select1}
                    defaultValue={"football"}
                    onChange={handleDatasetChange}
                    options={datasetOptions}
                />
                <span className={index.selectText}>
                Select Algorithm
                </span>
                <Select
                    className={index.select2}
                    defaultValue={"CN"}
                    onChange={handleAlgorithmChange}
                    options={algorithmOptions}
                />
            </div>
        </div>
    )
}

export default Title