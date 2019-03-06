const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const ShoppingListSchema = new mongoose.Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    title: String,
    online: Boolean,
    items: [{
        name: String,
        purchased: Boolean,
        ordered: Boolean
    }]
});
mongoose.model('ShoppingList', ShoppingListSchema);

module.exports = mongoose.model('ShoppingList');
