{React, SnapShot, Wrapper} = require '../helpers/component-testing'

COURSE_ID = '1'
DATA = require   '../../../api/courses/1/performance.json'

Header = require '../../../src/components/scores/assignment-header'

describe 'Scores Report: assignment column header', ->

  beforeEach ->
    @props =
      courseId: COURSE_ID
      columnIndex: 0
      onSort: jest.fn()
      sort: {}
      headings: DATA[0].data_headings


  it 'renders and matches snapshot', ->
    wrapper = shallow(<Header {...@props} />)
    expect(wrapper.find('.header-cell.title').render().text()).toEqual(@props.headings[0].title)
    expect(wrapper).toHaveRendered("Time[date=\"#{@props.headings[0].due_at}\"]")
    expect(SnapShot.create(
      <Wrapper _wrapped_component={Header} noReference {...@props}/>).toJSON()
    ).toMatchSnapshot()

  describe 'for a CC course', ->

    beforeEach ->
      @props.isConceptCoach = true
      @wrapper = shallow(<Header {...@props} />)

    it 'sets className', ->
      expect(@wrapper).toHaveRendered('.header-cell.cc')

    it 'hides due date', ->
      expect(@wrapper).not.toHaveRendered("Time")

    it 'matches snapshot', ->
      expect(SnapShot.create(
        <Wrapper _wrapped_component={Header} noReference {...@props}/>).toJSON()
      ).toMatchSnapshot()
