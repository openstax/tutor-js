api =

  endpoints:
    'exercise.*.savefreeResponse':
      url: 'api/steps/{id}'
      method: 'PATCH'
      completedEvent: 'exercise.{id}.savefreeResponse.done'

    'exercise.*.saveAnswer':
      url: 'api/steps/{id}'
      method: 'PATCH'
      completedEvent: 'exercise.{id}.saveAnswer.done'

    'exercise.*.complete':
      url: 'api/steps/{id}/completed'
      method: 'PUT'
      completedEvent: 'exercise.{id}.complete.done'

    'exercise.*.fetch':
      url: 'api/steps/{id}'
      method: 'GET'
      completedEvent: 'exercise.{id}.fetch.done'

    'task.*.fetch':
      url: 'api/cc/tasks/{collectionUUID}/{moduleUUID}'
      method: 'GET'
      completedEvent: 'task.{collectionUUID}.{moduleUUID}.fetch.done'

module.exports = {api}
