{React, _} = require '../../helpers/component-testing'

moment = require 'moment'

MiniEditor = require '../../../../src/components/task-plan/mini-editor/editor'
{CourseActions} = require '../../../../src/flux/course'
{TaskPlanActions, TaskPlanStore} = require '../../../../src/flux/task-plan'
{TimeStore} = require '../../../../src/flux/time'
TimeHelper = require '../../../../src/helpers/time'

COURSE  = require '../../../../api/courses/1.json'
COURSE_ID = '1'

DATA   = require '../../../../api/courses/1/dashboard'

PLAN = _.extend({
  settings: { exercise_ids: [1, 2, 3] }
}, _.findWhere(DATA.plans, id: '7'))


getButtons = (wrapper) ->
  publish: wrapper.find('.-publish')
  save: wrapper.find('.-save')
  cancel: wrapper.find('.btn.cancel')

fakeTerm = ->
  now = moment(TimeStore.getNow())
  start = now.clone().add(1, 'year').startOf('year')
  end = start.clone().add(6, 'months')

  {start, end}

describe 'TaskPlan MiniEditor wrapper', ->

  beforeEach ->
    @sandbox = sinon.sandbox.create()
    @sandbox.stub(TaskPlanActions, 'save')
    @sandbox.stub(TaskPlanActions, 'publish')
    @sandbox.stub(TaskPlanStore, 'isValid', -> true)
    @sandbox.stub(TaskPlanStore, 'hasChanged', -> true)

    CourseActions.loaded(COURSE, COURSE_ID)

    TaskPlanActions.loaded(PLAN, PLAN.id)

    term = fakeTerm()

    @props =
      id: PLAN.id
      courseId: COURSE_ID
      onHide: sinon.spy()
      termStart: term.start
      termEnd: term.end
      handleError: sinon.spy()


  afterEach ->
    @sandbox.restore()

  it 'can update title', ->
    sinon.stub(TaskPlanActions, 'updateTitle')
    wrapper = mount(<MiniEditor {...@props} />)
    title = wrapper.find("input[value=\"#{PLAN.title}\"]")
    expect(title).length.to.be(1)
    title.simulate('change', target: value: 'foo')
    expect(TaskPlanActions.updateTitle).to.have.been.calledWith(@props.id, 'foo')
    undefined

  it 'hides itself when cancel is clicked', ->
    wrapper = mount(<MiniEditor {...@props} />)
    wrapper.find('.cancel').simulate('click')
    expect(@props.onHide).to.have.been.called
    undefined

  it 'publishes and sets button state', ->
    wrapper = mount(<MiniEditor {...@props} />)
    {publish, save, cancel} = getButtons(wrapper)
    @sandbox.stub(TaskPlanStore, 'isSaving', -> true)
    expect(publish.text()).to.equal('Publish')
    publish.simulate('click')
    expect(TaskPlanActions.publish).to.have.been.called

    expect(publish.text()).to.equal('Publishing…')
    expect(save.text()).to.equal('Save as Draft')
    expect( publish.prop('disabled') ).to.equal(true)
    expect( save.prop('disabled') ).to.equal(true)
    expect( cancel.prop('disabled') ).to.equal(true)
    undefined

  it 'saves as draft and sets button state', ->
    wrapper = mount(<MiniEditor {...@props} />)
    {publish, save, cancel} = getButtons(wrapper)

    expect(save.text()).to.equal('Save as Draft')
    @sandbox.stub(TaskPlanStore, 'isSaving', -> true)
    save.simulate('click')

    expect(TaskPlanActions.save).to.have.been.called
    expect(save.text()).to.equal('Saving…')
    expect(publish.text()).to.equal('Publish')
    expect( publish.prop('disabled') ).to.equal(true)
    expect( save.prop('disabled') ).to.equal(true)
    expect( cancel.prop('disabled') ).to.equal(true)
    undefined

  it 'hides when cancel is clicked', ->
    wrapper = mount(<MiniEditor {...@props} />)
    {cancel} = getButtons(wrapper)
    cancel.simulate('click')
    expect(@props.onHide).to.have.been.called
    undefined

  it 'calls handleError when server error is thrown', ->
    wrapper = shallow(<MiniEditor {...@props} />)
    TaskPlanStore.emit('errored', {status: 404, statusMessage: "There's been an error", config: {}})
    expect(@props.handleError).to.have.been.called
    undefined

  it 'renders error when server error is thrown', ->
    wrapper = mount(<MiniEditor {...@props} />)
    TaskPlanStore.emit('errored', {status: 404, statusMessage: "There's been an error", config: {}})
    expect(wrapper.find('ServerErrorMessage')).length.to.be(1)
    undefined

  it 'limits opens date and due date to term dates', ->
    wrapper = mount(<MiniEditor {...@props} />)
    datePickers = wrapper.find("DatePicker")

    expect(datePickers.at(0).props().minDate.isSame(@props.termStart, 'day')).to.equal(true)
    expect(datePickers.at(1).props().maxDate.isSame(@props.termEnd, 'day')).to.equal(true)
    undefined
