exports.run = {
   usage: ['rank'],
   category: 'user info',
   async: async (m, {
      client,
      participants,
      Func
   }) => {
      let point = global.db.users.sort((a, b) => b.point - a.point)
      let rank = point.map(v => v.jid)
      let show = Math.min(10, point.length)
      let teks = `乂  *G L O B A L - R A N K*\n\n`
      teks += `“You are ranked *${rank.indexOf(m.sender) + 1}* out of *${global.db.users.length}* users.”\n\n`
      teks += point.slice(0, show).map((v, i) => (i + 1) + '. @' + v.jid.split`@` [0] + '\n    *💴  :  ' + Func.h2k(v.point) + '*\n    *🎗  :  ' + Func.level(v.point, global.multiplier)[0] + ' [ ' + Func.h2k(Func.level(v.point, global.multiplier)[3]) + ' / ' + Func.h2k(Func.level(v.point, global.multiplier)[1]) + ' ]*\n    *⚔️  :  ' + Func.role(Func.level(v.point, global.multiplier)[0]) + '*').join`\n`
      teks += `\n\n${global.footer}`
      m.reply(teks)
   },
   error: false
}