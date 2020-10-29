function createRequest(address, method){ 
    return new Request(address, { method: method,
                                    mode: 'cors',
                                    redirect: 'follow',
                                    credentials: 'include',
                                    headers: {
                                        'Content-type': 'application/json',
                                        'Accept': 'application/json'
                                    }  
                                });
}

function createRequestWithBody(address, method, body){  
    return new Request(address, { method: method,
                                    mode: 'cors',
                                    redirect: 'follow',
                                    credentials: 'include',
                                    headers: {
                                        'Content-type': 'application/json',
                                        'Accept': 'application/json'
                                    },
                                    body: body  
                                });
}

module.exports = {
    createRequest: createRequest,
    createRequestWithBody: createRequestWithBody
}