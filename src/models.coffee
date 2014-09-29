{Collection, Model} = require './loadable'

class Tasks extends Collection
  url: -> '/api/tasks'

module.exports =
  Tasks: new Tasks()
