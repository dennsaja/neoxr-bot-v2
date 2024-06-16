exports.run = {
   usage: ['gift', 'tflimit'],
   use: 'amount',
   category: 'group',
   async: async (m, {
      client,
      args,
      isPrefix,
      command,
      Func
   }) => {
      if (m.quoted) {
         if (m.quoted.isBot) return client.reply(m.chat, Func.texted('bold', `Tidak bisa melakukan gift limit kepada bot`), m)
         if (!args || !args[0]) return client.reply(m.chat, Func.texted('bold', `Berikan jumlah limit yang akan di gift`), m)
         if (isNaN(args[0])) return client.reply(m.chat, Func.texted('bold', `Limit harus berupa angka.`), m)
         let nominal = parseInt(args[0])
         let target = client.decodeJid(m.quoted.sender)
         if (target == m.sender) return client.reply(m.chat, Func.texted('bold', `Tidak bisa melakukan gift limit kepada diri sendiri`), m)
         global.db.users.find(v => v.jid == target).limit += nominal
         let teks = `❏ *G I F T - L I M I T*\n\n`
         teks += `Berhasil melakukan gift limit kepada *@${target.replace(/@.+/g, '')}* dengan jumlah ${Func.formatNumber(nominal)} limit`
         client.reply(m.chat, teks, m)
      } else if (m.mentionedJid.length != 0) {
         if (!args || !args[1]) return client.reply(m.chat, Func.texted('bold', `Berikan jumlah limit yang akan di gift.`), m)
         if (isNaN(args[1])) return client.reply(m.chat, Func.texted('bold', `Limit harus berupa angka.`), m)
         let nominal = parseInt(args[1])
         let target = client.decodeJid(m.mentionedJid[0])
         if (target == client.decodeJid(client.user.id)) return client.reply(m.chat, Func.texted('bold', `Tidak bisa melakukan gift limit kepada bot.`), m)
         if (target == m.sender) return client.reply(m.chat, Func.texted('bold', `Tidak bisa melakukan gift limit kepada diri sendiri.`), m)
         global.db.users.find(v => v.jid == target).limit += nominal
         let teks = `❏ *G I F T - L I M I T*\n\n`
         teks += `Berhasil melakukan gift limit kepada *@${target.replace(/@.+/g, '')}* dengan jumlah ${Func.formatNumber(nominal)} limit\n\n`
         client.reply(m.chat, teks, m)
      } else {
         let teks = `• *Example* :\n\n`
         teks += `${isPrefix + command} @0 10000\n`
         teks += `${isPrefix + command} 10000 (reply chat target)`
         client.reply(m.chat, teks, m)
      }
   },
   error: false,
   group: true
}