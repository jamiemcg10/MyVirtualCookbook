// update notes in db
function updateNotes(event, chapter, recipe){
    let createRequest = require('./createRequest.js');

    let body = JSON.stringify({
        notes: event.target.value,
    });
    let updateNotesRequest = createRequest.createRequestWithBody(`/api/recipes/update_notes/${chapter}/${recipe}`, "POST", body);
    fetch(updateNotesRequest).then(
        (response)=>{
            // the response doesn't need to be handled
            ;
        });
}

module.exports = {
    updateNotes: updateNotes,
}