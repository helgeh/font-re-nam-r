
import express from 'express'
import ViteExpress from 'vite-express'

import api from './api.js'

const port = process.env.PORT || 3003

const app = express()

app.use(api)

app.get("/hello", (req, res) => {
  res.send("Hello Vite + Vue!")
})


ViteExpress.listen(app, port, () =>
  console.log(`Server is listening on port ${port}...`)
)
