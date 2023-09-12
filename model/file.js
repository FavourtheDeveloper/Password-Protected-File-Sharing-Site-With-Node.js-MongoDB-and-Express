const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    path: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    password: String,
    downloadCount: {
        type: Number,
        required: true,
        default: 0
    },
})

module.exports = mongoose.model("File", fileSchema);