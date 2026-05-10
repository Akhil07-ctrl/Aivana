import mongoose from 'mongoose';
import slugify from 'slugify';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [120, 'Product name cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
    },
    msrp: {
      type: Number, // Manufacturer Suggested Retail Price (for strike-through text)
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    category: {
      type: String, // Keep it simple for now, can be ObjectId ref to Category model later
      required: true,
    },
    subcategory: {
      type: String,
    },
    variants: [
      {
        size: { type: String }, // e.g., S, M, L, XL
        color: { type: String }, // e.g., Red, Blue
        stock: { type: Number, required: true, default: 0 },
        sku: { type: String },
      },
    ],
    totalStock: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'draft', 'archived', 'inactive'],
      default: 'active',
    },
    averageRating: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be above 0'],
      max: [5, 'Rating must be below 5'],
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Pre-save hook to generate slug and calculate total stock
productSchema.pre('save', async function () {
  if (this.isModified('name')) {
    let baseSlug = slugify(this.name, { lower: true, strict: true, replacement: '-' });
    let uniqueSlug = baseSlug;
    let counter = 1;

    // Check for existing slug and increment until unique
    while (await mongoose.model('Product').findOne({ slug: uniqueSlug, _id: { $ne: this._id } })) {
      uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
      // Alternatively: uniqueSlug = `${baseSlug}-${counter}`; counter++;
      // Using random string is safer for high concurrency
    }
    this.slug = uniqueSlug;
  }

  if (this.isModified('variants') || this.isNew) {
    this.totalStock = this.variants.reduce((acc, curr) => acc + (curr.stock || 0), 0);
  }
});

// Compound indexes for common query patterns
productSchema.index({ status: 1, category: 1, createdAt: -1 }); // Main listing: filter by status+category, sort by date
productSchema.index({ status: 1, price: 1 });                    // Price-sorted queries

const Product = mongoose.model('Product', productSchema);
export default Product;
