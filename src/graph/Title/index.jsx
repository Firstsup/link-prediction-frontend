import React from 'react';
import index from './index.module.css'
import {Select} from "antd";
import {datasetState, algorithmState} from '../../state/store';
import {useRecoilState} from "recoil";

const Title = () => {
    const [dataset, setDataset] = useRecoilState(datasetState)
    const [algorithm, setAlgorithm] = useRecoilState(datasetState)
    const handleDatasetChange = (value) => {
        setDataset(value)
    }
    const handleAlgorithmChange = (value) => {
        setAlgorithm(value)
    }
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
                    options={[
                        {
                            value: "football",
                            label: "football"
                        },
                        {
                            value: "zachary",
                            label: "zachary"
                        }
                    ]}
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
                        }
                    ]}
                />
            </div>
        </div>
    )
}

export default Title