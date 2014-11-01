Components = require '../src/components'

{expect} = require 'chai'

require './components'
require './answer-store.spec'
require './task-store.spec'

# This should be done **last** because it starts up the whole app
require './router.spec'
