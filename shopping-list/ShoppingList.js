const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShoppingListSchema = new mongoose.Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  title: String,
  online: {
    type: Boolean,
    default: true
  },
  items: [
    {
      title: String,
      purchased: {
        type: Boolean,
        default: false
      },
      ordered: {
        type: Boolean,
        default: false
      }
    }
  ]
});
mongoose.model('ShoppingList', ShoppingListSchema);

module.exports = mongoose.model('ShoppingList');
