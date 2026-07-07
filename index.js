const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { credential } = require('firebase-admin');
require('dotenv').config();

const firebaseApp = initializeApp({
  credential: credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});
const db = getFirestore(firebaseApp);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(`✅ ArenaX Bot online as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  const content = message.content.toLowerCase().trim();

  if (content === '!help') {
    const embed = new EmbedBuilder()
      .setColor('#f0c040')
      .setTitle('🏆 ArenaX Bot Commands')
      .addFields(
        { name: '!tournaments', value: 'Upcoming tournaments', inline: true },
        { name: '!leaderboard', value: 'Top 5 players', inline: true },
        { name: '!register', value: 'Registration link', inline: true },
        { name: '!ping', value: 'Bot latency', inline: true },
      )
      .setFooter({ text: 'ArenaX — Compete · Rise · Dominate' });
    return message.reply({ embeds: [embed] });
  }

  if (content === '!tournaments') {
    try {
      const snap = await db.collection('tournaments')
        .where('status', 'in', ['upcoming', 'live'])
        .limit(5).get();
      if (snap.empty) return message.reply('No upcoming tournaments!');
      const embed = new EmbedBuilder()
        .setColor('#e8404a')
        .setTitle('🏆 ArenaX Tournaments');
      snap.forEach(doc => {
        const t = doc.data();
        embed.addFields({
          name: `${t.status === 'live' ? '🔴' : '🔵'} ${t.name}`,
          value: `🎮 ${t.game || 'Grand RP'} | 🏅 ${t.prize || 'TBD'} | 👥 ${t.registered || 0}/${t.maxPlayers || 32}`,
        });
      });
      return message.reply({ embeds: [embed] });
    } catch (e) { return message.reply('❌ Error: ' + e.message); }
  }

  if (content === '!leaderboard') {
    try {
      const snap = await db.collection('users')
        .orderBy('balance', 'desc').limit(5).get();
      const medals = ['🥇','🥈','🥉','4️⃣','5️⃣'];
      const embed = new EmbedBuilder()
        .setColor('#f0c040')
        .setTitle('🏆 ArenaX Top Players');
      let i = 0;
      snap.forEach(doc => {
        const u = doc.data();
        embed.addFields({
          name: `${medals[i]} ${u.name || 'Player'}`,
          value: `💰 ${(u.balance||0).toLocaleString()} AX ${u.premium?'👑':''}`,
          inline: true,
        });
        i++;
      });
      return message.reply({ embeds: [embed] });
    } catch (e) { return message.reply('❌ Error: ' + e.message); }
  }

  if (content === '!register') {
    const embed = new EmbedBuilder()
      .setColor('#3ddc84')
      .setTitle('🎮 Join ArenaX!')
      .addFields(
        { name: '🔗 Link', value: 'https://kpllahore123-maker.github.io/arenaX/' },
      );
    return message.reply({ embeds: [embed] });
  }

  if (content === '!ping') {
    return message.reply(`🏓 Pong! **${client.ws.ping}ms**`);
  }
});

client.login(process.env.DISCORD_TOKEN);
