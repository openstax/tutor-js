{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{CourseActions} = require './course'
_ = require 'lodash'

StudentIdConfig = {

  _loaded: (studentData, courseId) ->
    course = _.find(studentData.courses, {id: courseId})
    student = _.first(course.students)
    @_local[courseId] = student

  update: (courseId, newStudentId) ->
    if (newStudentId)
      @save(courseId, {
        student_identifier: newStudentId,
        id: courseId,
      })
    else
      @_errors.push(code: 'blank_student_identifer')

  _failed: (error, id) ->
    @_errors[id] = error?.data?.errors

  addError: (id, error) ->
    @_errors[id] = [error]

  _saved: (student, courseId) ->
    @_local[student.id] = student
    @emit('student-id-saved')
    @emitChange()

  exports:
    getId: (courseId) -> @_local[courseId]?.student_identifier
    getErrors: (courseId) -> @_errors[courseId] or []
}

extendConfig(StudentIdConfig, new CrudConfig())
{actions, store} = makeSimpleStore(StudentIdConfig)
module.exports = {StudentIdActions:actions, StudentIdStore:store}
