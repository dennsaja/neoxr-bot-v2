exports.run = {
   usage: ['buylimit', 'buyguard'],
   use: 'amount',
   category: 'user info',
   async: async (m, {
      client,
      args,
      isPrefix,
      command,
      Func
   }) => {
      try {
         let user = global.db.users.find(v => v.jid == m.sender)
         let maximum = 10000
         if (command == 'buylimit' && user.limit >= maximum) return client.reply(m.chat, Func.texted('bold', `🚩 Kamu tidak bisa membeli limit lagi karena telah mencapai jumlah batas maximum.`), m)
         if (command == 'buyguard' && user.guard >= maximum) return client.reply(m.chat, Func.texted('bold', `🚩 Kamu tidak bisa membeli guard lagi karena telah mencapai jumlah batas maximum.`), m)
         if (isNaN(args[0])) return client.reply(m.chat, Func.example(isPrefix, command, '1'), m)
         if (args[0] < 1) return client.reply(m.chat, Func.example(isPrefix, command, '1'), m)
         let price = command == 'buyguard' ? 1555555 : 150000
         if (user.point >= price * parseInt(args[0])) {
            if (command == 'buyguard') {
               if ((user.guard + parseInt(args[0])) >= maximum) return client.reply(m.chat, Func.texted('bold', `🚩 Jumlah guard yang kamu beli melebihi batas maximum.`), m)
               user.point -= price * parseInt(args[0])
               user.guard += parseInt(args[0])
            } else {
               if ((user.limit + parseInt(args[0])) >= maximum) return client.reply(m.chat, Func.texted('bold', `🚩 Jumlah limit yang kamu beli melebihi batas maximum.`), m)
               user.point -= price * parseInt(args[0])
               user.limit += parseInt(args[0])
            }
            return client.reply(m.chat, `🚩 Kamu telah membeli *${args[0]}* ${command == 'buyguard' ? 'guard' : 'limit'} dengan *${Func.h2k(price * args[0])}* point.`, m)
         } else {
            client.reply(m.chat, Func.texted('bold', `🚩 Point yang kamu miliki tidak mencukupi untuk membeli ${Func.formatNumber(args[0])} ${command == 'buyguard' ? 'guard' : 'limit'}.`), m)
         }
      } catch (e) {
         client.reply(m.chat, require('util').format(e), m)
      }
   },
   error: false
}