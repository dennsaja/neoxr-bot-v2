exports.run = {
   async: async (m, {
      client,
      body,
      groupSet,
      isAdmin
   }) => {
      try {
        if (groupSet.antilink && !isAdmin && body) {
            if (m.msg.matchedText && m.msg.matchedText.match(/(chat.whatsapp.com)/gi) && !m.msg.matchedText.includes(await client.groupInviteCode(m.chat)) || body.match(/(chat.whatsapp.com)/gi) && !body.includes(await client.groupInviteCode(m.chat)) || body.match(/(wa.me)/gi)) return client.sendMessage(m.chat, {
               delete: {
                  remoteJid: m.chat,
                  fromMe: false,
                  id: m.key.id,
                  participant: m.sender
               }
            })
         }      
      } catch (e) {
         return client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   group: true,
   botAdmin: true,
   cache: true,
   location: __filename
}
