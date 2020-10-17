const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Mixed = mongoose.Schema.Types.Mixed;

let recipeSchema = new Schema({  // add validation later
    name: String,
    source: String,
    RecipeLink: String,
    RecipeImg: Mixed,
    RecipeNotes: String,
    Chapter: {type: Number, ref: 'Chapter'}
});

const recipeMdl = mongoose.model('Recipe', recipeSchema);

module.exports = {
    recipeMdl: recipeMdl
}