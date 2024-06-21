exports.run = {
   usage: ['whatword'],
   category: 'fun games',
   async: async (m, {
      client,
      isPrefix,
      Func
   }) => {
      client.whatword = client.whatword ? client.whatword : {}
      let id = m.chat,
         timeout = 60000
      if (id in client.whatword) return client.reply(m.chat, '*^ soal ini belum terjawab!*', client.whatword[id][0])
      let json = Func.jsonRandom('./media/json/whatword.json')
      let teks = `乂  *W H A T W O R D*\n\n`
      teks += `${json.acak}\n\n`
      teks += `Timeout : [ *${((timeout / 1000) / 60)} minutes* ]\n`
      teks += `Reply pesan ini untuk menjawab, kirim *${isPrefix}wordclue* untuk bantuan dan *${isPrefix}wordskip* untuk menghapus sesi.`
      client.whatword[id] = [
         await client.reply(m.chat, teks, m),
         json,
         setTimeout(() => {
            if (client.whatword[id]) client.reply(m.chat, `*Waktu habis!*\nJawaban : *${json.jawaban}*`, client.whatword[id][0])
            delete client.whatword[id]
         }, timeout)
      ]
   },
   group: true,
   limit: true,
   game: true
}