{React} = require '../../helpers/component-testing'
_ = require 'underscore'

moment = require 'moment-timezone'

MiniEditor = require '../../../../src/components/task-plan/mini-editor/editor'
{default: Courses} = require '../../../../src/models/courses-map'

{TaskPlanActions, TaskPlanStore} = require '../../../../src/flux/task-plan'
{TimeStore} = require '../../../../src/flux/time'
TimeHelper = require '../../../../src/helpers/time'
EnzymeContext = require '../../helpers/enzyme-context'

COURSE  = require '../../../../api/courses/1.json'
COURSE_ID = '1'

DATA   = require '../../../../api/courses/1/dashboard'

PLAN = _.extend({
  settings: { exercise_ids: [1, 2, 3] }
}, _.findWhere(DATA.plans, id: '7'))

today = moment(TimeStore.getNow()).format(TimeHelper.ISO_DATE_FORMAT)
dayAfter = moment(TimeStore.getNow()).add(2, 'day').format(TimeHelper.ISO_DATE_FORMAT)

PLAN.tasking_plans = _.map(PLAN.tasking_plans, (tasking) ->
  tasking = _.clone(tasking)
  tasking.opens_at = today
  tasking.due_at = dayAfter
  tasking
)

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
  sandbox = {}
  props = {}
  options = {}

  beforeEach ->
    sandbox = sinon.sandbox.create()
    sandbox.stub(TaskPlanActions, 'save')
    sandbox.stub(TaskPlanActions, 'publish')
    sandbox.stub(TaskPlanStore, 'isValid', -> true)
    sandbox.stub(TaskPlanStore, 'hasChanged', -> true)
    moment.tz.setDefault('America/Chicago')
    Courses.bootstrap([COURSE], { clear: true })

    TaskPlanActions.loaded(PLAN, PLAN.id)

    term = fakeTerm()
    options = EnzymeContext.build()
    props =
      id: PLAN.id
      courseId: COURSE_ID
      onHide: sinon.spy()
      termStart: term.start
      termEnd: term.end
      handleError: sinon.spy()


  afterEach ->
    sandbox.restore()

  it 'can update title', ->
    sinon.stub(TaskPlanActions, 'updateTitle')
    wrapper = mount(<MiniEditor {...props} />, options)
    title = wrapper.find("input[value=\"#{PLAN.title}\"]")
    expect(title).length.to.be(1)
    title.simulate('change', target: value: 'foo')
    expect(TaskPlanActions.updateTitle).to.have.been.calledWith(props.id, 'foo')
    undefined

  it 'hides itself when cancel is clicked', ->
    wrapper = mount(<MiniEditor {...props} />, options)
    wrapper.find('.cancel').simulate('click')
    expect(props.onHide).to.have.been.called
    undefined

  it 'publishes and sets button state', ->
    wrapper = mount(<MiniEditor {...props} />, options)
    {publish, save, cancel} = getButtons(wrapper)
    sandbox.stub(TaskPlanStore, 'isSaving', -> true)
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
    wrapper = mount(<MiniEditor {...props} />, options)
    {publish, save, cancel} = getButtons(wrapper)

    expect(save.text()).to.equal('Save as Draft')
    sandbox.stub(TaskPlanStore, 'isSaving', -> true)
    save.simulate('click')

    expect(TaskPlanActions.save).to.have.been.called
    expect(save.text()).to.equal('Saving…')
    expect(publish.text()).to.equal('Publish')
    expect( publish.prop('disabled') ).to.equal(true)
    expect( save.prop('disabled') ).to.equal(true)
    expect( cancel.prop('disabled') ).to.equal(true)
    undefined

  it 'hides when cancel is clicked', ->
    wrapper = mount(<MiniEditor {...props} />, options)
    {cancel} = getButtons(wrapper)
    cancel.simulate('click')
    expect(props.onHide).to.have.been.called
    undefined

  it 'calls handleError when server error is thrown', ->
    wrapper = shallow(<MiniEditor {...props} />)
    TaskPlanStore.emit('errored', {status: 404, statusMessage: "There's been an error", config: {method: 'GET'}})
    expect(props.handleError).to.have.been.called
    undefined

  it 'renders error when server error is thrown', ->
    wrapper = mount(<MiniEditor {...props} />, options)
    TaskPlanStore.emit('errored', {status: 404, statusMessage: "There's been an error", config: {method: 'POST'}})
    expect(wrapper.find('ServerErrorMessage')).length.to.be(1)
    undefined

  it 'limits opens date and due date to term dates', ->
    wrapper = mount(<MiniEditor {...props} />, options)
    datePickers = wrapper.find("DatePicker")

    expect(datePickers.at(0).props().minDate.isSame(props.termStart, 'day')).to.equal(true)
    expect(datePickers.at(1).props().maxDate.isSame(props.termEnd, 'day')).to.equal(true)
    undefined
