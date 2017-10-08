import axios from 'axios'

export const makeSuggestionRequest = query => {
  const crop = query.length // + 1
  
  return axios.post('/suggestions', { query })
    .then(res => res.data)
    .then(rawSuggestions => {
      if (rawSuggestions.length) {
        return rawSuggestions.map(suggestion =>
          suggestion.slice(crop)).slice(0, 6)
      } else {
        console.log('no suggestions...')
      }
    })
    .catch(err => {
      if (err.response) {
        console.error(err.response.data)
        console.error(err.response.status)
        console.error(err.response.headers)
      } else if (err.request) {
        console.error(err.request)
      } else {
        console.error('Unknown Error... ', err.message)
      }
      console.error(err.config)
    })
}