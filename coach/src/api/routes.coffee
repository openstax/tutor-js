keys = require 'lodash/keys'

handledCourseErrorsMap = require '../course/handled-errors'
handledCourseErrors = keys(handledCourseErrorsMap)

routes = [{
    subject: 'exercise'
    action: 'save'
    method: 'PATCH'
    pattern: 'api/steps/{id}'
  }, {
    subject: 'exercise'
    action: 'complete'
    method: 'PUT'
    pattern: 'api/steps/{id}/completed'
  }, {
    subject: 'exercise'
    action: 'fetch'
    method: 'GET'
    pattern: 'api/steps/{id}'
  }, {
    subject: 'task'
    action: 'fetch'
    method: 'GET'
    pattern: 'api/tasks/{id}'
  }, {
    subject: 'task'
    action: 'fetchByModule'
    method: 'GET'
    pattern: 'api/cc/tasks/{collectionUUID}/{moduleUUID}'
    handledErrors: ['page_has_no_exercises', 'course_ended']
  }, {
    subject: 'user'
    topic: 'status'
    action: 'fetch'
    method: 'GET'
    pattern: 'auth/status'
    withCredentials: true
  }, {
    subject: 'courseDashboard'
    action: 'fetch'
    method: 'GET'
    pattern: 'api/courses/{id}/cc/dashboard'
  }, {
    subject: 'course'
    action: 'prevalidation'
    method: 'POST'
    pattern: 'api/enrollment_changes/prevalidate'
    handledErrors: handledCourseErrors
  }, {
    subject: 'course'
    action: 'registration'
    method: 'POST'
    pattern: 'api/enrollment_changes'
    handledErrors: handledCourseErrors
  }, {
    subject: 'course'
    action: 'confirmation'
    method: 'PUT'
    pattern: 'api/enrollment_changes/{id}/approve'
    handledErrors: handledCourseErrors
  }, {
    subject: 'course'
    action: 'studentUpdate'
    method: 'PATCH'
    pattern: 'api/user/courses/{id}/student'
    handledErrors: handledCourseErrors
}]

module.exports = routes
