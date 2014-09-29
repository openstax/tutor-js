{Collection, Model} = require './loadable'

class Tasks extends Collection
  url: -> '/api/user/tasks'

module.exports =
  Tasks: new Tasks()
