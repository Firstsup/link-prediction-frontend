import React, {useEffect, useState} from 'react';
import {Input, Typography, Divider, Table, Switch} from 'antd';
import index from './index.module.css'
import {node1State, node2State, datasetState, algorithmState, matrixState} from "../../state/store";
import {useRecoilState} from "recoil";
import getMatrix from "../../api/getMatrix";
import * as d3 from "d3";

const Console = () => {
    const [node1, setNode1] = useRecoilState(node1State)
    const [node2, setNode2] = useRecoilState(node2State)
    const [dataset, setDataset] = useRecoilState(datasetState)
    const [algorithm, setAlgorithm] = useRecoilState(algorithmState)
    const [matrix, setMatrix] = useRecoilState(matrixState)
    const [allTableData, setAllTableData] = useState()
    const [node1TableData, setNode1TableData] = useState()
    const [switchChecked, setSwitchChecked] = useState(true)
    const changeNode1 = (value) => {
        setNode1(value)
    }
    const changeNode2 = (value) => {
        setNode2(value)
    }
    const changeSwitch = (checked) => {
        setSwitchChecked(checked)
    }
    const allColumns = [
        {
            title: 'Ranking',
            dataIndex: 'ranking',
            key: 'ranking',
            align: 'center',
            render: (text) => <strong>{text}</strong>
        },
        {
            title: 'Node1',
            dataIndex: 'node1',
            key: 'node1',
            align: 'center'
        },
        {
            title: 'Node2',
            dataIndex: 'node2',
            key: 'node2',
            align: 'center'
        },
        {
            title: 'Score',
            dataIndex: 'score',
            key: 'score',
            align: 'center'
        }
    ]
    const node1Columns = [
        {
            title: 'Ranking',
            dataIndex: 'ranking',
            key: 'ranking',
            align: 'center',
            render: (text) => <strong>{text}</strong>
        },
        {
            title: 'Node1',
            dataIndex: 'node1',
            key: 'node1',
            align: 'center',
            onCell: (_, index) => {
                if (index === 0) {
                    return {rowSpan: 12}
                } else {
                    return {rowSpan: 0}
                }
            }
        },
        {
            title: 'Node2',
            dataIndex: 'node2',
            key: 'node2',
            align: 'center'
        },
        {
            title: 'Score',
            dataIndex: 'score',
            key: 'score',
            align: 'center'
        }
    ]
    const rowSelection = {
        type: 'radio',
        onChange: (selectedRowKeys, selectedRows) => {
            setNode1(selectedRows[0].node1)
            setNode2(selectedRows[0].node2)
        }
    }
    useEffect(() => {
        getMatrix(dataset, algorithm).then(
            res => {
                if (res.code === 1) {
                    const matrix = res.data.matrix
                    setMatrix(matrix)
                    const sortArr = []
                    for (let i = 0; i < matrix.length; i++) {
                        for (let j = i + 1; j < matrix.length; j++) {
                            sortArr.push([i + 1, j + 1, matrix[i][j]])
                        }
                    }
                    sortArr.sort((a, b) => {
                        return b[2] - a[2]
                    })
                    const tempAllTableData = []
                    for (let i = 0; i < 12; i++) {
                        tempAllTableData.push({
                            key: `${i + 1}`,
                            ranking: `${i + 1}`,
                            node1: sortArr[i][0],
                            node2: sortArr[i][1],
                            score: sortArr[i][2]
                        })
                    }
                    setAllTableData(tempAllTableData)
                } else {
                    console.log(`控制台 API 报错，错误原因为${res.message}`)
                }
            }
        )
    }, [dataset, algorithm])
    useEffect(() => {
        getMatrix(dataset, algorithm).then(
            res => {
                if (res.code === 1) {
                    const matrix = res.data.matrix
                    setMatrix(matrix)
                    const sortArr = []
                    for (let i = 0; i < matrix.length; i++) {
                        if (node1 - 1 < i) {
                            sortArr.push([i + 1, matrix[node1 - 1][i]])
                        } else if (node1 - 1 > i) {
                            sortArr.push([i + 1, matrix[i][node1 - 1]])
                        }
                    }
                    sortArr.sort((a, b) => {
                        return b[1] - a[1]
                    })
                    const tempNode1TableData = []
                    for (let i = 0; i < 12; i++) {
                        tempNode1TableData.push({
                            key: `${i + 1}`,
                            ranking: `${i + 1}`,
                            node1: node1,
                            node2: sortArr[i][0],
                            score: sortArr[i][1]
                        })
                    }
                    setNode1TableData(tempNode1TableData)
                } else {
                    console.log(`控制台 API 报错，错误原因为${res.message}`)
                }
            }
        )
    }, [dataset, algorithm, node1])
    return (
        <div className={index.console}>
            <Typography.Title level={3} className={index.title}>Console</Typography.Title>
            <Switch
                className={index.switch}
                checkedChildren={'All'}
                unCheckedChildren={'Node1'}
                defaultChecked
                onChange={changeSwitch}
            />
            <Divider/>
            <Input.Search className={index.search} onSearch={changeNode1} addonBefore={'Node1 '}/>
            <Input.Search onSearch={changeNode2} addonBefore={'Node2 '}/>
            <Divider/>
            {switchChecked ?
                <Table
                    columns={allColumns}
                    dataSource={allTableData}
                    pagination={false}
                    bordered={true}
                    size={'middle'}
                    rowSelection={rowSelection}
                /> :
                <Table
                    columns={node1Columns}
                    dataSource={node1TableData}
                    pagination={false}
                    bordered={true}
                    size={'middle'}
                    rowSelection={rowSelection}
                />}
        </div>
    )
}

export default Console