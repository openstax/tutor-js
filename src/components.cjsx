# @csx React.DOM

_ = require 'underscore'
React = require 'react'
katex = require 'katex'
{AnswerActions, AnswerStore} = require './flux/answer'
{ExerciseActions, ExerciseStore, EXERCISE_MODES} = require './flux/exercise'

ViewArbitraryHtmlAndMath = require './content'

# Converts an index to `a-z` for question answers
AnswerLabeler = React.createClass
  displayName: 'AnswerLabeler'
  render: ->
    {index, before, after} = @props
    letter = String.fromCharCode(index + 97) # For uppercase use 65
    <span className='answer-char'>{before}{letter}{after}</span>


DefaultStemMixin =
  renderStemView: ->
    {config} = @props
    <ViewArbitraryHtmlAndMath block=true className='stem' html={config.stem} onSaveContent={@onSaveStemContent} />

  renderStemReview: -> @renderStemView()
  onSaveStemContent: (html) ->
    ExerciseActions.changeQuestion(@props.config, html)


QuestionMixin =
  # renderStemView: ->
  # renderStemReview: ->

  # renderBodyView: ->
  # renderBodyReview: ->

  renderStimulus: ->
    {config} = @props
    <ViewArbitraryHtmlAndMath block=true className='stimulus' html={config.stimulus} onSaveContent={@onSaveStimulusContent} />

  onSaveStimulusContent: (html) ->
    ExerciseActions.changeQuestionStimulus(@props.config, html)

  render: ->
    {config} = @props

    if config.stimulus?
      stimulus = @renderStimulus(config)
    classes = ['question', config.format]
    classes.push('answered') if ExerciseStore.getExerciseMode(config) is EXERCISE_MODES.REVIEW

    stem = switch ExerciseStore.getExerciseMode(config)
      when EXERCISE_MODES.VIEW then @renderStemView(config)
      when EXERCISE_MODES.REVIEW then @renderStemReview(config)
      else throw new Error('BUG: Invalid exercise mode')

    body = switch ExerciseStore.getExerciseMode(config)
      when EXERCISE_MODES.VIEW then @renderBodyView(config)
      when EXERCISE_MODES.REVIEW then @renderBodyReview(config)
      else throw new Error('BUG: Invalid exercise mode')

    <div className={classes.join(' ')} data-format={config.type}>
      {stimulus}
      {stem}
      {body}
    </div>


BlankQuestion = React.createClass
  displayName: 'BlankQuestion'
  mixins: [QuestionMixin]

  renderStemView: (config) ->
    {stem} = config
    stem = stem.replace(/____/, '<input type="text" placeholder="fill this in" class="blank"/>')
    <ViewArbitraryHtmlAndMath block=true className='stem' html={stem} onSaveContent={@onSaveStemContent} />

  renderStemReview: (config) ->
    {stem} = config

    # TODO: Make sure HTML is escaped!!!
    if config.answer is config.correct
      stem = stem.replace(/____/, "<span class='correct'>#{config.answer}</span>")
    else
      stem = stem.replace(/____/, "<span class='incorrect'>#{config.answer}</span><span class='missed'>#{config.correct}</span>")

    <ViewArbitraryHtmlAndMath block=true className='stem' html={stem} onSaveContent={@onSaveStemContent} />

  renderBodyView: (config) ->
  renderBodyReview: (config) ->

  onSaveStemContent: (html) ->
    ExerciseActions.changeQuestion(@props.config, html)

  componentDidMount: ->
    # Find the input box and attach listeners to it
    input = @getDOMNode().querySelector('.blank')
    input?.onkeyup = input?.onblur = input?.onchange = =>
      if input.value
        AnswerActions.setAnswer(@props.config, input.value)
      else
        AnswerActions.setAnswer(@props.config, undefined)


