import {atom} from "recoil";
import {DATASETS, ALGORITHMS} from "../constants";

export const datasetState = atom({
    key: 'dataset',
    default: DATASETS[0]
})

export const algorithmState = atom({
    key: 'algorithm',
    default: ALGORITHMS[0]
})

export const node1State = atom({
    key: 'node1',
    default: 1
})

export const node2State = atom({
    key: 'node2',
    default: 2
})

export const matrixState = atom({
    key: 'matrix',
    default: []
})

export const nodesState = atom({
    key: 'nodes',
    default: []
})

export const edgesState = atom({
    key: 'edges',
    default: []
})

export const aState = atom({
    key: 'a',
    default: 50
})

export const bState = atom({
    key: 'b',
    default: 0.008
})

export const hoverState = atom({
    key: 'hover',
    default: 0
})