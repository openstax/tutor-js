React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

{BreadcrumbStatic} = require '../breadcrumb'

BackButton = require '../buttons/back-button'

module.exports = React.createClass
  displayName: 'Breadcrumbs'

  propTypes:
    id: React.PropTypes.string.isRequired
    currentStep: React.PropTypes.number
    goToStep: React.PropTypes.func.isRequired
    scrollToStep: React.PropTypes.func.isRequired
    title: React.PropTypes.string.isRequired
    courseId: React.PropTypes.string.isRequired
    crumbs: React.PropTypes.array.isRequired

  goToStep: (key) ->
    @props.goToStep(key)
    @props.scrollToStep(key)

  render: ->
    {currentStep, title, courseId, crumbs} = @props

    stepButtons = _.map crumbs, (crumb) =>
      <BreadcrumbStatic
        crumb={crumb}
        stepIndex={crumb.key}
        currentStep={currentStep}
        goToStep={@goToStep}
        key="breadcrumb-#{crumb.type}-#{crumb.key}"/>

    fallbackLink =
      to: 'taskplans'
      params: {courseId}
      text: 'Back to Calendar'

    backButton = <BackButton fallbackLink={fallbackLink} />

    <div className='task-breadcrumbs'>
      {stepButtons}
      {backButton}
      <div className='task-title'>
        {title}
      </div>
    </div>
