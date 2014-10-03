Components = require '../src/components'

{expect} = require 'chai'

it 'should be simple', ->
  expect(1).to.be.ok



# This should be done **last** because it starts up the whole app
require './router.spec'
