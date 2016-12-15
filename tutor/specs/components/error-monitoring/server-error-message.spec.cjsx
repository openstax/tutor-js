{React, SnapShot} = require '../helpers/component-testing'

# jest.mock('../../../src/helpers/router')
# TutorRouter = require '../../../src/helpers/router'

# {CourseActions, CourseStore} = require '../../../src/flux/course'

# TestRouter = require '../helpers/test-router'
# COURSE_ID = '1'
# COURSE = require '../../../api/user/courses/1.json'

ErrorMessage = require '../../../src/components/error-monitoring/server-error-message'

# Wrapper = (props) ->
#   <span>{props.body}</span>

describe 'Error monitoring: server-error message', ->

  beforeEach ->
    # CourseActions.loaded(COURSE, COURSE_ID)
    # @course = CourseStore.get(COURSE_ID)
    # TutorRouter.currentParams.mockReturnValue({courseId: COURSE_ID})
    # TutorRouter.makePathname.mockReturnValue('/go/to/dash')
    @props =
      status: 404
      statusMessage: "Not Found"
      config:
        method: 'none'
        url: 'non-url'
        data: 'code: Red'

  it 'renders for errors with status 500', ->
    @props.status = 500
    wrapper = shallow(<ErrorMessage {...@props} />)
    expect(wrapper.text()).to.include('500')
    undefined

  it 'matches snapshot', ->
    component = SnapShot.create(<ErrorMessage {...@props} />)
    tree = component.toJSON()
    expect(tree).toMatchSnapshot()
