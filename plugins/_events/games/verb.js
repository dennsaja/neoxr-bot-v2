let fs = require('fs')
exports.run = {
   usage: ['verb'],
   category: 'fun games',
   async: async (m, {
      client,
      isPrefix,
      Func
   }) => {
      client.verb = client.verb ? client.verb : {}
      let id = m.chat,
         timeout = 60000
      if (id in client.verb) return client.reply(m.chat, '*^ soal ini belum terjawab!*', client.verb[id][0])
      let json = Func.jsonRandom('./media/json/verb.json')
      let teks = `乂  *V E R B*\n\n`
      teks += `Lengkapi kata kerja di bawah ini :\n`
      teks += `➠ ${'```' + json.replace(/[aiueo]/g, '_').toUpperCase() + '```'}\n\n`
      teks += `Timeout : [ *${((timeout / 1000) / 60)} minutes* ]\n`
      teks += `Reply pesan ini untuk menjawab, kirim *${isPrefix}verbskip* untuk menghapus sesi.`
      client.verb[id] = [
         await client.reply(m.chat, teks, m),
         json, 3,
         setTimeout(() => {
            if (client.verb[id]) client.reply(m.chat, `*Waktu habis!*\nJawaban : *${client.verb[id][1].toUpperCase()}*`, client.verb[id][0])
            delete client.verb[id]
         }, timeout)
      ]
   },
   group: true,
   limit: true,
   game: true
}