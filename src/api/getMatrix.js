const f = async (datasetName, algorithmName, a, b) => {
    return (
        await fetch(`/api/getMatrix?datasetName=${datasetName}&algorithmName=${algorithmName}&a=${a}&b=${b}`, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
            },
        })
    ).json()
}

export default f