const { Client, GatewayIntentBits, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// ── TRIVIA QUESTIONS ──
const quizQuestions = [
  { q: 'Which country won FIFA World Cup 2022?', a: 'argentina' },
  { q: 'Who is the all-time top scorer in FIFA World Cups?', a: 'ronaldo' },
  { q: 'Which country has won the most World Cups?', a: 'brazil' },
  { q: 'In which year was the first FIFA World Cup held?', a: '1930' },
  { q: 'Which player is known as CR7?', a: 'ronaldo' },
  { q: 'Which club did Messi join after PSG?', a: 'inter miami' },
  { q: 'How many players are in a football team on the field?', a: '11' },
  { q: 'Which country is hosting FIFA World Cup 2026?', a: 'usa' },
];

// ── GAMING JOKES ──
const jokes = [
  "Why did the gamer go broke? Because he spent all his coins on in-app purchases! 😂",
  "What do you call a fish who plays video games? A game-r fish! 🐟",
  "Why can't gamers play hide and seek? Because good players are always found! 🎮",
  "What's a gamer's favorite subject? Multi-player-cation! 📚",
  "Why did the noob cross the road? To get to the respawn point! 💀",
];

// Active quiz sessions
const activeQuiz = new Map();

client.once('ready', () => {
  console.log(`✅ ArenaX Bot online as ${client.user.tag}`);
  client.user.setActivity('ArenaX Tournaments 🏆', { type: 0 });
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  const content = message.content.toLowerCase().trim();
  const args = message.content.trim().split(/\s+/);

  // ── !help ──
  if (content === '!help') {
    const embed = new EmbedBuilder()
      .setColor('#f0c040')
      .setTitle('🏆 ArenaX Bot Commands')
      .setDescription('Welcome to ArenaX Esports Platform!')
      .addFields(
        { name: '🌐 General', value: '`!register` `!website` `!info` `!ping`', inline: false },
        { name: '🏆 Tournaments', value: '`!tournaments` `!worldcup` `!missions`', inline: false },
        { name: '🎲 Fun', value: '`!roll` `!coinflip` `!quiz` `!joke`', inline: false },
        { name: '📜 Server', value: '`!rules` `!serverinfo`', inline: false },
        { name: '🛡️ Moderation', value: '`!warn @user reason` `!rules`', inline: false },
      )
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
        { name: '🔗 Website', value: 'https://kpllahore123-maker.github.io/arenaX/' },
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
      .setDescription('**https://kpllahore123-maker.github.io/arenaX/**')
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
        { name: '🎮 Features', value: '• Online Tournaments\n• AX Coin Wallet\n• Premium Profiles\n• Live Chat\n• FIFA World Cup Event\n• Red Report System' },
        { name: '🌐 Website', value: 'https://kpllahore123-maker.github.io/arenaX/' },
        { name: '💰 Currency', value: 'AX Coins — earn by winning tournaments!' },
      )
      .setFooter({ text: 'Compete · Rise · Dominate' });
    return message.reply({ embeds: [embed] });
  }

  // ── !tournaments ──
  if (content === '!tournaments') {
    const embed = new EmbedBuilder()
      .setColor('#e8404a')
      .setTitle('🏆 ArenaX Tournaments')
      .setDescription('Join tournaments on ArenaX and win AX Coins!')
      .addFields(
        { name: '🔴 FIFA World Cup Squad Event', value: '📅 July 15, 2026\n🏅 Prize: 50,000 AX Coins\n👥 Format: Squad (4v4)\n⏰ Time: 8:00 PM PKT' },
        { name: '🔵 How to Join', value: '1. Visit ArenaX website\n2. Login/Register\n3. Click "JOIN & REGISTER NOW"\n4. Complete registration form' },
        { name: '🔗 Register Now', value: 'https://kpllahore123-maker.github.io/arenaX/' },
      )
      .setFooter({ text: 'ArenaX — Compete · Rise · Dominate' });
    return message.reply({ embeds: [embed] });
  }

  // ── !worldcup ──
  if (content === '!worldcup') {
    const embed = new EmbedBuilder()
      .setColor('#f0c040')
      .setTitle('⚽ FIFA World Cup Event — ArenaX')
      .setDescription('Join the ArenaX FIFA World Cup Special Event!')
      .addFields(
        { name: '🌍 Event', value: 'FIFA World Cup Squad Battle Royale' },
        { name: '👥 Format', value: '32 Players | 8 Squads | 1 Match | Last squad standing WINS!' },
        { name: '🎁 Rewards', value: '• FIFA World Member Badge\n• Football Avatar\n• 7 Days Free Premium\n• Special Gold Frame\n• 1000+ AX Coins' },
        { name: '📋 Missions', value: '1. Choose your country team\n2. Register in tournament\n3. Login 3 days in a row\n4. Score 10 goals in mini game\n5. Type GOAL in global chat' },
        { name: '🔗 Join Now', value: 'https://kpllahore123-maker.github.io/arenaX/' },
      )
      .setColor('#f0c040')
      .setFooter({ text: 'ArenaX — Compete · Rise · Dominate' });
    return message.reply({ embeds: [embed] });
  }

  // ── !missions ──
  if (content === '!missions') {
    const embed = new EmbedBuilder()
      .setColor('#3ddc84')
      .setTitle('📋 FIFA Event Missions')
      .addFields(
        { name: '1️⃣ Choose Team', value: 'Select your World Cup country team → **50 AX**', inline: false },
        { name: '2️⃣ Register', value: 'Register in any tournament → **100 AX**', inline: false },
        { name: '3️⃣ Login Streak', value: 'Login 3 days in a row → **150 AX**', inline: false },
        { name: '4️⃣ Mini Game', value: 'Score 10 goals in penalty shootout → **200 AX**', inline: false },
        { name: '5️⃣ GOAL!', value: 'Type "GOAL" in global chat → **50 AX**', inline: false },
        { name: '🎁 Complete All 5', value: 'FIFA World Member Badge + Football Avatar + 7 Days Premium!', inline: false },
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
      .setDescription(`${message.author.username} rolled: **${num}**`)
      .setFooter({ text: num === 100 ? '🎉 PERFECT SCORE!' : num >= 80 ? '🔥 Great roll!' : num <= 20 ? '💀 Bad luck!' : '' });
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

  // ── !joke ──
  if (content === '!joke') {
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    const embed = new EmbedBuilder()
      .setColor('#3ddc84')
      .setTitle('😂 Gaming Joke')
      .setDescription(joke)
      .setFooter({ text: 'ArenaX — Compete · Rise · Dominate' });
    return message.reply({ embeds: [embed] });
  }

  // ── !quiz ──
  if (content === '!quiz') {
    if (activeQuiz.has(message.channel.id)) {
      return message.reply('❌ A quiz is already active in this channel! Answer it first.');
    }
    const q = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
    activeQuiz.set(message.channel.id, { answer: q.a, userId: message.author.id });
    const embed = new EmbedBuilder()
      .setColor('#4f9eff')
      .setTitle('🧠 Football Trivia!')
      .setDescription(`**${q.q}**\n\nType your answer below! You have **30 seconds**`)
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

  // ── Quiz answer check ──
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

  // ── !rules ──
  if (content === '!rules') {
    const embed = new EmbedBuilder()
      .setColor('#e8404a')
      .setTitle('📜 Server Rules')
      .addFields(
        { name: '1️⃣ Respect', value: 'Respect all members — no toxicity!', inline: false },
        { name: '2️⃣ No Spam', value: 'No spamming messages or commands', inline: false },
        { name: '3️⃣ No Cheating', value: 'Cheating in tournaments = permanent ban', inline: false },
        { name: '4️⃣ Language', value: 'Keep it clean — no excessive profanity', inline: false },
        { name: '5️⃣ Fair Play', value: 'Play fair — report cheaters via Red Report on ArenaX', inline: false },
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
        { name: '🌐 ArenaX', value: 'https://kpllahore123-maker.github.io/arenaX/', inline: false },
      )
      .setFooter({ text: 'ArenaX — Compete · Rise · Dominate' });
    return message.reply({ embeds: [embed] });
  }

  // ── !warn ──
  if (args[0].toLowerCase() === '!warn') {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return message.reply('❌ You do not have permission to warn members!');
    }
    const target = message.mentions.members.first();
    if (!target) return message.reply('❌ Please mention a user to warn! Usage: `!warn @user reason`');
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
});

client.login(process.env.DISCORD_TOKEN);
