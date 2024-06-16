exports.run = {
   async: async (m, {
       client,
       body,
       Func,
       isPrefix,
       chats,
       setting
   }) => {
       try {
               if (body && global.evaluate_chars.some(v => body.startsWith(v)) || body && Func.socmed(body)) return
               global.db.chatroom = global.db.chatroom ? global.db.chatroom : []
               const room = global.db.chatroom.find(v => v.jid == m.sender)
               const hint = [
                   'hai gemita',
                   'halo gemita',
                   'halo gemita ai',
                   'gemita',
                   'gemita ai',
                   'ai'
               ]
               const buttons = [{
                   name: 'quick_reply',
                   buttonParamsJson: JSON.stringify({
                       display_text: 'Tanya saya apapun',
                       id: `start-chat`
                   }),
                   index: 0
               }]

               if (body && hint.includes(body.toLowerCase())) {
                   if (room) { // Periksa apakah pengguna sudah berada dalam ruang obrolan
                       client.reply(m.chat, 'Halo! Apa yang bisa saya bantu hari ini?')
                   } else {
                       client.sendIAMessage(m.chat, buttons, {
                           key: {
                               fromMe: false,
                               participant: '6282221251804@s.whatsapp.net',
                               remoteJid: '120363179855462238@g.us'
                           },
                           message: {
                               "extendedTextMessage": {
                                   "text": 'AI Plus+'
                               }
                           }
                       }, {
                           header: '',
                           content: 'Halo! Saya adalah asisten AI.\nAda yang bisa saya bantu hari ini?',
                           footer: ''
                       })
                   }
               }

               for (let jid of [...new Set([...(m.mentionedJid || [])])]) {
                   if (jid != client.decodeJid(client.user.id)) continue
                   let regex = /@(\d+)\s*(.*)/;
                   let match = body.match(regex);
                   const json = await Api.neoxr('/gpt-pro', {
                    q: match[2] ? match[2].trim() : 'Halo gpt saya' + m.pushName
                 })
                 if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
                  await Func.delay(1500)
                   client.reply(m.chat, json.data.message, {
                       key: {
                           fromMe: false,
                           participant: '6282221251804@s.whatsapp.net',
                           remoteJid: '120363179855462238@g.us'
                       },
                       message: {
                           "extendedTextMessage": {
                               "text": 'AI Plus+'
                           }
                       }
                   })
               }

               if (body && body.toLowerCase() == 'start-chat' && !room) {
                   if (global.db.chatroom.length >= 5) return m.reply('Chatroom telah digunakan sebanyak 5 pengguna, tunggu giliran kamu.')
                   return client.reply(m.chat, 'Halo! Apa yang bisa saya bantu hari ini?').then(() => global.db.chatroom.push({
                       jid: m.sender,
                       created_at: new Date * 1
                   }))
               } else if (body && body.toLowerCase() == 'start-chat' && room) return m.reply('Kamu sudah membuat chatroom, kirim perintah *stop* untuk menghapus sesi chatroom.')

               if (body && body.toLowerCase() == 'stop' && room) return m.reply('Baik, sekarang chat AI telah di stop untuk mu.\nUntuk menggunakanya kembali ketik *gemita ai* dan kirim ke bot.').then(() => Func.removeItem(global.db.chatroom, room))

               if (body && !body.startsWith('ai') && !global.evaluate_chars.some(v => body.startsWith(v)) && room) {
                   const json = await Api.neoxr('/gpt-pro', {
                    q: body
                 })
                 if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
                  await Func.delay(1500)
                   if (!m.fromMe && room) return client.reply(m.chat, json.data.message, {
                       key: {
                           fromMe: false,
                           participant: '6282221251804@s.whatsapp.net',
                           remoteJid: '120363179855462238@g.us'
                       },
                       message: {
                           "extendedTextMessage": {
                               "text": 'ketik *stop* untuk menghentikan sesi chat dengan ai.'
                           }
                       }
                   })
               }
       } catch (e) {
           console.log(e)
           client.reply(m.chat, Func.jsonFormat(e), m)
       }
   },
   error: false,
   cache: true,
   location: __filename
}
