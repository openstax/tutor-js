{React, _} = require '../../helpers/component-testing'

HelpTooltip = require '../../../../src/components/task-plan/footer/help-tooltip'

displayPopover = (props) ->
  new Promise( (resolve, reject) ->
    wrapper = mount(<HelpTooltip {...props} />)
    wrapper.simulate('click')
    resolve(_.last document.querySelectorAll('#plan-footer-popover'))
  )


describe 'Task Plan Builder: Help tooltip', ->
  beforeEach ->
    @props =
      isPublished: false

  it 'displays popover that mentions publishing', ->
    displayPopover(@props).then (dom) ->
      expect(dom.textContent).to.include("Publish")

  it 'doesn’t mention publishing if task plan is published', ->
    @props.isPublished = true
    displayPopover(@props).then (dom) ->
      expect(dom.textContent).to.not.include("Publish")

  it 'doesn’t mention delete unless task plan is published', ->
    displayPopover(@props).then (dom) ->
      expect(dom.textContent).not.to.include("Delete Assignment")
    @props.isPublished = true
    displayPopover(@props).then (dom) ->
      expect(dom.textContent).to.include("Delete Assignment")
