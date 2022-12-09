const f = async (datasetName, node1, node2, a, b) => {
    return(
        await fetch(`/api/getAlgorithmResult?datasetName=${datasetName}&node1=${node1}&node2=${node2}&a=${a}&b=${b}`, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
            },
        })
    ).json()
}

export default f