exports.run = {
   async: async (m, {
      client,
      body,
      users,
      prefixes
   }) => {
      try {
         var id = m.chat
         var reward = Func.randomInt(global.min_reward, global.max_reward)
         client.verb = client.verb ? client.verb : {}
         if (m.quoted && m.quoted.sender != client.decodeJid(client.user.id)) return
         if (m.quoted && /verbskip/i.test(m.quoted.text)) {
            if (!(id in client.verb) && /verbskip/i.test(m.quoted.text)) return client.reply(m.chat, Func.texted('bold', `🚩 Soal tersebut telah berakhir, silahkan kirim _${prefixes[0]}verb_ untuk mendapatkan soal baru.`), m)
            if (body && body.toLowerCase() == client.verb[id][1]) {
               users.point += reward
               clearTimeout(client.verb[id][3])
               delete client.verb[id]
               await client.sendSticker(m.chat, await Func.fetchBuffer('./media/sticker/true.webp'), m, {
                  packname: global.db.setting.sk_pack,
                  author: global.db.setting.sk_author
               }).then(() => {
                  client.reply(m.chat, Func.texted('bold', `+ ${Func.formatNumber(reward)} Point`), m)
               })
            } else {
               if (--client.verb[id][2] == 0) {
                  clearTimeout(client.verb[id][3])
                  await client.sendSticker(m.chat, await Func.fetchBuffer('./media/sticker/false.webp'), m, {
                     packname: global.db.setting.sk_pack,
                     author: global.db.setting.sk_author
                  }).then(() => {
                     client.reply(m.chat, `🚩 _Permainan berkahir karena telah 3x menjawab salah, jawabannya adalah_ : *${client.verb[id][1]}*`, m).then(() => delete client.verb[id])
                  })
               } else {
                  if (users.point == 0) return client.sendSticker(m.chat, await Func.fetchBuffer('./media/sticker/false.webp'), m, {
                     packname: global.db.setting.sk_pack,
                     author: global.db.setting.sk_author
                  })
                  users.point < reward ? users.point = 0 : users.point -= reward
                  await client.sendSticker(m.chat, await Func.fetchBuffer('./media/sticker/false.webp'), m, {
                     packname: global.db.setting.sk_pack,
                     author: global.db.setting.sk_author
                  }).then(() => {
                     client.reply(m.chat, `*- ${Func.formatNumber(reward)} Point*`, m)
                  })
               }
            }
         }
      } catch (e) {
         return client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   group: true,
   game: true,
   cache: true,
   location: __filename
}