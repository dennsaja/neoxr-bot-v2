exports.run = {
   usage: ['whoami'],
   category: 'fun games',
   async: async (m, {
      client,
      isPrefix,
      Func
   }) => {
      client.whoami = client.whoami ? client.whoami : {}
      let id = m.chat,
         timeout = 60000
      if (id in client.whoami) return client.reply(m.chat, '*^ soal ini belum terjawab!*', client.whoami[id][0])
      let json = Func.jsonRandom('./media/json/whoami.json')
      let teks = `乂  *W H O A M I*\n\n`
      teks += `${json.pertanyaan}\n\n`
      teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`
      teks += `Reply pesan ini untuk menjawab, kirim *${isPrefix}who* untuk bantuan dan *${isPrefix}whoskip* untuk menghapus sesi.`
      client.whoami[id] = [
         await client.reply(m.chat, teks, m),
         json,
         setTimeout(() => {
            if (client.whoami[id]) client.reply(m.chat, `*Waktu habis!*\nJawaban : *${json.jawaban}*`, client.whoami[id][0])
            delete client.whoami[id]
         }, timeout)
      ]
   },
   group: true,
   limit: true,
   game: true
}