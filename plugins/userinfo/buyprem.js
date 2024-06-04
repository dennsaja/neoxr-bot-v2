exports.run = {
   usage: ['buyprem'],
   category: 'user info',
   async: async (m, {
      client,
      args,
      isPrefix,
      users,
      command,
      Func
   }) => {
      try {
         let now = new Date * 1
         let package = [{
            _id: '1D',
            name: 'PREMIUM 1 DAY',
            price: 100_000_000,
            limit: 30,
            duration: 86400000 * 1
         }, {
            _id: '3D',
            name: 'PREMIUM 3 DAY',
            price: 300_000_000,
            limit: 100,
            duration: 86400000 * 3
         }, {
            _id: '7D',
            name: 'PREMIUM 7 DAY',
            price: 700_000_000,
            limit: 250,
            duration: 86400000 * 7
         }, {
            _id: '30D',
            name: 'PREMIUM 30 DAY',
            price: 1_000_000_000,
            limit: 1000,
            duration: 86400000 * 30
         }]
         let p = `乂  *B U Y P R E M*\n\n`
         package.map((v, i) => {
            p += `${(i+1)}. ${v.name}\n`
            p += `◦  *Price* : ${Func.formatter(v.price)} Points\n`
            p += `◦  *Command* : ${isPrefix + command} ${v._id}\n\n`
         })
         p += global.footer
         if (!args || !args[0]) return client.sendMessageModify(m.chat, p, m, {
            largeThumb: true,
            thumbnail: await Func.fetchBuffer('https://telegra.ph/file/05216f281d5e99dce6c51.jpg')
         })
         const pkg = package.find(v => v._id == (args[0]).toUpperCase())
         if (!pkg) return client.reply(m.chat, Func.texted('bold', `🚩 Package not found.`), m)
         if (Number(pkg.price) > users.point) return client.reply(m.chat, Func.texted('bold', `🚩 Your points are not enough to be exchanged for a ${pkg.name} package.`), m)
         users.limit += pkg.limit
         users.expired += users.premium ? (pkg.duration) : (now + pkg.duration)
         users.point -= Number(pkg.price)
         client.reply(m.chat, Func.texted('bold', `✅ Succesfully buying ${pkg.name} package.`), m).then(() => users.premium = true)
      } catch (e) {
         client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false
}