{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
_ = require 'underscore'

# Unlike other stores defined in TutorJS, this contains three separate stores that have very similar capabilities.
# They're combined in one file because they're pretty lightweight and share helper methods.
# If and when any of them grow larger they could be broken out into separate files that are required and re-exported here

# Common helper method to find all the sections contained in a learning guide response
findAllSections = (section) ->
  sections = []
  if section.chapter_section?.length > 1
    sections.push(section)
  if section.children
    for child in section.children
      for section in findAllSections(child)
        sections.push(section)
  sections



# learning guide data for a teacher.
# It's loaded by the teacher and contains consolidated data for all the students in the course
Teacher = makeSimpleStore extendConfig {
  exports:
    getChaptersForPeriod: (courseId, periodId) ->
      period = _.findWhere(@_get(courseId), period_id: periodId)
      period?.children or []

    getSectionsForPeriod: (courseId, periodId) ->
      period = _.findWhere(@_get(courseId), period_id: periodId)
      findAllSections(period)

}, new CrudConfig

# Common store methods for students
CommonStudentConfig = {
  exports:
    getAllSections: (courseId) ->
      findAllSections(@_get(courseId))

    getSortedSections: (courseId, property = 'current_level') ->
      sections = findAllSections(@_get(courseId))
      _.sortBy(sections, property)
}

# learning guide data for a student.  It's loaded by the student and contains only their data
Student = makeSimpleStore(extendConfig(_.clone(CommonStudentConfig), new CrudConfig))

# learning guide data for a teacher's student.
# It's loaded by the teacher and contains data for an individual student in a course they're teaching
TeacherStudent = makeSimpleStore(extendConfig(_.clone(CommonStudentConfig), new CrudConfig))

module.exports = {Student, Teacher, TeacherStudent}
