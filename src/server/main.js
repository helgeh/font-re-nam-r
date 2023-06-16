
import express from 'express'
import ViteExpress from 'vite-express'

import api from './api.js'

const port = process.env.PORT || 3003

const app = express()

app.use(api)

app.get("/hello", (req, res) => {
  res.send("Hello Vite + Vue!")
})

app.use((err, req, res, next) => {
  if (req.xhr)
    res.status(500).send({error: 'Something feila'})
  else
    next(err)
})

ViteExpress.config({ inlineViteConfig: 'vite.config.js' })

ViteExpress.listen(app, port, () =>
  console.log(`Server is listening on port ${port}...`)
)
