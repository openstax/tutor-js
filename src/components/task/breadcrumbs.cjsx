React = require 'react'
{TaskStore} = require '../../flux/task'

_ = require 'underscore'

CrumbMixin = require './crumb-mixin'
Breadcrumb = require './breadcrumb'

module.exports = React.createClass
  displayName: 'Breadcrumbs'

  mixins: [CrumbMixin]

  propTypes:
    id: React.PropTypes.string.isRequired
    currentStep: React.PropTypes.number.isRequired
    goToStep: React.PropTypes.func.isRequired

  render: ->
    crumbs = @getCrumableCrumbs()
    {currentStep, goToStep} = @props

    stepButtons = _.map crumbs, (crumb) ->
      <Breadcrumb crumb={crumb} currentStep={currentStep} goToStep={goToStep}/>

    <div className='steps'>
      {stepButtons}
    </div>
