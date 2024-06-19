exports.run = {
    usage: ['lapor'],
    use: '<nama fitur> <pesan>',
    category: 'miscs',
    async: async (m, {
       client,
       args,
       isPrefix,
       command,
       Func
    }) => {
       try {
        let user = global.status.report_err
          if (!args || !args[0] || !args[1]) return m.reply(Func.example(isPrefix, command, 'spin ' + 'point ku ga nambah'))
          client.reply(m.chat, `🚩 Sukses mengirim laporan mu, terima kasih sudah melapor.`, m).then(() => client.reply('120363292483383184@g.us', `*Fitur Error*\n\n*Nama Fitur:* ${args[0]}\n\n*Pesan:* ${args[1]}`))
       } catch (e) {
          client.reply(m.chat, Func.jsonFormat(e), m)
       }
    },
    cache: true,
    location: __filename
 }