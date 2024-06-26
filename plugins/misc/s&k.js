exports.run = {
    usage: ['syarat-ketentuan'],
    hidden: ['s&k', 'syarat-ketentuan-bot'],
    category: 'miscs',
    async: async (m, {
       client,
       setting
    }) => {
       try {
          client.reply(m.chat, setting.sk, m)
       } catch (e) {
          client.reply(m.chat, global.status.error, m)
       }
    },
    error: false,
    cache: true,
    location: __filename
 }