exports.run = {
   usage: ['riddle'],
   category: 'fun games',
   async: async (m, {
      client,
      isPrefix,
      Func
   }) => {
      client.riddle = client.riddle ? client.riddle : {}
      let id = m.chat,
         timeout = 60000
      if (id in client.riddle) return client.reply(m.chat, '*^ soal ini belum terjawab!*', client.riddle[id][0])
      let json = Func.jsonRandom('./media/json/riddle.json') 
      let teks = `乂  *R I D D L E*\n\n`
      teks += `${json.pertanyaan}\n\n`
      teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`
      teks += `Reply pesan ini untuk menjawab, kirim *${isPrefix}clue* untuk bantuan dan *${isPrefix}ridskip* untuk menghapus sesi.`
      client.riddle[id] = [
         await client.reply(m.chat, teks, m),
         json,
         setTimeout(() => {
            if (client.riddle[id]) client.reply(m.chat, `*Waktu habis!*\nJawaban : *${json.jawaban}*`, client.riddle[id][0])
            delete client.riddle[id]
         }, timeout)
      ]
   },
   group: true,
   limit: true,
   game: true
}