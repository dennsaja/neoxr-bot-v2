exports.run = {
   async: async (m, {
      client,
      body,
      users,
      prefixes
   }) => {
      try {
         var id = m.chat
         var reward = Func.randomInt(global.min_reward, global.max_reward)
         client.quiz = client.quiz ? client.quiz : {}
         if (m.quoted && m.quoted.sender != client.decodeJid(client.user.id)) return
         if (m.quoted && /Sisa|quizclue/i.test(m.quoted.text) && users.point >= 10000) {
            if (!(id in client.quiz) && /Sisa|quizclue/i.test(m.quoted.text)) return client.reply(m.chat, Func.texted('bold', `🚩 Soal tersebut telah berakhir, silahkan kirim _${prefixes[0]}quiz_ untuk mendapatkan soal baru.`), m)
            if (body && !Func.socmed(body)) {
               let json = JSON.parse(JSON.stringify(client.quiz[id][1]))
               const answer = body.toLowerCase()
               if ((client.quiz[id][3]).includes(answer)) return client.reply(m.chat, `💀 *"${answer}"* sudah terjawab!\n\nSilahkan cari jawaban lain, denda : *- ${Func.formatNumber(reward)} Point*`, m).then(() => {
                  if (reward > users.point) {
                     users.point = 0
                  } else {
                     users.point -= reward
                  }
               })
               if (!json.jawaban.includes(answer)) return client.reply(m.chat, `🚩 Jawaban mu salah!, *- ${Func.formatNumber(reward)} Point*`, m).then(() => {
                  if (reward > users.point) {
                     users.point = 0
                  } else {
                     users.point -= reward
                  }
               })
               users.point += reward
               client.quiz[id][3].push(answer)
               if (!client.quiz[id][4][m.sender]) {
                  client.quiz[id][4][m.sender] = {
                     score: reward,
                     answer: 1,
                  }
               } else {
                  client.quiz[id][4][m.sender].score += reward
                  client.quiz[id][4][m.sender].answer += 1
               }
               var clue = ''
               for (let i = 0; i < json.jawaban.length; i++) {
                  if (client.quiz[m.chat][3].includes(json.jawaban[i])) {
                     clue += '```' + Func.ucword(json.jawaban[i]) + '```\n'
                  } else {
                     clue += '```' + Func.ucword(json.jawaban[i].replace(/[abcdefghijklmnopqrstuvwxyz]/g, '_')) + '```\n'
                  }
               }
               let pop = clue.split('\n')
               pop.pop()
               if (client.quiz[id][3].length == json.jawaban.length) {
                  let people = Object.entries(client.quiz[id][4]).sort((a, b) => b[1].score - a[1].score)
                  let teks = `乂  *Q U I Z*\n\n`
                  teks += people.map(([user, data], i) => (i + 1) + '. @' + user.split`@` [0] + ' ' + (i == 0 ? '🥇' : i == 1 ? '🥈' : i == 2 ? '🥉' : '') + '\n    *Answer* : ' + data.answer + '  –  *Score* : ' + Func.formatNumber(data.score)).join('\n')
                  teks += `\n\n`
                  teks += `乂  *J A W A B A N*\n\n`
                  teks += pop.map((v, i) => (i + 1) + '. ' + v).join('\n')
                  teks += `\n\nPermainan selesai!, silahkan kirim *${prefixes[0]}quiz* untuk mendapatkan soal baru.`
                  return client.reply(m.chat, teks, m).then(() => {
                     clearTimeout(client.quiz[id][2])
                     delete client.quiz[id]
                  })
               } else {
                  let people = Object.entries(client.quiz[id][4]).sort((a, b) => b[1].score - a[1].score)
                  let teks = `乂  *Q U I Z*\n\n`
                  teks += people.map(([user, data], i) => (i + 1) + '. @' + user.split`@` [0] + ' ' + (i == 0 ? '🥇' : i == 1 ? '🥈' : i == 2 ? '🥉' : '') + '\n    *Answer* : ' + data.answer + '  –  *Score* : ' + Func.formatNumber(data.score)).join('\n')
                  teks += `\n\n`
                  teks += `乂  *J A W A B A N*\n\n`
                  teks += pop.map((v, i) => (i + 1) + '. ' + v).join('\n')
                  teks += `\n\nSisa *${json.jawaban.length - client.quiz[id][3].length}* jawaban belum terjawab.`
                  return client.reply(m.chat, teks, m)
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