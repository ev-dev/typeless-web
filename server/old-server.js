const path = require('path')
const { promisify } = require('util')
const express = require('express')
const bodyParser = require('body-parser')
// const suggest = promisify(require('suggestion'))
// const suggest = promisify(require('node-google-suggest'))
const suggest = require('google-suggestions')
const axios = require('axios')


const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(require('volleyball'))

app.get('/bundle.js', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'bundle.js'))
})

app.use((req, res, next) => {
  if (path.extname(req.path).length > 0) res.status(404).end()
  else next(null)
})


app.post('/api/suggest', (req, res, next) => {
  suggest(req.body.query)
    .then(data => data.map(suggestion =>
      suggestion.replace(/<\/b>/, '')
    ))
    .then(suggestions => {
      console.log('\nsuggestion results: ')
      console.log(suggestions)
      res.json(suggestions)
    })
    .catch(next)
})

app.get('/api/azure/body/:query', (req, res, next) => {
  axios({
    url: '/generateNextWords',
    method: 'post',
    baseURL: 'https://westus.api.cognitive.microsoft.com/text/weblm/v1.0/',
    headers: {
      'Host': 'westus.api.cognitive.microsoft.com',
      'Ocp-Apim-Subscription-Key': 'e97abab4ef3f4998b293713e9a5287d6'
    },
    params: {
      model: 'body',
      words: req.params.query
    }
  })
  .then(res => res.data)
  .then(suggestions => res.json(suggestions))
  .catch(console.error)
})

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'))
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
