function updateNotes(event, chapter, recipe){
    // this might be too slow
    let createRequest = require('./createRequest.js');

    let body = JSON.stringify({
        notes: event.target.value,
    });
    let updateNotesRequest = createRequest.createRequestWithBody(`/api/recipes/update_notes/${chapter}/${recipe}`, "POST", body);
    fetch(updateNotesRequest).then(
        (response)=>{
            ;
        });
}

module.exports = {
    updateNotes: updateNotes,
}