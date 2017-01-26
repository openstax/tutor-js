{React, SnapShot} = require '../helpers/component-testing'

jest.mock('../../../src/helpers/router')
TutorRouter = require '../../../src/helpers/router'

{CourseActions, CourseStore} = require '../../../src/flux/course'

TestRouter = require '../helpers/test-router'
COURSE_ID = '1'
COURSE = require '../../../api/user/courses/1.json'

Handlers = require '../../../src/components/error-monitoring/handlers'

Wrapper = (props) ->
  <span>{props.body}</span>

describe 'Error monitoring: handlers', ->

  beforeEach ->
    CourseActions.loaded(COURSE, COURSE_ID)
    @course = CourseStore.get(COURSE_ID)
    TutorRouter.currentParams.mockReturnValue({courseId: COURSE_ID})
    TutorRouter.makePathname.mockReturnValue('/go/to/dash')
    @args =
      error: {}
      data: {}
      context:
        router: new TestRouter


  it 'renders default if code isnt recognized', ->
    @args.error = {
      status: 500, statusMessage: '500 Error fool!', config: {}
    }
    attrs = Handlers.getAttributesForCode('blarg', @args)
    expect(attrs.title).to.include('Server Error')
    wrapper = shallow(<Wrapper body={attrs.body} />)
    expect(wrapper.find('ServerErrorMessage')).to.have.length(1)
    undefined

  it 'renders not started message', ->
    attrs = Handlers.getAttributesForCode('course_not_started', @args)
    expect(attrs.title).to.include('Future')
    wrapper = shallow(<Wrapper body={attrs.body} />)
    expect(wrapper.text()).to.include('not yet started')
    attrs.onOk()
    expect(TutorRouter.makePathname).toHaveBeenCalledWith('dashboard', {courseId: COURSE_ID})
    expect(@args.context.router.transitionTo).to.have.been.calledWith('/go/to/dash')
    undefined

  it 'renders course ended message', ->
    attrs = Handlers.getAttributesForCode('course_ended', @args)
    expect(attrs.title).to.include('Past')
    wrapper = shallow(<Wrapper body={attrs.body} />)
    expect(wrapper.text()).to.include('course ended')
    attrs.onOk()
    expect(TutorRouter.makePathname).toHaveBeenCalledWith('dashboard', {courseId: COURSE_ID})
    expect(@args.context.router.transitionTo).to.have.been.calledWith('/go/to/dash')
    undefined

  it 'renders exercises not found', ->
    attrs = Handlers.getAttributesForCode('no_exercises', @args)
    expect(attrs.title).to.include('No exercises are available')
    wrapper = shallow(<Wrapper body={attrs.body} />)
    expect(wrapper.text()).to.include('no problems to show')
    attrs.onOk()
    expect(TutorRouter.makePathname).toHaveBeenCalledWith('dashboard', {courseId: COURSE_ID})
    expect(@args.context.router.transitionTo).to.have.been.calledWith('/go/to/dash')
    undefined
