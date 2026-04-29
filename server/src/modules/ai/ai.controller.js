import asyncHandler from '../../utils/asyncHandler.js';
import ApiError from '../../utils/ApiError.js';
import ApiResponse from '../../utils/ApiResponse.js';
import Product from '../product/product.model.js';
import groq from '../../config/groq.js';

// @desc    Get AI Fashion Advice (Powered by Groq)
// @route   POST /api/ai/chat
// @access  Public
export const getFashionAdvice = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    throw new ApiError(400, 'Message is required');
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are the Aivana AI Stylist, a premium, friendly, and trend-aware fashion expert for the Aivana e-commerce platform. 
          Your goal is to provide personalized fashion advice, styling tips, and product recommendations in a concise and engaging manner. 
          Use emojis sparingly to keep it premium but fun. 
          If a user asks for a specific look, suggest styles and mention that they can find these on Aivana.`
        },
        {
          role: 'user',
          content: message,
        },
      ],
      model: 'llama3-8b-8192',
      temperature: 0.7,
      max_tokens: 512,
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || "I'm having a little trouble thinking of a style right now. Try again?";

    res.json(new ApiResponse(200, { reply: aiResponse }, 'AI responded successfully'));
  } catch (error) {
    console.error('Groq Error:', error);
    throw new ApiError(500, 'AI Service is currently unavailable');
  }
});

// @desc    Get AI Personalized Recommendations
// @route   GET /api/ai/recommend
// @access  Public
export const getRecommendations = asyncHandler(async (req, res) => {
  const { category, vibes } = req.query;

  let query = {};
  if (category) query.category = category;

  const products = await Product.aggregate([
    { $match: query },
    { $sample: { size: 4 } }
  ]);

  res.json(new ApiResponse(200, products, 'Recommendations fetched'));
});
