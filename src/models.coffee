{Collection, Model} = require './loadable'

class Tasks extends Collection
  url: -> '/api/users/tasks' # TODO: Depluralize this route

module.exports =
  Tasks: new Tasks()
