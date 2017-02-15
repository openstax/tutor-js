{React} = require '../helpers/component-testing'
_ = require 'lodash'
SnapShot = require 'react-test-renderer'

COURSE_ID = '1'
DATA = require   '../../../api/courses/1/performance.json'

Header = require '../../../src/components/scores/assignment-header'

describe 'Scores Report: assignment column header', ->

  beforeEach ->
    @props =
      courseId: COURSE_ID
      columnIndex: 0
      headings: DATA[0].data_headings


  it 'renders', ->
    wrapper = shallow(<Header {...@props} />)
    expect(wrapper.find('.header-cell.title').render().text()).toEqual(@props.headings[0].title)
    expect(wrapper).toHaveRendered("Time[date=\"#{@props.headings[0].due_at}\"]")
    undefined

  describe 'for a CC course', ->

    beforeEach ->
      @props.isConceptCoach = true
      @wrapper = shallow(<Header {...@props} />)

    it 'sets className', ->
      expect(@wrapper).toHaveRendered('.header-cell.cc')

    it 'hides due date', ->
      expect(@wrapper).not.toHaveRendered("Time")

    it 'renders cell width as "wide"', ->
      expect(@wrapper).toHaveRendered('AverageLabel[cellWidth="wide"]')
      expect(@wrapper).toHaveRendered('ReviewLink[cellWidth="wide"]')
