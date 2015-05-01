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
  actions: [
    'clickContinue'
  ]

view =
  name: 'view'
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

# Policy Shape
#
#   #{taskType}:
#     #{stepType}:
#       #{for}:
#         default: #{info}
#         check: #{stateType}
#         states:
#           #{state}: #{info}

policies =

  homework:
    exercise:
      panels:
        check: 'dueState'
        states:
          before: stepNoFeedback
          after: stepFeedbackImmediate

  default:
    exercise:
      panels:
        default: stepFeedbackImmediate
    reading:
      panels:
        default: stepViewOnly
    video:
      panels:
        default: stepViewOnly
    interactive:
      panels:
        default: stepViewOnly

module.exports = policies
