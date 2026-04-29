import express from 'express';
import {
  createProduct,
  getProducts,
  getProductByIdOrSlug,
  updateProduct,
  deleteProduct
} from './product.controller.js';
import { validateApiKey } from '../../middleware/apiKey.middleware.js';
import upload from '../../middleware/upload.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:identifier', getProductByIdOrSlug);

// Protected routes (Using API Key)
router.use(validateApiKey);

// @desc Upload product image
// @route POST /api/products/upload
// @body form-data -> key: 'image', type: File
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file provided' });
  }
  res.json({
    success: true,
    data: {
      url: req.file.path,
      publicId: req.file.filename,
    },
    message: 'Image uploaded successfully'
  });
});

router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
