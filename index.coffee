require 'jquery'
require 'bootstrap' # Attach bootstrap to jQuery

api = require './src/api'
api.start()
router = require './src/router'

router.start(document.body)
