const { AZURE_KEY } = require('../api_keys')
const path = require('path')
const chalk = require('chalk')
const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const googleSuggest = require('google-suggestions')

// const { promisify } = require('util')
// const suggestion = promisify(require('suggestion'))
// const nodeGoogleSuggest = promisify(require('node-google-suggest'))


const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(require('volleyball'))

// Google suggestion API
app.get('/api/suggest/:query', (req, res, next) => {
  googleSuggest(req.body.query)
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

/* Azure Web Language API
  Query Params:
    ?type=[suggest, correct]
    ?model=[body, anchor, query, title]
    ?q=[custom query]     
*/
app.get('/api/azure', (req, res, next) => {
  const { type, model, q } = req.query
  
  let azureUrl
  if (type === 'suggest') azureUrl = 'generateNextWords'
  else if (type === 'correct') azureUrl = 'breakIntoWords'
  else next(null)

  if (model !== 'body' || model !== 'anchor' || model !== 'title' || model !== 'query') next(null)

  // @ts-ignore
  axios({
    url: `/${azureUrl}`,
    method: 'post',
    baseURL: 'https://westus.api.cognitive.microsoft.com/text/weblm/v1.0/',
    headers: {
      'Host': 'westus.api.cognitive.microsoft.com',
      'Ocp-Apim-Subscription-Key': AZURE_KEY
    },
    params: {
      model: req.query.model,
      words: req.query.q
    }
  })
  .then(res => res.data)
  .then(suggestions => res.json(suggestions))
  .catch(console.error)
})

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

app.use((err, req, res, next) => {
  console.error(err, typeof next)
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal Server Error.')
})

const PORT = 8002
app.listen(PORT, () => {
  const name = chalk.red.bold('[TypeLess Server]')
  const url = chalk.cyan.bold(`http://localhost:`)
  const listen = chalk.yellow.bold('Listening')
  
  console.log(`
  ${name} - ${listen} - ${url}${chalk.yellow(PORT)}
  `)
})
