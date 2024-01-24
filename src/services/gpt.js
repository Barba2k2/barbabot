const { OPENAI_API_KEY } = require("../config");

exports.gpt = async (content) => {
  if (!OPENAI_API_KEY) {
    throw new Error(
      "Is necessary configure the environment variable OPENAI_API_KEY/OPENAI_API_KEY with your token!"
    );
  }

  const { data } = await axios.post(
    "https://api.openai.com/v1/chat/completations",
    {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content }],
    },
    {
      headers: {
        "Content-Type": "application/json",
        Auhtorization: `Bearer ${OPENAI_API_KEY}`,
      },
    }
  );

  return data.choices[0].messages.content;
};
