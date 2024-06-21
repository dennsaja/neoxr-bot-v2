const path = require('path')
exports.run = {
   async: async (m, {
      client,
      body,
      users,
      prefixes,
      Func
   }) => {
      try {
         var reward = Func.randomInt(global.min_reward, global.max_reward)
         const kbbi = require(path.resolve(__dirname, '../../../lib/kbbi'))
         client.magz = client.magz ? client.magz : {}
         let room = Object.values(client.magz).find(room => room.player.includes(m.sender) && room.id == m.chat && room.playing)
         if (room && body && !prefixes.includes(body.charAt(0))) {
            let scores = room.leaderboard[m.sender]
            let people = Object.entries(room.leaderboard).sort((a, b) => b[1].score - a[1].score)
            let show = Math.min(5, people.length)
            let answer = (body.toUpperCase().split` ` [0]).trim()
            clearTimeout(room.time)
            clearTimeout(room.timer)
            if (room.words.includes(answer)) return client.reply(m.chat, Func.texted('bold', `🚩 Kata "${answer}" sudah digunakan silahkan cari kata lain.`), m)
            if (!answer.startsWith(Func.filter(room.answer))) {
               room.wrongs += 1
               scores.wrongAns += 1
               if (room.wrongs >= 3) {
                  let teks = `乂  *S C O R E (5)*\n\n`
                  teks += people.slice(0, show).map(([user, data], i) => (i + 1) + '. @' + user.split`@` [0] + ' ' + (i == 0 ? '🥇' : i == 1 ? '🥈' : i == 2 ? '🥉' : '') + '\n    *( × )* : ' + data.wrongAns + '  –  *( √ )* : ' + data.correctAns + '  –  *Score* : ' + Func.formatNumber(data.score)).join('\n')
                  teks += `\n\n`
                  teks += `Soal : [ ${room.playTimes} / 10 ]\n`
                  teks += `Permainan selesai karena 3x menjawab salah, berikut ini adalah skor akhir.`
                  return client.reply(m.chat, teks, room.playTimes == 1 ? room.chat : room.msg).then(() => {
                     people.map(([user, data]) => users.point += room.leaderboard[user].score)
                     delete client.magz[room.id]
                  })
               } else {
                  room.timer = setTimeout(() => {
                     if (room.playTimes == 1) {
                        return client.reply(m.chat, Func.texted('bold', `🚩 Tidak ada aktifitas dalam kurun waktu 2 menit, permainan dibatalkan.`), room.chat).then(() => delete client.magz[room.id])
                     } else {
                        let teks = `乂  *S C O R E (5)*\n\n`
                        teks += people.slice(0, show).map(([user, data], i) => (i + 1) + '. @' + user.split`@` [0] + ' ' + (i == 0 ? '🥇' : i == 1 ? '??' : i == 2 ? '🥉' : '') + '\n    *( × )* : ' + data.wrongAns + '  –  *( √ )* : ' + data.correctAns + '  –  *Score* : ' + Func.formatNumber(data.score)).join('\n')
                        teks += `\n\n`
                        teks += `Soal : [ ${room.playTimes} / 10 ]\n`
                        teks += `Permainan selesai berikut ini adalah skor akhir.`
                        return client.reply(m.chat, teks, room.playTimes == 1 ? room.chat : room.msg).then(() => {
                           people.map(([user, data]) => users.point += room.leaderboard[user].score)
                           delete client.magz[room.id]
                        })
                     }
                  }, room.timeout)
                  return client.reply(m.chat, `🚩 Kata harus dimulai dari awalan "${Func.filter(room.answer)}".`, m)
               }
            }
            let json = await kbbi.check_kata(answer.toLowerCase())
            if (!json.status) {
               room.wrongs += 1
               scores.wrongAns += 1
               if (room.wrongs >= 3) {
                  let teks = `乂  *S C O R E (5)*\n\n`
                  teks += people.slice(0, show).map(([user, data], i) => (i + 1) + '. @' + user.split`@` [0] + ' ' + (i == 0 ? '🥇' : i == 1 ? '🥈' : i == 2 ? '🥉' : '') + '\n    *( × )* : ' + data.wrongAns + '  –  *( √ )* : ' + data.correctAns + '  –  *Score* : ' + Func.formatNumber(data.score)).join('\n')
                  teks += `\n\n`
                  teks += `Soal : [ ${room.playTimes} / 10 ]\n`
                  teks += `Permainan selesai karena 3x menjawab salah, berikut ini adalah skor akhir.`
                  return client.reply(m.chat, teks, room.playTimes == 1 ? room.chat : room.msg).then(() => {
                     people.map(([user, data]) => users.point += room.leaderboard[user].score)
                     delete client.magz[room.id]
                  })
               } else {
                  room.timer = setTimeout(() => {
                     if (room.playTimes == 1) {
                        return client.reply(m.chat, Func.texted('bold', `🚩 Tidak ada aktifitas dalam kurun waktu 2 menit, permainan dibatalkan.`), room.chat).then(() => delete client.magz[room.id])
                     } else {
                        let teks = `乂  *S C O R E (5)*\n\n`
                        teks += people.slice(0, show).map(([user, data], i) => (i + 1) + '. @' + user.split`@` [0] + ' ' + (i == 0 ? '🥇' : i == 1 ? '??' : i == 2 ? '🥉' : '') + '\n    *( × )* : ' + data.wrongAns + '  –  *( √ )* : ' + data.correctAns + '  –  *Score* : ' + Func.formatNumber(data.score)).join('\n')
                        teks += `\n\n`
                        teks += `Soal : [ ${room.playTimes} / 10 ]\n`
                        teks += `Permainan selesai berikut ini adalah skor akhir.`
                        return client.reply(m.chat, teks, room.playTimes == 1 ? room.chat : room.msg).then(() => {
                           people.map(([user, data]) => users.point += room.leaderboard[user].score)
                           delete client.magz[room.id]
                        })
                     }
                  }, room.timeout)
                  return client.reply(m.chat, `🚩 Kata *"${answer}"* tidak terdapat didalam KBBI.`, m)
               }
            } else {
               delete room.m
               room.playTimes += 1
               room.words.push(answer)
               room.answer = answer
               scores.score += reward
               scores.correctAns += 1
               if (room.playTimes >= 10) {
                  let teks = `乂  *S C O R E (5)*\n\n`
                  teks += people.slice(0, show).map(([user, data], i) => (i + 1) + '. @' + user.split`@` [0] + ' ' + (i == 0 ? '🥇' : i == 1 ? '🥈' : i == 2 ? '🥉' : '') + '\n    *( × )* : ' + data.wrongAns + '  –  *( √ )* : ' + data.correctAns + '  –  *Score* : ' + Func.formatNumber(data.score)).join('\n')
                  teks += `\n\n`
                  teks += `Soal : [ ${room.playTimes} / 10 ]\n`
                  teks += `Permainan selesai berikut ini adalah skor akhir.`
                  return client.reply(m.chat, teks, room.msg).then(() => {
                     people.map(([user, data]) => users.point += room.leaderboard[user].score)
                     delete client.magz[room.id]
                  })
               } else {
                  let teks = `乂  *M A G Z*\n\n`
                  teks += `Lanjut : ${answer}\n`
                  teks += `${Func.filter(answer)}... ?\n\n`
                  teks += `Soal : [ ${room.playTimes} / 10 ]\n`
                  teks += `Silahkan teruskan kata diatas tanpa perlu me-reply pesan.`
                  room.msg = await client.reply(m.chat, teks, m)
                  room.timer = setTimeout(() => {
                     if (room.playTimes == 1) {
                        return client.reply(m.chat, Func.texted('bold', `🚩 Tidak ada aktifitas dalam kurun waktu 2 menit, permainan dibatalkan.`), room.chat).then(() => delete client.magz[room.id])
                     } else {
                        let teks = `乂  *S C O R E (5)*\n\n`
                        teks += people.slice(0, show).map(([user, data], i) => (i + 1) + '. @' + user.split`@` [0] + ' ' + (i == 0 ? '🥇' : i == 1 ? '??' : i == 2 ? '🥉' : '') + '\n    *( × )* : ' + data.wrongAns + '  –  *( √ )* : ' + data.correctAns + '  –  *Score* : ' + Func.formatNumber(data.score)).join('\n')
                        teks += `\n\n`
                        teks += `Soal : [ ${room.playTimes} / 10 ]\n`
                        teks += `Permainan selesai berikut ini adalah skor akhir.`
                        return client.reply(m.chat, teks, room.playTimes == 1 ? room.chat : room.msg).then(() => {
                           people.map(([user, data]) => users.point += room.leaderboard[user].score)
                           delete client.magz[room.id]
                        })
                     }
                  }, room.timeout)
               }
            }
         } else {}
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