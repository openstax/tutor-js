{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
_ = require 'underscore'

ReferenceBookConfig = {

  exports:
    getToc: (courseId) ->
      @_get(courseId)['0']

}

extendConfig(ReferenceBookConfig, new CrudConfig())
{actions, store} = makeSimpleStore(ReferenceBookConfig)
module.exports = {ReferenceBookActions:actions, ReferenceBookStore:store}
