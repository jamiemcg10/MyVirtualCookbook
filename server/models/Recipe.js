const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Mixed = mongoose.Schema.Types.Mixed;

let recipeSchema = new Schema({  // add validation later
    name: String,
    nameId: String,
    source: String,
    recipeLink: String,
    recipeImg: Mixed,  // if recipe image uploads are ever allowed
    method: String,
    recipeNotes: String
});

const recipeMdl = mongoose.model('Recipe', recipeSchema);

module.exports = {
    recipeMdl: recipeMdl
}