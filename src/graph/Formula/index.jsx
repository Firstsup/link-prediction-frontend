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
                    <MathComponent
                        tex={'\\LARGE{S_{xy}=\\displaystyle\\sum_{z\\in\\Gamma_x\\cap\\Gamma_y}\\frac{1}{\\log k_z}}'}/>
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
                    <MathComponent
                        tex={'\\LARGE{S_{xy}=\\displaystyle\\sum_{z\\in\\Gamma_x\\cap\\Gamma_y}\\frac{1}{k_z}}'}/>
                    <div className={index.RADiv1} onMouseOver={() => setHover(1)} onMouseOut={() => setHover(0)}/>
                    <div className={index.RADiv2} onMouseOver={() => setHover(2)} onMouseOut={() => setHover(0)}/>
                    <div className={index.RADiv3} onMouseOver={() => setHover(3)} onMouseOut={() => setHover(0)}/>
                    <div className={index.RADiv4} onMouseOver={() => setHover(3)} onMouseOut={() => setHover(0)}/>
                </div>
            )
        case 'PA':
            return (
                <div className={index.formula}>
                    <div style={{height: 45}}/>
                    <MathComponent tex={'\\LARGE{S_{xy}=\\vert\\Gamma_x\\vert\\cdot\\vert\\Gamma_y\\vert}'}/>
                    <div className={index.PADiv1} onMouseOver={() => setHover(1)} onMouseOut={() => setHover(0)}/>
                    <div className={index.PADiv2} onMouseOver={() => setHover(2)} onMouseOut={() => setHover(0)}/>
                </div>
            )
        case 'HDI':
            return (
                <div className={index.formula}>
                    <div style={{height: 30}}/>
                    <MathComponent
                        tex={'\\LARGE{S_{xy}=\\frac{\\vert\\Gamma_x\\cap\\Gamma_y\\vert}{\\max\\{k_x,k_y\\}}}'}/>
                    <div className={index.HDIDiv1} onMouseOver={() => setHover(1)} onMouseOut={() => setHover(0)}/>
                    <div className={index.HDIDiv2} onMouseOver={() => setHover(2)} onMouseOut={() => setHover(0)}/>
                    <div className={index.HDIDiv3} onMouseOver={() => setHover(4)} onMouseOut={() => setHover(0)}/>
                    <div className={index.HDIDiv4} onMouseOver={() => setHover(5)} onMouseOut={() => setHover(0)}/>
                </div>
            )
        case 'HPI':
            return (
                <div className={index.formula}>
                    <div style={{height: 30}}/>
                    <MathComponent
                        tex={'\\LARGE{S_{xy}=\\frac{\\vert\\Gamma_x\\cap\\Gamma_y\\vert}{\\min\\{k_x,k_y\\}}}'}/>
                    <div className={index.HPIDiv1} onMouseOver={() => setHover(1)} onMouseOut={() => setHover(0)}/>
                    <div className={index.HPIDiv2} onMouseOver={() => setHover(2)} onMouseOut={() => setHover(0)}/>
                    <div className={index.HPIDiv3} onMouseOver={() => setHover(4)} onMouseOut={() => setHover(0)}/>
                    <div className={index.HPIDiv4} onMouseOver={() => setHover(5)} onMouseOut={() => setHover(0)}/>
                </div>
            )
        case 'SI':
            return (
                <div className={index.formula}>
                    <div style={{height: 30}}/>
                    <MathComponent
                        tex={'\\LARGE{S_{xy}=\\frac{\\vert\\Gamma_x\\cap\\Gamma_y\\vert}{\\sqrt{k_x\\cdot k_y}}}'}/>
                    <div className={index.SIDiv1} onMouseOver={() => setHover(1)} onMouseOut={() => setHover(0)}/>
                    <div className={index.SIDiv2} onMouseOver={() => setHover(2)} onMouseOut={() => setHover(0)}/>
                    <div className={index.SIDiv3} onMouseOver={() => setHover(4)} onMouseOut={() => setHover(0)}/>
                    <div className={index.SIDiv4} onMouseOver={() => setHover(5)} onMouseOut={() => setHover(0)}/>
                </div>
            )
        case 'SOL':
            return (
                <div className={index.formula}>
                    <div style={{height: 30}}/>
                    <MathComponent
                        tex={'\\LARGE{S_{xy}=\\frac{2\\vert\\Gamma_x\\cap\\Gamma_y\\vert}{k_x+k_y}}'}/>
                    <div className={index.SOLDiv1} onMouseOver={() => setHover(1)} onMouseOut={() => setHover(0)}/>
                    <div className={index.SOLDiv2} onMouseOver={() => setHover(2)} onMouseOut={() => setHover(0)}/>
                    <div className={index.SOLDiv3} onMouseOver={() => setHover(4)} onMouseOut={() => setHover(0)}/>
                    <div className={index.SOLDiv4} onMouseOver={() => setHover(5)} onMouseOut={() => setHover(0)}/>
                </div>
            )
        case 'CH':
            return (
                <div className={index.formula}>
                    <div style={{height: 20}}/>
                    <MathComponent
                        tex={'\\LARGE{S_{xy}=\\displaystyle\\sum_{z\\in\\Gamma_x\\cap\\Gamma_y}\\frac{1+k_{z(i)}}{1+k_{z(e)}}}'}/>
                    <div className={index.CHDiv1} onMouseOver={() => setHover(1)} onMouseOut={() => setHover(0)}/>
                    <div className={index.CHDiv2} onMouseOver={() => setHover(2)} onMouseOut={() => setHover(0)}/>
                    <div className={index.CHDiv3} onMouseOver={() => setHover(6)} onMouseOut={() => setHover(0)}/>
                    <div className={index.CHDiv4} onMouseOver={() => setHover(7)} onMouseOut={() => setHover(0)}/>
                    <div className={index.CHDiv5} onMouseOver={() => setHover(3)} onMouseOut={() => setHover(0)}/>
                </div>
            )
        case 'ERD':
            return (
                <div className={index.formula}>
                    <div style={{height: 20}}/>
                    <MathComponent
                        tex={'\\small{S_{xy}=\\displaystyle\\sum_{z\\in\\Gamma_x\\cap\\Gamma_y}\\frac{\\displaystyle\\sum_{m\\in\\Gamma_{z(i)}}\\frac{2}{k_m}\\cdot\\frac{1}{k_z}+\\frac{2}{k_z}}{\\displaystyle\\sum_{m\\in\\Gamma_{z(i)}}\\frac{k_m-3}{k_m}\\cdot\\frac{1}{k_z}+\\frac{k_{z(e)}}{k_z}+1}}'}/>
                    <div className={index.ERDDiv1} onMouseOver={() => setHover(3)} onMouseOut={() => setHover(0)}/>
                    <div className={index.ERDDiv2} onMouseOver={() => setHover(1)} onMouseOut={() => setHover(0)}/>
                    <div className={index.ERDDiv3} onMouseOver={() => setHover(2)} onMouseOut={() => setHover(0)}/>
                    <div className={index.ERDDiv4} onMouseOver={() => setHover(3)} onMouseOut={() => setHover(0)}/>
                    <div className={index.ERDDiv5} onMouseOver={() => setHover(3)} onMouseOut={() => setHover(0)}/>
                    <div className={index.ERDDiv6} onMouseOver={() => setHover(3)} onMouseOut={() => setHover(0)}/>
                    <div className={index.ERDDiv7} onMouseOver={() => setHover(7)} onMouseOut={() => setHover(0)}/>
                    <div className={index.ERDDiv8} onMouseOver={() => setHover(3)} onMouseOut={() => setHover(0)}/>
                    <div className={index.ERDDiv9} onMouseOver={() => setHover(6)} onMouseOut={() => setHover(0)}/>
                    <div className={index.ERDDiv10} onMouseOver={() => setHover(6)} onMouseOut={() => setHover(0)}/>
                </div>
            )
        case "LERD":
            return (
                <div className={index.formula}>
                    <div style={{height: 1}}/>
                    <MathComponent
                        tex={'\\small{S_{xy}=S_{xy}^{ERD}+\\alpha\\cdot \\displaystyle\\sum_{(z_1,z_2)\\in Q}\\frac{\\frac{2}{k_{z_1}}\\cdot \\frac{2}{k_{z_2}}}{\\frac{k_{z_1(e)}}{k_{z_1}}+\\frac{k_{z_2(e)}}{k_{z_2}}}}'}/>
                    <MathComponent
                        tex={'\\scriptsize{\\frac{+\\beta\\cdot \\displaystyle\\sum_{m_1\\in\\Gamma_{z_1(i)}}\\frac{2}{k_{m_1}}\\cdot \\frac{1}{k_{z_1}}+\\beta\\cdot\\displaystyle\\sum_{m_2\\in\\Gamma_{z_2(i)}}\\frac{2}{k_{m_2}}\\cdot\\frac{1}{k_{z_2}}}{+\\beta\\cdot\\displaystyle\\sum_{m_1\\in\\Gamma_{z_1(i)}}\\frac{k_{m_1}-3}{k_{m_1}}\\cdot\\frac{1}{k_{z_1}}+\\beta\\cdot\\displaystyle\\sum_{m_2\\in\\Gamma_{z_2(i)}}\\frac{k_{m_2}-3}{k_{m_2}}\\cdot\\frac{1}{k_{z_2}}}}'}/>
                </div>
            )
        default:
            return (
                <div className={index.formula}/>
            )
    }
}

export default Formula