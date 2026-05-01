import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity can not be less than 1'],
    default: 1
  },
  price: {
    type: Number,
    required: true
  },
  size: {
    type: String,
  },
  color: {
    type: String,
  }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // One user, one active cart
  },
  items: [cartItemSchema],
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  }
}, { timestamps: true });

// Pre-save to calculate total price automatically
cartSchema.pre('save', async function () {
  this.totalPrice = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
