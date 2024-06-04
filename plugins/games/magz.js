const kbbi = require('../../lib/kbbi')
exports.run = {
   usage: ['magz'],
   hidden: ['create', 'in', 'out', 'start'],
   category: 'fun games',
   async: async (m, {
      client,
      args,
      isPrefix,
      command,
      Func
   }) => {
      try {
         if (global.db.users.find(v => v.jid == m.sender).point < 1000) return client.reply(m.chat, Func.texted('bold', `🚩 Point yang kamu miliki tidak cukup untuk bermain game Sambung Kata.`), m)
         client.magz = client.magz ? client.magz : {}
         let timeout = 120000,
            id = m.chat
         if (command == 'magz') return client.reply(m.chat, info(isPrefix), m)
         if (command == 'create') {
            let check = Object.values(client.magz).find(room => room.id == m.chat)
            if (check) return client.reply(m.chat, Func.texted('bold', `🚩 Sesi sudah tersedia dengan kode : "${check.code}"`), m)
            let code = Func.makeId(4)
            let teks = `Sesi game Magz berhasil dibuat dengan kode : *${code}*\n\n`
            teks += `🚩 Jika ingin bermain solo kirim *${isPrefix}start*, kamu juga bisa mengajak temanmu bergabung kedalam sesi untuk bermain bersama dengan menyuruh temanmu mengirimkan *${isPrefix}in*`
            client.magz[id] = {
               m: await client.reply(m.chat, teks, m),
               player: [m.sender],
               leaderboard: {
                  [m.sender]: {
                     score: 0,
                     correctAns: 0,
                     wrongAns: 0
                  }
               },
               code,
               creator: m.sender,
               id,
               playing: false,
               playTimes: 0,
               words: [],
               answer: '',
               wrongs: 0,
               startTime: setTimeout(() => {
                  if (client.magz[id]) return client.reply(m.chat, Func.texted('bold', `🚩 Permainan tidak dimulai dalam waktu 2 menit, room "${code}" telah dihapus.`), m).then(() => {
                     delete client.magz[id]
                  })
               }, timeout),
               timeout
            }
         } else if (command == 'in') {
            let room1 = Object.values(client.magz).find(room => room.id == m.chat)
            let room2 = Object.values(client.magz).find(room => room.id == m.chat && room.playing)
            let room3 = Object.values(client.magz).find(room => room.id == m.chat && room.player.includes(m.sender))
            let room4 = Object.values(client.magz).find(room => room.id == m.chat && !room.player.includes(m.sender) && !room.playing)
            if (!room1) return client.reply(m.chat, Func.texted('bold', `🚩 Sesi tidak ditemukan silahkan buat sesi terlebih dahulu dengan mengirim ${isPrefix}create`), m)
            if (room2) return client.reply(m.chat, Func.texted('bold', `🚩 Tidak bisa bergabung karena permainan sedang berlangsung.`), m)
            if (room3) return client.reply(m.chat, Func.texted('bold', `🚩 Kamu sudah berada didalam sesi.`), m)
            if (room4) {
               room4.player.push(m.sender)
               room4.leaderboard[m.sender] = {
                  score: 0,
                  correctAns: 0,
                  wrongAns: 0
               }
               client.reply(m.chat, Func.texted('bold', `🚩 Berhasil masuk kedalam sesi.`), m)
            } else client.reply(m.chat, Func.texted('bold', `🚩 Emror!`), m)
         } else if (command == 'out') {
            let playing = Object.values(client.magz).find(room => room.id && room.playing)
            if (playing) return client.reply(m.chat, Func.texted('bold', `🚩 Tidak bisa keluar dari sesi karena permainan sedang berlangsung.`), m)
            let creator = Object.values(client.magz).find(room => room.id && room.creator == m.sender)
            if (creator) return client.reply(m.chat, Func.texted('bold', `🚩 Karena kamu pembuat sesi, sesi yang kamu buat dengan kode "${creator.code}" dihapus.`), m).then(() => {
               delete client.magz[creator.id]
            })
            let room = Object.values(client.magz).find(room => room.id && room.player.includes(m.sender))
            if (room) return client.reply(m.chat, Func.texted('bold', `🚩 Berhasil keluar dari sesi game Magz.`), m).then(() => Func.removeItem(room.player, m.sender))
            client.reply(m.chat, Func.texted('bold', `🚩 Kamu tidak berada didalam sesi game Magz`), m)
         } else if (command == 'start') {
            let creator = Object.values(client.magz).find(room => room.id == m.chat && room.creator != m.sender)
            if (creator) return client.reply(m.chat, Func.texted('bold', `🚩 Permainan hanya bisa dimulai oleh @${creator.creator.split('@')[0]} sebagai pembuat sesi.`), m)
            let check = Object.values(client.magz).find(room => room.id == m.chat)
            if (!check) return client.reply(m.chat, Func.texted('bold', `🚩 Sesi tidak ditemukan silahkan buat sesi terlebih dahulu dengan mengirim ${isPrefix}create`), m)
            let playing = Object.values(client.magz).find(room => room.id == m.chat && room.playing)
            if (playing) return client.reply(m.chat, Func.texted('bold', `🚩 Permainan sedang berlangsung.`), m)
            let room = Object.values(client.magz).find(room => room.id == m.chat)
            if (room) {
               clearTimeout(room.startTime)
               room.playing = true
               let people = Object.entries(room.leaderboard).sort((a, b) => b[1].score - a[1].score)
               let json = await kbbi.kata()
               var kata
               if (!json.status) {
                  kata = Func.random(['aku', 'kamu', 'dia'])
               } else {
                  kata = typeof json.data.kata != 'undefined' ? json.data.kata : Func.random(['aku', 'kamu', 'dia'])
               }
               room.answer = kata.toUpperCase()
               room.playTimes += 1
               let teks = `乂  *M A G Z*\n\n`
               teks += `Mulai : ${(kata).toUpperCase()}\n`
               teks += `${Func.filter(kata).toUpperCase()}... ?\n\n`
               teks += `Pemain :\n\n`
               teks += people.map(([user, data], i) => (i + 1) + '. @' + user.split`@` [0] + '\n    *( × )* : ' + data.wrongAns + '  –  *( √ )* : ' + data.correctAns + '  –  *Score* : ' + Func.formatNumber(data.score)).join('\n')
               teks += `\n\n`
               teks += `Soal : [ ${room.playTimes} / 10 ]\n`
               teks += `Silahkan jawab soal ini tanpa perlu me-reply pesan.`
               room.chat = await client.reply(m.chat, teks, m)
               room.time = setTimeout(() => {
                     if (client.magz[id]) return client.reply(m.chat, Func.texted('bold', `🚩 Tidak ada penjawab pada soal pertama, room "${room.code}" telah dihapus.`), m).then(() => delete client.magz[id])
                  }, timeout),
                  timeout
            }
         }
      } catch (e) {
         client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   group: true,
   limit: true,
   game: true,
   cache: true,
   location: __filename
}

const info = (prefix) => {
   return `乂  *M A G Z*
   
Game Magz adalah permainan *"Sambung Kata"*, konsep permainan ini hanya membuat kata sesuai yang ada di KBBI, dan berikut ini aturan mainnya :

➠ Untuk memainkan permainan ini dibutuhkan point sebanyak 1.000 point.
➠ Minimal terdapat 1 pemain didalam 1 sesi.
➠ Permainan berlangsung selama 2 menit dengan 10 soal.

Command :
➠ *${prefix}create* -- Membuat sesi.
➠ *${prefix}in* -- Masuk kedalam sesi.
➠ *${prefix}out* -- Keluar dari sesi.
➠ *${prefix}start* -- Memulai permainan.

Catatan :
Script game ini masih versi *BETA* dan tidak dipublish & dibagikan kepada siapapun.`
}