const fs = require('fs'),
   FormData = require('form-data'),
   axios = require('axios')
   
async function pornDetector(buffer) {
   return new Promise(async resolve => {
      try {
         let form = new FormData()
         form.append('media', buffer)
         form.append('models', 'nudity-2.0,wad,gore')
         form.append('api_user', '539978705')
         form.append('api_secret', 'ySkueGagxeAMu93dJkBgkn2MKgathG3S')
         let result = await axios.post('https://api.sightengine.com/1.0/check.json', form, {
            headers: form.getHeaders()
         })
         if (result.status == 200) {
            if (result.data.status == 'success') {
               if (result.data.nudity.sexual_activity >= 0.50 || result.data.nudity.suggestive >= 0.50 || result.data.nudity.erotica >= 0.50) return resolve({
                  creator: global.creator,
                  status: true,
                  msg: `Nudity Content : ${(result.data.nudity.sexual_activity >= 0.50 ? result.data.nudity.sexual_activity * 100 : result.data.nudity.suggestive >= 0.50 ? result.data.nudity.suggestive * 100 :  result.data.nudity.erotica >= 0.50 ? result.data.nudity.erotica * 100 : 0)}%`
               })
               if (result.data.weapon > 0.50) return resolve({
                  creator: global.creator,
                  status: true,
                  msg: `Provocative Content : ${result.data.weapon * 100}%`
               })
            } else return resolve({
               creator: global.creator,
               status: false
            })
         } else return resolve({
            creator: global.creator,
            status: false
         })
      } catch (e) {
         return resolve({
            creator: global.creator,
            status: false,
            msg: e.message
         })
      }
   })
}

module.exports = pornDetector;