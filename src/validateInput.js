'use strict'

const minimist = require('minimist')
const Joi = require('joi')

/**
 *
 * @param {InputConfig} inputConfig
 * @param {string[]} argv
 */
function validateInput(inputConfig, argv) {

  let argvObj
  if (typeof argv === 'string') {
    argvObj = minimist(argv.split(' '))
  } else if (Array.isArray(argv)) {
    argvObj = minimist(process.argv.slice(2))
  } else {
    throw new Error('argv incorrect')
  }

  Object.keys(inputConfig).forEach(key => {
    inputConfig[key].value = inputConfig[key].onRead(argvObj[key])
    Joi.validate(inputConfig[key].value, inputConfig[key].validationSchema,
      (err, value) => {
        if (err) {
          throw new Error('Incorrect input: ' + err.details[0].message)
        }
      }
    )
  })
}

module.exports = validateInput