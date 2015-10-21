{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
_ = require 'underscore'

PeriodConfig = {

  create: (courseId, params) ->

  created: (period, courseId) ->
    @emitChange()


}

extendConfig(PeriodConfig, new CrudConfig())
{actions, store} = makeSimpleStore(PeriodConfig)
module.exports = {PeriodActions:actions, PeriodStore:store}
