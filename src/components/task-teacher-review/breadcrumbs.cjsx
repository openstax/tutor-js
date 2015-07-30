React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

CrumbMixin = require './crumb-mixin'
ChapterSectionMixin = require '../chapter-section-mixin'
{BreadcrumbStatic} = require '../breadcrumb'

BackButton = require '../buttons/back-button'

module.exports = React.createClass
  displayName: 'Breadcrumbs'

  mixins: [ChapterSectionMixin, CrumbMixin]

  propTypes:
    id: React.PropTypes.string.isRequired
    currentStep: React.PropTypes.number
    goToStep: React.PropTypes.func.isRequired
    title: React.PropTypes.string.isRequired
    courseId: React.PropTypes.string.isRequired

  render: ->
    crumbs = @getCrumableCrumbs()
    {currentStep, goToStep, title, courseId} = @props

    stepButtons = _.map crumbs, (crumb) ->
      <BreadcrumbStatic
        crumb={crumb}
        currentStep={currentStep}
        goToStep={goToStep}
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
