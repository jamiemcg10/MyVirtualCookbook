// templates to create requests both with and without bodies

function createRequest(address, method){ // no body
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

function createRequestWithBody(address, method, body){  // with body
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