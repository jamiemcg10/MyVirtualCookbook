const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { chapterMdl } = require('./Chapter.js');

const chapter = chapterMdl.schema;

let userSchema = new Schema({
    googleUserId: String, 
    facebookUserId: String,
    lastName: String,
    firstName: String, 
    email: String,
    password: String,
    chapterList: {
        type: [chapter],
    }
});

userSchema.virtual('fullName').get(function(){  // virtual field for getting full name
    return `${this.firstName} ${this.lastName}`;
});


const userMdl = mongoose.model('User', userSchema);

module.exports = {
    userMdl: userMdl
}