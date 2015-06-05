STUDENT_COURSE_ONE_MODEL = {
  id: 1
  name: 'Local Test Course One'
  roles: [
    {
      "type": "student"
    }
  ]
}

TEACHER_COURSE_TWO_MODEL = {
  id: 2
  name: 'Local Test Course Two'
  roles: [
    {
      "type": "teacher"
    }
  ]
}

TEACHER_AND_STUDENT_COURSE_THREE_MODEL = {
  id: 3
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
