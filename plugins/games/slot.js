exports.run = {
   usage: ['slot'],
   category: 'fun games',
   async: async (m, {
      client,
      Func
   }) => {
      let user = global.db.users.find(v => v.jid == m.sender)
      let level = Func.level(global.db.users.find(v => v.jid == m.sender).point)[0]
      if (user.point == 0) return client.reply(m.chat, Func.texted('bold', `🚩 Kamu tidak punya point untuk bermain game slot.`), m)
      if (user.point < 1000) return client.reply(m.chat, Func.texted('bold', `🚩 Untuk bermain minimal kamu harus mempunyai 1000 point.`), m)
      let reward = Func.randomInt(global.min_reward, global.max_reward)
      let emojis = ["🍃", "🍟", "🐱"]
      let a = Math.floor(Math.random() * emojis.length)
      let b = Math.floor(Math.random() * emojis.length)
      let c = Math.floor(Math.random() * emojis.length)
      let x = [],
         y = [],
         z = []
      for (let i = 0; i < 3; i++) {
         x[i] = emojis[a]
         a++
         if (a == emojis.length) a = 0
      }
      for (let i = 0; i < 3; i++) {
         y[i] = emojis[b]
         b++
         if (b == emojis.length) b = 0
      }
      for (let i = 0; i < 3; i++) {
         z[i] = emojis[c]
         c++
         if (c == emojis.length) c = 0
      }
      let end
      if (a == b && b == c) {
         end = `JACKPOT! *+${Func.formatNumber(reward)} point*`
         user.point += reward
      } else if (a == b || a == c || b == c) {
         end = `Hampir Beruntung! *+3 Limits*`
         user.limit += 3
      } else {
         end = `LOSE! *-${Func.formatNumber(reward)} point*`
         if (reward > user.point) {
            user.point = 0
         } else {
            user.point -= reward
         }
      }
      let teks = `乂  *S L O T S*\n\n`
      teks += `	[ ${x[0]} ${y[0]} ${z[0]} ]\n`
      teks += `	[ ${x[1]} ${y[1]} ${z[1]} ]\n`
      teks += `	[ ${x[2]} ${y[2]} ${z[2]} ]\n`
      teks += `\n${end}`
      client.reply(m.chat, teks, m)
   },
   group: true,
   limit: true,
   game: true
}