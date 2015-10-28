settings =
  # # set/comment in to use actual BE
  # baseUrl: 'http://localhost:3001'

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
      completedEvent: 'task.{collectionUUID}/{moduleUUID}.receive.fetchByModule'

module.exports = settings
