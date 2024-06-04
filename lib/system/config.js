const { NeoxrApi } = new(require('@neoxr/wb'))
const Function = new (require('./functions'))
const Func = Function
global.Api = new NeoxrApi(process.env.API_ENDPOINT, process.env.API_KEY)
global.header = `xinzuo chatbot`
global.footer = `© 2024 xinzuo chatbot`
global.timezone = `Asia/Jakarta`
global.evaluate_chars = ['=>', '~>', '<', '>', '$']
global.multiplier = 36
global.cooldown = 3
global.min_reward = 100000
global.max_reward = 500000
global.status = Object.freeze({
   invalid: Func.Styles('Url salah.'),
   wrong: Func.Styles('Format salah.'),
   fail: Func.Styles('Tidak bisa mendapatkan metadata.'),
   error: Func.Styles('Terjadi kesalahan'),
   errorF: Func.Styles('Maaf fitur ini sedang error.'),
   premium: Func.Styles('Fitur hanya bisa di akses pengguna premium.'),
   auth: Func.Styles('Kamu tidak memiliki akses ke fitur ini.'),
   owner: Func.Styles('Fitur hanya bisa di akses owner.'),
   group: Func.Styles('Fitur hanya bisa di akses pada grup.'),
   botAdmin: Func.Styles('Fitur hanya bisa di akses saat bot menjadi admin.'),
   admin: Func.Styles('Fitur hanya bisa di akses admin grup.'),
   private: Func.Styles('Fitur hanya bisa di akses pada pesan pribadi.'),
   gameSystem: Func.Styles('Fitur game sedang di nonaktifkan, hubungi bantuan untuk menanyakan hal ini.'),
   gameInGroup: Func.Styles('Fitur game sedang di nonaktifkan di grup ini oleh admin.'),
   gameLevel: Func.Styles('Limit kamu mencapai batas maximum, tidak bisa memainkan game ini.')
})
