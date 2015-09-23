freeResponse =
  name: 'free-response'
  optional: 'checkQuestionFormat'
  passCheck: ['free_response']
  actions: [
    'fillFreeResponse'
    'saveFreeResponse'
  ]

multipleChoice =
  name: 'multiple-choice'
  optional: 'checkQuestionFormat'
  passCheck: ['answer_id', 'is_completed']
  actions: [
    'pickMultipleChoice'
    'saveMultipleChoice'
  ]

review =
  name: 'review'
  canReview: true
  canWrite: true
  actions: [
    'clickContinue'
  ]

teacherReadOnly =
  name: 'teacher-read-only'
  canWrite: false
  actions: [
    'clickContinue'
  ]

teacherReview =
  name: 'teacher-read-only'
  canReview: true
  canWrite: false
  actions: [
    'clickContinue'
  ]

view =
  name: 'view'
  canReview: true
  actions: [
    'clickContinue'
  ]

stepNoFeedback = [
  freeResponse
  multipleChoice
]

stepFeedbackImmediate = [
  freeResponse
  multipleChoice
  review
]

stepViewOnly = [
  view
]

stepTeacherReview = [
  teacherReview
]

stepTeacherReadOnly = [
  teacherReadOnly
]

# Policy Shape
#
#   #{taskType}:
#     #{stepType}:
#       #{for}:
#         default: #{info}
#         check: #{stateType}
#         states:
#           #{state}: #{info}

defaultPolicies =
  exercise:
    panels:
      default: stepFeedbackImmediate
      check: 'role'
      states:
        teacher: stepTeacherReview
  reading:
    panels:
      default: stepViewOnly
      check: 'role'
      states:
        teacher: stepTeacherReview
  video:
    panels:
      default: stepViewOnly
      check: 'role'
      states:
        teacher: stepTeacherReview
  interactive:
    panels:
      default: stepViewOnly
      check: 'role'
      states:
        teacher: stepTeacherReview
  placeholder:
    panels:
      default: stepViewOnly
      check: 'role'
      states:
        teacher: stepTeacherReview

policies =

  homework:
    exercise:
      panels:
        default:
          check: 'dueState'
          states:
            before: stepNoFeedback
            after: stepFeedbackImmediate
        check: 'role'
        states:
          teacher:
            check: 'dueState'
            states:
              before: stepTeacherReadOnly
              after: stepTeacherReview
    placeholder:
      panels:
        default: stepViewOnly
        check: 'role'
        states:
          teacher: stepTeacherReview

  practice:
    exercise:
      panels:
        default: stepFeedbackImmediate
        check: 'role'
        states:
          teacher: stepTeacherReview

  chapter_practice:
    exercise:
      panels:
        default: stepFeedbackImmediate
        check: 'role'
        states:
          teacher: stepTeacherReview

  page_practice:
    exercise:
      panels:
        default: stepFeedbackImmediate
        check: 'role'
        states:
          teacher: stepTeacherReview

  reading: defaultPolicies

  external:
    external_url:
      panels:
        default: stepViewOnly
        check: 'role'
        states:
          teacher: stepTeacherReview

  default: defaultPolicies

module.exports = policies
