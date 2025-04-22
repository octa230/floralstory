import mongoose from "mongoose";


const AddressSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  mobile: { type: String, required: true },
  altMobile: { type: String, default: '' },
  email: { type: String },
  addressType: { type: String, default: 'home' },
  landmark: { type: String, default: '' }
});

const MessageSchema = new mongoose.Schema({
  recipient: { type: String, required: true },
  sender: { type: String, required: true },
  themeOption: { type: String },
  messageBody: { type: String }
});

const OrderItemSchema = new mongoose.Schema({
    name: String,
    slug: String,
    image: String,
    sku: String,
    price: Number,
    quantity: Number,
    deliveryDate: Date,
    city: String,
    deliverySlot: Object,  // For the time slot object
    accessories: Array,     // For accessories
    cartId: String,
    message: {type: MessageSchema},
    address: {type: AddressSchema, required: true},
  });


const OrderSchema = new mongoose.Schema({
    user: {
      _id: String,
      email: String,
      name: String,
      phone: String,
      isVerified: Boolean
    },
    items: [OrderItemSchema],  // Array of order items
    deliveryFees: Number,
    total: Number,           // Subtotal for items
    accessoriesTotal: Number, // Total for accessories
    fullTotal: Number,       // Grand total
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    delivered: { type: Boolean, default: false },
    deliveredAt: Date,
    paymentMethod: String,
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String
    },
  },
  {
    timestamps: true
  });

const Order = mongoose.model('Order', OrderSchema)
export default Order