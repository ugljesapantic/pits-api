

const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const ClipboardSchema = new mongoose.Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    title: String,
    lables: [{
        title: String,
        color: String,
    }],
    items: [{
        title: String,
        value: String,
    }]
});
mongoose.model('Clipboard', ClipboardSchema);

module.exports = mongoose.model('Clipboard');
