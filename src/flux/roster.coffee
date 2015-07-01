{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
_ = require 'underscore'

RosterConfig = {
  exports:

    getStudentsForPeriod: (courseId, periodId) ->
      _.where(@_get(courseId), period_id: periodId)

}

extendConfig(RosterConfig, new CrudConfig())
{actions, store} = makeSimpleStore(RosterConfig)
module.exports = {RosterActions:actions, RosterStore:store}
