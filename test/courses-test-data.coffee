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

MASTER_COURSES_LIST = [
  STUDENT_COURSE_ONE_MODEL
  TEACHER_COURSE_TWO_MODEL
  TEACHER_AND_STUDENT_COURSE_THREE_MODEL
]

module.exports = {
  STUDENT_COURSE_ONE_MODEL,
  TEACHER_COURSE_TWO_MODEL
  TEACHER_AND_STUDENT_COURSE_THREE_MODEL,
  MASTER_COURSES_LIST
}
