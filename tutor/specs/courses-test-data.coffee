{ default: CoursesMap } = require '../src/models/courses-map'
moment = require 'moment'

STUDENT_COURSE_ONE_MODEL = {
  id: '1'
  name: 'Local Test Course One'
  book_id: '123'
  appearance_code: 'testing'
  offering_id: '1'
  is_active: true
  is_concept_coach: false
  year: 2017
  term: 'Spring'
  starts_at: moment().subtract(1, 'month').format(),
  ends_at: moment().add(1, 'month').format(),
  webview_url: 'http://cnx.org/',
  salesforce_book_name: 'a book title',
  roles: [
    {
      "id": "1",
      "type": "student"
    }
  ],
  students: [
    { role_id: "1", student_identifier: '1234' }
  ]

}

TEACHER_COURSE_TWO_MODEL = {
  id: '2'
  name: 'Local Test Course Two'
  book_id: '123'
  appearance_code: 'testing'
  offering_id: '1'
  is_active: true
  is_concept_coach: false
  year: 2017
  term: 'Spring'
  starts_at: moment().subtract(1, 'month').format(),
  ends_at: moment().add(1, 'month').format(),
  webview_url: 'http://cnx.org/',
  salesforce_book_name: 'a book title',
  periods: [{
    id: "1", name : "1st", enrollment_url: "http://test/period/1", default_open_time: "07:01",
    default_due_time: "12:00", is_archived: false
  }]
  roles: [
    {
      "type": "teacher"
    }
  ]
}

TEACHER_AND_STUDENT_COURSE_THREE_MODEL = {
  id: '3'
  book_id: '123'
  name:'Local Test Course Three'
  appearance_code: 'testing'
  offering_id: '1'
  is_active: true
  is_concept_coach: false
  year: 2017
  term: 'Spring'
  starts_at: moment().subtract(1, 'month').format(),
  ends_at: moment().add(1, 'month').format(),
  roles: [
    {
      type: 'student'
    }
    {
      type: 'teacher'
    }
  ]
}

STUDENT_ARCHIVED_COURSE = {
  id: '4'
  book_id: '123'
  name:'Local Test Course Three'
  appearance_code: 'testing'
  offering_id: '1'
  is_active: false
  is_concept_coach: false
  year: 2016
  term: 'Spring'
  starts_at: moment().subtract(1, 'month').format(),
  ends_at: moment().add(1, 'month').format(),
  webview_url: 'http://cnx.org/',
  salesforce_book_name: 'a book title',
  roles: []
}

TEACHER_PAST_COURSE = {
  id: '5'
  book_id: '123'
  name:'Local Test Course Three'
  appearance_code: 'testing'
  offering_id: '1'
  is_active: false
  is_concept_coach: false
  year: 2016
  term: 'Spring'
  starts_at: moment().subtract(6, 'month').format(),
  ends_at: moment().subtract(1, 'month').format(),
  webview_url: 'http://cnx.org/',
  salesforce_book_name: 'a book title',
  roles: [
    {
      type: 'teacher'
    }
  ]
}

STUDENT_PAST_COURSE = {
  id: '6'
  book_id: '123'
  name:'Local Test Course Three'
  appearance_code: 'testing'
  offering_id: '1'
  is_active: false
  is_concept_coach: false
  year: 2016
  term: 'Spring'
  starts_at: moment().subtract(6, 'month').format(),
  ends_at: moment().subtract(1, 'month').format(),
  webview_url: 'http://cnx.org/',
  salesforce_book_name: 'a book title',
  roles: [
    {
      type: 'teacher'
    }
  ]
}

MASTER_COURSES_LIST = [
  STUDENT_COURSE_ONE_MODEL
  TEACHER_COURSE_TWO_MODEL
  TEACHER_AND_STUDENT_COURSE_THREE_MODEL
]

TUTOR_HELP = 'http://openstax.force.com/support?l=en_US&c=Products%3ATutor'
CONCEPT_COACH_HELP = 'http://openstax.force.com/support?l=en_US&c=Products%3AConcept_Coach'

bootstrapCoursesList = ->
  CoursesMap.bootstrap(MASTER_COURSES_LIST)

module.exports = {
  STUDENT_COURSE_ONE_MODEL,
  TEACHER_COURSE_TWO_MODEL,
  STUDENT_ARCHIVED_COURSE,
  TEACHER_AND_STUDENT_COURSE_THREE_MODEL,
  MASTER_COURSES_LIST,
  TUTOR_HELP,
  CONCEPT_COACH_HELP,
  TEACHER_PAST_COURSE,
  STUDENT_PAST_COURSE,
  bootstrapCoursesList,
}
