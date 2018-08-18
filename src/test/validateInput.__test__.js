const assert = require('assert')
const InputConfig = require('../InputConfig')
const validateInput = require('../validateInput')


describe('validateInput', () => {

  it('accepts correct input', (done) => {
    validateInput(InputConfig, '--posts 10')
    done()
  })

  it('throws for missing posts number', (done) => {
    assert.throws(validateInput.bind(null, InputConfig, '--posts'))
    done()
  })

  it('throws for incorrect flag', (done) => {
    assert.throws(validateInput.bind(null, InputConfig, '-posts'))
    done()
  })

})
