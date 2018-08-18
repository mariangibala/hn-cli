'use strict'

const fetch = require('node-fetch')
const Joi = require('joi')
const InputConfig = require('./InputConfig')
const validateInput = require('./validateInput')

/**
 * API config
 */
const API = {
  url: 'https://hacker-news.firebaseio.com/v0/',
  endpoints: {
    topStores: 'topstories.json',
    item: 'item/'
  }
}

/**
 * Wrapper for fetch to do request and parse response
 * @param {string} url
 * @returns {Promise<*>}
 */
const request = async (url) => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  return await response.json()
}

/**
 * Joi validation schema for post
 */
const postValidationSchema = Joi.object({
  url: Joi.string().uri().required(),
  title: Joi.string().min(1).max(256).required(),
  by: Joi.string().min(1).max(256).required(),
  score: Joi.number().integer().min(0).required(),
  kids: Joi.array(),
}).unknown(true)


async function main() {

  validateInput(InputConfig, process.argv)

  // Join API URI with endpoints
  Object.keys(API.endpoints)
    .forEach(key => API.endpoints[key] = API.url + API.endpoints[key])


  // Grab top stores id list ([<string>,...])
  let topStoresList = await request(API.endpoints.topStores)

  const posts = []

  for (let x = 0; x < topStoresList.length; x++) {
    let postId = topStoresList[x]
    let post = await request(API.endpoints.item + postId + '.json')

    Joi.validate(post, postValidationSchema, (err, value) => {
      if (err) {
        // If post doesn't meet our requirements just ignore it
        // and proceed to the next one
        return
      }

      posts.push(value)

    })

    if (posts.length === InputConfig.posts.value) {
      break
    }

  }

  // Format output to the required schema
  const finalResult = posts.map((el, index) => {
    return {
      title: el.title,
      uri: el.url,
      author: el.by,
      points: el.score,
      comments: el.kids ? el.kids.length : 0,
      rank: index
    }
  })

  console.log(finalResult)

}

main().then(() => process.exit()).catch(err => {
  console.error(err.message)
})

