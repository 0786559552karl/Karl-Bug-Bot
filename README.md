# Karl AI — WhatsApp Bot

A WhatsApp bot built on [Baileys](https://github.com/WhiskeySockets/Baileys).

- **Name:** Karl AI
- **Created by:** Marx Muronzi
- **Feedback:** 0773834309
- **Pairing:** QR code or pairing code (your choice at startup)
- **Style:** "futuristic" boxed/styled replies on every message

## ⚠️ About "2,000 commands"

This project ships with **~48 real, working commands** across general, owner,
group-management, fun, converter, games, sticker, and AI-chat categories —
plus a **plugin system** that auto-loads any `.js` file you drop into
`/commands`. Scaling toward hundreds or thousands of commands is realistic
this way (e.g. many short fun/quote/fact-style commands, or wiring up
download/search APIs), but nobody hand-codes 2,000 genuinely distinct commands
— any bot claiming that is almost always counting bulk-generated variations
the same way. Use this scaffold as your base and keep adding plugin files.

## ⚠️ About the `EALLOWGIT` / libsignal install error

Some hosts (including bot-hosting.net) run a recent npm that blocks
git-based package installs by default. Baileys pulls in `libsignal` via a
raw GitHub URL, which trips that block with an `EALLOWGIT` error. This is
already fixed in `package.json` via an `overrides` field that redirects
`libsignal` to its npm-registry-published equivalent,
`@whiskeysockets/libsignal-node`, so `npm install` on these hosts works
without needing git access at all. If you still see `EALLOWGIT` after this,
delete any `package-lock.json`/`node_modules` on the host and reinstall so
the override takes effect.

## 1. Install

```bash
npm install
```

(Requires Node.js 18+)

## 2. Configure

Edit `config.js`:

```js
botName: "Karl AI",
ownerName: "Marx Muronzi",
feedbackNumber: "0773834309",
prefix: ".",
loginMethod: "ask", // "qr" | "code" | "ask" (asks you each run)
owners: ["0773834309"]
```

## 3. Run locally first (to generate your session)

```bash
npm start
```

You'll be asked to choose:
- **1 = QR code** → scan it with WhatsApp: Settings → Linked Devices → Link a Device
- **2 = Pairing code** → enter your phone number, then type the 8-character code shown in WhatsApp: Linked Devices → Link with phone number instead

Once connected, your session is saved in `/sessions`. **Keep this folder private** — anyone with it can control your WhatsApp account.

## 4. Add / edit commands

Create a file in `/commands/<category>/yourcommand.js`:

```js
module.exports = {
  name: "hello",
  aliases: ["hi"],
  category: "fun",
  description: "Say hello",
  run: async ({ reply, args }) => {
    await reply("Hello there!");
  }
};
```

It's picked up automatically — no need to register it anywhere else.
Every reply sent through `reply()` is automatically wrapped in the
"futuristic" box style (configurable in `config.js` → `theme.style`:
`"box"`, `"glitch"`, or `"terminal"`).

## 5. Deploy on Render (24/7)

Render runs persistent processes (unlike Vercel, which can't host this bot —
see note below), so it's a good fit. A few things to know first:

- **Render's free web-service plan spins down after ~15 minutes with no
  incoming HTTP traffic**, and that kills your bot's WhatsApp connection.
  The bot now includes a tiny built-in HTTP server (see routes below)
  specifically so Render can health-check it, but that alone won't stop
  free-tier spin-down — you'd need an external uptime-pinger hitting `/status`
  every few minutes, or just use a paid plan, which doesn't spin down.
- **Render's filesystem resets on every redeploy** unless you attach a
  **persistent disk**. Without one, your `/sessions` folder (where your
  WhatsApp login lives) gets wiped on each deploy and you'll have to re-pair
  every time. `render.yaml` below already requests a small persistent disk
  mounted at the sessions path.
- There's no interactive terminal on Render the way there is on your own
  machine, so the bot no longer blocks waiting for a typed answer when
  hosted — it reads `LOGIN_METHOD` and `PAIRING_NUMBER` from **environment
  variables** instead, and defaults to QR if neither is set.

### Steps

1. Push this project to a GitHub repo (Render deploys from Git, not a zip upload).
2. In the Render dashboard: **New → Web Service**, connect that repo.
   - If you used the included `render.yaml`, Render will read the config automatically (**New → Blueprint** instead of **Web Service**).
3. Set:
   - **Build command:** `npm install`
   - **Start command:** `npm start`
   - **Health check path:** `/status`
4. Add environment variables (Render dashboard → Environment):
   - `LOGIN_METHOD` = `qr` or `code`
   - `PAIRING_NUMBER` = your number, digits only with country code, no `+` (only needed if `LOGIN_METHOD=code`)
5. Add a **persistent disk** (Render dashboard → Disks) mounted at the project's `sessions` folder path, so your login survives redeploys.
6. Choose a **paid instance plan** if you want this running 24/7 without spin-down/disconnects (the free plan is fine for testing, not for a bot that needs to always be reachable).
7. Deploy, then open your Render service's public URL in a browser:
   - `https://your-app.onrender.com/qr` → shows the QR code as an image to scan
   - `https://your-app.onrender.com/pairing-code` → shows your pairing code as text (if using code login)
   - `https://your-app.onrender.com/status` → shows connection status

## Why not Vercel?

Vercel runs serverless functions — short-lived, triggered per request, no
persistent process, and the filesystem resets between invocations. This bot
needs a permanently open WebSocket connection to WhatsApp and a saved session
on disk, so it can't run on Vercel at all. Render, Railway, a VPS, or
bot-hosting.net (anything that runs a long-lived process) is what you need.

## 6. Deploy on bot-hosting.net (24/7)

1. Create an account at bot-hosting.net and create a new **Node.js** server/bot instance.
2. Upload this whole project as a `.zip`, or connect it via their Git/file-upload option.
3. Set the **Main file** to `index.js` and the **Start command** to `npm install && npm start`.
4. Because the panel runs your process non-interactively, set `loginMethod` to `"qr"` or `"code"` directly in `config.js` (don't leave it as `"ask"`, since there's no terminal to type into on first boot) — or just generate the `/sessions` folder locally first (step 3 above) and upload it along with your project so it's already logged in.
5. If you do need to pair directly on the host: set `loginMethod: "code"` and fill in `pairingNumber` in `config.js` with your WhatsApp number (digits only, with country code, no `+`). The code will print in the **console/logs tab** of your bot-hosting.net panel.
6. Enable **"Auto-restart"** / **"Keep alive"** in the panel so the process restarts if it crashes or the host reboots.
7. Never delete or reset the `/sessions` folder from the panel's file manager unless you want to re-pair the bot.

## Command categories included

| Category  | Examples |
|---|---|
| general   | menu, ping, alive, owner, feedback, time, jid |
| owner     | broadcast, restart, setname, block, unblock |
| group     | add, kick, promote, demote, tagall, groupinfo, setdesc, setgroupname, mute, unmute |
| fun       | joke, quote, flip, dice, rate, ship, 8ball, insult, compliment, fact |
| converter | upper, lower, reverse, tobinary, frombinary, tobase64, frombase64, fancy |
| games     | guess, rps, trivia, math, answer |
| sticker   | sticker, toimage |
| ai        | ai (placeholder — wire up a real provider in `commands/ai/ai.js`) |

## Notes

- The `.ai` command is a placeholder. Open `commands/ai/ai.js` and replace
  `callAIProvider()` with a real API call (OpenAI, Anthropic, etc.) and your
  own API key, stored as an environment variable — never hard-code keys in
  the file.
- I did not include "bug"/crash-inducing commands (payload spam, infinite
  loops sent to other users' devices, etc.) — those are a denial-of-service
  attack on whoever receives them and I won't build that functionality into
  this or any bot.
