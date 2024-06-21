exports.run = {
   usage: ['fibonacci'],
   hidden: ['fibo'],
   category: 'fun games',
   async: async (m, {
      client,
      isPrefix,
      Func
   }) => {
      client.deret = client.deret ? client.deret : {}
      let id = m.chat,
         timeout = 60000
      if (id in client.deret) return client.reply(m.chat, '*^ soal ini belum terjawab!*', client.deret[id][0])
      const isO = Func.random(['+', '*'])
      const isX = Func.randomInt(1, isO == '*' ? 3 : 25)
      const isY = Func.randomInt(isO == '*' ? 4 : 26, isO == '*' ? 7 : 50)
      const isF = Func.randomInt(1, isO == '*' ? 5 : 7)
      const isR = Func.randomInt(1, isF)
      const isD = Func.fibonacci(isX, isY, isF, isO)
      const isS = isD[isR]
      let teks = `乂  *F I B O N A C C I*\n\n`
      teks += `Lengkapi deret angka di bawah ini :\n`
      teks += `➠ ${isD.map(v => v).join(' ').replace(RegExp(isS, 'i'), '_')}\n\n`
      teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`
      teks += `Reply pesan ini untuk menjawab, kirim *${isPrefix}fiboskip* untuk menghapus sesi.`
      client.deret[id] = [
         await client.reply(m.chat, teks, m),
         isS, 3,
         setTimeout(() => {
            if (client.deret[id]) client.reply(m.chat, `*Waktu habis!*\nJawaban : *${client.deret[id][1]}*`, client.deret[id][0])
            delete client.deret[id]
         }, timeout)
      ]
   },
   group: true,
   limit: true,
   game: true
}