import mongoose from "mongoose";


// Sub-schema for variants (sizes/colors)
const variantSchema = new mongoose.Schema({
    name: { type: String, required: true }, // "Small", "Red", etc.
    sku: { type: String, unique: true },
    priceAdjustment: { type: Number, default: 0 }, // +$10 for XL
    stock: { type: Number, default: 0 },
    metrics: { 
      weight: Number,
      dimensions: String // "10x5x3 in"
    }
  });

const Variant = mongoose.model('Variant', variantSchema)
export default Variant