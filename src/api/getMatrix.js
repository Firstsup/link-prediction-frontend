const f = async (datasetName, algorithmName) => {
    return (
        await fetch(`/api/getMatrix?datasetName=${datasetName}&algorithmName=${algorithmName}`, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
            },
        })
    ).json()
}

export default f