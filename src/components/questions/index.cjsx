React = require 'react'
{RouteHandler} = require 'react-router'

{EcosystemsStore, EcosystemsActions} = require '../../flux/ecosystems'
SectionsChooser = require '../sections-chooser'
BindStore = require '../bind-store-mixin'
Icon = require '../icon'

QuestionsDashboard = React.createClass

  contextTypes:
    router: React.PropTypes.func

  getInitialState: -> {selectedSectionIds: {}}
  onSectionChange: (ev, selections) ->
    debugger
    # @setState(selections:
    # if selected
    #   @setState(selected: @state.selected.concat(sectionId))
    # else
    #   @setState(selected: _.without(@state.selected, sectionId))


  render: ->
    {courseId} = @context.router.getCurrentParams()
    <div className="questions">
      <h1><Icon type='check-square-o' /></h1>
      <i className="fa fa-exclamation-circle"></i>
      <hr />

      <SectionsChooser courseId={courseId}
        onSectionChange={@onSectionChange}
        selectedSectionIds={@state.selectedSectionIds}
        />

  </div>
    # if EcosystemsStore.isLoaded()
    #   params = _.clone @context.router.getCurrentParams()
    #   params.ecosystemId ?= "#{EcosystemsStore.first().id}"
    #   <RouteHandler {...params} />
    # else
    #   <h3>Loading ...</h3>

module.exports = QuestionsDashboard
