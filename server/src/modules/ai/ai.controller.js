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
    let chatCompletion;
    try {
      chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are the Aivana Personal Stylist, an elite fashion expert for the Aivana luxury e-commerce platform. 
            
            STRICT GUIDELINES:
            1. IDENTITY: You are the Aivana Personal Stylist for an Indian fashion audience.
            2. BRANDING: Be sophisticated and premium.
            3. CURRENCY: Always use the Indian Rupee symbol (₹) for prices. NEVER use the dollar symbol ($).
            4. CONCISENESS: Keep responses under 3 sentences. 
            5. PRODUCT DISCOVERY: If the user asks for products, prices (e.g., "under 900"), or categories, append a search tag: SEARCH_PARAMS: {"maxPrice": 900, "query": "dresses"}.
            6. RELEVANCE: Redirect non-fashion topics politely.`
          },
          {
            role: 'user',
            content: message,
          },
        ],
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
        max_tokens: 512,
      });
    } catch (primaryError) {
      console.warn('Primary AI Model failed, trying fallback...', primaryError.message);
      // Fallback to another model if the primary one fails
      chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'user', content: message }
        ],
        model: 'llama3-8b-8192', 
        temperature: 0.6,
      });
    }

    const aiResponseContent = chatCompletion.choices[0]?.message?.content || "";

    // Regex to find search intent in AI response (if any)
    const searchIntentMatch = aiResponseContent.match(/SEARCH_PARAMS:\s*(\{.*\})/);
    let suggestedProducts = [];

    if (searchIntentMatch) {
      try {
        const searchParams = JSON.parse(searchIntentMatch[1]);
        let productQuery = { status: 'active' };
        
        if (searchParams.maxPrice) productQuery.price = { $lte: searchParams.maxPrice };
        if (searchParams.minPrice) productQuery.price = { ...productQuery.price, $gte: searchParams.minPrice };
        
        if (searchParams.query) {
          productQuery.$or = [
            { name: { $regex: searchParams.query, $options: 'i' } },
            { category: { $regex: searchParams.query, $options: 'i' } }
          ];
        }

        suggestedProducts = await Product.find(productQuery).limit(3);
      } catch (parseErr) {
        console.error('Failed to parse AI search intent:', parseErr);
      }
    }

    // Clean the message for the UI (remove the internal SEARCH_PARAMS tag)
    const cleanReply = aiResponseContent.replace(/SEARCH_PARAMS:\s*\{.*\}/, '').trim();

    res.json(new ApiResponse(200, { 
      reply: cleanReply, 
      products: suggestedProducts 
    }, 'AI responded successfully'));
  } catch (error) {
    console.error('Groq Chat Critical Error:', error);
    throw new ApiError(500, `AI Stylist is currently resting. (Debug: ${error.message})`);
  }
});

// @desc    Get AI Personalized Recommendations
// @route   GET /api/ai/recommend
// @access  Public
export const getRecommendations = asyncHandler(async (req, res) => {
  const { category, vibes, context } = req.query;

  try {
    // If we have a 'vibe' or 'context', we use AI to figure out what to search for
    if (vibes || context) {
      const aiResponse = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are a fashion search expert. Given a user's desired "vibe" or "context", 
            identify the top 2 product categories (Dresses, Tops, Outerwear, Activewear, Accessories, Jewelry) 
            and 3 specific fashion keywords that capture that aesthetic. 
            Focus on high-end fashion terminology.
            Return ONLY a valid JSON object: {"categories": ["CategoryName"], "keywords": ["Keyword1", "Keyword2"]}`
          },
          {
            role: 'user',
            content: `Vibe: ${vibes || 'any'}, Context: ${context || 'browsing fashion'}`
          }
        ],
        model: 'llama3-8b-8192',
        response_format: { type: "json_object" }
      });

      const suggestions = JSON.parse(aiResponse.choices[0].message.content);
      
      // Build a smart query
      let query = {
        $or: [
          { category: { $in: suggestions.categories } },
          { name: { $regex: suggestions.keywords.join('|'), $options: 'i' } },
          { description: { $regex: suggestions.keywords.join('|'), $options: 'i' } }
        ],
        status: 'active'
      };

      const products = await Product.find(query).limit(4);
      
      // Fallback if AI query is too specific
      if (products.length === 0) {
        const fallback = await Product.aggregate([{ $sample: { size: 4 } }]);
        return res.json(new ApiResponse(200, fallback, 'AI Fallback Recommendations'));
      }

      return res.json(new ApiResponse(200, products, `AI Recommendations for: ${vibes || context}`));
    }

    // Default behavior if no vibe/context
    let query = { status: 'active' };
    if (category) query.category = category;

    const products = await Product.aggregate([
      { $match: query },
      { $sample: { size: 4 } }
    ]);

    res.json(new ApiResponse(200, products, 'Recommendations fetched'));
  } catch (error) {
    console.error('AI Recommendation Error Details:', {
      message: error.message,
      status: error.status,
      data: error.response?.data
    });
    // Silent fail to random recommendations for UX
    const products = await Product.aggregate([{ $sample: { size: 4 } }]);
    res.json(new ApiResponse(200, products, 'Recommendations (Fallback)'));
  }
});
