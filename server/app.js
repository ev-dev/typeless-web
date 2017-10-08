const path = require('path')
const { promisify } = require('util')
const express = require('express')
const bodyParser = require('body-parser')
const suggest = promisify(require('suggestion'))

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(require('volleyball'))

app.get('/bundle.js', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'bundle.js'))
})

app.use((req, res, next) => {
  if (path.extname(req.path).length > 0) res.status(404).end()
  else next(null)
})

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

app.post('/suggestions', (req, res, next) => {
  suggest(req.body.query)
    .then(suggestions => {
      console.log('\nsuggestion results: ')
      console.log(suggestions)
      res.json(suggestions)
    })
    .catch(next)
})

app.use((err, req, res, next) => {
  console.error(err, typeof next)
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal Server Error.')
})

const PORT = 3332
app.listen(PORT, () => console.log(`
Listening on Port ${PORT}...
`))
