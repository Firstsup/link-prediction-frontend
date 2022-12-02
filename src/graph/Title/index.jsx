import React from 'react';
import index from './index.module.css'
import {Select} from "antd";
import {datasetState, algorithmState} from '../../state/store';
import {useRecoilState} from "recoil";
import {DATASETS, ALGORITHMS} from "../../constants";

const Title = () => {
    const [dataset, setDataset] = useRecoilState(datasetState)
    const [algorithm, setAlgorithm] = useRecoilState(algorithmState)
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
            <div className={index.text}>LP-VIS</div>
            <div className={index.selectDiv}>
                <span className={index.selectText}>
                Select Dataset
                </span>
                <Select
                    defaultValue={"football"}
                    onChange={handleDatasetChange}
                    options={datasetOptions}
                />
                <span className={index.selectText}>
                Select Algorithm
                </span>
                <Select
                    defaultValue={"CN"}
                    onChange={handleAlgorithmChange}
                    options={[
                        {
                            value: "CN",
                            label: "CN"
                        },
                        {
                            value: 'AA',
                            label: 'AA'
                        },
                        {
                            value: 'RA',
                            label: 'RA'
                        },
                        {
                            value: 'PA',
                            label: 'PA'
                        },
                        {
                            value: 'HDI',
                            label: 'HDI'
                        },
                        {
                            value: 'HPI',
                            label: 'HPI'
                        },
                        {
                            value: 'SI',
                            label: 'SI'
                        },
                        {
                            value: 'SOL',
                            label: 'SOL'
                        },
                        {
                            value: 'CH',
                            label: 'CH'
                        },
                        {
                            value: 'ERD',
                            label: 'ERD'
                        },
                        {
                            value: 'LERD',
                            label: 'LERD'
                        }
                    ]}
                />
            </div>
        </div>
    )
}

export default Title