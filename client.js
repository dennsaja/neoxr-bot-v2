"use strict";
require('events').EventEmitter.defaultMaxListeners = 50; // Sesuaikan dengan kebutuhan
const PORT = process.env.PORT || 7392;
const { Baileys, MongoDB, PostgreSQL, Scandir } = new (require('@neoxr/wb'));
const Function = new (require('./lib/system/functions'));
const Func = Function;
const fs = require('fs');
const path = require('path');
const colors = require('@colors/colors');
const env = require('./config.json');
const express = require('express');
const app = express();
const http = require('http');
const nodeCache = require('node-cache');
const session = require('express-session');
const flash = require('connect-flash');
const axios = require('axios');

const cache = new nodeCache({ stdTTL: env.cooldown });

let machine;
if (process.env.DATABASE_URL) {
    if (/mongo/.test(process.env.DATABASE_URL)) {
        machine = new (require('./lib/system/mongo'));
    } else if (/postgres/.test(process.env.DATABASE_URL)) {
        machine = PostgreSQL;
    }
} else {
    machine = new (require('./lib/system/localdb'))(env.database);
}

const client = new Baileys({
    type: '--neoxr-v1',
    plugsdir: 'plugins',
    sf: 'session',
    online: true,
    version: [2, 2413, 51]
});

/* Starting to connect */
client.on('connect', async res => {
    try {
        global.db = { users: [], chats: [], groups: [], statistic: {}, sticker: {}, setting: {}, ...(await machine.fetch() || {}) };
        await machine.save(global.db);
        if (res && typeof res === 'object' && res.message) Func.logFile(res.message);
    } catch (error) {
        console.error('Error during connection:', error);
    }
});

/* Print error */
client.on('error', async error => {
    console.log(colors.red(error.message));
    if (error && typeof error === 'object' && error.message) Func.logFile(error.message);
});

/* Bot is connected */
client.on('ready', async () => {
    const ramCheck = setInterval(() => {
        const ramUsage = process.memoryUsage().rss;
        if (ramUsage >= require('bytes')(env.ram_limit)) {
            clearInterval(ramCheck);
            console.log('Memory usage exceeded. Restarting application...');
            process.exit(1);
        }
    }, 60000);

    /*const runServer = async () => {
        app.set('json spaces', 2);
        app.set('view engine', 'ejs');
        app.use(express.static('views'));
        app.use(session({
            secret: process.env.SESSION_SECRET || 'xnzgcdgcgcigecgi28062024',
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 60000,
                secure: process.env.NODE_ENV === 'production'
            }
        }));
        app.use(flash());
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success_msg');
            res.locals.error_msg = req.flash('error_msg');
            next();
        });

        app.get("/api", async (req, res) => {
            const serverInfo = {
                bot: {
                    users: global.db.users.length,
                    hit: Func.formatNumber(Func.jumlahkanHitStat(global.db.statistic)),
                    msgreceive: Func.formatNumber(global.db.setting.messageReceive),
                    msgssent: Func.formatNumber(global.db.setting.messageSent),
                    datareceive: Func.formatSize(global.db.setting.receiveSize),
                    dataupload: Func.formatSize(global.db.setting.uploadSize),
                },
            };
            res.json(serverInfo);
        });

        app.get('/', async(req, res) => {
            res.render('unban');
        });

        app.get('/progres', async (req, res) => {
            try {
                const nomoruser = req.query.nomor;
                const jid = `${nomoruser}@s.whatsapp.net`;
                let is_user = global.db.users;

                if (!is_user.some(v => v.jid === jid)) {
                    req.flash('error_msg', '🚩 Pengguna tidak ditemukan.');
                    return res.redirect('/');
                }

                const user = is_user.find(v => v.jid === jid);
                if (!user.banned) {
                    req.flash('error_msg', '🚩 Akun mu tidak ditangguhkan!');
                    return res.redirect('/');
                }

                user.banned = false;
                let bannedCount = is_user.filter(v => v.banned).length;

                req.flash('success_msg', `Sukses membuka penangguhan akun mu dari ${bannedCount} akun.`);
                res.redirect('/');
            } catch (error) {
                console.error("Error:", error);
                req.flash('error_msg', 'Internal server error.');
                res.redirect('/');
            }
        });

        const server = http.createServer(app);
        server.listen(PORT, () => console.log('Connected to server --', PORT));
    };

    runServer();*/

    if (!fs.existsSync('./temp')) fs.mkdirSync('./temp');

    require('./lib/system/config');

    setInterval(async () => {
        try {
            const tmpFiles = await fs.promises.readdir('./temp');
            if (tmpFiles.length > 0) {
                await Promise.all(tmpFiles
                    .filter(file => !file.endsWith('.file'))
                    .map(file => fs.promises.unlink(path.join('./temp', file))));
                tmpFiles.forEach(file => console.log(`Deleted temp file: ${file}`));
            }
        } catch (err) {
            console.error(`Failed to clean temp directory:`, err);
        }
    }, 600000);

    setInterval(async () => {
        if (global.db) await machine.save(global.db);
        if (process.env.CLOVYR_APPNAME && process.env.CLOVYR_URL && process.env.CLOVYR_COOKIE) {
            try {
                const response = await axios.get(process.env.CLOVYR_URL, {
                    headers: {
                        referer: `https://clovyr.app/view/${process.env.CLOVYR_APPNAME}`,
                        cookie: process.env.CLOVYR_COOKIE
                    }
                });
                Func.logFile(`${response.status} - Application wake-up!`);
            } catch (error) {
                console.error('Failed to send HTTP request:', error);
            }
        }
    }, 30000);
});

