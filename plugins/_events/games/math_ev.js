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
         client.math = client.math ? client.math : {}
         if (m.quoted && m.quoted.sender != client.user.id.split(':')[0] + '@s.whatsapp.net') return
         if (m.quoted && /Berapa hasil dari/i.test(m.quoted.text)) {  
            if (!(id in client.math) && /Berapa hasil dari/i.test(m.quoted.text)) return client.reply(m.chat, Func.texted('bold', `🚩 Soal tersebut telah berakhir, silahkan kirim _${prefixes[0]}math_ untuk mendapatkan soal baru.`), m)
            let math = JSON.parse(JSON.stringify(client.math[id][1]))
            if (m.text == math.result) {
               users.point += math.bonus
               clearTimeout(client.math[id][3])
               delete client.math[id]
               await client.sendSticker(m.chat, await Func.fetchBuffer('./media/sticker/true.webp'), m, {
                  packname: global.db.setting.sk_pack,
                  author: global.db.setting.sk_author
               }).then(() => {
                  client.reply(m.chat, Func.texted('bold', `+ ${math.bonus} Point`), m)
               })
            } else {
               if (--client.math[id][2] == 0) {
                  clearTimeout(client.math[id][3])
                  delete client.math[id]
                  await client.sendSticker(m.chat, await Func.fetchBuffer('./media/sticker/false.webp'), m, {
                     packname: global.db.setting.sk_pack,
                     author: global.db.setting.sk_author
                  }).then(() => {
                     client.reply(m.chat, `🚩 _Permainan berakhir karena telah 3x menjawab salah, jawabannya adalah_ : *${math.result}*`, m)
                  })
               } else await client.sendSticker(m.chat, await Func.fetchBuffer('./media/sticker/false.webp'), m, {
                  packname: global.db.setting.sk_pack,
                  author: global.db.setting.sk_author
               }) // client.reply(m.chat, Func.texted('bold', `${client.math[id][2]} chances to answer.`), m)}
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