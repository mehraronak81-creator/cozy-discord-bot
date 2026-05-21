# Cozy Bot v2.0.0

A feature-rich Discord bot built by **Void&Co Development**.

Cozy brings moderation, utilities, fun commands, tickets, suggestions, logging, and more into one clean, reliable package.

**Support Server:** https://discord.gg/KE6habwtZU

---

## Features

### Moderation (9 commands)
- `/ban` - Ban a member (with DM notification, message deletion)
- `/unban` - Unban a user by ID
- `/kick` - Kick a member (with DM notification)
- `/mute` - Timeout a member for a set duration
- `/unmute` - Remove a member's timeout
- `/warn add|list|remove|clear` - Full warning system with threshold alerts
- `/purge` - Bulk delete messages with filters (by user, bots, links, attachments)
- `/slowmode` - Set channel slowmode
- `/lock on|off` - Lock/unlock channels
- `/modlog` - View moderation history

### Utility (6 commands)
- `/userinfo` - Detailed user information (roles, join date, account age, etc.)
- `/serverinfo` - Full server breakdown (members, channels, boosts, etc.)
- `/avatar` - Get a user's avatar in full resolution (global or server)
- `/ping` - Bot latency and uptime
- `/remind set|list|cancel` - Personal reminder system
- `/roleinfo` - Detailed role information
- `/membercount` - Server member count breakdown

### Fun (6 commands)
- `/8ball` - Ask the magic 8-ball
- `/coinflip` - Flip a coin
- `/roll` - Roll dice with full notation support (2d6, 1d20+5, etc.)
- `/poll` - Create polls with reaction voting
- `/choose` - Let the bot choose between options
- `/rps` - Rock Paper Scissors
- `/rate` - Rate anything out of 10

### Information (6 commands)
- `/about` - Bot info, stats, and links
- `/help` - Full command list with categories and per-command details
- `/license` - View the Void&Co proprietary license
- `/agreement` - View Terms of Service
- `/invite` - Get the bot invite link
- `/support` - Get the support server link

### Tickets & Suggestions (2 commands)
- `/ticket create|close|list` - Full ticket system with private channels
- `/suggest submit|approve|deny` - Suggestion system with voting

### Configuration (1 command, 8 subcommands)
- `/setup welcome` - Configure welcome messages
- `/setup goodbye` - Configure goodbye messages
- `/setup logs` - Set up event logging
- `/setup modlog` - Set up moderation logs
- `/setup autorole` - Auto-assign roles to new members
- `/setup tickets` - Enable the ticket system
- `/setup suggestions` - Set up suggestion channel
- `/setup disable` - Disable any feature
- `/setup view` - View current configuration

### Automatic Systems
- Welcome/goodbye messages with placeholders
- Auto-role assignment for new members
- Event logging (joins, leaves, message edits/deletes)
- Reminder delivery system (checked every 30 seconds)
- Rotating status display

---

## Setup Guide

### 1. Prerequisites
- Node.js 18.0 or higher
- A Discord bot application ([create one here](https://discord.com/developers/applications))

### 2. Installation
```bash
git clone <your-repo-url>
cd cozy-bot
npm install
```

### 3. Configuration
```bash
cp .env.example .env
```
Edit `.env` with your values:
- `DISCORD_TOKEN` - Your bot token
- `CLIENT_ID` - Your application/client ID
- `GUILD_ID` - (Optional) Test server ID for fast command deployment
- `OWNER_ID` - Your Discord user ID

### 4. Deploy Commands
```bash
# Deploy globally (takes up to 1 hour to propagate)
npm run deploy

# Deploy to a test guild (instant)
npm run deploy -- --guild
```

### 5. Start the Bot
```bash
npm start
```

### 6. Configure Your Server
Once the bot is in your server, use `/setup view` to see the current configuration, then use the setup subcommands to enable features.

---

## Required Bot Permissions
- Manage Channels
- Manage Roles
- Kick Members
- Ban Members
- Moderate Members
- Manage Messages
- Read Messages/View Channels
- Send Messages
- Embed Links
- Add Reactions
- Read Message History

**Invite URL (Administrator):**
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands
```

---

## Tech Stack
- **Runtime:** Node.js
- **Library:** discord.js v14
- **Database:** SQLite (via better-sqlite3)
- **Language:** JavaScript (ES Modules)

---

## Project Structure
```
cozy-bot/
  src/
    index.js              - Main entry point
    config.js             - Bot configuration
    deploy-commands.js    - Slash command deployer
    commands/
      moderation/         - Ban, kick, mute, warn, purge, etc.
      utility/            - Userinfo, serverinfo, avatar, ping, etc.
      fun/                - 8ball, coinflip, roll, poll, etc.
      info/               - About, help, license, agreement, etc.
      tickets/            - Ticket and suggestion systems
      config/             - Server setup commands
    events/               - Discord event handlers
    handlers/             - Command and event loaders
    utils/
      database.js         - SQLite database manager
      embed.js            - Embed builder utilities
      logger.js           - Console logger
      permissions.js      - Permission helpers
  data/                   - SQLite database (auto-created)
  .env.example            - Environment template
  LICENSE                 - Void&Co proprietary license
  package.json
  README.md
```

---

## License

Copyright (c) 2024-2026 **Void&Co Development**. All rights reserved.

This software is proprietary. See [LICENSE](./LICENSE) for full terms.

---

**Made with care by Void&Co Development**
https://discord.gg/KE6habwtZU
