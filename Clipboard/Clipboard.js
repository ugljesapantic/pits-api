const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClipboardSchema = new mongoose.Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  title: String,
  items: [
    {
      title: String
    }
  ]
});
mongoose.model('Clipboard', ClipboardSchema);

module.exports = mongoose.model('Clipboard');
