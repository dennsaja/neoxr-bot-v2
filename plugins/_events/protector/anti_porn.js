const fs = require('fs')
const pornDetector = require('lib/scrape')
exports.run = {
   async: async (m, {
      client,
      groupSet,
      isAdmin,
      isBotAdmin,
      Func
   }) => {
      try {
         if (!m.fromMe && m.isGroup && groupSet.antiporn && /image|webp/.test(m.mtype) && !isAdmin && isBotAdmin) {
            let sync = await Func.getFile(await m.download())
            const json = await pornDetector(fs.createReadStream(sync.file))
            if (json.status) return m.reply(`Detect ${json.msg}`).then(() => {
               client.sendMessage(m.chat, {
               delete: {
                  remoteJid: m.chat,
                  fromMe: false,
                  id: m.key.id,
                  participant: m.sender
                 }
               })
            })
         } else if (!m.fromMe && !m.isGroup && /image|webp/.test(m.mtype)) {
            let sync = await Func.getFile(await m.download())
            const json = await pornDetector(fs.createReadStream(sync.file))
            if (json.status) return m.reply(`Foto porno terdeteksi [ ${json.msg} ]`)
         }
      } catch (e) {
         console.log(e)
      }
   },
   error: true,
   cache: true,
   location: __filename
}