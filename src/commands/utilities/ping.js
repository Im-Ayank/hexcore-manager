module.exports = {
  name: "ping",
  description: "Check bot latency",
  category: "utilities",
  slash: true,
  prefix: true,

  async execute({ reply }) {
    reply("Pong!");
  }
};
