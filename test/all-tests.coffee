{expect} = require 'chai'

require './task-store.spec'

# This should be done **last** because it starts up the whole app
require './router.spec'
