React = require 'react'
{TaskStore} = require '../../flux/task'

_ = require 'underscore'

CrumbMixin = require './crumb-mixin'
Breadcrumb = require './breadcrumb'
BindStoreMixin = require '../bind-store-mixin'

module.exports = React.createClass
  displayName: 'Breadcrumbs'

  mixins: [CrumbMixin, BindStoreMixin]

  propTypes:
    id: React.PropTypes.string.isRequired
    currentStep: React.PropTypes.number.isRequired
    goToStep: React.PropTypes.func.isRequired

  bindStore: TaskStore

  render: ->
    crumbs = @getCrumableCrumbs()
    {currentStep, goToStep} = @props

    stepButtons = _.map crumbs, (crumb) ->
      <Breadcrumb crumb={crumb} currentStep={currentStep} goToStep={goToStep}/>

    <div className='steps'>
      {stepButtons}
    </div>
