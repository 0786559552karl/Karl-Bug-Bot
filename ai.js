// Placeholder AI chat hook.
// Plug in any provider here (OpenAI, Anthropic, local model, etc.)
// by filling in callAIProvider() with a real API call.

async function callAIProvider(prompt) {
  // TODO: replace with a real API call, e.g.:
  // const res = await axios.post("https://api.openai.com/v1/chat/completions", {...});
  // return res.data.choices[0].message.content;
  return `(AI placeholder) You said: "${prompt}". Connect a real AI provider in commands/ai/ai.js to get real answers.`;
}

module.exports = {
  name: "ai",
  aliases: ["ask", "gpt"],
  category: "ai",
  description: "Chat with the AI assistant",
  run: async ({ reply, args }) => {
    if (!args.length) return reply("Usage: .ai <your question>");
    const answer = await callAIProvider(args.join(" "));
    await reply(answer);
  }
};
