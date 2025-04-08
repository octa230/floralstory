import mongoose from "mongoose";

const ItemScehma = {
    name:String,
    qty: Number,
    total: Number 
}


const OrderSchema = new mongoose.Schema({
    user: {userSchema},
    items:[ItemScehma],
    address:{AddressSchema},
    delivered: {type: Boolean, default: false}
})

const Order = mongoose.model('Order', OrderSchema)
export default Order