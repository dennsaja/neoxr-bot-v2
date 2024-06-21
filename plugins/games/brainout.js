exports.run = {
   usage: ['brainout'],
   category: 'fun games',
   async: async (m, {
      client,
      isPrefix,
      Func
   }) => {
      client.brainout = client.brainout ? client.brainout : {}
      let id = m.chat,
         timeout = 60000
      if (id in client.brainout) return client.reply(m.chat, '*^ soal ini belum terjawab!*', client.brainout[id][0])
      let json = Func.jsonRandom('./media/json/brainout.json')
      let teks = `乂  *B R A I N O U T*\n\n`
      teks += `${json.pertanyaan}\n\n`
      teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`
      teks += `Reply pesan ini untuk menjawab, kirim *${isPrefix}brainwhat* untuk bantuan dan *${isPrefix}brainskip* untuk menghapus sesi.`
      client.brainout[id] = [
         await client.reply(m.chat, teks, m),
         json,
         setTimeout(() => {
            if (client.brainout[id]) client.reply(m.chat, `*Waktu habis!*\nJawaban : *${json.jawaban}*`, client.brainout[id][0])
            delete client.brainout[id]
         }, timeout)
      ]
   },
   group: true,
   limit: true,
   game: true
}