const f = async (datasetName, a, b) => {
    return(
        await fetch(`/api/getLERTRAUCPrecisionOnly?datasetName=${datasetName}&a=${a}&b=${b}`, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
            },
        })
    ).json()
}

export default f