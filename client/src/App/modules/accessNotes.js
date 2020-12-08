// update notes in db
function updateNotes(event, chapter, recipe){
    let createRequest = require('./createRequest.js');

    let body = JSON.stringify({
        notes: event.target.value,
    });
    let updateNotesRequest = createRequest.createRequestWithBody(`/api/recipes/update_notes/${chapter}/${recipe}`, "POST", body);
    fetch(updateNotesRequest)
        .catch(error=>{
            let logErrorRequest = this.createRequest.createRequestWithBody("/api/log", "POST", JSON.stringify({text: error.message}));
            fetch(logErrorRequest);
        });
}

module.exports = {
    updateNotes: updateNotes,
}