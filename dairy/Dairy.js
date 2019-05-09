const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const DairySchema = new mongoose.Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    content: String,
    date: String
});
mongoose.model('Dairy', DairySchema);

module.exports = mongoose.model('Dairy');
