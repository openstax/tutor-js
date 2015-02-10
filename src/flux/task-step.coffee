_ = require 'underscore'
flux = require 'flux-react'

{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

TaskStepConfig =

  complete: (id) ->
    @edit(id, {is_completed: true})
    @save(id)


extendConfig(TaskConfig, CrudConfig)
{actions, store} = makeSimpleStore(TaskConfig)
module.exports = {TaskActions:actions, TaskStore:store}
