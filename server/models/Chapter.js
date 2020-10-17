const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = mongoose.Schema.Types.ObjectId;

let chapterSchema = new Schema({
    chapterName: String,
    recipes: [{
        type: ObjectId,
        ref: 'Recipe'
    }]
});

const chapterMdl = mongoose.model('Chapter', chapterSchema);

module.exports = {
    chapterMdl: chapterMdl
}