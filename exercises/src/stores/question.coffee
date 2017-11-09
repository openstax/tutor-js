_ = require 'underscore'
flux = require 'flux-react'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{AnswerActions, AnswerStore} = require './answer'

QuestionConfig = {
  _loaded: (obj, id) ->
    for answer in obj?.answers
      AnswerActions.loaded(answer, answer.id)

    obj

  syncAnswers: (id) ->
    answers = _.map @_local[id]?.answers, (answer) ->
      AnswerStore.get(answer.id)
    @_change(id, {answers})

  addNewAnswer: (id) ->
    newAnswer =
      id: AnswerStore.freshLocalId()
      correctness: "0.0"
      feedback_html: ''
      content_html: ''

    AnswerActions.created(newAnswer, newAnswer.id)
    answers = @_local[id]?.answers.push(newAnswer)
    @syncAnswers(id)

  removeAnswer: (id, answerId) ->
    AnswerActions.delete(answerId)
    answers = _.reject @_local[id]?.answers, (answer) ->
      answer.id is answerId
    @_local[id]?.answers = answers

  moveAnswer: (id, answerId, direction) ->
    index = _.findIndex @_local[id]?.answers, (answer) ->
      answer.id is answerId

    if (index isnt -1)
      temp = @_local[id]?.answers[index]
      @_local[id]?.answers[index] = @_local[id]?.answers[index + direction]
      @_local[id]?.answers[index + direction] = temp

  updateStem: (id, stem_html) ->
    @_change(id, {stem_html})

  updateStimulus: (id, stimulus_html) -> @_change(id, {stimulus_html})

  updateSolution: (id, feedback) ->
    solution = _.first(@_get(id).collaborator_solutions)
    if (solution)
      solution.content_html = feedback
    else
      solution =
        content_html: feedback
        attachments: []
        solution_type: 'detailed'

    @_change(id, {collaborator_solutions: [solution]})

  setCorrectAnswer: (id, newAnswer, curAnswer) ->
    if not AnswerStore.isCorrect(newAnswer)
      AnswerActions.setCorrect(newAnswer)
      AnswerActions.setIncorrect(curAnswer) if curAnswer

  togglePreserveOrder: (id) ->
    {is_answer_order_important} = @_get(id)
    @_change(id, {is_answer_order_important: not is_answer_order_important})

  toggleFormat: (id, name, isSelected) ->
    formats = @_get(id).formats

    formats = if isSelected
      formats.concat(name) unless _.includes(formats, name)
    else
      _.without(formats, name)

    # toggle free-response depending on selection
    if isSelected
      switch name
        when 'true-false'
          formats = _.without(formats, 'free-response')
        when 'multiple-choice'
          formats = formats.concat('free-response')

    @_change(id, {formats: _.unique(formats)})

  exports:

    hasFormat: (id, name) ->
      _.include @_get(id)?.formats, name

    getAnswers: (id) -> @_get(id)?.answers or []

    getStem: (id) -> @_get(id)?.stem_html or ''

    getStimulus: (id) -> @_get(id)?.stimulus_html or ''

    getSolution: (id) ->
      _.first(@_get(id).collaborator_solutions)?.content_html or ''

    getCorrectAnswer: (id) ->
      _.find @_get(id)?.answers, (answer) -> AnswerStore.isCorrect(answer.id)

    isOrderPreserved: (id) ->
      @_get(id).is_answer_order_important or false

    getTemplate: ->
      answerId = AnswerStore.freshLocalId()

      formats: ['multiple-choice', 'free-response']
      stem_html:"",
      stimulus_html:"",
      answers:[_.extend({}, AnswerStore.getTemplate(), {id: answerId})],
      is_answer_order_important: false

    validate: (id) ->
      question = @_get(id)
      if (not question.stem_html)
        return valid: false, part: 'Question Stem'

      _.reduce @_get(id).answers, (memo, answer) ->
        validity = AnswerStore.validate(answer.id)

        valid: memo.valid and validity.valid
        part: memo.part or validity.part
      , valid: true
}

extendConfig(QuestionConfig, new CrudConfig())
{actions, store} = makeSimpleStore(QuestionConfig)

module.exports = {QuestionActions:actions, QuestionStore:store}
