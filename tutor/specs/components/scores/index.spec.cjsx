{React, SnapShot, Wrapper} = require '../helpers/component-testing'
_ = require 'lodash'


EnzymeContext = require '../helpers/enzyme-context'

COURSE = require '../../../api/user/courses/1.json'
DATA = require   '../../../api/courses/1/performance.json'
COURSE_ID = '1'
Sorter = require '../../../src/components/scores/student-data-sorter'
{ScoresActions} = require '../../../src/flux/scores'
{CourseActions} = require '../../../src/flux/course'


{Scores} = require '../../../src/components/scores/index'

getStudentNames = (wrapper) ->
  names = wrapper.find('.student-name').map (el) -> el.text()
  names.slice(1)

describe 'Scores Report', ->

  beforeEach ->
    @props = {
      courseId: COURSE_ID
      isConceptCoach: false
    }
    CourseActions.loaded(COURSE, COURSE_ID)
    ScoresActions.loaded(DATA, COURSE_ID)

  it 'renders', ->
    wrapper = mount(<Scores {...@props} />, EnzymeContext.build())
    expect(getStudentNames(wrapper)).to.deep.equal(_.map(DATA[0].students, 'name'))
    undefined

  it 'sorts', ->
    wrapper = mount(<Scores {...@props} />, EnzymeContext.build())
    wrapper.find('.header-cell.sortable').at(1).simulate('click')
    sorter = Sorter(sort: {key: 0, dataType: 'score'}, displayAs: 'percentage')
    sorted = _.sortBy(DATA[0].students, sorter).reverse()
    expect(getStudentNames(wrapper)).to.deep.equal(_.map(sorted, 'name'))
    wrapper.find('.header-cell.sortable').at(1).simulate('click')
    expect(getStudentNames(wrapper)).to.deep.equal(_.map(sorted.reverse(), 'name'))
    undefined

  it 'renders and matches snapshot', ->
    expect(SnapShot.create(
      <Wrapper _wrapped_component={Scores} noReference {...@props}/>).toJSON()
    ).toMatchSnapshot()
