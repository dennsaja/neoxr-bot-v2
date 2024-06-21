exports.run = {
   async: async (m, {
      client,
      body,
      users,
      prefixes,
      Func
   }) => {
      try {
         var id = m.chat
         var timeout = 180000
         var reward = Func.randomInt(100, 80000)
         client.bomb = client.bomb ? client.bomb : {}
         if (!(id in client.bomb) && m.quoted && /kotak/i.test(m.quoted.text)) return client.reply(m.chat, Func.texted('bold', `🚩Sesi telah berakhir, silahkan kirim _${prefixes[0]}bomb_ untuk membuat sesi baru.`), m)
         if ((id in client.bomb) && !isNaN(body)) {
            let json = client.bomb[id][1].find(v => v.position == body)
            if (!json) return client.reply(m.chat, Func.texted('bold', `🚩 Untuk membuka kotak kirim angka 1 - 9`), m)
            if (json.emot == '💥') {
               json.state = true
               let bomb = client.bomb[id][1]
               let teks = `乂  *B O M B*\n\n`
               teks += bomb.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
               teks += bomb.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n'
               teks += bomb.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n'
               teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`
               teks += `*Permainan selesai!*, kotak berisi bom terbuka : (- *${Func.formatNumber(reward)}*)`
               return client.sendMessageModify(m.chat, teks, m, {
                  thumbnail: 'https://telegra.ph/file/287cbe90fe5263682121d.jpg',
                  largeThumb: true
               }).then(() => {
                  users.point < reward ? users.point = 0 : users.point -= reward
                  clearTimeout(client.bomb[id][2])
                  delete client.bomb[id]
               })
            } else if (json.state) {
               return client.reply(m.chat, Func.texted('bold', `🚩 Kotak ${json.number} sudah di buka silahkan pilih kotak yang lain.`), m)
            } else {
               json.state = true
               let changes = client.bomb[id][1]
               let open = changes.filter(v => v.state && v.emot != '💥').length
               if (open >= 8) {
                  let teks = `乂  *B O M B*\n\n`
                  teks += `Kirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`
                  teks += changes.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
                  teks += changes.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n'
                  teks += changes.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n'
                  teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`
                  teks += `*Permainan selesai!* kotak berisi bom tidak terbuka : (+ *${Func.formatNumber(reward)}*)`
                  return client.sendMessageModify(m.chat, teks, m, {
                     thumbnail: 'https://telegra.ph/file/308a4f10cc4576a90b4a0.jpg',
                     largeThumb: true
                  }).then(() => {
                     users.point += reward
                     clearTimeout(client.bomb[id][2])
                     delete client.bomb[id]
                  })
               } else {
                  let teks = `乂  *B O M B*\n\n`
                  teks += `Kirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`
                  teks += changes.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
                  teks += changes.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n'
                  teks += changes.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n'
                  teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`
                  teks += `Kotak berisi bom tidak terbuka : (+ *${Func.formatNumber(reward)}*)`
                  client.reply(m.chat, teks, m).then(() => {
                     users.point += reward
                  })
               }
            }
         }
      } catch (e) {
         return client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   group: true,
   game: true,
   cache: true,
   location: __filename
}