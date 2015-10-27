_ = require 'underscore'
flux = require 'flux-react'

EXERCISE_MODES_TEMPLATE = [
  'VIEW'      # just render the exercise (with radios and input boxes)
  'REVIEW'    # like view but without checkboxes and the correct/incorrect answer selected
  'EDIT'      # view + all the edit buttons and quill if content clicked
]

EXERCISE_MODES = {}
for val, i in EXERCISE_MODES_TEMPLATE
  EXERCISE_MODES[val] = "ENUM_#{val}_#{i}" # To make sure it's not hardcoded

aryRemove = (ary, item) ->
  index = ary.indexOf(item)
  if index >= 0
    ary.splice(index, 1)
  else
    throw new Error('BUG: Item not found in array')
  true

ExerciseConfig = {
  # Exercise has a current mode it is rendered as.
  changeExerciseMode: (newMode) ->
    @_currentMode = newMode
    @emitChange()

  changeExerciseStimulus: (exercise, html) ->
    exercise.stimulus_html = html # TODO: Change to background_html
    @emitChange()

  removeExerciseStimulus: (exercise) ->
    # delete exercise.stimulus_html
    # Ruby doesn't recognize an deleted stimulus so make it blank
    exercise.stimulus_html = ''
    @emitChange()

  addQuestion: (exercise, question) ->
    exercise.questions.push(question)
    @emitChange()

  removeQuestion: (exercise, question) ->
    aryRemove(exercise.questions, question)
    @emitChange()

  moveQuestionUp: (exercise, question) ->
    i = exercise.questions.indexOf(question)
    throw new Error('BUG: Invalid position') unless i > 0
    exercise.questions.splice(i, 1)
    exercise.questions.splice(i - 1, 0, question)
    @emitChange()

  moveQuestionDown: (exercise, question) ->
    i = exercise.questions.indexOf(question)
    unless i < exercise.questions.length - 1
      throw new Error('BUG: Invalid position')
    exercise.questions.splice(i, 1)
    exercise.questions.splice(i + 1, 0, question)
    @emitChange()

  # Question

  changeQuestion: (question, html) ->
    question.stem_html = html
    @emitChange()

  # changeQuestionStimulus: (question, html) ->
  #   question.stimulus_html = html
  #   @emitChange()
  
  changeAnswers: (question, answers) ->
    question.answers = answers
    @emitChange()

  # addAnswer: (question, answer) ->
  #   question.answers.push(answer)
  #   @emitChange()
  #
  # removeAnswer: (question, answer) ->
  #   aryRemove(question.answers, answer)
  #   @emitChange()
  #
  # setAllAnswer: (question, isAnOption) ->
  #   question.hasAllAnswer = isAnOption
  #   @emitChange()
  #
  # setNoneAnswer: (question, isAnOption) ->
  #   question.hasNoneAnswer = isAnOption
  #   @emitChange()
  #
  # addMultiAnswer: (question, multiAnswer) ->
  #   question.answers.push(multiAnswer)
  #   @emitChange()
  #
  # removeMultiAnswer: (question, multiAnswer) ->
  #   aryRemove(question.answers, multiAnswer)
  #   @emitChange()

  # Answer

  # changeAnswer: (answer, html) ->
  #   answer.content_html = html
  #   @emitChange()
  #
  # changeAnswerCorrectness: (answer, isCorrect) ->
  #   answer.isCorrect = isCorrect
  #   @emitChange()
  #
  # changeMultiAnswer: (multiAnswer, answerIds) ->
  #   multiAnswer.answer_ids = answerIds
  #   @emitChange()
  #
  # changeMultiAnswerCorrectness: (multiAnswer, isCorrect) ->
  #   multiAnswer.isCorrect = isCorrect
  #   @emitChange()

  exports:
    getExerciseMode: (exercise) ->
      return @_currentMode if @_currentMode
      if exercise?.answer?
        EXERCISE_MODES.REVIEW
      else
        EXERCISE_MODES.VIEW

    # getQuestions: (exercise) ->
    #   exercise.questions
    # getAnswers: (question) ->
    #   question.answers

    # getQuestionStem: (question) -> question.stem_html
    # getQuestionStimulus: (question) -> question.stimulus_html
    # getAnswerContent: (answer) -> answer.content_html
    # getAnswerCorrectness: (answer) -> answer.isCorrect
    # getMultiAnswerAnswers: (multiAnswer) -> multiAnswer.answer_ids
    # getMultiAnswerCorrectness: (multiAnswer) -> multiAnswer.isCorrect
    # getId: (obj) -> obj.id
    # hasAllAnswer: (question) -> question.hasAllAnswer
    # hasNoneAnswer: (question) -> question.hasNoneAnswer
    isFirstQuestion: (exercise, question) -> exercise.questions[0] is question
    isLastQuestion: (exercise, question) ->
      exercise.questions[exercise.questions.length - 1] is question

    getQuestions: (exercise) -> exercise.questions
    getId: (exercise) -> exercise.uid
    getNumber: (exercise) -> exercise.number
    getStimulus: (exercise) -> exercise.stimulus_html
    getTags: (exercise) -> exercise.tags

    getQuestionAnswers: (question) -> question.answers
    getQuestionId: (question) -> question.id
    getQuestionStem: (question) -> question.stem_html
    getQuestionStimulus: (question) -> question.stimulus_html

    getAnswerContent: (answer) -> answer.content_html
    isAnswerCorrect: (answer) -> answer.correctness is "1.0"
}

# Helper for creating a simple store for actions
makeSimpleStore = (storeConfig) ->

  actionsConfig = _.without(_.keys(storeConfig), 'exports')
  actions = flux.createActions(actionsConfig)
  storeConfig.actions = _.values(actions)
  store = flux.createStore(storeConfig)
  {actions, store}


{actions: ExerciseActions, store: ExerciseStore} = makeSimpleStore(ExerciseConfig)
module.exports = {ExerciseActions, ExerciseStore, EXERCISE_MODES}
