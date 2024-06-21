exports.run = {
   async: async (m, {
      client,
      body,
      Func
   }) => {
      try {
         let id = m.chat
         let reward = Func.randomInt(500, 500000)
         let playScore = 150000
         let ok
         let isWin = !1
         let isTie = !1
         let isSurrender = !1
         client.game = client.game ? client.game : {}
         let room = Object.values(client.game).find(room => room.id && room.game && room.state && room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender) && room.state == 'PLAYING')
         if (room) {
            if (!/^([1-9]|(me)?nyerah|surr?ender)$/i.test(body)) return !0
            isSurrender = !/^[1-9]$/.test(body)
            if (m.sender !== room.game.currentTurn) { // nek wayahku
               if (!isSurrender) return !0
            }
            if (!isSurrender && 1 > (ok = room.game.turn(m.sender === room.game.playerO, parseInt(body) - 1))) {
               client.reply(m.chat, {
                  '-3': 'Game Over!',
                  '-2': 'Invalid',
                  '-1': 'Invalid Position!',
                  0: 'Invalid Position!',
               } [ok], m)
               return !0
            }
            if (m.sender === room.game.winner) isWin = true
            else if (room.game.board === 511) isTie = true
            let arr = room.game.render().map(v => {
               return {
                  X: '❌',
                  O: '⭕',
                  1: '1️⃣',
                  2: '2️⃣',
                  3: '3️⃣',
                  4: '4️⃣',
                  5: '5️⃣',
                  6: '6️⃣',
                  7: '7️⃣',
                  8: '8️⃣',
                  9: '9️⃣',
               } [v]
            })
            if (isSurrender) {
               room.game._currentTurn = m.sender === room.game.playerX
               isWin = true
            }
            let winner = isSurrender ? room.game.currentTurn : room.game.winner
            let str = `乂  *T I C T A C T O E*\n\n`
            str += `${arr.slice(0, 3).join('')}\n`
            str += `${arr.slice(3, 6).join('')}\n`
            str += `${arr.slice(6).join('')}\n\n`
            str += `${isWin ? `@${winner.split`@`[0]} Win! (+${Func.formatNumber(reward)} Point)\n\n` : isTie ? `Game over (+${Func.formatNumber(playScore)} Point)\n\n` : `Giliran ${['❌', '⭕'][1 * room.game._currentTurn]} : @${room.game.currentTurn.split`@`[0]} !!\n\n`}`
            str += `❌ : @${room.game.playerX.split`@`[0]}\n`
            str += `⭕ : @${room.game.playerO.split`@`[0]}\n`
            str += `Kirim *nyerah* untuk menyerah.\n`
            str += `*Room ID* : ${room.id}`
            let users = global.db.users
            if ((room.game._currentTurn ^ isSurrender ? room.x : room.o) !== m.chat)
               room[room.game._currentTurn ^ isSurrender ? 'x' : 'o'] = m.chat
            if (room.x !== room.o) await client.reply(room.x, str, m)
            await client.reply(room.o, str, m)
            if (isTie || isWin) {    	
               users.find(v => v.jid == room.game.playerX).point += playScore
               users.find(v => v.jid == room.game.playerO).point += playScore
               if (isWin) users.find(v => v.jid == winner).point += reward - playScore
               delete client.game[room.id]
            }
         }
      } catch (e) {
         return client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   group: true,
   game: true,
   cache: true,
   location: __filename
}