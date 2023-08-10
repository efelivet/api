const mongoose =require('mongoose');

const PostSchema = new mongoose.Schema({
    title:"string",
    description:"string",
    file:"string"
})

const PostModel = mongoose.model('Post',PostSchema);

module.exports = PostModel;