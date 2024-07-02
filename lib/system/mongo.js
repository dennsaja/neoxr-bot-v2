const { MongoClient } = require('mongodb')

module.exports = class MongoDB {
   constructor(db, collection, options = {
      useNewUrlParser: true,
      useUnifiedTopology: true
   }) {
      this._id = 1
      this.db = db || 'data'
      this.options = options
      this.init()
   }

   client = new MongoClient('mongodb+srv://xinzuo:pw@cluster0.mkkspou.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', this.options)

   exec = async (collect) => {
      try {
         await this.client.connect()
         const db = await this.client.db(this.db).collection(collect)
         return db
      } catch (e) {
         console.log(`System restarted because your mongodb connection error . . .`)
         process.exit(1)
      }
   }

   fetch = async () => {
      try {
         const json = await (await this.exec('database')).findOne({
            _id: this._id
         })
         if (!json) {
            await (await this.exec('database')).insertMany([{
               _id: this._id,
               data: {}
            }])
            return ({})
         } else {
            return json.data
         }
      } catch (e) {
         console.log(`System restarted because your mongodb connection error . . .`)
         process.exit(1)
      }
   }

   save = async data => {
      try {
         const json = await (await this.exec('database')).findOne({
            _id: this._id
         })
         const is_data = data ? data : global.db ? global.db : {}
         if (!json) {
            await (await this.exec('database')).insertMany([{
               _id: this._id,
               data: is_data
            }])
         } else {
            const res = await (await this.exec('database')).updateOne({
               _id: this._id
            }, {
               '$set': {
                  data: is_data
               }
            })
         }
      } catch (e) {
         console.log(`System restarted because your mongodb connection error . . .`)
         process.exit(1)
      }
   }

   init = async () => {
      await this.client.connect()
      const db = await this.client.db(this.db)
      const data = await (await db.listCollections().toArray()).some(v => v.name == 'data')
      if (!data) db.createCollection('data')
   }
}