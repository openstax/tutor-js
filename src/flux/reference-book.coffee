{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
_ = require 'underscore'

ReferenceBookConfig = {

  exports:
    getToc: (courseId) ->
      _.first @_get(courseId)

}

extendConfig(ReferenceBookConfig, new CrudConfig())
{actions, store} = makeSimpleStore(ReferenceBookConfig)
module.exports = {ReferenceBookActions:actions, ReferenceBookStore:store}
