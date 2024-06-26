exports.run = {
   usage: ['me', 'akun'],
   category: 'user info',
   async: async (m, {
      client,
      isPrefix,
      blockList,
      Func
   }) => {
      let user = global.db.users.find(v => v.jid == m.sender)
      let bios = user.bio ? user.bio : '_perlu di set_'
      let _own = [...new Set([global.owner, ...global.db.setting.owners])]
      let gender = user.gender;
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
      let picPath = './media/image/profil-cowok-default.png';  // default gambar cowok
      if (user.gender === 'cewek') {
        picPath = './media/image/profil-cewek-default.png';  // set path gambar cewek jika gender adalah cewek
      }
      let pic;
      try {
        pic = await Func.fetchBuffer(picPath);  // fetch gambar berdasarkan path yang sudah ditentukan
      } catch (error) {
        console.error('Error fetching image:', error);
        pic = await Func.fetchBuffer('./media/image/profil-cowok-default.png');  // fallback ke gambar cowok
      } finally {
         let blocked = blockList.includes(m.sender) ? true : false
         //let now = new Date() * 1
        // let lastseen = (user.lastseen == 0) ? 'Never' : Func.toDate(now - user.lastseen)
       //  let usebot = (user.usebot == 0) ? 'Never' : Func.toDate(now - user.usebot)
         let caption = `乂  *I N F O R M A S I  A K U N*\n\n`
         caption += `	◦ *Username* : ${user.username ? user.username : '_perlu di set_'}\n`
         caption += `	◦ *Gender* : ${gender}\n`
         caption += `	◦ *Bio* : ${Func.censorBio(bios)}\n`
         caption += `	◦ *Point* : ${Func.h2k(user.point)}\n`
         caption += `	◦ *Tabungan* : ${Func.h2k(user.tabungan)}\n`
         caption += `	◦ *Guard* : ${Func.formatNumber(user.guard)}\n`
         caption += `	◦ *Limit* : ${Func.formatNumber(user.limit)}\n`
         caption += `	◦ *Level* : ${Func.level(user.point, global.multiplier)[0]} (${Func.role(Func.level(user.point, global.multiplier)[0])})\n`
         caption += `	◦ *Hitstat* : ${Func.formatNumber(user.hit)}\n`
         caption += `	◦ *Warning* : ${((m.isGroup) ? (typeof global.db.groups.find(v => v.jid == m.chat).member[m.sender] != 'undefined' ? global.db.groups.find(v => v.jid == m.chat).member[m.sender].warning : 0) + ' / 5' : user.warning + ' / 5')}\n\n`
         caption += `乂  *S T A T U S  A K U N*\n\n`
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
             title: `${Func.censorName2(user.name)} ${(user.verified ? 'Terverifikasi' : '')}`,
             body: `${(user.premium ? '⚡ Akun Premium ' : ' Akun Standar ')}`,
             thumbnail: pic
         })
      }
   },
   error: false,
   cache: true,
   location: __filename
}