/* Print all message object */
client.on('message', ctx => {
    require('./handler')(client.sock, ctx);
    require('./lib/system/baileys')(client.sock);
    require('./lib/system/functions');
    require('./lib/system/scraper');
});

/* AFK detector */
client.on('presence.update', update => {
    if (!update) return;
    const sock = client.sock;
    const { id, presences } = update;
    if (id.endsWith('g.us')) {
        for (let jid in presences) {
            if (!presences[jid] || jid == sock.decodeJid(sock.user.id)) continue;
            const user = global.db.users.find(v => v.jid == jid);
            if ((presences[jid].lastKnownPresence === 'composing' || presences[jid].lastKnownPresence === 'recording') && user && user.afk > -1) {
                sock.reply(id, `System detects activity from @${jid.replace(/@.+/, '')} after being offline for : ${Func.texted('bold', Func.toTime(new Date - user.afk))}\n\n➠ ${Func.texted('bold', 'Reason')} : ${user.afkReason ? user.afkReason : '-'}`, user.afkObj);
                user.afk = -1;
                user.afkReason = '';
                user.afkObj = {};
            }
        }
    }
});

/* Handle group member addition */
client.on('group.add', async ctx => {
    const sock = client.sock;
    const text = `Thanks +tag for joining into +grup group.`;
    await Func.delay(1500);
    const groupSet = global.db.groups.find(v => v.jid == ctx.jid);
    let pic;

    try {
        pic = await Func.fetchBuffer(await sock.profilePictureUrl(ctx.member, 'image'));
    } catch {
        pic = await Func.fetchBuffer(await sock.profilePictureUrl(ctx.jid, 'image'));
    }

    if (groupSet && groupSet.localonly) {
        if (global.db.users.some(v => v.jid == ctx.member) && !global.db.users.find(v => v.jid == ctx.member).whitelist && !ctx.member.startsWith('62') || !ctx.member.startsWith('62')) {
            sock.reply(ctx.jid, Func.texted('bold', `Sorry @${ctx.member.split`@`[0]}, this group is only for indonesian people and you will removed automatically.`));
            sock.updateBlockStatus(ctx.member, 'block');
            await Func.delay(2000).then(() => sock.groupParticipantsUpdate(ctx.jid, [ctx.member], 'remove'));
            return;
        }
    }

    const txt = (groupSet && groupSet.text_welcome ? groupSet.text_welcome : text).replace('+tag', `@${ctx.member.split`@`[0]}`).replace('+grup', `${ctx.subject}`);
    await Func.delay(1500);
    if (groupSet && groupSet.welcome) sock.sendMessageModify(ctx.jid, txt, null, {
        largeThumb: true,
        thumbnail: pic,
        url: global.db.setting.link
    });
});

/* Handle group member removal */
client.on('group.remove', async ctx => {
    const sock = client.sock;
    const text = `Good bye +tag :)`;
    await Func.delay(1500);
    const groupSet = global.db.groups.find(v => v.jid == ctx.jid);
    let pic;

    try {
        pic = await Func.fetchBuffer(await sock.profilePictureUrl(ctx.member, 'image'));
    } catch {
        pic = await Func.fetchBuffer(await sock.profilePictureUrl(ctx.jid, 'image'));
    }

    const txt = (groupSet && groupSet.text_left ? groupSet.text_left : text).replace('+tag', `@${ctx.member.split`@`[0]}`).replace('+grup', `${ctx.subject}`);
    await Func.delay(1500);
    if (groupSet && groupSet.left) sock.sendMessageModify(ctx.jid, txt, null, {
        largeThumb: true,
        thumbnail: pic,
        url: global.db.setting.link
    });
});

/* Handle uncaught exceptions */
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Tambahkan langkah-langkah penanganan tambahan di sini jika diperlukan
});


//client.on('caller', ctx => {
//    if (typeof ctx === 'boolean') return;
//    client.sock.updateBlockStatus(ctx.jid, 'block');
//})

// client.on('group.promote', ctx => console.log(ctx))
// client.on('group.demote', ctx => console.log(ctx))
