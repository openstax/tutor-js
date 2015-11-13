settings =

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

    'user.send.statusUpdate':
      url: 'auth/status'
      method: 'GET'
      useCredentials: true
      completedEvent: 'user.receive.statusUpdate'

    'courseDashboard.*.send.fetch':
      url: 'api/courses/{id}/cc/dashboard'
      method: 'GET'
      baseUrl: process?.env?.BASE_URL
      completedEvent: 'courseDashboard.{id}.receive.fetch'

    'course.*.send.registration':
      url: 'api/enrollment_changes'
      method: 'POST'
      useCredentials: true
      failedEvent: 'course.{book_uuid}.receive.registration.failure'
      completedEvent: 'course.{book_uuid}.receive.registration.complete'

    'course.*.send.confirmation':
      url: 'api/enrollment_changes/{id}/approve'
      method: 'PUT'
      useCredentials: true
      failedEvent: 'course.{id}.receive.confirmation.failure'
      completedEvent: 'course.{id}.receive.confirmation.complete'

module.exports = settings
