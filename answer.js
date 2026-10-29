module.exports = {
  name: "answer",
  category: "games",
  description: "Answer the current trivia or math question",
  run: async ({ reply, args, session }) => {
    if (session.trivia) {
      const correct = args.join(" ").toLowerCase() === session.trivia;
      await reply(correct ? "Correct! 🎉" : `Wrong! The answer was: ${session.trivia}`);
      session.trivia = null;
      return;
    }
    if (session.mathAnswer !== undefined && session.mathAnswer !== null) {
      const correct = parseFloat(args[0]) === session.mathAnswer;
      await reply(correct ? "Correct! 🎉" : `Wrong! The answer was: ${session.mathAnswer}`);
      session.mathAnswer = null;
      return;
    }
    await reply("No active question. Start one with .trivia or .math");
  }
};
