const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')
exports.run = {
   usage: ['nabung', 'tarik', 'riwayattabungan', 'riwayatpenarikan', 'tabungan'],
   category: 'user info',
   async: async (m, {
      client,
      args,
      isPrefix,
      command,
      Func
   }) => {
      try {
         if (command == 'nabung') {
            if (!args || !args[0]) return client.reply(m.chat, Func.example(isPrefix, command, '10000'), m)
            let user = global.db.users.find(v => v.jid == m.sender)
            if (user.point == 0) return client.reply(m.chat, Func.texted('bold', `Kamu tidak mempunyai point.`), m)
            if (isNaN(args[0])) return client.reply(m.chat, Func.texted('bold', `Nominal point harus berupa angka.`), m)
            if (args[0] < 10000) return client.reply(m.chat, Func.texted('bold', `Minimal 10K point untuk di tabung.`), m)
            if (args[0] > user.point) return client.reply(m.chat, Func.texted('bold', `Point yang kamu miliki tidak cukup untuk di tabung.`), m)
            
            let bunga = Math.random() * 0.0069 + 0.0001; // Generate random bunga from 0.0001% to 0.7%
            let bungaAmount = Math.floor(parseInt(args[0]) * bunga); // Calculate bunga amount
            user.point -= parseInt(args[0]);
            user.tabungan += parseInt(args[0]) + bungaAmount;
            user.history_nabung.push({
               sn: Func.makeId(5),
               nominal: parseInt(args[0]),
               bunga: bunga * 100,
               bunga_amount: bungaAmount,
               type: 'SAVING',
               date: new Date() * 1
            });
            let teks = `❏  *N A B U N G*\n\n`;
            teks += `Berhasil menyimpan uang kedalam tabungan dengan nominal Rp. ${Func.formatNumber(args[0])} rupiah\n`;
            teks += `Bunga yang didapatkan: ${bunga * 100}% (${Func.formatNumber(bungaAmount)} rupiah)\n\n`;
            teks += `➠ *Sisa Uang* : ${Func.formatNumber(global.db.users.find(v => v.jid == m.sender).point)}\n`;
            teks += `➠ *SN* : ${Func.makeId(5)}`;
            client.sendMessageModify(m.chat, teks, m, {
               largeThumb: true,
               thumbnail: await Func.fetchBuffer('https://telegra.ph/file/062602bf84d125e97d35c.jpg')
            });
         } else if (command == 'tarik') {
            if (!args || !args[0]) return client.reply(m.chat, Func.example(isPrefix, command, '10000'), m)
            let user = global.db.users.find(v => v.jid == m.sender)
            if (user.tabungan == 0) return client.reply(m.chat, Func.texted('bold', `Kamu tidak mempunyai tabungan.`), m)
            if (isNaN(args[0])) return client.reply(m.chat, Func.texted('bold', `Nominal uang harus berupa angka.`), m)
            if (args[0] < 10000) return client.reply(m.chat, Func.texted
('bold', `Minimal 10K untuk di tarik.`), m)
            if (args[0] > user.tabungan) return client.reply(m.chat, Func.texted('bold', `Nominal saldo melebihi jumlah tabunganmu saat ini.`), m)
            user.point += parseInt(args[0])
            user.tabungan -= parseInt(args[0])
            user.history_nabung.push({
               sn: Func.makeId(5),
               nominal: parseInt(args[0]),
               type: 'WITHDRAW',
               date: new Date * 1
            })
            let teks = `❏  *T A R I K*\n\n`
            teks += `Berhasil melakukan penarikan uang dengan nominal Rp. ${Func.formatNumber(args[0])} rupiah\n\n`
            teks += `➠ *Sisa uang* : ${Func.formatNumber(global.db.users.find(v => v.jid == m.sender).tabungan)}\n`
            teks += `➠ *SN* : ${Func.makeId(5)}`
            client.sendMessageModify(m.chat, teks, m, {
            largeThumb: true,
            thumbnail: await Func.fetchBuffer('https://telegra.ph/file/a34aa9bd94e21ecb29a31.jpg')
})
         } else if (command == 'riwayattabungan') {
            let data = global.db.users.find(v => v.jid == m.sender)
            if (data.tabungan == 0) return client.reply(m.chat, `Empty data!`, m)
            let SV_P = data.history_nabung.filter(v => v.type == 'SAVING')
            if (SV_P.length == 0) return client.reply(m.chat, `Empty data!`, m)
            SV_P.sort((a, b) => b.date - a.date)
            let teks = `❏  *T A B U N G A N*\n\n`
            teks += SV_P.slice(0, 20).map((v, i) => (i + 1) + '. Menyimpan point pada tanggal _' + moment(v.date).format('DD/MM/YY HH:mm:ss') + '_\n	◦  *Nominal* :  ' + Func.formatNumber(v.nominal) + '\n	◦  *SN* :  ' + v.sn).join`\n\n`
            teks += `\n\n${global.db.setting.footer}`
            client.sendMessageModify(m.chat, teks, m, {
            largeThumb: true,
            thumbnail: await Func.fetchBuffer('https://telegra.ph/file/fc5be6d7a3b260b7f8688.jpg')
})
         } else if (command == 'riwayatpenarikan') {
            let data = global.db.users.find(v => v.jid == m.sender)
            if (data.tabungan == 0) return client.reply(m.chat, `Empty data!`, m)
            let SV_P = data.history_nabung.filter(v => v.type == 'WITHDRAW')
            if (SV_P.length == 0) return client.reply(m.chat, `Empty data!`, m)
            SV_P.sort((a, b) => b.date - a.date)
            let teks = `❏  *T A B U N G A N*\n\n`
            teks += SV_P.slice(0, 20).map((v, i) => (i + 1) + '. Penarikan point pada tanggal _' + moment(v.date).format('DD/MM/YY HH:mm:ss') + '_\n	◦  *Nominal* :  ' + Func.formatNumber(v.nominal) + '\n	◦  *SN* :  ' + v.sn).join`\n\n`
            teks += `\n\n${global.db.setting.footer}`
            client.sendMessageModify(m.chat, teks, m, {
            largeThumb: true,
            thumbnail: await Func.fetchBuffer('https://telegra.ph/file/fc5be6d7a3b260b7f8688.jpg')
})
         } else if (command == 'tabungan') {
            let user = global.db.users.find(v => v.jid == m.sender)
            if (user.tabungan < 1) return client.reply(m.chat, `Kamu tidak mempunyai tabungan.`, m)
            client.sendMessageModify(m.chat, Func.texted('bold', `Kamu mempunyai tabungan sebanyak ${Func.h2k(Func.formatNumber(user.tabungan))} (${Func.formatNumber(user.tabungan)}) point.`), m, {
            largeThumb: true,
            thumbnail: await Func.fetchBuffer('https://telegra.ph/file/5d6808add1f55c1246984.jpg')
})
         }
      } catch (e) {
         client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   cache: true,
   location: __filename
}