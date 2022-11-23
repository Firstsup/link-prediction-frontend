import {atom} from "recoil";

export const datasetState = atom({
    key: 'dataset',
    default: 'football'
})

export const algorithmState = atom({
    key: 'algorithm',
    default: 'CN'
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