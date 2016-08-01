{expect} = require 'chai'
_ = require 'underscore'

Helper = require '../../src/helpers/api'

describe 'ApiHelpers', ->

  it 'encodes query parameters', ->
    expect( Helper.toParams({foo: 'bar', baz: 42, q:[1, 2, 3]})).to.equal('foo=bar&baz=42&q%5B%5D=1&q%5B%5D=2&q%5B%5D=3')
