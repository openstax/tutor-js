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
    formats = _.clone @_get(id).formats

    formats = switch name
      when 'requires-choices'
        if isSelected then formats.concat('free-response') else _.without(formats, 'free-response')
      when 'multiple-choice'
        if isSelected
          _.without( formats.concat('multiple-choice'), 'true-false')
        else
          _.without( formats, 'multiple-choice' )
      when 'true-false'
        if isSelected
          _.without( formats.concat('true-false'), 'multiple-choice')
        else
          _.without( formats, 'true-false' )
      else
        if isSelected
          formats.concat(name)
        else
          _.without( formats, name )
    console.log formats
    @_change(id, {formats: _.unique(formats)})

  exports:

    hasFormat: (id, name) ->
      formats = @_get(id)?.formats
      if name is 'requires-choices'
        _.include formats, 'free-response'
      else
        _.include formats, name

    getAnswers: (id) -> @_get(id)?.answers or []

    getStem: (id) -> @_get(id)?.stem_html

    getStimulus: (id) -> @_get(id)?.stimulus_html

    getSolution: (id) ->
      _.first(@_get(id).collaborator_solutions)?.content_html

    getCorrectAnswer: (id) ->
      _.find @_get(id)?.answers, (answer) -> AnswerStore.isCorrect(answer.id)

    isOrderPreserved: (id) ->
      @_get(id).is_answer_order_important

    getTemplate: ->
      answerId = AnswerStore.freshLocalId()

      formats: ['multiple-choice', 'free-response']
      stem_html:"",
      stimulus_html:"",
      collaborator_solutions: [{"content_html": "", "solution_type": "detailed"}],
      answers:[_.extend({}, AnswerStore.getTemplate(), {id: answerId})],
      is_answer_order_important: false

    validate: (id) ->
      question = @_get(id)
      if (not question.stem_html)
        return valid: false, part: 'Question Stem'
      if _.isEmpty(question.collaborator_solutions) or not _.first(question.collaborator_solutions)?.content_html
        return valid: false, part: 'Detailed Solution'

      _.reduce @_get(id).answers, (memo, answer) ->
        validity = AnswerStore.validate(answer.id)

        valid: memo.valid and validity.valid
        part: memo.part or validity.part
      , valid: true
}

extendConfig(QuestionConfig, new CrudConfig())
{actions, store} = makeSimpleStore(QuestionConfig)

module.exports = {QuestionActions:actions, QuestionStore:store}
