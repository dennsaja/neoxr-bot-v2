const nodemailer = require('nodemailer')
exports.run = {
   usage: ['reg'],
   use: 'email',
   category: 'user info',
   async: async (m, {
      client,
      args,
      isPrefix,
      command,
      Func
   }) => {
      try {
         if (global.db.users.find(v => v.jid == m.sender).verified) return client.reply(m.chat, Func.texted('bold', `✅ Nomor kamu sudah teregistrasi.`), m)
      if (!args || !args[0]) return client.reply(m.chat, Func.example(isPrefix, command, 'emailkamu@gmail.com'), m)
      if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ig.test(args[0])) return client.reply(m.chat, Func.texted('bold', '🚩 Email tidak valid.'), m)
      let emails = global.db.users.filter(v => v.email).map(v => v.email)
      if (emails.includes(args[0])) return client.reply(m.chat, Func.texted('bold', '🚩 Email sudah di daftarkan.'), m)
      client.sendReact(m.chat, '🕒', m.key)
      let code = `${Func.randomInt(100, 900)}-${Func.randomInt(100, 900)}`
      let users = global.db.users.find(v => v.jid == m.sender)
      users.codeExpire = new Date * 1
      users.code = code
      users.email = args[0]
      const transport = nodemailer.createTransport({
         service: process.env.USER_EMAIL_PROVIDER,
         auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_APP_PASSWORD
         }
      })
      const mailOptions = {
         from: {
            name: process.env.USER_NAME,
            address: process.env.USER_EMAIL
         },
         to: args[0],
         subject: 'Email Verification',
         html: `<div style="padding:20px;border:1px dashed #222;font-size:15px"><tt>Hai <b>${m.pushName} 👋🏻</b><br><br>Konfirmasikan email Anda untuk dapat digunakan ${process.env.USER_NAME}. Kirim kode ini ke bot dan masa berlakunya akan habis dalam 3 menit.<br><center><h1>${code}</h1></center>Atau klik url untuk menuju ke browser : <a href="https://wa.me/${client.decodeJid(client.user.id).split('@')[0]}?text=${code}">https://wa.me/${client.decodeJid(client.user.id).split('@')[0]}?text=${code}</a><br><br><hr style="border:0px; border-top:1px dashed #222"><br>Regards, <b>${global.owner_name}</b></tt></div>`
      }
      transport.sendMail(mailOptions, function(err, data) {
         if (err) return m.reply(Func.texted('bold', `❌ SMTP Error !!`))
         return client.reply(m.chat, Func.texted('bold', `✅ Cek mailbox kamu untuk mendapatkan kode verifikasi.`), m)
      })
      } catch (e) {
         client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   private: true
}