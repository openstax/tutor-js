React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
classnames = require 'classnames'

{VocabularyActions, VocabularyStore} = require 'stores/vocabulary'

Distractor = React.createClass
  getInitialState: ->
    term: @props.term

  componentWillReceiveProps: (nextProps) ->
    @setState(term: nextProps.term)

  save: (ev) ->
    VocabularyActions.updateDistractor(@props.termId, @props.term, @state.term)

  onKeyPress: (ev) ->
    if ev.key is 'Enter'
      @save()
      VocabularyActions.addBlankDistractor(@props.termId, @props.index + 1)
      _.defer =>
        @getDOMNode().parentElement.querySelector("[data-index='#{@props.index+1}']")?.focus()


  onChange: (ev) ->
    @setState(term: ev.target.value)

  render: ->
    <input
      data-index={@props.index}
      className='form-control'
      type='text'
      value={@state.term}
      onKeyPress={@onKeyPress}
      onChange={@onChange}
      onBlur={@save}
      placeholder={@props.placeholder} />


Distractors = React.createClass
  propTypes:
    termId:   React.PropTypes.string.isRequired


  onAdd: ->
    VocabularyActions.addBlankDistractor(@props.termId)

  render: ->
    vt = VocabularyStore.get(@props.termId)
    return null unless vt

    <div className="distractors">
      <div className="heading">
        <label className="control-label">Distractors</label>
        <div className="controls">
          <i onClick={@onAdd} className="fa fa-plus-circle" />
        </div>
      </div>
      <div className="values">
        {for distractor, i in vt.distractor_literals or []
          <Distractor key={i} index={i} termId={@props.termId} term={distractor} />}
      </div>
    </div>

module.exports = Distractors
