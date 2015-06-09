React = require 'react'
{TaskTeacherReviewStore} = require '../../../flux/task-teacher-review'

_ = require 'underscore'

CrumbMixin = require './crumb-mixin'
ChapterSectionMixin = require '../../chapter-section-mixin'
Breadcrumb = require './breadcrumb'

module.exports = React.createClass
  displayName: 'Breadcrumbs'

  mixins: [ChapterSectionMixin, CrumbMixin]

  propTypes:
    id: React.PropTypes.string.isRequired
    currentStep: React.PropTypes.number.isRequired
    goToStep: React.PropTypes.func.isRequired

  render: ->
    crumbs = @getCrumableCrumbs()
    {currentStep, goToStep} = @props

    stepButtons = _.map crumbs, (crumb) ->
      <Breadcrumb
        crumb={crumb}
        currentStep={currentStep}
        goToStep={goToStep}
        key="breadcrumb-#{crumb.type}-#{crumb.key}"/>

    <div className='task-breadcrumbs'>
      {stepButtons}
    </div>
