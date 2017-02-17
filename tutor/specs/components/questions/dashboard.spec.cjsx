{Testing, sinon, _, SnapShot, React, Wrapper, ReactTestUtils} = require '../helpers/component-testing'

jest.mock('react-dom')
ReactDOM = require 'react-dom'

FakeDOMNode = require 'shared/specs/helpers/fake-dom-node'
ld = require 'lodash'

Dashboard = require '../../../src/components/questions/dashboard'

{TocStore, TocActions} = require '../../../src/flux/toc'
{CourseActions} = require '../../../src/flux/course'
COURSE = require '../../../api/user/courses/1.json'
TOC = require '../../../api/ecosystems/2/readings.json'
COURSE_ID = '1'
ECOSYSTEM_ID = '2'

describe 'Questions Dashboard Component', ->

  beforeEach ->
    @props = {
      courseId: COURSE_ID
      ecosystemId: ECOSYSTEM_ID
    }
    CourseActions.loaded(COURSE, COURSE_ID)
    TocActions.loaded([TOC[0]], ECOSYSTEM_ID)

  it 'displays cc help when course is cc', ->
    course = ld.cloneDeep(COURSE)
    course.is_concept_coach = true
    CourseActions.loaded(course, COURSE_ID)
    Testing.renderComponent( Dashboard, props: @props ).then ({dom}) ->
      expect(dom.textContent).to.contain(
        'Students will only see questions from sections they work on in Concept Coach'
      )

  it 'matches snapshot', ->
    ReactDOM.findDOMNode = jest.fn(-> new FakeDOMNode)
    expect(SnapShot.create(
      <Wrapper _wrapped_component={Dashboard} noReference {...@props}/>).toJSON()
    ).toMatchSnapshot()
    undefined
