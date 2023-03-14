import React, {useEffect, useState} from 'react';
import index from './index.module.css';
import {useRecoilState} from "recoil";
import {aState, bState} from "../../state/store";
import {Divider, Slider} from "antd";
import {useDebounceEffect} from "ahooks";
import {A, B} from '../../constants'

const ABControl = () => {
    const [a, setA] = useRecoilState(aState)
    const [b, setB] = useRecoilState(bState)
    const [thisA, setThisA] = useState()
    const [thisB, setThisB] = useState()
    const correspondence1 = [[0, A[0]], [12.5, A[1]], [25, A[2]], [37.5, A[3]], [50, A[4]], [62.5, A[5]], [75, A[6]], [87.5, A[7]], [100, A[8]]]
    const correspondence2 = [[0, B[0]], [11, B[1]], [22, B[2]], [33, B[3]], [44, B[4]], [55, B[5]], [66, B[6]], [77, B[7]], [88, B[8]], [100, B[9]]]
    const changeA = (value) => {
        setThisA(value)
    }
    const changeB = (value) => {
        setThisB(value)
    }
    const marks1 = {
        0: {
            style: {'fontSize': '12px'},
            label: A[0]
        },
        12.5: {
            style: {'fontSize': '12px'},
            label: A[1]
        },
        25: {
            style: {'fontSize': '12px'},
            label: A[2]
        },
        37.5: {
            style: {'fontSize': '12px'},
            label: A[3]
        },
        50: {
            style: {'fontSize': '12px'},
            label: A[4]
        },
        62.5: {
            style: {'fontSize': '12px'},
            label: A[5]
        },
        75: {
            style: {'fontSize': '12px'},
            label: A[6]
        },
        87.5: {
            style: {'fontSize': '12px'},
            label: A[7]
        },
        100: {
            style: {'fontSize': '12px'},
            label: A[8]
        }
    }
    const marks2 = {
        0: {
            style: {'fontSize': '12px'},
            label: B[0]
        },
        12.5: {
            style: {'fontSize': '12px'},
            label: B[1]
        },
        25: {
            style: {'fontSize': '12px'},
            label: B[2]
        },
        37.5: {
            style: {'fontSize': '12px'},
            label: B[3]
        },
        50: {
            style: {'fontSize': '12px'},
            label: B[4]
        },
        62.5: {
            style: {'fontSize': '12px'},
            label: B[5]
        },
        75: {
            style: {'fontSize': '12px'},
            label: B[6]
        },
        87.5: {
            style: {'fontSize': '12px'},
            label: B[7]
        },
        100: {
            style: {'fontSize': '12px'},
            label: B[8]
        }
    }
    useEffect(() => {
        correspondence1.forEach(d => {
            if (d[1] === a) {
                setThisA(d[0])
            }
        })
        correspondence2.forEach(d => {
            if (d[1] === b) {
                setThisB(d[0])
            }
        })
    }, [a, b])
    useDebounceEffect(() => {
        correspondence1.forEach(d => {
            if (d[0] === thisA) {
                setA(d[1])
            }
        })
    }, [thisA])
    useDebounceEffect(() => {
        correspondence2.forEach(d => {
            if (d[0] === thisB) {
                setB(d[1])
            }
        })
    }, [thisB])
    return (
        <div className={index.control}>
            <div className={index.occupy}/>
            <div className={index}>
                <span className={index.span}>α</span>
                <Slider
                    className={index.slider}
                    marks={marks1}
                    tooltip={{open: false}}
                    step={null}
                    value={thisA}
                    onChange={changeA}
                />
            </div>
            <Divider/>
            <div className={index.div}>
                <span className={index.span}>β</span>
                <Slider
                    className={index.slider}
                    marks={marks2}
                    tooltip={{open: false}}
                    step={null}
                    value={thisB}
                    onChange={changeB}
                />
            </div>
        </div>
    )
}

export default ABControl