SimpleQuestion = React.createClass
  displayName: 'SimpleQuestion'
  mixins: [QuestionMixin, DefaultStemMixin]

  renderBodyReview: (config) ->
    answer = AnswerStore.getAnswer(config)
    <div className='answer'>Your answer: <strong>{answer}</strong></div>

  renderBodyView: (config) ->
    answer = AnswerStore.getAnswer(config)
    <textarea
        className='form-control'
        rows='3'
        ref='prompt'
        placeholder={config.short_stem}
        onChange=@onChange>{answer or ''}</textarea>

  onChange: ->
    val = @refs.prompt.getDOMNode().value
    if val
      AnswerActions.setAnswer(@props.config, val)
    else
      AnswerActions.setAnswer(@props.config, undefined)


SimpleMultipleChoiceOption = React.createClass
  displayName: 'SimpleMultipleChoiceOption'
  render: ->
    {config, questionId, index} = @props
    id = config.id
    <ViewArbitraryHtmlAndMath className='answer-text' html={config.content or config.value} onSaveContent={@onSaveContent} />

  onSaveContent: (html) -> ExerciseActions.changeAnswer(@props.config, html)

MultiMultipleChoiceOption = React.createClass
  displayName: 'MultiMultipleChoiceOption'
  render: ->
    {config, idIndices} = @props
    vals = []
    for id, i in idIndices
      unless config.value.indexOf(id) < 0
        index = config.value.indexOf(id)
        vals.push <AnswerLabeler key={index} before='(' after=')' index={index}/>
    <span className='multi'>{vals}</span>


MultipleChoiceOptionMixin =
  render: ->
    {inputType, config, questionId, index, isAnswered} = @props

    # For radio boxes there is only 1 value, the id/value but
    # for checkboxes the answer is an array of ids/values
    option = if Array.isArray(config.value)
      @props.idIndices = for id in config.value
        id
      MultiMultipleChoiceOption(@props)
    else
      SimpleMultipleChoiceOption(@props)

    id = "#{questionId}-#{config.id}"

    inputType = 'hidden' if isAnswered

    classes = ['option']
    # null (unanswered), 'correct', 'incorrect', 'missed'
    classes.push(@props.answerState) if @props.answerState

    optionIdent = @props.config.id or @props.config.value
    if Array.isArray(@props.answer)
      isChecked = @props.answer.indexOf(optionIdent) >= 0
    else
      isChecked = @props.answer is optionIdent

    contents = [
      <span key='letter' className='letter'><AnswerLabeler after=')' index={index}/> </span>
      <span key='answer' className='answer'>{option}</span>
    ]

    unless isAnswered
      contents =
        <label>
          <input type={inputType}
            ref='input'
            name={questionId}
            value={JSON.stringify(config.value)}
            onChange=@onChange
            defaultChecked={isChecked}
          />
          {contents}
        </label>

    <li key={id} className={classes.join(' ')}>
      {contents}
    </li>



MultipleChoiceOption = React.createClass
  displayName: 'MultipleChoiceOption'
  getDefaultProps: -> {inputType:'radio'}
  mixins: [MultipleChoiceOptionMixin]

  onChange: ->
    @props.onChange(@props.config)


MultipleChoiceQuestion = React.createClass
  displayName: 'MultipleChoiceQuestion'
  mixins: [QuestionMixin, DefaultStemMixin]

  getOptions: (config) ->
    # TODO: remove isAnswered
    isAnswered = ExerciseStore.getExerciseMode(config) is EXERCISE_MODES.REVIEW
    questionId = config.id
    options = for option, index in config.answers
      answerState = null
      if config.answer is option.id # if my answer is this option
        if config.correct is config.answer
          answerState = 'correct'
        else
          answerState = 'incorrect'
      else if config.correct is option.id and config.answers.length > 2
        answerState = 'missed'

      optionProps = {
        config: option
        answer: AnswerStore.getAnswer(config)
        questionId
        index
        isAnswered
        answerState
        @onChange
      }
      MultipleChoiceOption(optionProps)

    return options

  renderBodyView: (config) -> @renderBodyReview(config)
  renderBodyReview: (config) ->
    questionId = config.id
    options = @getOptions(config)

    classes = ['question']
    classes.push('answered') if ExerciseStore.getExerciseMode(config) is EXERCISE_MODES.REVIEW

    <div key={questionId} className={classes.join(' ')}>
      <ul className='options'>{options}</ul>
    </div>

  onChange: (answer) ->
    AnswerActions.setAnswer(@props.config, answer.id or answer.value)


