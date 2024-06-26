exports.run = {
    usage: ['premium', 'infopremium'],
    async: async (m, {
       client,
       isPrefix,
       command
    }) => {
        let footer = global.footer
          let teks = `*- P R E M I U M*\n\nApa manfaat berlangganan premium?\n\n *1.* Akses semua fitur\n *2.* Tambahan Limit\n *3.* Pakai bot di chat pribadi (jika mode grup)\n\n`
          teks += `*P I L I H A N - P A K E T*\n\n`
          teks += `	◦ *Paket* : Mini\n`
          teks += `	◦ *Harga* : Rp. 5,000\n`
          teks += `	◦ *Limit* : +50k\n`
          teks += `	◦ *Kedaluarsa* : 7 hari\n\n`
          teks += `	◦ *Paket* : Ultra\n`
          teks += `	◦ *Harga* : Rp. 10,000\n`
          teks += `	◦ *Limit* : +100k\n`
          teks += `	◦ *Kedaluarsa* : 30 hari\n\n`
          teks += `	◦ *Paket* : Pro\n`
          teks += `	◦ *Harga* : Rp. 20,000\n`
          teks += `	◦ *Limit* : +150k\n`
          teks += `	◦ *Kedaluarsa* : 60 hari\n\n`
          teks += `Ayo langganan sekarang, nikmati *potongan harga 50%* untuk paket ultra.\n\n`
          teks += footer
          client.reply(m.chat, teks, m)  
    },
    error: false
 }