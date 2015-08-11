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
  actions: [
    'clickContinue'
  ]

teacherReadOnly =
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
        teacher: stepTeacherReadOnly
  reading:
    panels:
      default: stepViewOnly
      check: 'role'
      states:
        teacher: stepTeacherReadOnly
  video:
    panels:
      default: stepViewOnly
      check: 'role'
      states:
        teacher: stepTeacherReadOnly
  interactive:
    panels:
      default: stepViewOnly
      check: 'role'
      states:
        teacher: stepTeacherReadOnly
  placeholder:
    panels:
      default: stepViewOnly
      check: 'role'
      states:
        teacher: stepTeacherReadOnly

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
          teacher: stepTeacherReadOnly
    placeholder:
      panels:
        default: stepViewOnly
        check: 'role'
        states:
          teacher: stepTeacherReadOnly

  practice:
    exercise:
      panels:
        default: stepFeedbackImmediate
        check: 'role'
        states:
          teacher: stepTeacherReadOnly

  chapter_practice:
    exercise:
      panels:
        default: stepFeedbackImmediate
        check: 'role'
        states:
          teacher: stepTeacherReadOnly

  page_practice:
    exercise:
      panels:
        default: stepFeedbackImmediate
        check: 'role'
        states:
          teacher: stepTeacherReadOnly

  reading: defaultPolicies

  external:
    external_url:
      panels:
        default: stepViewOnly
        check: 'role'
        states:
          teacher: stepTeacherReadOnly

  default: defaultPolicies

module.exports = policies
