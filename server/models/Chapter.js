const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { recipeMdl } = require('./Recipe.js');

const Recipe = recipeMdl.schema;

let chapterSchema = new Schema({
    chapterName: String,
    recipes: {
        type: [Recipe],
    }
});

const chapterMdl = mongoose.model('Chapter', chapterSchema);

module.exports = {
    chapterMdl: chapterMdl
}