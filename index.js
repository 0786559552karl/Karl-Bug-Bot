const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const pino = require("pino");
const qrcodeTerminal = require("qrcode-terminal");
const QRCode = require("qrcode");
const readline = require("readline");
const chalk = require("chalk");
const fs = require("fs-extra");
const path = require("path");
const http = require("http");

const config = require("./config");
const { loadCommands } = require("./lib/commandLoader");
const { styleReply } = require("./lib/style");

const SESSION_DIR = path.join(__dirname, "sessions");
fs.ensureDirSync(SESSION_DIR);

// --- shared state the tiny HTTP server reads from, so you can view
// the QR code / pairing code / status from a browser when hosted
// somewhere with no interactive terminal (Render, bot-hosting.net, etc.) ---
let lastQR = null;
let lastPairingCode = null;
let connectionStatus = "starting";

// very small in-memory per-chat session store, used by games like .trivia / .math
const sessions = new Map();
function getSession(chatId) {
  if (!sessions.has(chatId)) sessions.set(chatId, {});
  return sessions.get(chatId);
}

function isOwner(jid) {
  const digits = jid.replace(/[^0-9]/g, "");
  return config.owners.some((o) => o.replace(/[^0-9]/g, "") === digits);
}

// ---------------------------------------------------------------------
// Minimal HTTP server.
// Render (and similar PaaS hosts) expect a web service to bind to
// process.env.PORT and respond to HTTP requests for health checks.
// This also doubles as a convenient way to view the QR code or pairing
// code from a browser when there's no interactive console available.
// ---------------------------------------------------------------------
function startServer() {
  const port = process.env.PORT || 3000;

  const server = http.createServer(async (req, res) => {
    if (req.url === "/" || req.url === "/status") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(`${config.botName} — status: ${connectionStatus}`);
      return;
    }

    if (req.url === "/qr") {
      if (!lastQR) {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(
          connectionStatus === "open"
            ? "Already connected — no QR code needed."
            : "No QR code available yet. Refresh in a few seconds, or this instance is set to pairing-code mode (see /pairing-code)."
        );
        return;
      }
      try {
        const png = await QRCode.toBuffer(lastQR, { width: 320, margin: 2 });
        res.writeHead(200, { "Content-Type": "image/png" });
        res.end(png);
      } catch (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Failed to render QR code.");
      }
      return;
    }

    if (req.url === "/pairing-code") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(
        lastPairingCode
          ? `Pairing code: ${lastPairingCode}\n\nOpen WhatsApp > Linked Devices > Link a device > Link with phone number, then enter this code.`
          : "No pairing code generated yet. Make sure LOGIN_METHOD=code and PAIRING_NUMBER are set, then check back in a few seconds."
      );
      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found. Try / , /qr or /pairing-code");
  });

  server.listen(port, () => {
    console.log(chalk.blue(`HTTP server listening on port ${port} (routes: / , /qr , /pairing-code)`));
  });
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: "silent" }),
    browser: ["Karl AI", "Chrome", "1.0.0"]
  });

  // ---- Decide pairing method ----
  // Env vars win (used on hosts like Render/bot-hosting.net where you can't
  // type into a live prompt). Falls back to config.js, and only drops into
  // an interactive terminal prompt if you're running this locally with a
  // real TTY attached.
  let method = process.env.LOGIN_METHOD || config.loginMethod;
  const canPromptInteractively = process.stdin.isTTY;

  if (method === "ask" && !state.creds.registered) {
    if (canPromptInteractively) {
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      const ask = (q) => new Promise((res) => rl.question(q, (a) => { res(a); }));
      method = (await ask("Login with (1) QR code or (2) Pairing code? [1/2]: ")).trim() === "2" ? "code" : "qr";
      rl.close();
    } else {
      // No interactive terminal available (hosted environment) — default to QR
      // and let the person view it via the /qr HTTP route, or set
      // LOGIN_METHOD=code explicitly as an environment variable instead.
      method = "qr";
      console.log(chalk.yellow("No interactive terminal detected — defaulting to QR login. Set LOGIN_METHOD=code as an env var to use pairing-code login instead."));
    }
  }

  if (method === "code" && !state.creds.registered) {
    let number = process.env.PAIRING_NUMBER || config.pairingNumber;

    if (!number && canPromptInteractively) {
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      const ask = (q) => new Promise((res) => rl.question(q, (a) => { res(a); }));
      number = (await ask("Enter your WhatsApp number with country code (e.g. 263771234567): ")).trim();
      rl.close();
    }

    if (!number) {
      console.log(chalk.red("LOGIN_METHOD=code is set but no phone number was provided. Set the PAIRING_NUMBER environment variable (digits only, with country code, no +) and restart."));
    } else {
      setTimeout(async () => {
        try {
          const code = await sock.requestPairingCode(number.replace(/[^0-9]/g, ""));
          lastPairingCode = code;
          console.log(chalk.green(`\nYour pairing code: ${chalk.bold(code)}`));
          console.log(chalk.gray("Open WhatsApp > Linked Devices > Link a device > Link with phone number, then enter this code."));
          console.log(chalk.gray("(Also viewable at the /pairing-code HTTP route if you're hosted.)\n"));
        } catch (err) {
          console.error(chalk.red("Failed to request pairing code:"), err.message);
        }
      }, 3000);
    }
  }

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr && method === "qr") {
      lastQR = qr;
      console.log(chalk.cyan("\nScan this QR code with WhatsApp > Linked Devices:\n"));
      qrcodeTerminal.generate(qr, { small: true });
      console.log(chalk.gray("(Also viewable as an image at the /qr HTTP route if you're hosted.)\n"));
    }

    if (connection === "close") {
      connectionStatus = "disconnected";
      const shouldReconnect =
        new Boom(lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log(chalk.yellow("Connection closed."), shouldReconnect ? "Reconnecting..." : "Logged out.");
      if (shouldReconnect) startBot();
    } else if (connection === "open") {
      connectionStatus = "open";
      lastQR = null;
      console.log(chalk.green(`\n${config.botName} is connected and online! ✅\n`));
    }
  });

  sock.ev.on("creds.update", saveCreds);

  // ---- Load commands ----
  let { map: commandMap, list: allCommands } = loadCommands();
  console.log(chalk.blue(`Loaded ${allCommands.length} commands.`));

  // ---- Message handling ----
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;
    const msg = messages[0];
    if (!msg?.message || msg.key.fromMe) return;

    const from = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;
    const isGroup = from.endsWith("@g.us");

    const body =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      msg.message.imageMessage?.caption ||
      msg.message.videoMessage?.caption ||
      "";

    if (config.autoReadMessages) {
      try { await sock.readMessages([msg.key]); } catch (e) {}
    }

    if (!body.startsWith(config.prefix)) return;

    const withoutPrefix = body.slice(config.prefix.length).trim();
    const [cmdName, ...args] = withoutPrefix.split(/\s+/);
    if (!cmdName) return;

    const command = commandMap.get(cmdName.toLowerCase());
    if (!command) return;

    if (command.ownerOnly && !isOwner(sender)) {
      await sock.sendMessage(from, { text: "This command is for the bot owner only." }, { quoted: msg });
      return;
    }
    if (command.groupOnly && !isGroup) {
      await sock.sendMessage(from, { text: "This command only works in groups." }, { quoted: msg });
      return;
    }
    if (command.adminOnly && isGroup) {
      try {
        const meta = await sock.groupMetadata(from);
        const participant = meta.participants.find((p) => p.id === sender);
        const isAdmin = participant && (participant.admin === "admin" || participant.admin === "superadmin");
        if (!isAdmin) {
          await sock.sendMessage(from, { text: "This command is for group admins only." }, { quoted: msg });
          return;
        }
      } catch (e) {}
    }

    const quotedCtx = msg.message.extendedTextMessage?.contextInfo;
    const quotedMsg = quotedCtx?.quotedMessage
      ? { message: quotedCtx.quotedMessage, key: { remoteJid: from, id: quotedCtx.stanzaId, participant: quotedCtx.participant } }
      : null;
    const quotedSender = quotedCtx?.participant || null;

    const reply = async (text) => {
      const finalText = styleReply(text);
      await sock.sendMessage(from, { text: finalText }, { quoted: msg });
    };

    const ctx = {
      sock,
      msg,
      from,
      sender,
      args,
      reply,
      allCommands,
      quotedMsg,
      quotedSender,
      session: getSession(from),
      store: { getAllChatIds: async () => Array.from(sessions.keys()) }
    };

    if (config.autoTypingIndicator) {
      try { await sock.sendPresenceUpdate("composing", from); } catch (e) {}
    }

    try {
      await command.run(ctx);
    } catch (err) {
      console.error(chalk.red(`Error running command ${cmdName}:`), err);
      await sock.sendMessage(from, { text: "Something went wrong running that command." }, { quoted: msg });
    }
  });

  return sock;
}

startServer();

startBot().catch((err) => {
  console.error(chalk.red("Fatal error starting bot:"), err);
  process.exit(1);
});
