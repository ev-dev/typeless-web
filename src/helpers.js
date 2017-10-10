import axios from 'axios'
import getGoogleSuggestions from 'google-suggestions'
// import Suggestion from 'get-suggestions'

export const fetchSuggestions = (query, mode='body') => {
  return axios({
    url: '/generateNextWords',
    method: 'post',
    baseURL: 'https://westus.api.cognitive.microsoft.com/text/weblm/v1.0/',
    headers: {
      'Host': 'westus.api.cognitive.microsoft.com',
      'Ocp-Apim-Subscription-Key': 'e97abab4ef3f4998b293713e9a5287d6'
    },
    params: {
      model: mode,
      words: query
    }
  })
    .then(res => res.data.candidates)
    .then(suggestions => suggestions.map(suggestion => suggestion.word))
    .catch(console.error)
}

// * Best google suggest api version
// export const fetchSuggestions = query => {
//   const crop = query.length - 1
//   return getGoogleSuggestions(query)
//   .then(rawSuggestions => {
//       if (rawSuggestions.length) {
//         return rawSuggestions.map(suggestion =>
//           suggestion.slice(crop)).slice(0, 6)
//       } else {
//         console.log(`No suggestions found for ${query}...`)
//       }
//     })
//     .catch(console.error)
//   }
  

export const makeSuggestionRequest = query => {
  const crop = query.length
  
  return axios.post('/api/suggest', { query })
    .then(res => res.data)
    .then(rawSuggestions => {
      if (rawSuggestions.length) {
        return rawSuggestions.map(suggestion =>
          suggestion.slice(crop))
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

// export const fetchSuggestions = query => {
//   const crop = query.length
//   let newQuery = new Suggestion(query)
//   return newQuery.get()
//     .then(suggestions => {
//       console.log('suggestions', suggestions)
//       return suggestions
//     })
//     .catch(err => console.error(err))
// }