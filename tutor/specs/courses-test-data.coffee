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
  is_college: true,
  does_cost: true,
  year: 2017
  term: 'spring'
  starts_at: moment().subtract(1, 'month').format(),
  ends_at: moment().add(1, 'month').format(),
  webview_url: 'http://cnx.org/',
  salesforce_book_name: 'a book title',
  roles: [{
    id: "1",
    type: "student",
    joined_at: moment().subtract(1, 'week').format()
  }],
  students: [
    {
       role_id: "1", student_identifier: '1234', uuid: "06fc16fc-70f5-4db1-a61d-b0f496cf3cd4"
       is_paid: false, is_comped: false, is_active: true, first_name: 'Test', last_name: 'Tester',
    }
  ]

}

TEACHER_COURSE_TWO_MODEL = {
  id: '2'
  homework_score_weight: 80
  homework_progress_weight: 15
  reading_score_weight: 5
  reading_progress_weight: 0
  name: 'Local Test Course Two'
  book_id: '123'
  appearance_code: 'testing'
  offering_id: '1'
  is_active: true
  is_concept_coach: false
  year: 2017
  term: 'spring'
  starts_at: moment().subtract(1, 'month').format(),
  ends_at: moment().add(1, 'month').format(),
  webview_url: 'http://cnx.org/',
  salesforce_book_name: 'a book title',
  periods: [{
    id: "1", name : "1st", num_enrolled_students: 12, enrollment_url: "http://test/period/1", default_open_time: "07:01",
    default_due_time: "12:00", is_archived: false
  }]
  roles: [{
    id: "1",
    type: "teacher",
    joined_at: moment().subtract(2, 'week').format()
  }]
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
  term: 'spring'
  starts_at: moment().subtract(1, 'month').format(),
  ends_at: moment().add(1, 'month').format(),
  roles: [{
    id: "1",
    type: "student",
    joined_at: moment().subtract(1, 'week').format()
  }, {
    id: "2",
    type: "teacher",
    joined_at: moment().subtract(1, 'week').format()
  }]
  students: [
    {
       role_id: "1", student_identifier: '1234', uuid: "06fc16fc-70f5-4db1-a61d-b0f496cf3cd4"
       is_paid: false, is_comped: false, is_active: true, first_name: 'Test', last_name: 'Tester',
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
  term: 'spring'
  starts_at: moment().subtract(1, 'month').format(),
  ends_at: moment().add(1, 'month').format(),
  webview_url: 'http://cnx.org/',
  salesforce_book_name: 'a book title',
  roles: [{
    id: "1",
    type: "student",
    joined_at: moment().subtract(1, 'week').format()
  }]
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
  term: 'spring'
  starts_at: moment().subtract(6, 'month').format(),
  ends_at: moment().subtract(1, 'month').format(),
  webview_url: 'http://cnx.org/',
  salesforce_book_name: 'a book title',
  roles: [{
    id: "1",
    type: "teacher",
    joined_at: moment().subtract(1, 'week').format()
  }]
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
  term: 'spring'
  starts_at: moment().subtract(6, 'month').format(),
  ends_at: moment().subtract(1, 'month').format(),
  webview_url: 'http://cnx.org/',
  salesforce_book_name: 'a book title',
  roles: [{
    id: "1",
    type: "student",
    joined_at: moment().subtract(1, 'week').format()
  }]
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
