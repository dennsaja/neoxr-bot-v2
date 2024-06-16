exports.run = {
    async: async (m, {
       client,
       body,
       users,
       Func
    }) => {
       try {
          if (!m.isGroup && body && body.match(/\d{3}-\d{3}/) && !users.verified) {
             if (users.jid == m.sender && users.code != body.trim()) return client.reply(m.chat, Func.texted('bold', '🚩 Kode verifikasi kamu salah.'), m)
             if (new Date - users.codeExpire > 180000) return client.reply(m.chat, Func.texted('bold', '🚩 Kode verifikasi kamu telah kedaluarsa.'), m).then(() => {
                users.codeExpire = 0
                users.code = ''
                users.email = ''
                users.attempt = 0
             })
             return client.reply(m.chat, Func.texted('bold', `✅ Nomor kamu berhasil di verifikasi.`), m).then(() => {
                users.codeExpire = 0
                users.code = ''
                users.attempt = 0
                users.verified = true
             })
          }
       } catch (e) {
          console.log(e)
       }
    },
    error: false,
    private: true,
    cache: true,
    location: __filename
 }