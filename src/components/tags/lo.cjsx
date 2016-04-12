React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'

Error = require './error'
Wrapper = require './wrapper'
{ExerciseActions, ExerciseStore} = require '../../stores/exercise'

PREFIX = 'lo'
BookSelection = require './book-selection'

Input = React.createClass

  getDefaultProps: ->
    inputType: 'text'

  propTypes:
    tag: React.PropTypes.string.isRequired

  getInitialState: ->
    [book, lo] = @props.tag.split(':')
    {book, lo}

  validateInput: (value) ->
    'Must match LO pattern of dd-dd-dd' unless value.match(
      /^\d{1,2}-\d{1,2}-\d{1,2}$/
    )

  componentWillReceiveProps: (nextProps) ->
    [book, lo] = @props.tag.split(':')
    @setState({book, lo})

  onTextChange: (ev) ->
    lo = ev.target.value.replace(/[^0-9\-]/g, '')
    @setState({errorMsg: null, lo})

  validateAndSave: (attrs = {}) ->
    {lo, book} = _.defaults attrs, @state
    if book and lo?.match( /^\d{1,2}-\d{1,2}-\d{1,2}$/ )
      ExerciseActions.setPrefixedTag(@props.exerciseId,
        prefix: PREFIX, tag: "#{book}:#{lo}", previous: @props.tag
      )
    else
      @setState({lo, book, errorMsg: 'Must match LO pattern of book:dd-dd-dd'})

  onTextBlur: -> @validateAndSave()
  updateBook: (ev) ->
    book = ev.target.value
    @validateAndSave({book})

  onDelete: ->
    ExerciseActions.setPrefixedTag(@props.exerciseId,
      prefix: PREFIX, tag: false, previous: @props.tag
    )

  render: ->

    <div className={classnames('tag', 'has-error': @state.errorMsg)}>
      <BookSelection onChange={@updateBook} selected={@state.book}
        limit={ExerciseStore.getTagsWithPrefix(@props.exerciseId, 'book')}
      />
      <input
        className='form-control'
        type={@props.inputType}
        onChange={@onTextChange}
        onBlur={@onTextBlur}
        value={@state.lo}
        placeholder={@props.placeholder} />
      <Error error={@state.errorMsg} />
      <span className="controls">
        <i onClick={@onDelete} className="fa fa-trash" />
      </span>
    </div>

ExIdTags = React.createClass

  propTypes:
    exerciseId: React.PropTypes.string.isRequired

  onAdd: ->
    ExerciseActions.addBlankPrefixedTag(@props.exerciseId, prefix: PREFIX)

  render: ->
    tags = ExerciseStore.getTagsWithPrefix(@props.exerciseId, PREFIX)
    <Wrapper label="LO" onAdd={@onAdd}>
      {for tag in tags
        <Input key={tag} {...@props} tag={tag} />}
    </Wrapper>

module.exports = ExIdTags
