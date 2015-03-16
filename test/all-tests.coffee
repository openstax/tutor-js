{expect} = require 'chai'

require './crud-store.spec'
require './task-store.spec'
require './loadable.spec'

# This should be done **last** because it starts up the whole app
require './router.spec'
