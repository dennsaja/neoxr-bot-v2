exports.run = {
   usage: ['me'],
   category: 'user info',
   async: async (m, {
      client,
      isPrefix,
      blockList,
      Func
   }) => {
      let user = global.db.users.find(v => v.jid == m.sender)
      let pic = await Func.fetchBuffer('./media/image/default.jpg')
      let _own = [...new Set([global.owner, ...global.db.setting.owners])]
      try {
         pic = await Func.fetchBuffer(await client.profilePictureUrl(m.sender, 'image'))
      } catch {} finally {
         let blocked = blockList.includes(m.sender) ? true : false
         //let now = new Date() * 1
        // let lastseen = (user.lastseen == 0) ? 'Never' : Func.toDate(now - user.lastseen)
       //  let usebot = (user.usebot == 0) ? 'Never' : Func.toDate(now - user.usebot)
         let caption = `乂  *U S E R - P R O F I L E*\n\n`
         caption += `	◦ *Name* : ${Func.censorName(m.pushName)}\n`
         caption += `	◦ *Username* : ${user.username ? user.username : '_perlu di set_'}\n`
         caption += `	◦ *Bio* : ${user.bio ? user.bio : '_perlu di set_'}\n`
         caption += `	◦ *Point* : ${Func.h2k(user.point)}\n`
         caption += `	◦ *Tabungan* : ${Func.h2k(user.tabungan)}\n`
         caption += `	◦ *Guard* : ${Func.formatNumber(user.guard)}\n`
         caption += `	◦ *Limit* : ${Func.formatNumber(user.limit)}\n`
         caption += `	◦ *Level* : ${Func.level(user.point, global.multiplier)[0]} (${Func.role(Func.level(user.point, global.multiplier)[0])})\n`
         caption += `	◦ *Hitstat* : ${Func.formatNumber(user.hit)}\n`
         caption += `	◦ *Warning* : ${((m.isGroup) ? (typeof global.db.groups.find(v => v.jid == m.chat).member[m.sender] != 'undefined' ? global.db.groups.find(v => v.jid == m.chat).member[m.sender].warning : 0) + ' / 5' : user.warning + ' / 5')}\n\n`
         caption += `乂  *U S E R - S T A T U S*\n\n`
         caption += `	◦ *Blocked* : ${(blocked ? '√' : '×')}\n`
         caption += `	◦ *Banned* : ${(new Date - user.banTemp < global.timer) ? Func.toTime(new Date(user.banTemp + global.timer) - new Date()) + ' (' + ((global.timer / 1000) / 60) + ' min)' : user.banned ? '√' : '×'}\n`
         caption += `	◦ *Use In Private* : ${(global.db.chats.map(v => v.jid).includes(m.sender) ? '√' : '×')}\n`
         caption += `	◦ *Taken* : ${(user.taken ? '√' : '×')}\n`
         caption += `	◦ *Loved* : ${user.taken ? '@' + user.partner.split`@`[0] : '-'}\n`
         caption += `	◦ *Verified* : ${(user.verified ? '√' : '×')}\n`
         caption += `	◦ *Premium* : ${(user.premium ? '√' : '×')}\n`
         caption += `	◦ *Expired* : ${user.expired == 0 ? '-' : Func.timeReverse(user.expired - new Date() * 1)}\n\n`
         caption += global.footer
         client.sendMessageModify(m.chat, caption, m, {
             largeThumb: true,
             thumbnail: pic
         })
      }
   },
   error: false,
   cache: true,
   location: __filename
}