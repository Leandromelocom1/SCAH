const axios = require('axios');

const getSolution = async (req, res) => {
  try {
    const { problemDescription } = req.body;

    const response = await axios.post('https://api.openai.com/v1/completions', {
      model: 'text-davinci-003',
      prompt: problemDescription,
      max_tokens: 150,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const solution = response.data.choices[0].text;
    res.status(200).json({ solution });
  } catch (error) {
    console.error('Erro ao buscar solução no GPT-3:', error.message || error);
    res.status(500).json({ error: 'Erro ao buscar solução no GPT-3' });
  }
};

module.exports = {
  getSolution,
};
