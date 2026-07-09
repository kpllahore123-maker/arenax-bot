const { Client, GatewayIntentBits, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const admin = require('firebase-admin');
require('dotenv').config();

// ── Firebase Init ──
try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
  console.log('✅ Firebase connected!');
} catch (e) {
  console.error('❌ Firebase error:', e.message);
}

const db = admin.firestore();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// ── CONSTANTS ──
const ARENA_URL = 'https://kpllahore123-maker.github.io/arenaX/';
const BANNER_URL = 'https://raw.githubusercontent.com/kpllahore123-maker/arenaX/main/event_banner_1783187383925.jpg';
const ADMIN_IDS = ['xDa31jOrsoQC2HxjSheO3wBqyII2']; // Discord User IDs of admins

const jokes = [
  "Why did the gamer go broke? Because he spent all his coins on in-app purchases! 😂",
  "What do you call a fish who plays video games? A game-r fish! 🐟",
  "Why can't gamers play hide and seek? Because good players are always found! 🎮",
  "What's a gamer's favorite subject? Multi-player-cation! 📚",
  "Why did the noob cross the road? To get to the respawn point! 💀",
  "Why did the WiFi router break up with the gamer? Too much lag in the relationship! 📶",
];

const tips = [
  "🎯 Always warm up before a tournament match!",
  "🗺️ Learn the map — knowing positions wins games!",
  "🎧 Use headphones — sound gives enemy positions!",
  "💊 Don't forget to heal before engaging!",
  "🤝 Communication with squad wins more games than skill!",
  "😤 Stay calm under pressure — panic = mistakes!",
  "🔋 Keep your phone/device charged before matches!",
  "🏃 Movement is key — never stay still in the open!",
];

const quizQuestions = [
  { q: 'Which country won FIFA World Cup 2022?', a: 'argentina' },
  { q: 'Who is the all-time top scorer in FIFA World Cups?', a: 'ronaldo' },
  { q: 'Which country has won the most World Cups?', a: 'brazil' },
  { q: 'In which year was the first FIFA World Cup held?', a: '1930' },
  { q: 'Which player is known as CR7?', a: 'ronaldo' },
  { q: 'How many players are in a football team on the field?', a: '11' },
  { q: 'Which country is hosting FIFA World Cup 2026?', a: 'usa' },
  { q: 'What is the nickname of the Brazilian national football team?', a: 'seleção' },
];

const activeQuiz = new Map();

// ── HELPER: Get Tournaments from Firebase ──
async function getTournaments() {
  try {
    const snap = await db.collection('tournaments')
      .orderBy('createdAt', 'desc')
      .limit(8)
      .get();
    const list = [];
    snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
    return list;
  } catch (e) {
    console.error('Tournaments fetch error:', e.message);
    return null;
  }
}

// ── HELPER: Get Leaderboard from Firebase ──
async function getLeaderboard() {
  try {
    const snap = await db.collection('users')
      .orderBy('balance', 'desc')
      .limit(10)
      .get();
    const list = [];
    snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
    return list;
  } catch (e) {
    console.error('Leaderboard fetch error:', e.message);
    return null;
  }
}

