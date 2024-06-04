let { proto } = require('@adiwajshing/baileys')
exports.run = {
   usage: ['claim-flash'],
   category: 'user info',
   async: async (m, {
      client,
      isPrefix,
      command,
      Func
   }) => {
      try {
         client.relayMessage(m.chat, { 
            viewOnceMessage: {
               message: {
                   "messageContextInfo": {
                     "deviceListMetadata": {},
                     "deviceListMetadataVersion": 2
                   },
            interactiveResponseMessage: proto.Message.InteractiveResponseMessage.create({          
            body: proto.Message.InteractiveResponseMessage.Body.create({         
              text: 'Berhasil',
              format: 1
            }),   
            nativeFlowResponseMessage: proto.Message.InteractiveResponseMessage.NativeFlowResponseMessage.create({
               name: 'galaxy_message',
               paramsJson: '{"flow_token":"2","screen_0_question1Checkbox_0":["2"]}'
             })
            })
         }
      }       
        }, m)
         } catch (e) {
            client.reply(m.chat, Func.jsonFormat(e), m)
         }
   },
   error: false,
   cache: true,
   location: __filename
}