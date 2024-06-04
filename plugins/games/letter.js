exports.run = {
   usage: ['letter'],
   category: 'fun games',
   async: async (m, {
      client,
      isPrefix,
      Func
   }) => {
      client.letter = client.letter ? client.letter : {}
      let id = m.chat,
         timeout = 60000,
         object = Func.random([{
            q: 'O',
            a: 'Q'
         }, {
            q: 'N',
            a: 'M'
         }, {
            q: 'V',
            a: 'U'
         }, {
            q: 'E',
            a: 'F'
         }, {
            q: 'S',
            a: '5'
         }, {
            q: 'l',
            a: '1'
         }, {
            q: 'B',
            a: 'R'
         }, {
            q: 'T',
            a: '7'
         }, {
            q: 'I',
            a: 'H'
         }])
      if (id in client.letter) return client.reply(m.chat, '*^ soal ini belum terjawab!*', client.letter[id][0])
      let q = Func.randomInt(1, 7)
      let a = Func.randomInt(50, 200)
      let _q = object.q.repeat(q).split('')
      let _a = object.a.repeat(a).split('')
      const shuffleArray = arr => {
         let currentIndex = arr.length
         let tempVal, randomIndex
         while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex -= 1
            tempVal = arr[currentIndex]
            arr[currentIndex] = arr[randomIndex]
            arr[randomIndex] = tempVal
         }
         return arr
      }
      const json = {
         prefix: object.q,
         question: shuffleArray(_q.concat(_a)).join(''),
         answer: q
      }
      let teks = `乂  *L E T T E R*\n\n`
      teks += `Berapa jumlah huruf "${json.prefix}" pada baris berikut ??\n\n`
      teks += `${json.question}\n\n`
      teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`
      teks += `Reply pesan ini untuk menjawab, kirim *${isPrefix}letskip* untuk menghapus sesi.`
      client.letter[id] = [
         await client.reply(m.chat, teks, m),
         json, 3,
         setTimeout(() => {
            if (client.letter[id]) client.reply(m.chat, `*Waktu habis!*, Jawaban : *${client.letter[id][1].answer}*`, client.letter[id][0])
            delete client.letter[id]
         }, timeout)
      ]
   },
   group: true,
   limit: true,
   game: true
}