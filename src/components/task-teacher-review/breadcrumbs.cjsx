React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

CrumbMixin = require './crumb-mixin'
ChapterSectionMixin = require '../chapter-section-mixin'
{BreadcrumbStatic} = require '../breadcrumb'

module.exports = React.createClass
  displayName: 'Breadcrumbs'

  contextTypes:
    router: React.PropTypes.func

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

    <div className='task-breadcrumbs'>
      {stepButtons}
      <BS.Button onClick={@context.router.goBack}>
          Back
      </BS.Button>
      <div className='task-title'>
        {title}
      </div>
    </div>
