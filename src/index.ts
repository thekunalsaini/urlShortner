import express from 'express'
import mongoose from 'mongoose'
import * as bodyParser from 'body-parser'
import * as routes from './routes/index'
import * as dotenv from 'dotenv'
import morgan from 'morgan'
import helmet from 'helmet'
require('./model/link')

// env variables
dotenv.config()
const user = process.env.DB_USER
const pass = process.env.DB_PASS
const endpoint = process.env.DB_ENDPOINT

// initialise connection to DB
const uri = endpoint
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)
mongoose.set('useNewUrlParser', true)
if (uri) {
  mongoose.connect(uri)
}
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', _ => console.log('Database connected:', uri))

// initialise app
const app = express()
app.use(helmet())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api/*', bodyParser.json())
app.use(morgan('combined'))
app.set('port', process.env.PORT || 3000)

routes.routes(app)

app.listen(app.get('port'), () => {
  console.log('App is running at %d', app.get('port'))
}
)
