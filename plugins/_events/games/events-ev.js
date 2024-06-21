const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')
exports.run = {
   async: async (m, {
   client,
   body,
   users,
   prefixes,
   Scraper,
   Func
   }) => {
   try {
      if (body && m.quoted && /[#]ID/.test(m.quoted.text)) {
         const _id = (m.quoted.text.split('#ID-')[1]).trim()
         let quizset = global.db.setting.quizset.find(v => v._id == _id)
         if (!quizset.status || (new Date() - quizset.created_at > global.timer)) return client.reply(`${Func.texted('italic', `❌ Event telah selesai silahkan tunggu edisi *Event gift* di lain kesempatan.`)}\n\n${quizset.correct.map(v => `- @${v.split('@')[0]}`).join('\n')}\n\n^ Ke-${quizset.correct.length} orang diatas adalah mereka yang mendapatkan hadiah event edisi saat ini.`).then(() => quizset.status = false)
         if (body.toLowerCase() == 'qzclue' || body.toLowerCase() == prefixes[0] + 'qzclue') return client.reply(m.chat, '🚩 Clue : ' + quizset.answer.replace(/[bcdfghjklmnpqrstvwxyz]/g, '_'), m)    
         if (quizset.respondents.includes(m.sender)) return m.reply(Func.texted('italic', `🚩 Maaf kamu hanya bisa menjawab 1 kali saja jika code yang kamu masukan salah kesempatan kamu akan *HANGUS*.`))
         quizset.respondents.push(m.sender)
         if (quizset.answer != body.toLowerCase()) return client.sendSticker(m.chat, await Func.fetchBuffer('./media/sticker/false.webp'), m, {
            packname: global.db.setting.sk_pack,
            author: global.db.setting.sk_author
         })
         if (quizset.correct.length >= quizset.slot) quizset.status = false
         quizset.correct.push(m.sender)
         if (quizset.reward_key == 1) {
            const value = quizset.reward_value || 7
            users.limit += 1000
            users.premium = true
            users.expired = (new Date() * 1) + (86400000 * parseInt(value))
            client.reply(m.chat, Func.texted('bold', `✅ selamat kamu mendapatkan reward akses premium untuk ${value} hari.`), m).then(() => {
               let caption = `乂  *EVENT GIFT🎁*\n\n`
               caption += `Event Gift disi ${moment(quizset.timeout).format('DD/MM/YYYY (HH:mm)')} WIB\n`
               caption += `${quizset.question.trim()}\n\n`
               caption += `Slot : [ ${quizset.slot - quizset.correct.length} ]\n`
               caption += `Timeout : [ *${((global.timer / 1000) / 60)} menit* ]\n\n`
               caption += `reply pesan broadcast ini dan ketikan *CODE GIF* dengan benar .\n\n`
               caption += `#ID-${quizset._id}`
               client.sendFile(m.chat, quizset.url, '', caption)
            })
         } else if (quizset.reward_key == 2) {
        	const value = quizset.reward_value || 500000
            users.point += value
            client.reply(m.chat, Func.texted('bold', `✅ selamat kamu mendapatkan reward point sebanyak ${Func.formatter(value)}.`), m).then(() => {
            let caption = `乂  *EVENT GIFT🎁*\n\n`
               caption += `Event Gift disi ${moment(quizset.timeout).format('DD/MM/YYYY (HH:mm)')} WIB\n`
               caption += `${quizset.question.trim()}\n\n`
               caption += `Slot : [ ${quizset.slot - quizset.correct.length} ]\n`
               caption += `Timeout : [ *${((global.timer / 1000) / 60)} menit* ]\n\n`
               caption += `reply pesan broadcast ini dan ketikan *CODE GIF* dengan benar\n\n`
               caption += `#ID-${quizset._id}`
               client.sendFile(m.chat, quizset.url, '', caption)
            })
         } else if (quizset.reward_key == 3) {
        	const value = quizset.reward_value || 25
            users.limit += value
            client.reply(m.chat, Func.texted('bold', `✅ selamat kamu mendapatkan reward limit sebanyak ${Func.formatter(value)}.`), m).then(() => {
               let caption = `乂  *EVENT GIFT🎁*\n\n`
               caption += `Event Gift disi ${moment(quizset.timeout).format('DD/MM/YYYY (HH:mm)')} WIB\n`
               caption += `${quizset.question.trim()}\n\n`
               caption += `Slot : [ ${quizset.slot - quizset.correct.length} ]\n`
               caption += `Timeout : [ *${((global.timer / 1000) / 60)} menit* ]\n\n`
               caption += `reply pesan broadcast ini dan ketikan *CODE GIF* dengan benar .\n\n`
               caption += `#ID-${quizset._id}`
               client.sendFile(m.chat, quizset.url, '', caption)
            })
         } else if (quizset.reward_key == 4) {
        	const value = Func.randomInt(1, 500000)
            users.point += value
            client.reply(m.chat, Func.texted('bold', `✅ selamat kamu mendapatkan reward point sebanyak ${Func.formatter(value)}.`), m).then(() => {
               let caption = `乂  *EVENT GIFT🎁*\n\n`
               caption += `Event Gift disi ${moment(quizset.timeout).format('DD/MM/YYYY (HH:mm)')} WIB\n`
               caption += `${quizset.question.trim()}\n\n`
               caption += `Slot : [ ${quizset.slot - quizset.correct.length} ]\n`
               caption += `Timeout : [ *${((global.timer / 1000) / 60)} menit* ]\n\n`
               caption += `reply pesan broadcast ini dan ketikan *CODE GIF* dengan benar .\n\n`
               caption += `#ID-${quizset._id}`
               client.sendFile(m.chat, quizset.url, '', caption)
            })
         } else if (quizset.reward_key == 5) {
        	const value = Func.randomInt(1, 30)
            users.limit += value
            client.reply(m.chat, Func.texted('bold', `✅ selamat kamu mendapatkan reward limit sebanyak ${Func.formatter(value)}.`), m).then(() => {
               let caption = `乂  *EVENT GIFT🎁*\n\n`
               caption += `Event Gift disi ${moment(quizset.timeout).format('DD/MM/YYYY (HH:mm)')} WIB\n`
               caption += `${quizset.question.trim()}\n\n`
               caption += `Slot : [ ${quizset.slot - quizset.correct.length} ]\n`
               caption += `Timeout : [ *${((global.timer / 1000) / 60)} menit* ]\n\n`
               caption += `reply pesan broadcast ini dan ketikan *CODE GIF* dengan benar .\n\n`
               caption += `#ID-${quizset._id}`
               client.sendFile(m.chat, quizset.url, '', caption)
            })
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
