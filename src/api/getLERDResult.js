const f = async (datasetName) => {
    return(
        await fetch(`/api/getLERDResult?datasetName=${datasetName}`, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
            },
        })
    ).json()
}

export default f