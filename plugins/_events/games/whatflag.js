exports.run = {
   usage: ['whatflag'],
   category: 'fun games',
   async: async (m, {
      client,
      isPrefix,
      store,
      Func
   }) => {
      client.whatflag = client.whatflag ? client.whatflag : {}
      let id = m.chat,
         timeout = 120000
      if (id in client.whatflag) {
         return client.reply(m.chat, '*^ soal ini belum terjawab!*', client.whatflag[id][0])
      } else {
         let json = Func.jsonRandom('./media/json/flags.json')
         let teks = `乂  *W H A T F L A G*\n\n`
         teks += `Apa nama negara yang menggunakan bendera ini ?\n\n`
         teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`
         teks += `Reply pesan ini untuk menjawab, kirim *${isPrefix}flagclue* untuk bantuan dan *${isPrefix}flagskip* untuk menghapus sesi.`
         client.whatflag[id] = [
            await client.sendFile(m.chat, json.img, 'image.jpg', teks, m),
            json,
            setTimeout(async () => {
               const msg = await store.loadMessage(m.chat, client.whatflag[id][0])
               if (client.whatflag[id]) client.reply(m.chat, `*Waktu habis!*\nJawaban : *${json.name}*`, client.whatflag[id][0])
               delete client.whatflag[id]
            }, timeout)
         ]
      }
   },
   group: true,
   limit: true,
   game: true
}