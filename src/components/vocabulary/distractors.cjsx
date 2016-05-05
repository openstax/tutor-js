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

  onChange: (ev) ->
    @setState(term: ev.target.value)

  render: ->
    <input
      className='form-control'
      type='text'
      value={@state.term}
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

    <div className="distractors">
      <div className="heading">
        <label className="control-label">Distractors</label>
        <div className="controls">
          <i onClick={@onAdd} className="fa fa-plus-circle" />
        </div>
      </div>
      <div className="values">
        {for distractor, i in vt.distractor_literals
          <Distractor key={i} termId={@props.termId} term={distractor} />}
      </div>
    </div>

module.exports = Distractors
