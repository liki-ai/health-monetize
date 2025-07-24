export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { prompt, final } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error("OPENAI_API_KEY is missing");
    return res.status(500).json({ error: "OpenAI API key not configured." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: final ? "gpt-4" : "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    const result = await response.json();
    const text = result.choices?.[0]?.message?.content || "No response";
    res.status(200).json({ response: text });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return res.status(500).json({ error: "OpenAI API request failed." });
  }
}
