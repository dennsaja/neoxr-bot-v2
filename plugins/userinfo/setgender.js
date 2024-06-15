exports.run = {
    usage: ['setgender'],
    use: '(option)',
    category: 'user info',
    async: async (m, {
       client,
       args,
       isPrefix,
       command,
       Func
    }) => {
       try {
        let user = global.db.users.find(v => v.jid == m.sender)
          if (!args || !args[0]) return m.reply(Func.example(isPrefix, command, 'cowok'))
          if (!['cowok','cewek'].includes(args[0])) return client.reply(m.chat, Func.texted('bold', `🚩 Gender tidak ada, kami hanya menerima cewek dan cowok.`), m)
          client.reply(m.chat, `🚩 Sukses set gender kamu ke *${args[0]}*.`, m).then(() => user.gender = args[0])
       } catch (e) {
          client.reply(m.chat, Func.jsonFormat(e), m)
       }
    },
    owner: true,
    cache: true,
    location: __filename
 }