MultiSelectOption = React.createClass
  displayName: 'MultiSelectOption'
  getDefaultProps: -> {inputType:'checkbox'}
  mixins: [MultipleChoiceOptionMixin]

  onChange: ->
    # NOTE: @refs.input.state.checked only works for checkboxes (not radio buttons)
    # but @refs.input.getDOMNode().checked works for both
    # and @refs.input.getDOMNode().checked does not work for Node tests ; (
    @props.onChange(@props.config)


# http://stackoverflow.com/questions/7837456/comparing-two-arrays-in-javascript
ArrayEquals = (ary1, array) ->
  # if the other array is a falsy value, return
  return false  unless array
  # compare lengths - can save a lot of time
  return false  unless ary1.length is array.length
  i = 0
  l = ary1.length
  while i < l
    # Check if we have nested arrays
    if ary1[i] instanceof Array and array[i] instanceof Array
      # recurse into the nested arrays
      return false  unless ary1[i].equals(array[i])
    # Warning - two different object instances will never be equal: {x:20} != {x:20}
    else return false  unless ary1[i] is array[i]
    i++
  true

MultiSelectQuestion = React.createClass
  displayName: 'MultiSelectQuestion'
  mixins: [QuestionMixin, DefaultStemMixin]
  getInitialState: ->
    answers: []


  getOptions: (config) ->
    isAnswered = ExerciseStore.getExerciseMode(config) is EXERCISE_MODES.REVIEW
    questionId = config.id

    options = []

    for option, index in config.answers
      unless Array.isArray(option.value)
        isCorrect = false
        isIncorrect = false

        if isAnswered and config.correct
          correctAnswers = _.find(config.answers, (a) -> a.id is config.correct).value
          # If correctAnswers is not an array then there is only 1 correct answer
          unless Array.isArray(correctAnswers)
            correctAnswers = [config.correct]

          if config.answer?.indexOf(option.id) >= 0 # if my answer contains this option
            if correctAnswers.indexOf(option.id) >= 0
              answerState = 'correct'
            else
              answerState = 'incorrect'
          else if correctAnswers.indexOf(option.id) >= 0 # This option was missed
            answerState = 'missed'
          else
            answerState = null

        optionProps = {
          config: option
          answer: AnswerStore.getAnswer(config)
          isAnswered
          answerState
          questionId
          index
          @onChange
        }

        options.push MultiSelectOption(optionProps)

    return options

  renderBodyView: (config) -> @renderBodyReview(config)
  renderBodyReview: (config) ->
    questionId = config.id
    options = @getOptions(config)

    <div key={questionId} className='question-body'>
      <div>Select all that apply:</div>
      <ul className='options'>{options}</ul>
    </div>

  onChange: (answer, isChecked) ->
    i = @state.answers.indexOf(answer.id)
    if i >= 0
      @state.answers.splice(i, 1)
    else
      @state.answers.push(answer.id)

    if @state.answers.length
      AnswerActions.setAnswer(@props.config, @state.answers)
    else
      AnswerActions.setAnswer(@props.config, undefined)


