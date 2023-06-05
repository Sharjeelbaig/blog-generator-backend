const express = require('express');
const cohere = require('cohere-ai');
const cors = require('cors'); 

const router = express.Router();

cohere.init(process.env.API);
router.use(express.json());

// Function to generate the heading
async function generateHeading(tag) {
  const prompt = `Generate a heading for a blog post about: ${tag}`;
  try {
    const response = await cohere.generate({
      model: 'command',
      prompt,
      max_tokens: 100,
      temperature: 0.1,
      k: 0,
      stop_sequences: [],
      return_likelihoods: 'NONE'
    });

    return response.body.generations[0].text.trim();
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while generating the heading.');
  }
}

// Function to generate the body
async function generateBody(tag) {
  const prompt = `Generate the body of a blog post about: ${tag}`;
  try {
    const response = await cohere.generate({
      model: 'command',
      prompt:prompt,
      max_tokens: 900, // Adjust as needed to control the length of the body
      temperature: 0.1,
      k: 0,
      stop_sequences: [],
      return_likelihoods: 'NONE'
    });

    return response.body.generations[0].text.trim();
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while generating the body.');
  }
}

const whitelist = ['https://shazi-blogify.vercel.app'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

router.post('/',cors(corsOptions), async (req, res) => {
  const tag = req.body.tag;

  try {
    const heading = await generateHeading(tag);
    const body = await generateBody(tag);

    res.json({ heading, body });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while generating the response.' });
  }
});

module.exports = router;
