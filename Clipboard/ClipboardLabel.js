

const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const ClipboardLabelSchema = new mongoose.Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    title: String,
    color: String,
});
mongoose.model('ClipboardLabel', ClipboardLabelSchema);

module.exports = mongoose.model('ClipboardLabel');
