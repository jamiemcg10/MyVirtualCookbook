const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Mixed = mongoose.Schema.Types.Mixed;

let userSchema = new Schema({
    googleUserId: String, 
    facebookUserId: String,
    lastName: String,
    firstName: String, 
    email: String,
    chapterList: {
        type: Mixed,
        default: [],
    }
});

userSchema.virtual('fullName').get(function(){  // virtual field for getting full name
    return `${this.firstName} ${this.lastName}`;
});


const userMdl = mongoose.model('User', userSchema);

module.exports = {
    userMdl: userMdl
}