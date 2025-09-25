// server/controllers/imageController.js
const axios = require("axios");

exports.generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/images",
      {
        model: "stabilityai/stable-diffusion-xl", // SDXL model
        prompt: prompt,
        size: "1024x1024", // Supported: 512x512, 768x768, 1024x1024
        n: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
console.log('OpenRouter API response:', response.data);

    if (!response.data?.data?.[0]?.url) {
      throw new Error("No image URL returned from API");
    }

    return res.status(200).json({
      imageUrl: response.data.data[0].url,
    });
  } catch (error) {
    console.error(
      "❌ Image generation error:",
      error.response?.data || error.message
    );
    return res.status(500).json({
      error:
        error.response?.data ||
        "Something went wrong while generating the image.",
    });
  }
};
