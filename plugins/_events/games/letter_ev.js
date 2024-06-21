exports.run = {
   async: async (m, {
      client,
      body,
      users,
      prefixes,
      Func
   }) => {
      try {
         let id = m.chat
         var reward = Func.randomInt(global.min_reward, global.max_reward)
         client.letter = client.letter ? client.letter : {}
         if (m.quoted && m.quoted.sender != client.user.id.split(':')[0] + '@s.whatsapp.net') return
         if (m.quoted && /letskip/i.test(m.quoted.text)) {  
            if (!(id in client.letter) && /letskip/i.test(m.quoted.text)) return client.reply(m.chat, Func.texted('bold', `🚩 Soal tersebut telah berakhir, silahkan kirim _${prefixes[0]}letter_ untuk mendapatkan soal baru.`), m)
            let letter = JSON.parse(JSON.stringify(client.letter[id][1]))
            if (body == client.letter[id][1].answer) {
               users.point += reward
               clearTimeout(client.letter[id][3])
               delete client.letter[id]
               await client.sendSticker(m.chat, await Func.fetchBuffer('./media/sticker/true.webp'), m, {
                  packname: global.db.setting.sk_pack,
                  author: global.db.setting.sk_author
               }).then(() => {
                  client.reply(m.chat, Func.texted('bold', `+ ${Func.formatNumber(reward)} Point`), m)
               })
            } else {
               if (--client.letter[id][2] == 0) {
                  clearTimeout(client.letter[id][3])
                  await client.sendSticker(m.chat, await Func.fetchBuffer('./media/sticker/false.webp'), m, {
                     packname: global.db.setting.sk_pack,
                     author: global.db.setting.sk_author
                  }).then(() => {
                     client.reply(m.chat, `🚩 _Permainan berakhir karena telah 3x menjawab salah, jawabannya adalah_ : *${client.letter[id][1].answer}*`, m)
                     delete client.letter[id]
                  })
               } else await client.sendSticker(m.chat, await Func.fetchBuffer('./media/sticker/false.webp'), m, {
                  packname: global.db.setting.sk_pack,
                  author: global.db.setting.sk_author
               }) // client.reply(m.chat, Func.texted('bold', `${client.letter[id][2]} chances to answer.`), m)}
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