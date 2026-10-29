module.exports = {
  // === Identity ===
  botName: "Karl AI",
  ownerName: "Marx Muronzi",
  feedbackNumber: "0773834309", // shown in menu / feedback command
  prefix: ".", // change command prefix here, e.g. "!", "/", "#"

  // === Pairing ===
  // "qr"   -> scan a QR code to log in
  // "code" -> enter your WhatsApp number and get an 8-digit pairing code
  // You will also be asked interactively at startup if this is left as "ask"
  loginMethod: "ask",

  // Phone number used ONLY when loginMethod = "code" is chosen at startup.
  // Include country code, no +, no spaces. e.g. 263771234567
  pairingNumber: "",

  // === Behaviour ===
  autoReadMessages: true,
  autoTypingIndicator: true,

  // === "Futuristic" reply theme ===
  theme: {
    enabled: true,
    headerTitle: "KARL • AI",
    footerText: "Powered by Marx Muronzi",
    style: "box" // "box" | "glitch" | "terminal"
  },

  // === Owner numbers (full JID or just digits), used for owner-only commands ===
  owners: [
    "0773834309"
  ]
};
