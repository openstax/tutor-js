React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'

Error = require './error'
Wrapper = require './wrapper'

PREFIX = 'lo'
BookSelection = require './book-selection'

Input = React.createClass

  propTypes:
    id:      React.PropTypes.string.isRequired
    store:   React.PropTypes.object.isRequired
    actions: React.PropTypes.object.isRequired
    tag:     React.PropTypes.string.isRequired

  getDefaultProps: ->
    inputType: 'text'

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
      @props.actions.setPrefixedTag(@props.id,
        prefix: PREFIX, tag: "#{book}:#{lo}", previous: @props.tag
      )
    else
      @setState({lo, book, errorMsg: 'Must match LO pattern of book:dd-dd-dd'})

  onTextBlur: -> @validateAndSave()
  updateBook: (ev) ->
    book = ev.target.value
    @validateAndSave({book})

  onDelete: ->
    @props.actions.setPrefixedTag(@props.id,
      prefix: PREFIX, tag: false, previous: @props.tag
    )

  render: ->

    <div className={classnames('tag', 'has-error': @state.errorMsg)}>
      <BookSelection onChange={@updateBook} selected={@state.book}
        limit={@props.store.getTagsWithPrefix(@props.id, 'book')}
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

LoTags = React.createClass

  propTypes:
    id:      React.PropTypes.string.isRequired
    store:   React.PropTypes.object.isRequired
    actions: React.PropTypes.object.isRequired

  onAdd: ->
    @props.actions.addBlankPrefixedTag(@props.id, prefix: PREFIX)

  render: ->
    tags = @props.store.getTagsWithPrefix(@props.id, PREFIX)
    <Wrapper label="LO" onAdd={@onAdd}>
      {for tag in tags
        <Input key={tag} {...@props} tag={tag} />}
    </Wrapper>

module.exports = LoTags
