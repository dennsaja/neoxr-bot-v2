exports.run = {
   usage: ['toplocal'],
   category: 'user info',
   async: async (m, {
      client,
      participants,
      Func
   }) => {
      let member = participants.map(u => u.id)
      let users = []
      for (i = 0; i < member.length; i++) {
         if (global.db.users.some(v => v.jid == member[i]) && member[i] != client.decodeJid(client.user.id)) {
            users.push({
               jid: member[i],
               point: global.db.users.find(v => v.jid == member[i]).point,
               level: Func.level(global.db.users.find(v => v.jid == member[i]).point),
               limit: global.db.users.find(v => v.jid == member[i]).limit
            })
         }
      }
      let point = users.sort((a, b) => b.point - a.point)
      let rank = point.map(v => v.jid)
      let show = Math.min(10, point.length)
      let teks = `乂  *T O P - L O C A L*\n\n`
      teks += `“You are ranked *${rank.indexOf(m.sender) + 1}* out of *${member.length}* ${await (await client.groupMetadata(m.chat)).subject} group members.”\n\n`
      teks += point.slice(0, show).map((v, i) => (i + 1) + '. @' + v.jid.split`@` [0] + '\n    *💴  :  ' + Func.h2k(v.point) + ' (' + Func.h2k(v.point) + ')*\n    *🎗️  :  ' + v.level[0] + ' [ ' + Func.formatNumber(v.level[3]) + ' / ' + Func.formatNumber(v.level[1]) + ' ]*').join`\n`
      teks += `\n\n${global.footer}`
      client.reply(m.chat, teks, m)
   },
   error: false,
   group: true
}