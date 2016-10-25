React = require 'react'
BS = require 'react-bootstrap'

partial = require 'lodash/partial'
classnames = require 'classnames'

SelectType = React.createClass

  getInitialState: ->
    selected: null

  propTypes:
    onContinue: React.PropTypes.func.isRequired
    onCancel: React.PropTypes.func.isRequired

  Footer: ->
    <div className="controls">
      <BS.Button onClick={@props.onCancel}>Cancel</BS.Button>
      <BS.Button onClick={@onContinue} disabled={not @state.selected}
        bsStyle="primary">Continue</BS.Button>
    </div>

  onSelectType: (type) ->
    @setState(selected: type)

  onContinue: ->
    @props.onContinue(course_type: @state.selected)

  Choice: (props) ->
    <div
      onClick={partial(@onSelectType, props.type)}
      className={classnames('type', props.type, active: @state.selected is props.type)}
    >
      <i />
      <span>{props.title}</span>
    </div>


  render: ->
    <BS.Panel
      className="select-type"
      header="Choose what you'd like to use in your course"
      footer={<@Footer />}
    >
      <div className="chooser">
        <@Choice type='cc' title='Concept Coach' />
        <@Choice type='tutor' title='Tutor' />
      </div>
    </BS.Panel>


module.exports = SelectType
