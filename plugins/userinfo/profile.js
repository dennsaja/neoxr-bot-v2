exports.run = {
   usage: ['profile', 'cek-akun'],
   use: 'mention or reply',
   category: 'user info',
   async: async (m, {
      client,
      text,
      isPrefix,
      blockList,
      env,
      Func
   }) => {
      let number = isNaN(text) ? (text.startsWith('+') ? text.replace(/[()+\s-]/g, '') : (text).split`@` [1]) : text
      if (!text && !m.quoted) return client.reply(m.chat, Func.texted('bold', `🚩 Mention or Reply chat target.`), m)
      if (isNaN(number)) return client.reply(m.chat, Func.texted('bold', `🚩 Invalid number.`), m)
      if (number.length > 15) return client.reply(m.chat, Func.texted('bold', `🚩 Invalid format.`), m)
         var pic = await Func.fetchBuffer('./media/image/default.jpg')
      try {
         if (text) {
            var user = number + '@s.whatsapp.net'
         } else if (m.quoted.sender) {
            var user = m.quoted.sender
         } else if (m.mentionedJid) {
            var user = number + '@s.whatsapp.net'
         }
      } catch (e) {} finally {
         let target = global.db.users.find(v => v.jid == user)
         let gender = target.gender;
           switch (gender) {
             case 'cowok':
             gender = 'Laki-laki';
             break;
           case 'cewek':
             gender = 'Perempuan';
             break;
           default:
             gender = 'Tidak diketahui';  // Jika gender tidak dikenal
      }
         if (typeof target == 'undefined') return client.reply(m.chat, Func.texted('bold', `🚩 Can't find user data.`), m)
         try {
            var pic = await Func.fetchBuffer(await client.profilePictureUrl(user, 'image'))
         } catch (e) {} finally {
            let blocked = blockList.includes(user) ? true : false
            let now = new Date() * 1
            let lastseen = (target.lastseen == 0) ? 'Never' : Func.lastSeen(now - target.lastseen)
            let usebot = (target.usebot == 0) ? 'Never' : Func.toDate(now - target.usebot)
            let caption = `乂  *I N F O R M A S I  A K U N*\n\n`
            caption += `	◦  *Username* : ${user.username ? user.username : '_perlu di set_'}\n`
            caption += `	◦  *Gender* : ${gender}\n`
            caption += `	◦  *Terakhir Dilihat* : ${lastseen}\n`
            caption += `	◦  *Bio* : ${target.bio ? target.bio : '_perlu di set_'}\n`
            caption += `	◦  *Point* : ${Func.h2k(target.point)}\n`
            caption += `	◦  *Tabungan* : ${Func.h2k(target.tabungan)}\n`
            caption += `	◦  *Guard* : ${Func.formatNumber(target.guard)}\n`
            caption += `	◦  *Limit* : ${Func.formatNumber(target.limit)}\n`
            caption += `	◦  *Hitstat* : ${Func.formatNumber(target.hit)}\n`
            caption += `	◦  *Level* : ${Func.level(user.point, env.multiplier)[0]} (${Func.role(Func.level(user.point, env.multiplier)[0])})\n`
            caption += `	◦  *Warning* : ${((m.isGroup) ? (typeof global.db.groups.find(v => v.jid == m.chat).member[user] != 'undefined' ? global.db.groups.find(v => v.jid == m.chat).member[user].warning : 0) + ' / 5' : target.warning + ' / 5')}\n\n`
            caption += `乂  *S T A T U S  A K U N*\n\n`
            caption += `	◦  *Blocked* : ${(blocked ? '√' : '×')}\n`
            caption += `	◦  *Banned* : ${(new Date - target.ban_temporary < env.timer) ? Func.toTime(new Date(target.ban_temporary + env.timeout) - new Date()) + ' (' + ((env.timeout / 1000) / 60) + ' min)' : target.banned ? '√' : '×'}\n`
            caption += `	◦  *Use In Private* : ${(global.db.chats.map(v => v.jid).includes(user) ? '√' : '×')}\n`
            caption += `	◦  *Taken* : ${(target.taken ? '√' : '×')}\n`
            caption += `	◦  *Loved* : ${target.taken ? '@' + target.partner.split`@`[0] : '-'}\n`
            caption += `	◦  *Verified* : ${(target.verified ? '√' : '×')}\n`
            caption += `	◦  *Premium* : ${(target.premium ? '√' : '×')}\n`
            caption += `	◦  *Expired* : ${target.expired == 0 ? '-' : Func.timeReverse(target.expired - new Date() * 1)}\n\n`
            caption += global.footer
            client.sendMessageModify(m.chat, caption, m, {
               largeThumb: true,
               title: `${Func.censorName2(m.pushName)} ${(user.verified ? 'Terverifikasi' : '')}`,
               body: `${(user.premium ? '₪ Akun Nitro' : 'Akun Standar')}`,
               thumbnail: pic
            })
         }
      }
   },
   error: false,
   cache: true,
   location: __filename
}