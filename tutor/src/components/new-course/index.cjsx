React = require 'react'
BS = require 'react-bootstrap'

classnames = require 'classnames'
keys = require 'lodash/keys'

BindStore = require '../bind-store-mixin'
{NewCourseActions, NewCourseStore} = require '../../flux/new-course'

STAGES = {
  'course_type': require './select-type'
  'course_code': require './select-course'
  'period':      require './select-dates'
  'details':     require './course-details'
  'all':         require './build-course'
}

STAGE_KEYS = keys(STAGES)

NewCourse = React.createClass

  getInitialState: ->
    currentStage: 0

  contextTypes:
    router: React.PropTypes.object

  mixins: [BindStore]
  bindStore: NewCourseStore

  onContinue: ->
    currentStage = @state.currentStage + 1
    @setState({currentStage})

  Footer: ->
    <div className="controls">
      <BS.Button onClick={@onCancel}>Cancel</BS.Button>
      <BS.Button onClick={@onContinue} bsStyle="primary"
        disabled={
          not NewCourseStore.isValid( STAGE_KEYS[@state.currentStage] )
        }
      >
        Continue
      </BS.Button>
    </div>

  onCancel: ->
    @context.router.transitionTo('/dashboard')

  render: ->
    Component = STAGES[ STAGE_KEYS[ @state.currentStage ] ]

    <div className="new-course">
      <BS.Panel
        header={Component.title}
        className={@state.currentStage}
        footer={<@Footer />}
      >
          <Component
            onContinue={@onContinue}
            onCancel={@onCancel}
            {...@state}
          />
      </BS.Panel>
    </div>



module.exports = NewCourse
