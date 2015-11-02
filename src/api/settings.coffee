settings =
  # to customize, set environmental var BASE_URL when building or running webpack-dev-server
  # Currently is set on an endpoint by endpoint basis until all are implemented by BE
  # baseUrl: process?.env?.BASE_URL

  endpoints:
    'exercise.*.send.save':
      url: 'api/steps/{id}'
      method: 'PATCH'
      completedEvent: 'exercise.{id}.receive.save'

    'exercise.*.send.complete':
      url: 'api/steps/{id}/completed'
      method: 'PUT'
      completedEvent: 'exercise.{id}.receive.complete'

    'exercise.*.send.fetch':
      url: 'api/steps/{id}'
      method: 'GET'
      completedEvent: 'exercise.{id}.receive.fetch'

    'task.*.send.fetch':
      url: 'api/tasks/{id}'
      method: 'GET'
      completedEvent: 'task.{id}.receive.fetch'

    'task.*.send.fetchByModule':
      url: 'api/cc/tasks/{collectionUUID}/{moduleUUID}'
      method: 'GET'
      baseUrl: process?.env?.BASE_URL
      completedEvent: 'task.{collectionUUID}/{moduleUUID}.receive.fetchByModule'

module.exports = settings
