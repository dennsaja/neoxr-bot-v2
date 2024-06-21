exports.run = {
   usage: ['quiz'],
   category: 'fun games',
   async: async (m, {
      client,
      isPrefix,
      Func
   }) => {
      if (global.db.users.find(v => v.jid == m.sender).point < 10000) return client.reply(m.chat, Func.texted('bold', `🚩 Untuk bermain game ini kamu harus mempunyai minimal 10K point.`), m)
      client.quiz = client.quiz ? client.quiz : {}
      let id = m.chat,
         timeout = 180000
      if (id in client.quiz) return client.reply(m.chat, '*^ soal ini belum terjawab!*', client.quiz[id][0])
      let json = Func.jsonRandom('./media/json/quiz.json')
      let teks = `乂  *Q U I Z*\n\n`
      teks += `${json.pertanyaan.replace(json.pertanyaan.charAt(0), json.pertanyaan.charAt(0).toUpperCase())} ??\n\n`
      teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`
      teks += `Terdapat *${json.jawaban.length}* jawaban, reply pesan ini untuk menjawab, kirim *${isPrefix}quizclue* untuk bantuan dan *${isPrefix}quizskip* untuk menghapus sesi.`
      client.quiz[id] = [
         await client.reply(m.chat, teks, m),
         json,
         setTimeout(() => {
            if (client.quiz[id]) {
           	let isJson = JSON.parse(JSON.stringify(client.quiz[id][1]))
               let teks = `乂  *J A W A B A N*\n\n`
               teks += isJson.jawaban.map((v, i) => (i + 1) + '. ```' + Func.ucword(v) + '```').join('\n')
               teks += `\n\n*Waktu habis!* berikut adalah jawabannya.`
               client.reply(m.chat, teks, client.quiz[id][0])
            }
            delete client.quiz[id]
         }, timeout),
         [], {}
      ]
   },
   group: true,
   limit: true,
   game: true
}