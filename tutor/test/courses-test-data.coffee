STUDENT_COURSE_ONE_MODEL = {
  id: 1
  name: 'Local Test Course One'
  book_id: '123'
  roles: [
    {
      "type": "student"
    }
  ]
}

TEACHER_COURSE_TWO_MODEL = {
  id: 2
  name: 'Local Test Course Two'
  book_id: '123'
  roles: [
    {
      "type": "teacher"
    }
  ]
}

TEACHER_AND_STUDENT_COURSE_THREE_MODEL = {
  id: 3
  book_id: '123'
  name:'Local Test Course Three'
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
  id: 4
  book_id: '123'
  name:'Local Test Course Three'
  roles: []
}

MASTER_COURSES_LIST = [
  STUDENT_COURSE_ONE_MODEL
  TEACHER_COURSE_TWO_MODEL
  TEACHER_AND_STUDENT_COURSE_THREE_MODEL
]

TUTOR_HELP = 'http://openstax.force.com/support?l=en_US&c=Products%3ATutor'
CONCEPT_COACH_HELP = 'http://openstax.force.com/support?l=en_US&c=Products%3AConcept_Coach'

module.exports = {
  STUDENT_COURSE_ONE_MODEL,
  TEACHER_COURSE_TWO_MODEL,
  STUDENT_ARCHIVED_COURSE,
  TEACHER_AND_STUDENT_COURSE_THREE_MODEL,
  MASTER_COURSES_LIST,
  TUTOR_HELP,
  CONCEPT_COACH_HELP
}