TrueFalseQuestion = React.createClass
  displayName: 'TrueFalseQuestion'
  mixins: [QuestionMixin, DefaultStemMixin]

  renderBodyReview: (config) ->
    questionId = config.id
    idTrue = "#{questionId}-true"
    idFalse = "#{questionId}-false"

    trueClasses  = ['option']
    falseClasses = ['option']

    if config.correct
      correctClasses = trueClasses
      incorrectClasses = falseClasses
    else
      correctClasses = falseClasses
      incorrectClasses = trueClasses
    if config.correct is !! config.answer
      correctClasses.push('correct')
    else
      # correctClasses.push('missed') No need to show missed if there are only 2 options
      incorrectClasses.push('incorrect')

    <div className='question-body'>
      <ul className='options'>
        <li className={trueClasses.join(' ')}>
          <span>True</span>
        </li>
        <li className={falseClasses.join(' ')}>
          <span>False</span>
        </li>
      </ul>
    </div>

  renderBodyView: (config) ->
    questionId = config.id
    idTrue = "#{questionId}-true"
    idFalse = "#{questionId}-false"

    <div className='question-body'>
      <ul className='options'>
        <li className='option'>
          <label>
            <input type='radio' name={questionId} value='true' onChange=@onTrue />
            <span>True</span>
          </label>
        </li>
        <li className='option'>
          <label>
            <input type='radio' name={questionId} value='false' onChange=@onFalse />
            <span>False</span>
          </label>
        </li>
      </ul>
    </div>

  onTrue:  -> AnswerActions.setAnswer(@props.config, true)
  onFalse: -> AnswerActions.setAnswer(@props.config, false)


MatchingQuestion = React.createClass
  displayName: 'MatchingQuestion'
  mixins: [QuestionMixin, DefaultStemMixin]

  renderBodyReview: (config) -> @renderBodyView(config)
  renderBodyView: (config) ->
    rows = for answer, i in config.answers
      item = config.items[i]

      <tr key={answer.id}>
        <td className='item'>
          <ViewArbitraryHtmlAndMath className='stem' html={item} />
        </td>
        <td className='spacer'></td>
        <td className='answer'>
          <ViewArbitraryHtmlAndMath className='stem' html={answer.content or answer.value} />
        </td>
      </tr>

    <table>
      {rows}
    </table>


QUESTION_TYPES =
  'matching'          : MatchingQuestion
  'multiple-choice'   : MultipleChoiceQuestion
  'multiple-select'   : MultiSelectQuestion
  'short-answer'      : SimpleQuestion
  'true-false'        : TrueFalseQuestion
  'fill-in-the-blank' : BlankQuestion

getQuestionType = (format) ->
  QUESTION_TYPES[format] or throw new Error("Unsupported format type '#{format}'")


Part = React.createClass
  displayName: 'Part'
  render: ->
    {config} = @props

    questions = for questionConfig in config.questions
      format = questionConfig.format
      Type = getQuestionType(format)
      props = {config:questionConfig}

      Type(props)

    <div className='part'>
      <ViewArbitraryHtmlAndMath className='background' html={config.background} onSaveContent={@onSaveBackground}/>
      {questions}
    </div>

  onSaveBackground: (html) ->
    ExerciseActions.changePart(@props.config, html)


Exercise = React.createClass
  displayName: 'Exercise'
  componentWillMount: ->
    ExerciseStore.addChangeListener(@update)

  update: -> @setState({}) # Just enough to trigger a re-render

  render: ->
    {config} = @props

    if config.content
      questions = for questionConfig in config.content.questions
        format = questionConfig.format
        Type = getQuestionType(format)
        props = {config:questionConfig}

        Type(props)

      <div className='exercise'>
        <ViewArbitraryHtmlAndMath className='stimulus' html={config.content.stimulus} onSaveContent={@onSaveBackground} />
        {questions}
      </div>

    else
      parts = for partConfig in config.parts
        props = {config:partConfig}
        Part(props)

      <div className='exercise'>
        <ViewArbitraryHtmlAndMath className='background' html={config.background} onSaveContent={@onSaveBackground} />
        {parts}
      </div>

  onSaveBackground: (html) ->
    ExerciseActions.changeBackground(@props.config, html)

module.exports = {Exercise, getQuestionType}