client.once('ready', () => {
  console.log(`✅ ArenaX Bot online as ${client.user.tag}`);
  client.user.setActivity('ArenaX Tournaments 🏆', { type: 0 });
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  const content = message.content.toLowerCase().trim();
  const args = message.content.trim().split(/\s+/);
  const cmd = args[0].toLowerCase();

  // ── !help ──
  if (content === '!help') {
    const embed = new EmbedBuilder()
      .setColor('#f0c040')
      .setTitle('🏆 ArenaX Bot Commands')
      .setDescription('Welcome to ArenaX Esports Platform!')
      .addFields(
        { name: '🌐 General', value: '`!register` `!website` `!info` `!ping`', inline: false },
        { name: '🏆 Tournaments', value: '`!tournaments` `!leaderboard` `!worldcup` `!missions`', inline: false },
        { name: '🎲 Fun', value: '`!roll` `!coinflip` `!quiz` `!joke` `!tip` `!8ball` `!rps`', inline: false },
        { name: '👤 Profile', value: '`!avatar` `!serverinfo`', inline: false },
        { name: '📜 Server', value: '`!rules` `!afk`', inline: false },
        { name: '🔧 Maintenance', value: '`!maintenance` `!setmaintenance on/off` *(admin)*', inline: false },
        { name: '📢 Admin', value: '`!announce #channel message` `!alert message` *(admin)*', inline: false },
        { name: '🛡️ Moderation', value: '`!warn @user` `!clear 10` `!slowmode 5` *(admin)*', inline: false },
      )
      .setThumbnail(BANNER_URL)
      .setFooter({ text: 'ArenaX — Compete · Rise · Dominate' })
      .setTimestamp();
    return message.reply({ embeds: [embed] });
  }

  // ── !ping ──
  if (content === '!ping') {
    return message.reply(`🏓 Pong! Latency: **${client.ws.ping}ms**`);
  }

  // ── !register ──
  if (content === '!register') {
    const embed = new EmbedBuilder()
      .setColor('#3ddc84')
      .setTitle('🎮 Join ArenaX!')
      .setDescription('Register on ArenaX and start competing!')
      .addFields(
        { name: '🔗 Website', value: ARENA_URL },
        { name: '📋 Steps', value: '1. Open the link\n2. Sign up with Google or Email\n3. Join tournaments and WIN AX Coins!' }
      )
      .setFooter({ text: 'ArenaX — Compete · Rise · Dominate' });
    return message.reply({ embeds: [embed] });
  }

  // ── !website ──
  if (content === '!website') {
    const embed = new EmbedBuilder()
      .setColor('#4f9eff')
      .setTitle('🌐 ArenaX Website')
      .setDescription(`**${ARENA_URL}**`)
      .setFooter({ text: 'ArenaX — Compete · Rise · Dominate' });
    return message.reply({ embeds: [embed] });
  }

  // ── !info ──
  if (content === '!info') {
    const embed = new EmbedBuilder()
      .setColor('#a78bfa')
      .setTitle('🏆 About ArenaX')
      .setDescription('ArenaX is a dark-themed gaming tournament platform!')
      .addFields(
        { name: '🎮 Features', value: '• Online Tournaments\n• AX Coin Wallet\n• Premium Profiles\n• Live Chat\n• FIFA World Cup Event\n• Red Report System\n• Discord Bot' },
        { name: '🌐 Website', value: ARENA_URL },
        { name: '💰 Currency', value: 'AX Coins — earn by winning tournaments!' },
      )
      .setFooter({ text: 'Compete · Rise · Dominate' });
    return message.reply({ embeds: [embed] });
  }

  // ── !tournaments (Firebase) ──
  if (content === '!tournaments') {
    const loadingMsg = await message.reply('⏳ Fetching tournaments...');
    const tours = await getTournaments();

    if (!tours) {
      return loadingMsg.edit('❌ Could not fetch tournaments. Try again later!');
    }
    if (tours.length === 0) {
      return loadingMsg.edit('📭 No tournaments found right now. Check back later!');
    }

    const embed = new EmbedBuilder()
      .setColor('#e8404a')
      .setTitle('🏆 ArenaX Tournaments')
      .setDescription(`Found **${tours.length}** tournament(s)!`)
      .setFooter({ text: `Register at ${ARENA_URL}` })
      .setTimestamp();

    tours.forEach(t => {
      const status = t.status === 'live' ? '🔴 LIVE' : t.status === 'upcoming' ? '🔵 Upcoming' : '⚫ Ended';
      const squadInfo = t.squadSize === 'solo' ? 'Solo' : t.squadSize === 'duo' ? 'Duo (2)' : t.squadSize === 'trio' ? 'Trio (3)' : 'Squad (4)';
      embed.addFields({
        name: `${status} — ${t.name}`,
        value: `🎮 **${t.game || 'Grand RP Mobile'}** | 👥 ${squadInfo}\n🏅 Prize: **${t.prize || 'TBD'}** | 💰 Fee: ${t.entryFee || 'Free'}\n📅 ${t.date || 'TBA'} ${t.time ? '· ' + t.time : ''}\n👤 Players: ${t.registered || 0}/${t.maxPlayers || 32}`,
        inline: false,
      });
    });

    return loadingMsg.edit({ content: '', embeds: [embed] });
  }

  // ── !leaderboard (Firebase) ──
  if (content === '!leaderboard') {
    const loadingMsg = await message.reply('⏳ Fetching leaderboard...');
    const players = await getLeaderboard();

    if (!players) {
      return loadingMsg.edit('❌ Could not fetch leaderboard. Try again later!');
    }
    if (players.length === 0) {
      return loadingMsg.edit('📭 No players found yet!');
    }

    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
    const embed = new EmbedBuilder()
      .setColor('#f0c040')
      .setTitle('🏆 ArenaX Leaderboard — Top Players')
      .setDescription('Ranked by AX Coin balance')
      .setFooter({ text: 'ArenaX — Compete · Rise · Dominate' })
      .setTimestamp();

    players.forEach((u, i) => {
      embed.addFields({
        name: `${medals[i]} ${u.name || 'Player'}`,
        value: `💰 **${(u.balance || 0).toLocaleString()} AX** ${u.premium ? '👑' : ''} ${u.banned ? '🚫' : ''}`,
        inline: true,
      });
    });

    return loadingMsg.edit({ content: '', embeds: [embed] });
  }

  // ── !worldcup ──
  if (content === '!worldcup') {
    const embed = new EmbedBuilder()
      .setColor('#f0c040')
      .setTitle('⚽ FIFA World Cup Event — ArenaX')
      .setDescription('Join the ArenaX FIFA World Cup Special Event!')
      .addFields(
        { name: '🌍 Format', value: '32 Players | 8 Squads | Last squad standing WINS!' },
        { name: '🎁 Rewards', value: '• FIFA World Member Badge\n• Football Avatar\n• 7 Days Free Premium\n• Special Gold Frame\n• 50,000+ AX Coins' },
        { name: '🔗 Join Now', value: ARENA_URL },
      )
      .setImage(BANNER_URL)
      .setFooter({ text: 'ArenaX — Compete · Rise · Dominate' });
    return message.reply({ embeds: [embed] });
  }

  // ── !missions ──
  if (content === '!missions') {
    const embed = new EmbedBuilder()
      .setColor('#3ddc84')
      .setTitle('📋 FIFA Event Missions')
      .addFields(
        { name: '1️⃣ Choose Team → 50 AX', value: 'Select your World Cup country team', inline: false },
        { name: '2️⃣ Register → 100 AX', value: 'Register in any tournament', inline: false },
        { name: '3️⃣ Login Streak → 150 AX', value: 'Login 3 days in a row', inline: false },
        { name: '4️⃣ Mini Game → 200 AX', value: 'Score 10 goals in penalty shootout', inline: false },
        { name: '5️⃣ GOAL! → 50 AX', value: 'Type "GOAL" in global chat', inline: false },
        { name: '🎁 Complete All 5!', value: 'FIFA World Member Badge + Football Avatar + 7 Days Premium!', inline: false },
      )
      .setFooter({ text: 'ArenaX — Compete · Rise · Dominate' });
    return message.reply({ embeds: [embed] });
  }

  // ── !roll ──
  if (content === '!roll') {
    const num = Math.floor(Math.random() * 100) + 1;
    const embed = new EmbedBuilder()
      .setColor('#a78bfa')
      .setTitle('🎲 Dice Roll')
      .setDescription(`${message.author.username} rolled: **${num}/100**`)
      .setFooter({ text: num === 100 ? '🎉 PERFECT!' : num >= 80 ? '🔥 Great!' : num <= 10 ? '💀 Bad luck!' : '' });
    return message.reply({ embeds: [embed] });
  }

  // ── !coinflip ──
  if (content === '!coinflip') {
    const result = Math.random() < 0.5 ? '🪙 HEADS' : '🪙 TAILS';
    const embed = new EmbedBuilder()
      .setColor('#f0c040')
      .setTitle('🪙 Coin Flip')
      .setDescription(`${message.author.username} flipped: **${result}**`);
    return message.reply({ embeds: [embed] });
  }

  // ── !8ball ──
  if (cmd === '!8ball') {
    const responses = ['Yes! 🟢', 'No! 🔴', 'Maybe... 🟡', 'Definitely! ✅', 'Absolutely not! ❌', 'Ask again later 🔮', 'Signs point to yes! 🎯', 'Very doubtful 🤔'];
    const q = args.slice(1).join(' ');
    if (!q) return message.reply('❌ Ask a question! Usage: `!8ball will I win the tournament?`');
    const embed = new EmbedBuilder()
      .setColor('#a78bfa')
      .setTitle('🎱 Magic 8 Ball')
      .addFields(
        { name: '❓ Question', value: q },
        { name: '🎱 Answer', value: responses[Math.floor(Math.random() * responses.length)] },
      );
    return message.reply({ embeds: [embed] });
  }

  // ── !rps ──
  if (cmd === '!rps') {
    const choice = args[1]?.toLowerCase();
    const choices = ['rock', 'paper', 'scissors'];
    if (!choices.includes(choice)) return message.reply('❌ Usage: `!rps rock` / `!rps paper` / `!rps scissors`');
    const botChoice = choices[Math.floor(Math.random() * 3)];
    const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };
    let result;
    if (choice === botChoice) result = "It's a **Tie!** 🤝";
    else if ((choice === 'rock' && botChoice === 'scissors') || (choice === 'paper' && botChoice === 'rock') || (choice === 'scissors' && botChoice === 'paper')) result = 'You **Win!** 🎉';
    else result = 'Bot **Wins!** 🤖';
    const embed = new EmbedBuilder()
      .setColor('#4f9eff')
      .setTitle('✂️ Rock Paper Scissors')
      .addFields(
        { name: 'You', value: `${emojis[choice]} ${choice}`, inline: true },
        { name: 'Bot', value: `${emojis[botChoice]} ${botChoice}`, inline: true },
        { name: 'Result', value: result, inline: false },
      );
    return message.reply({ embeds: [embed] });
  }

  // ── !joke ──
  if (content === '!joke') {
    const embed = new EmbedBuilder()
      .setColor('#3ddc84')
      .setTitle('😂 Gaming Joke')
      .setDescription(jokes[Math.floor(Math.random() * jokes.length)])
      .setFooter({ text: 'ArenaX — Compete · Rise · Dominate' });
    return message.reply({ embeds: [embed] });
  }

  // ── !tip ──
  if (content === '!tip') {
    const embed = new EmbedBuilder()
      .setColor('#f0c040')
      .setTitle('💡 Gaming Tip')
      .setDescription(tips[Math.floor(Math.random() * tips.length)])
      .setFooter({ text: 'ArenaX — Compete · Rise · Dominate' });
    return message.reply({ embeds: [embed] });
  }

  // ── !quiz ──
  if (content === '!quiz') {
    if (activeQuiz.has(message.channel.id)) return message.reply('❌ Quiz already active! Answer it first.');
    const q = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
    activeQuiz.set(message.channel.id, { answer: q.a, userId: message.author.id });
    const embed = new EmbedBuilder()
      .setColor('#4f9eff')
      .setTitle('🧠 Football Trivia!')
      .setDescription(`**${q.q}**\n\nType your answer! You have **30 seconds** ⏰`)
      .setFooter({ text: 'First correct answer wins!' });
    message.reply({ embeds: [embed] });
    setTimeout(() => {
      if (activeQuiz.has(message.channel.id)) {
        activeQuiz.delete(message.channel.id);
        message.channel.send(`⏰ Time's up! The answer was: **${q.a}**`);
      }
    }, 30000);
    return;
  }

  // Quiz answer check
  if (activeQuiz.has(message.channel.id)) {
    const quiz = activeQuiz.get(message.channel.id);
    if (content.includes(quiz.answer)) {
      activeQuiz.delete(message.channel.id);
      const embed = new EmbedBuilder()
        .setColor('#3ddc84')
        .setTitle('🎉 Correct Answer!')
        .setDescription(`**${message.author.username}** got it right!\nAnswer: **${quiz.answer}**`)
        .setFooter({ text: 'Visit ArenaX to win real AX Coins!' });
      return message.reply({ embeds: [embed] });
    }
  }

  // ── !avatar ──
  if (cmd === '!avatar') {
    const target = message.mentions.users.first() || message.author;
    const embed = new EmbedBuilder()
      .setColor('#4f9eff')
      .setTitle(`🖼️ ${target.username}'s Avatar`)
      .setImage(target.displayAvatarURL({ size: 512 }));
    return message.reply({ embeds: [embed] });
  }

  // ── !afk ──
  if (cmd === '!afk') {
    const reason = args.slice(1).join(' ') || 'AFK';
    return message.reply(`💤 **${message.author.username}** is now AFK: *${reason}*`);
  }

  // ── !rules ──
  if (content === '!rules') {
    const embed = new EmbedBuilder()
      .setColor('#e8404a')
      .setTitle('📜 ArenaX Server Rules')
      .addFields(
        { name: '1️⃣ Respect', value: 'Respect all members — no toxicity!', inline: false },
        { name: '2️⃣ No Spam', value: 'No spamming messages or commands', inline: false },
        { name: '3️⃣ No Cheating', value: 'Cheating in tournaments = permanent ban', inline: false },
        { name: '4️⃣ Language', value: 'Keep it clean — no excessive profanity', inline: false },
        { name: '5️⃣ Fair Play', value: 'Report cheaters via Red Report on ArenaX', inline: false },
      )
      .setFooter({ text: 'ArenaX — Compete · Rise · Dominate' });
    return message.reply({ embeds: [embed] });
  }

  // ── !serverinfo ──
  if (content === '!serverinfo') {
    const guild = message.guild;
    const embed = new EmbedBuilder()
      .setColor('#4f9eff')
      .setTitle(`📊 ${guild.name}`)
      .addFields(
        { name: '👥 Members', value: `${guild.memberCount}`, inline: true },
        { name: '📅 Created', value: guild.createdAt.toDateString(), inline: true },
        { name: '🌐 ArenaX', value: ARENA_URL, inline: false },
      )
      .setFooter({ text: 'ArenaX — Compete · Rise · Dominate' });
    return message.reply({ embeds: [embed] });
  }

  // ── !maintenance ──
  if (content === '!maintenance') {
    const embed = new EmbedBuilder()
      .setColor('#e8404a')
      .setTitle('🔧 ArenaX — Under Maintenance')
      .setDescription('ArenaX is currently undergoing maintenance!')
      .addFields(
        { name: '⏰ Status', value: '🔴 Currently Offline', inline: true },
        { name: '💬 Updates', value: 'Stay in this Discord server for live updates!', inline: false },
      )
      .setImage(BANNER_URL)
      .setFooter({ text: "ArenaX — We'll be back stronger! 💪" })
      .setTimestamp();
    return message.channel.send({ embeds: [embed] });
  }

  // ── !setmaintenance (admin) ──
  if (cmd === '!setmaintenance') {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) return message.reply('❌ Admins only!');
    const status = args[1]?.toLowerCase();
    if (status === 'on') {
      const embed = new EmbedBuilder()
        .setColor('#e8404a')
        .setTitle('🔧 ArenaX — Maintenance Mode ON')
        .setDescription('⚠️ ArenaX is going into maintenance mode.')
        .addFields({ name: '⏰ Started At', value: new Date().toLocaleString('en-PK') })
        .setTimestamp();
      return message.channel.send({ embeds: [embed] });
    } else if (status === 'off') {
      const embed = new EmbedBuilder()
        .setColor('#3ddc84')
        .setTitle('✅ ArenaX — Back Online!')
        .setDescription('🎉 ArenaX is back online! All systems running!')
        .addFields(
          { name: '⏰ Restored At', value: new Date().toLocaleString('en-PK') },
          { name: '🔗 Play Now', value: ARENA_URL },
        )
        .setTimestamp();
      return message.channel.send({ embeds: [embed] });
    }
    return message.reply('Usage: `!setmaintenance on` or `!setmaintenance off`');
  }

  // ── !announce (admin) ──
  if (cmd === '!announce') {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) return message.reply('❌ Admins only!');
    const channel = message.mentions.channels.first();
    const msg = args.slice(2).join(' ');
    if (!channel || !msg) return message.reply('❌ Usage: `!announce #channel Your message here`');
    const embed = new EmbedBuilder()
      .setColor('#f0c040')
      .setTitle('📢 ArenaX Announcement')
      .setDescription(msg)
      .setFooter({ text: 'ArenaX — Compete · Rise · Dominate' })
      .setTimestamp();
    await channel.send({ embeds: [embed] });
    return message.reply(`✅ Announcement sent to ${channel}!`);
  }

  // ── !alert (admin broadcast) ──
  if (cmd === '!alert') {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) return message.reply('❌ Admins only!');
    const msg = args.slice(1).join(' ');
    if (!msg) return message.reply('❌ Usage: `!alert Your emergency message here`');
    const embed = new EmbedBuilder()
      .setColor('#e8404a')
      .setTitle('🚨 ArenaX Alert')
      .setDescription(`@everyone\n\n${msg}`)
      .setFooter({ text: 'ArenaX Admin Team' })
      .setTimestamp();
    return message.channel.send({ content: '@everyone', embeds: [embed] });
  }

  // ── !warn (admin) ──
  if (cmd === '!warn') {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return message.reply('❌ No permission!');
    const target = message.mentions.members.first();
    if (!target) return message.reply('❌ Usage: `!warn @user reason`');
    const reason = args.slice(2).join(' ') || 'No reason provided';
    const embed = new EmbedBuilder()
      .setColor('#f0c040')
      .setTitle('⚠️ Warning Issued')
      .addFields(
        { name: 'User', value: target.user.tag, inline: true },
        { name: 'Reason', value: reason, inline: true },
        { name: 'By', value: message.author.tag, inline: true },
      )
      .setFooter({ text: 'ArenaX — Compete · Rise · Dominate' });
    return message.channel.send({ embeds: [embed] });
  }

  // ── !clear (admin) ──
  if (cmd === '!clear') {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) return message.reply('❌ No permission!');
    const amount = parseInt(args[1]) || 5;
    if (amount > 100) return message.reply('❌ Max 100 messages at once!');
    await message.channel.bulkDelete(amount + 1, true);
    const msg = await message.channel.send(`✅ Deleted **${amount}** messages!`);
    setTimeout(() => msg.delete().catch(() => {}), 3000);
    return;
  }

  // ── !slowmode (admin) ──
  if (cmd === '!slowmode') {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) return message.reply('❌ No permission!');
    const seconds = parseInt(args[1]) || 0;
    await message.channel.setRateLimitPerUser(seconds);
    return message.reply(`✅ Slowmode set to **${seconds} seconds**!`);
  }
});

client.login(process.env.DISCORD_TOKEN);
