function createRequest(address, method){  // TODO: Move this to a module
    return new Request(address, { method: method,
                                    mode: 'cors',
                                    redirect: 'follow',
                                    credentials: 'include',
                                    headers: {
                                        'Content-type': 'application/json'
                                    }  
                                });
}

function createRequestWithBody(address, method, body){  // TODO: Move this to a module
    return new Request(address, { method: method,
                                    mode: 'cors',
                                    redirect: 'follow',
                                    credentials: 'include',
                                    headers: {
                                        'Content-type': 'application/json'
                                    },
                                    body: body  
                                });
}

module.exports = {
    createRequest: createRequest,
    createRequestWithBody: createRequestWithBody
}