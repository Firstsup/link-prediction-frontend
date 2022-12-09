import React from 'react';
import Title from "../Title";
import Console from "../Console";
import ForceDirectedGraph from "../ForceDirectedGraph";
import StatisticsGraph from "../StatisticsGraph";
import index from './index.module.css';
import AnalysisGraph from "../AnalysisGraph";
import DegreeDistributionGraph from "../DegreeDistributionGraph";
import AUCPrecisionGraph from "../AUCPrecisionGraph";
import AlgorithmResultGraph from "../AlgorithmResultGraph";
import ABControl from "../ABControl";
import LERDGraph from "../LERDGraph";
import Formula from "../Formula";

const System = () => {
    return (
        <div className={index.system}>
            <div className={index.title}>
                <Title/>
            </div>
            <div className={index.forceDirectedGraph}>
                <ForceDirectedGraph/>
            </div>
            <div className={index.statisticsGraph}>
                <StatisticsGraph/>
            </div>
            <div className={index.degreeDistributionGraph}>
                <DegreeDistributionGraph/>
            </div>
            <div className={index.AUCPrecisionGraph}>
                <AUCPrecisionGraph/>
            </div>
            <div className={index.analysisGraph}>
                <AnalysisGraph/>
            </div>
            <div className={index.algorithmResultGraph}>
                <AlgorithmResultGraph/>
            </div>
            <div className={index.formula}>
                <Formula/>
            </div>
            <div className={index.ABControl}>
                <ABControl/>
            </div>
            <div className={index.LERDGraph}>
                <LERDGraph/>
            </div>
            <div className={index.console}>
                <Console/>
            </div>
        </div>
    )
}

export default System