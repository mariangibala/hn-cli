'use strict'

const Joi = require('joi')

/**
 * @typedef {Object} InputArgument
 * @property {string} flag
 * @property {function} onRead callback to cast initial value
 * @property {Object} validationSchema for Joi
 */

/**
 * Configuration for accepted arguments
 * @typedef {Object} InputConfig
 * @param {Object.<string>} InputArgument
 */
const InputConfig = {

  posts: {
    flag: '--posts',
    onRead: (val) => {
      return parseInt(val)
    },
    validationSchema: Joi.number()
      .integer().positive().max(100).required().label('--posts')
  }
}

module.exports = InputConfig