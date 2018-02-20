{Testing, sinon, _, SnapShot, React, Wrapper, ReactTestUtils} = require '../helpers/component-testing'

jest.mock('react-dom')
ReactDOM = require 'react-dom'

FakeDOMNode = require 'shared/specs/helpers/fake-dom-node'
ld = require 'lodash'

Dashboard = require '../../../src/components/questions/dashboard'

{TocStore, TocActions} = require '../../../src/flux/toc'
{ default: Courses } = require '../../../src/models/courses-map'
COURSE = require '../../../api/user/courses/1.json'
TOC = require '../../../api/ecosystems/2/readings.json'
COURSE_ID = '1'
ECOSYSTEM_ID = '2'

describe 'Questions Dashboard Component', ->
  props = {}
  beforeEach ->
    props = {
      courseId: COURSE_ID
      ecosystemId: ECOSYSTEM_ID
    }
    Courses.bootstrap([COURSE], { clear: true })
    TocActions.loaded([TOC[0]], ECOSYSTEM_ID)

  it 'matches snapshot', ->
    ReactDOM.findDOMNode = jest.fn(-> new FakeDOMNode)
    expect(SnapShot.create(
      <Wrapper _wrapped_component={Dashboard} noReference {...props}/>).toJSON()
    ).toMatchSnapshot()
    undefined
