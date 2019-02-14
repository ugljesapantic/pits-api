

const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const ClipboardSchema = new mongoose.Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    title: String,
    labels: [{ type: Schema.Types.ObjectId, ref: 'ClipboardLabel' },],
    items: [{
        title: String,
        value: String,
    }]
});
mongoose.model('Clipboard', ClipboardSchema);

module.exports = mongoose.model('Clipboard');
