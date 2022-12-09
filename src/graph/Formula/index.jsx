import React from 'react';
import index from './index.module.css';
import {useRecoilState} from "recoil";
import {algorithmState, hoverState} from "../../state/store";
import {MathComponent} from 'mathjax-react'

const Formula = () => {
    const [, setHover] = useRecoilState(hoverState)
    const [algorithm] = useRecoilState(algorithmState)
    switch (algorithm) {
        case 'CN':
            return (
                <div className={index.formula}>
                    <div style={{height: 45}}/>
                    <MathComponent tex={'\\LARGE{S_{xy}=\\vert\\Gamma_x\\cap\\Gamma_y\\vert}'}/>
                    <div className={index.CNDiv1} onMouseOver={() => setHover(1)} onMouseOut={() => setHover(0)}/>
                    <div className={index.CNDiv2} onMouseOver={() => setHover(2)} onMouseOut={() => setHover(0)}/>
                </div>
            )
        case 'AA':
            return (
                <div className={index.formula}>
                    <div style={{height: 30}}/>
                    <MathComponent tex={'\\LARGE{S_{xy}=\\displaystyle\\sum_{z\\in\\Gamma_x\\cap\\Gamma_y}\\frac{1}{\\log k_z}}'}/>
                    <div className={index.AADiv1} onMouseOver={() => setHover(1)} onMouseOut={() => setHover(0)}/>
                    <div className={index.AADiv2} onMouseOver={() => setHover(2)} onMouseOut={() => setHover(0)}/>
                    <div className={index.AADiv3} onMouseOver={() => setHover(3)} onMouseOut={() => setHover(0)}/>
                    <div className={index.AADiv4} onMouseOver={() => setHover(3)} onMouseOut={() => setHover(0)}/>
                </div>
            )
        case 'RA':
            return (
                <div className={index.formula}>
                    <div style={{height: 30}}/>
                    <MathComponent tex={'\\LARGE{S_{xy}=\\displaystyle\\sum_{z\\in\\Gamma_x\\cap\\Gamma_y}\\frac{1}{k_z}}'}/>
                    <div className={index.RADiv1} onMouseOver={() => setHover(1)} onMouseOut={() => setHover(0)}/>
                    <div className={index.RADiv2} onMouseOver={() => setHover(2)} onMouseOut={() => setHover(0)}/>
                    <div className={index.RADiv3} onMouseOver={() => setHover(3)} onMouseOut={() => setHover(0)}/>
                    <div className={index.RADiv4} onMouseOver={() => setHover(3)} onMouseOut={() => setHover(0)}/>
                </div>
            )
        default:
            return (
                <div className={index.formula}/>
            )
    }
}

export default Formula