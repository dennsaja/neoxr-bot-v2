exports.run = {
    usage: ['setbio'],
    use: 'bio',
    category: 'user info',
    async: async (m, {
       client,
       text,
       isPrefix,
       command,
       Func
    }) => {
       try {
          let setting = global.db.users.find(v => v.jid == m.sender)
          if (!text) return client.reply(m.chat, Func.example(isPrefix, command, 'gaada bio nya'), m)
          setting.bio = text
          client.reply(m.chat, Func.texted('bold', `🚩 Bio Berhasil di set ${text}.`), m)
       } catch (e) {
          client.reply(m.chat, Func.jsonFormat(e), m)
       }
    },
    cache: true,
    location: __filename
 }